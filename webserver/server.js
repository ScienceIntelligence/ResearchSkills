require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { requireAuth, supabase } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
// Short max-age + must-revalidate so JS/CSS iterations ship to users within
// seconds, not hours. Cloudflare/Railway were stamping a 4h cache otherwise.
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');
  },
}));

// --- Profile API ---

// GET /api/profile — get current user's profile
app.get('/api/profile', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Profile not found' });
  res.json(data);
});

// POST /api/profile — create profile (onboarding)
app.post('/api/profile', requireAuth, async (req, res) => {
  const { full_name, affiliation, role, homepage_url } = req.body;

  if (!full_name || !affiliation || !role || !homepage_url) {
    return res.status(400).json({ error: 'full_name, affiliation, role, and homepage_url are required' });
  }

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', req.user.id)
    .single();

  if (existing) return res.status(409).json({ error: 'Profile already exists' });

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: req.user.id,
      full_name,
      affiliation,
      role,
      homepage_url,
    })
    .select()
    .single();

  if (error) {
    console.error('Profile insert error:', error);
    return res.status(500).json({ error: 'Failed to create profile' });
  }
  res.status(201).json(data);
});

// PUT /api/profile — update profile
app.put('/api/profile', requireAuth, async (req, res) => {
  const { full_name, affiliation, role, homepage_url } = req.body;

  if (!full_name || !affiliation || !role || !homepage_url) {
    return res.status(400).json({ error: 'full_name, affiliation, role, and homepage_url are required' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name,
      affiliation,
      role,
      homepage_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Failed to update profile' });
  res.json(data);
});

// --- Tree API ---

// POST /api/trees — receive tree JSON from CLI (no auth)
app.post('/api/trees', async (req, res) => {
  const treeData = req.body;

  // Lightweight schema validation — reject obviously malformed uploads so the
  // review page can't be broken by garbage data.
  if (!treeData || typeof treeData !== 'object' || Array.isArray(treeData)) {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }
  if (!Array.isArray(treeData.nodes)) {
    return res.status(400).json({ error: 'tree.nodes must be an array' });
  }
  if (treeData.nodes.length > 2000) {
    return res.status(400).json({ error: 'tree.nodes exceeds maximum of 2000' });
  }
  const nodeIds = new Set();
  for (const n of treeData.nodes) {
    if (!n || typeof n !== 'object') {
      return res.status(400).json({ error: 'each node must be an object' });
    }
    if (typeof n.id !== 'string' || !n.id) {
      return res.status(400).json({ error: 'each node must have a non-empty string id' });
    }
    if (typeof n.action !== 'string' || !n.action) {
      return res.status(400).json({ error: 'each node must have an action' });
    }
    if (nodeIds.has(n.id)) {
      return res.status(400).json({ error: `duplicate node id: ${n.id}` });
    }
    nodeIds.add(n.id);
  }
  // Check parent_id references and detect cycles via a walk from each node up
  // to a root. Depth-cap prevents pathological input.
  for (const n of treeData.nodes) {
    if (n.parent_id && !nodeIds.has(n.parent_id)) {
      return res.status(400).json({ error: `node ${n.id} has unknown parent_id ${n.parent_id}` });
    }
  }
  const nodeById = Object.fromEntries(treeData.nodes.map((n) => [n.id, n]));
  for (const n of treeData.nodes) {
    let cur = n;
    let depth = 0;
    while (cur.parent_id) {
      depth++;
      if (depth > treeData.nodes.length) {
        return res.status(400).json({ error: `cycle detected involving node ${n.id}` });
      }
      cur = nodeById[cur.parent_id];
    }
  }

  // Anchor ref prefers paper URL, then project_name (more recognizable), then description.
  const anchorRef =
    treeData.anchor?.paper_url ||
    treeData.anchor?.project_name ||
    treeData.anchor?.project_description ||
    null;

  const { data, error } = await supabase
    .from('trees')
    .insert({
      data: treeData,
      domain: treeData.domain || null,
      subdomain: treeData.subdomain || null,
      anchor_type: treeData.anchor?.type || null,
      anchor_ref: anchorRef,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Insert error:', error);
    return res.status(500).json({ error: 'Failed to store decision tree' });
  }

  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  res.json({ id: data.id, reviewUrl: `${baseUrl}/review/${data.id}` });
});

// GET /api/trees — list all trees for current user
app.get('/api/trees', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('trees')
    .select('id, status, anchor_type, anchor_ref, domain, subdomain, created_at, updated_at, submitted_at')
    .eq('user_id', req.user.id)
    .order('updated_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Failed to fetch trees' });
  res.json(data || []);
});

// GET /api/trees/:id — get tree data (auth required, ownership check)
app.get('/api/trees/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('trees')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Tree not found' });

  // Allow access if unclaimed or owned by current user
  if (data.user_id && data.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  res.json(data);
});

