// Dashboard page logic
(async function () {
  const session = await window.app.getSession();
  if (!session) {
    window.location.href = '/';
    return;
  }

  const token = session.access_token;

  // Check profile exists
  const profile = await window.app.requireProfile();
  if (!profile) return;

  document.getElementById('loading').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';

  // --- Tabs ---
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // --- Profile Tab ---
  document.getElementById('prof-name').value = profile.full_name || '';
  document.getElementById('prof-affiliation').value = profile.affiliation || '';
  document.getElementById('prof-role').value = profile.role || '';
  document.getElementById('prof-homepage').value = profile.homepage_url || '';

  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgEl = document.getElementById('profile-message');
    msgEl.style.display = 'none';

    const body = {
      full_name: document.getElementById('prof-name').value.trim(),
      affiliation: document.getElementById('prof-affiliation').value.trim(),
      role: document.getElementById('prof-role').value,
      homepage_url: document.getElementById('prof-homepage').value.trim(),
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      msgEl.textContent = 'Profile saved.';
      msgEl.className = 'form-message success';
      msgEl.style.display = 'block';
    } catch (err) {
      msgEl.textContent = `Save failed: ${err.message}`;
      msgEl.className = 'form-message error';
      msgEl.style.display = 'block';
    }
  });

  // --- Research Skills Tab ---
  await loadSkills();

  const MEMORY_TYPE_COLORS = {
    procedural: '#4f7a63',
    semantic: '#5b6c8b',
    episodic: '#7b5b92',
  };

  async function loadSkills() {
    const projectsList = document.getElementById('projects-list');
    const noTrees = document.getElementById('no-trees');

    try {
      const res = await fetch('/api/skills', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const skills = await res.json();

      if (skills.length === 0) {
        noTrees.style.display = 'block';
        return;
      }

      // Group by domain/subdomain
      const normalize = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const groups = {};
      skills.forEach(skill => {
        const key = normalize([skill.domain, skill.subdomain].filter(Boolean).join('/')) || '__ungrouped__';
        if (!groups[key]) {
          groups[key] = {
            domain: skill.domain,
            subdomain: skill.subdomain,
            skills: [],
          };
        }
        groups[key].skills.push(skill);
      });

      projectsList.textContent = '';

      Object.values(groups).forEach(group => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const cardHeader = document.createElement('div');
        cardHeader.className = 'project-card-header';

        const title = document.createElement('h3');
        title.textContent = [group.domain, group.subdomain].filter(Boolean).join(' / ') || 'Ungrouped';
        cardHeader.appendChild(title);

        const meta = document.createElement('div');
        meta.className = 'project-meta';

        const draftCount = group.skills.filter(s => s.status === 'draft').length;
        const submittedCount = group.skills.filter(s => s.status === 'submitted').length;

        const countSpan = document.createElement('span');
        countSpan.textContent = `${group.skills.length} skill${group.skills.length > 1 ? 's' : ''}`;
        meta.appendChild(countSpan);

        if (draftCount > 0) {
          const draftBadge = document.createElement('span');
          draftBadge.className = 'status-tag draft';
          draftBadge.textContent = `${draftCount} draft`;
          meta.appendChild(draftBadge);
        }
        if (submittedCount > 0) {
          const subBadge = document.createElement('span');
          subBadge.className = 'status-tag submitted';
          subBadge.textContent = `${submittedCount} submitted`;
          meta.appendChild(subBadge);
        }

        cardHeader.appendChild(meta);
        card.appendChild(cardHeader);

        // Skill rows (collapsed by default, toggle on click)
        const skillList = document.createElement('div');
        skillList.className = 'tree-list collapsed';

        cardHeader.style.cursor = 'pointer';
        cardHeader.addEventListener('click', () => {
          skillList.classList.toggle('collapsed');
          cardHeader.classList.toggle('expanded');
        });

        group.skills.forEach(skill => {
          const row = document.createElement('div');
          row.className = 'tree-row';

          const info = document.createElement('div');
          info.className = 'tree-row-info';

          const nameSpan = document.createElement('span');
          nameSpan.className = 'tree-domain';
          nameSpan.textContent = skill.name || skill.subtype || 'Unnamed skill';
          info.appendChild(nameSpan);

          const memoryBadge = document.createElement('span');
          memoryBadge.className = 'badge';
          memoryBadge.textContent = skill.memory_type || 'unknown';
          const badgeColor = MEMORY_TYPE_COLORS[skill.memory_type] || '#888';
          memoryBadge.style.backgroundColor = badgeColor;
          memoryBadge.style.color = '#fff';
          info.appendChild(memoryBadge);

          if (skill.subtype) {
            const subtypeSpan = document.createElement('span');
            subtypeSpan.className = 'badge';
            subtypeSpan.textContent = skill.subtype;
            info.appendChild(subtypeSpan);
          }

          const statusBadge = document.createElement('span');
          statusBadge.className = `status-tag ${skill.status}`;
          statusBadge.textContent = skill.status;
          info.appendChild(statusBadge);

          const dateSpan = document.createElement('span');
          dateSpan.className = 'tree-date';
          dateSpan.textContent = new Date(skill.updated_at).toLocaleDateString();
          info.appendChild(dateSpan);

          row.appendChild(info);

          const actions = document.createElement('div');
          actions.className = 'tree-row-actions';

          const openBtn = document.createElement('a');
          openBtn.href = `/review/skill/${skill.id}`;
          openBtn.className = 'btn btn-sm btn-secondary';
          openBtn.textContent = 'Open';
          actions.appendChild(openBtn);

          if (skill.status === 'draft') {
            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-sm btn-danger';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async (e) => {
              e.stopPropagation();
              if (!confirm('Delete this draft skill? This cannot be undone.')) return;

              try {
                const delRes = await fetch(`/api/skills/${skill.id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (!delRes.ok) throw new Error(`HTTP ${delRes.status}`);
                await loadSkills();
              } catch (err) {
                alert(`Delete failed: ${err.message}`);
              }
            });
            actions.appendChild(delBtn);
          }

          row.appendChild(actions);
          skillList.appendChild(row);
        });

        card.appendChild(skillList);
        projectsList.appendChild(card);
      });

    } catch (err) {
      projectsList.textContent = `Error loading skills: ${err.message}`;
    }
  }
})();
