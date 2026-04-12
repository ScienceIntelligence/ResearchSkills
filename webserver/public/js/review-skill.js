// Skill review page — loads, renders, and submits skill memories.
// Uses shared Supabase client from supabase-client.js

const sb = window.app.sb;

const skillId = window.location.pathname.split('/review/skill/')[1];
let skillData = null;
let accessToken = null;

// arXiv taxonomy (same source as the tree review page)
let ARXIV_TAXONOMY = {};

async function loadTaxonomy() {
  try {
    const res = await fetch('/taxonomy.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    ARXIV_TAXONOMY = payload.taxonomy || {};
  } catch (err) {
    console.error('[review-skill] failed to load /taxonomy.json:', err);
  }
}

function populateSubdomains(domain, preserveValue) {
  const select = document.getElementById('skill-subdomain');
  select.textContent = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '--';
  select.appendChild(placeholder);

  const list = ARXIV_TAXONOMY[domain] || [];
  let matched = !preserveValue;
  list.forEach((sub) => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    if (sub === preserveValue) { opt.selected = true; matched = true; }
    select.appendChild(opt);
  });

  if (!matched && preserveValue) {
    const synth = document.createElement('option');
    synth.value = preserveValue;
    synth.textContent = `${preserveValue} (from upload)`;
    synth.selected = true;
    select.insertBefore(synth, select.children[1] || null);
  }
}

// --- Auth ---

async function checkAuth() {
  const session = await window.app.getSession();
  if (session) {
    accessToken = session.access_token;
    const profile = await window.app.requireProfile();
    if (!profile) return;
    loadSkill();
  } else {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('login-prompt').style.display = 'block';
  }
}

document.getElementById('github-login').addEventListener('click', async () => {
  await window.app.signIn();
});

sb.auth.onAuthStateChange((event, session) => {
  if (event !== 'SIGNED_IN' || !session) return;

  setTimeout(async () => {
    const reviewVisible = document.getElementById('review-container').style.display === 'block';
    if (reviewVisible) return;

    accessToken = session.access_token;
    document.getElementById('login-prompt').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    try {
      const profileRes = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (profileRes.status === 404) {
        sessionStorage.setItem('redirect_after_onboarding', window.location.href);
        window.location.href = '/onboarding';
        return;
      }
      if (!profileRes.ok) return;
      loadSkill();
    } catch (err) {
      console.error('[review-skill] onAuthStateChange deferred error:', err);
    }
  }, 0);
});

// --- Skill Loading ---