// PUT /api/trees/:id — update tree (auth required, ownership check)
app.put('/api/trees/:id', requireAuth, async (req, res) => {
  const { data: tree } = await supabase
    .from('trees')
    .select('user_id')
    .eq('id', req.params.id)
    .single();

  if (!tree) return res.status(404).json({ error: 'Tree not found' });
  if (tree.user_id && tree.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Only update fields that were explicitly provided, so the review page
  // can save anchor edits without wiping skill-supplied domain/subdomain.
  const updates = {
    user_id: tree.user_id || req.user.id,
    updated_at: new Date().toISOString(),
  };
  if (req.body.data !== undefined) updates.data = req.body.data;
  if (req.body.anchor_type !== undefined) updates.anchor_type = req.body.anchor_type;
  if (req.body.anchor_ref !== undefined) updates.anchor_ref = req.body.anchor_ref;
  if (req.body.domain !== undefined) updates.domain = req.body.domain;
  if (req.body.subdomain !== undefined) updates.subdomain = req.body.subdomain;

  const { data: updated, error } = await supabase
    .from('trees')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Failed to update' });
  res.json(updated);
});

// DELETE /api/trees/:id — delete draft tree (auth required, owner only)
app.delete('/api/trees/:id', requireAuth, async (req, res) => {
  const { data: tree } = await supabase
    .from('trees')
    .select('user_id, status')
    .eq('id', req.params.id)
    .single();

  if (!tree) return res.status(404).json({ error: 'Tree not found' });
  if (tree.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
  if (tree.status !== 'draft') return res.status(403).json({ error: 'Cannot delete submitted trees' });

  const { error } = await supabase
    .from('trees')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: 'Failed to delete' });
  res.json({ deleted: true });
});

// POST /api/trees/:id/submit — mark as submitted
app.post('/api/trees/:id/submit', requireAuth, async (req, res) => {
  const { data: tree } = await supabase
    .from('trees')
    .select('user_id')
    .eq('id', req.params.id)
    .single();

  if (!tree) return res.status(404).json({ error: 'Tree not found' });
  if (tree.user_id && tree.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { data, error } = await supabase
    .from('trees')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      user_id: req.user.id,
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Failed to submit' });
  res.json({ status: 'submitted', id: data.id });
});

// --- Skills API ---

const VALID_SUBTYPES = {
  procedural: ['tie', 'no-change', 'constraint-failure', 'operator-fail'],
  semantic: ['frontier', 'non-public', 'correction'],
  episodic: ['failure', 'adaptation', 'anomalous'],
};

function validateSkillData(skill) {
  if (!skill || typeof skill !== 'object' || Array.isArray(skill)) {
    return 'Request body must be a JSON object';
  }
  if (typeof skill.name !== 'string' || !skill.name.trim()) {
    return 'name must be a non-empty string';
  }
  const validMemoryTypes = Object.keys(VALID_SUBTYPES);
  if (!validMemoryTypes.includes(skill.memory_type)) {
    return `memory_type must be one of: ${validMemoryTypes.join(', ')}`;
  }
  const validSubs = VALID_SUBTYPES[skill.memory_type];
  if (!validSubs.includes(skill.subtype)) {
    return `subtype must be one of: ${validSubs.join(', ')} for memory_type ${skill.memory_type}`;
  }
  if (!skill.domain) return 'domain is required';
  if (!skill.subdomain) return 'subdomain is required';
  if (!skill.contributor) return 'contributor is required';
  if (typeof skill.body !== 'string' || !skill.body.trim()) {
    return 'body must be a non-empty string';
  }
  return null;
}

// POST /api/skills — receive skill JSON from CLI (no auth)
app.post('/api/skills', async (req, res) => {
  const skill = req.body;
  const validationError = validateSkillData(skill);
  if (validationError) return res.status(400).json({ error: validationError });

  const { data, error } = await supabase
    .from('skills')
    .insert({
      data: skill,
      memory_type: skill.memory_type,
      subtype: skill.subtype,
      domain: skill.domain,
      subdomain: skill.subdomain,
      contributor: skill.contributor,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Skill insert error:', error);
    return res.status(500).json({ error: 'Failed to store skill' });
  }

  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  res.json({ id: data.id, reviewUrl: `${baseUrl}/review/skill/${data.id}` });
});

// GET /api/skills — list all skills for current user
app.get('/api/skills', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('skills')
    .select('id, status, memory_type, subtype, domain, subdomain, contributor, created_at, updated_at, submitted_at')
    .eq('user_id', req.user.id)
    .order('updated_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Failed to fetch skills' });
  res.json(data || []);
});

// GET /api/skills/:id — get skill data (auth required, ownership check)
app.get('/api/skills/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Skill not found' });

  // Allow access if unclaimed or owned by current user
  if (data.user_id && data.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  res.json(data);
});

// PUT /api/skills/:id — update skill (auth required, ownership check)
app.put('/api/skills/:id', requireAuth, async (req, res) => {
  const { data: skill } = await supabase
    .from('skills')
    .select('user_id')
    .eq('id', req.params.id)
    .single();

  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  if (skill.user_id && skill.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const updates = {
    user_id: skill.user_id || req.user.id,
    updated_at: new Date().toISOString(),
  };
  if (req.body.data !== undefined) updates.data = req.body.data;
  if (req.body.memory_type !== undefined) updates.memory_type = req.body.memory_type;
  if (req.body.subtype !== undefined) updates.subtype = req.body.subtype;
  if (req.body.domain !== undefined) updates.domain = req.body.domain;
  if (req.body.subdomain !== undefined) updates.subdomain = req.body.subdomain;
  if (req.body.contributor !== undefined) updates.contributor = req.body.contributor;

  const { data: updated, error } = await supabase
    .from('skills')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Failed to update' });
  res.json(updated);
});

// DELETE /api/skills/:id — delete draft skill (auth required, owner only)
app.delete('/api/skills/:id', requireAuth, async (req, res) => {
  const { data: skill } = await supabase
    .from('skills')
    .select('user_id, status')
    .eq('id', req.params.id)
    .single();

  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  if (skill.user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
  if (skill.status !== 'draft') return res.status(403).json({ error: 'Cannot delete submitted skills' });

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: 'Failed to delete' });
  res.json({ deleted: true });
});

// POST /api/skills/:id/submit — mark as submitted
app.post('/api/skills/:id/submit', requireAuth, async (req, res) => {
  const { data: skill } = await supabase
    .from('skills')
    .select('user_id')
    .eq('id', req.params.id)
    .single();

  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  if (skill.user_id && skill.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { data, error } = await supabase
    .from('skills')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      user_id: req.user.id,
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Failed to submit' });
  res.json({ status: 'submitted', id: data.id });
});

// --- Page Routes ---

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/landing.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

app.get('/onboarding', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/onboarding.html'));
});

app.get('/review/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/review.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 catch-all (must be last)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
});

app.listen(PORT, () => {
  console.log(`researchskills.ai server running on port ${PORT}`);
});