async function loadSkill() {
  try {
    const res = await fetch(`/api/skills/${skillId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const skill = await res.json();
    skillData = skill;

    document.getElementById('loading').style.display = 'none';

    if (skill.status === 'submitted') {
      document.getElementById('submitted-message').style.display = 'block';
      return;
    }

    document.getElementById('review-container').style.display = 'block';

    const data = skill.data || {};

    // Header
    document.getElementById('skill-name').textContent = data.name || '(unnamed skill)';

    const memBadge = document.getElementById('badge-memory-type');
    memBadge.textContent = data.memory_type || skill.memory_type || '';
    memBadge.className = 'badge badge-' + (data.memory_type || skill.memory_type || '');

    document.getElementById('badge-subtype').textContent = data.subtype || skill.subtype || '';

    const domainVal = data.domain || skill.domain || '';
    const subdomainVal = data.subdomain || skill.subdomain || '';
    const domainBadge = document.getElementById('badge-domain');
    domainBadge.textContent = domainVal + (subdomainVal ? ' / ' + subdomainVal : '');

    document.getElementById('skill-contributor').textContent =
      'by ' + (data.contributor || skill.contributor || 'unknown');

    // Domain / subdomain dropdowns
    if (domainVal) {
      document.getElementById('skill-domain').value = domainVal;
    }
    populateSubdomains(domainVal, subdomainVal || null);

    // Render body
    renderBody(data);

    document.getElementById('loading').style.display = 'none';
  } catch (err) {
    console.error('[review-skill] loadSkill error:', err);
    const loadingEl = document.getElementById('loading');
    loadingEl.style.display = 'block';
    loadingEl.textContent = `Error: ${err.message}`;
  }
}

// --- Body Rendering ---

// Parse markdown body into {header, content} sections split on ## headers.
function parseSections(body) {
  if (!body) return [];
  const lines = body.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      if (current) sections.push(current);
      current = { header: match[1].trim(), content: '' };
    } else if (current) {
      current.content += line + '\n';
    }
    // Lines before the first ## are ignored (usually just the # title)
  }
  if (current) sections.push(current);

  // Trim trailing whitespace from each section's content
  sections.forEach(s => { s.content = s.content.trim(); });
  return sections;
}

function renderBody(data) {
  const container = document.getElementById('skill-body');
  container.textContent = '';

  const memoryType = data.memory_type || skillData.memory_type || '';
  const sections = parseSections(data.body);

  if (memoryType === 'episodic') {
    renderEpisodicBody(container, sections);
  } else {
    renderStandardBody(container, sections, memoryType);
  }
}

// Standard rendering: each section as a card. For procedural, highlight Decision.
function renderStandardBody(container, sections, memoryType) {
  sections.forEach(sec => {
    const card = document.createElement('div');
    card.className = 'section-card';

    if (memoryType === 'procedural' && sec.header.toLowerCase() === 'decision') {
      card.classList.add('highlight-decision');
    }

    const header = document.createElement('div');
    header.className = 'section-card-header';
    header.textContent = sec.header;
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'section-card-body';
    body.textContent = sec.content;
    card.appendChild(body);

    container.appendChild(card);
  });
}

// Episodic rendering: Situation/Action/Outcome as a timeline, rest as cards.
function renderEpisodicBody(container, sections) {
  const timelineHeaders = ['situation', 'action', 'outcome'];
  const timelineSections = [];
  const otherSections = [];

  sections.forEach(sec => {
    if (timelineHeaders.includes(sec.header.toLowerCase())) {
      timelineSections.push(sec);
    } else {
      otherSections.push(sec);
    }
  });

  // Timeline row
  if (timelineSections.length) {
    const flow = document.createElement('div');
    flow.className = 'timeline-flow';

    timelineSections.forEach(sec => {
      const step = document.createElement('div');
      step.className = 'timeline-step';

      const header = document.createElement('div');
      header.className = 'timeline-step-header';
      header.textContent = sec.header;
      step.appendChild(header);

      const body = document.createElement('div');
      body.className = 'timeline-step-body';
      body.textContent = sec.content;
      step.appendChild(body);

      flow.appendChild(step);
    });

    container.appendChild(flow);
  }

  // Remaining sections as normal cards
  otherSections.forEach(sec => {
    const card = document.createElement('div');
    card.className = 'section-card';

    const header = document.createElement('div');
    header.className = 'section-card-header';
    header.textContent = sec.header;
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'section-card-body';
    body.textContent = sec.content;
    card.appendChild(body);

    container.appendChild(card);
  });
}

// --- Save & Submit ---

function collectFields() {
  return {
    domain: document.getElementById('skill-domain').value || null,
    subdomain: document.getElementById('skill-subdomain').value.trim() || null,
  };
}

document.getElementById('save-draft').addEventListener('click', async () => {
  try {
    const res = await fetch(`/api/skills/${skillId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(collectFields()),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    alert('Draft saved.');
  } catch (err) {
    alert(`Save failed: ${err.message}`);
  }
});

document.getElementById('submit-skill').addEventListener('click', async () => {
  try {
    // Save first
    await fetch(`/api/skills/${skillId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(collectFields()),
    });

    const res = await fetch(`/api/skills/${skillId}/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    document.getElementById('review-container').style.display = 'none';
    document.getElementById('submitted-message').style.display = 'block';
  } catch (err) {
    alert(`Submit failed: ${err.message}`);
  }
});

// --- Init ---

(async function init() {
  await loadTaxonomy();
  document.getElementById('skill-domain').addEventListener('change', (e) => {
    populateSubdomains(e.target.value, null);
  });
  checkAuth();
})();
