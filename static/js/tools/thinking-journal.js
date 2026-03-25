(function() {
  const app = document.getElementById('journal-app');
  if (!app || typeof MODELS_DATA === 'undefined') return;

  // In-memory storage (no localStorage in this environment)
  let entries = [];

  function getEntries() {
    try {
      const stored = localStorage.getItem('tk-journal');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return entries;
  }

  function saveEntries(data) {
    entries = data;
    try { localStorage.setItem('tk-journal', JSON.stringify(data)); } catch(e) {}
  }

  let state = { phase: 'list', editIdx: null };

  function formatDate(d) {
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function render() {
    const allEntries = getEntries();

    if (state.phase === 'list') {
      const modelUsage = {};
      allEntries.forEach(e => {
        (e.models || []).forEach(m => {
          modelUsage[m] = (modelUsage[m] || 0) + 1;
        });
      });
      const topModels = Object.entries(modelUsage).sort((a,b) => b[1]-a[1]).slice(0,5);

      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);flex-wrap:wrap;gap:var(--space-md);">
            <div>
              <h3 style="margin:0 0 var(--space-xs);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Thinking Journal</h3>
              <p style="color:var(--color-ink-muted);font-size:0.82rem;margin:0;">${allEntries.length} ${allEntries.length === 1 ? 'entry' : 'entries'}</p>
            </div>
            <button onclick="journalNew()" class="btn btn-primary" style="padding:0.5rem 1.2rem;font-size:0.85rem;">+ New entry</button>
          </div>

          ${topModels.length > 0 ? `
            <div style="background:var(--color-bg);padding:var(--space-md);border-radius:var(--radius-md);margin-bottom:var(--space-xl);">
              <p style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-ink-muted);margin-bottom:var(--space-sm);">Most used models</p>
              <div style="display:flex;gap:var(--space-sm);flex-wrap:wrap;">
                ${topModels.map(([m, count]) => {
                  const model = MODELS_DATA.find(md => md.s === m);
                  return `<span style="font-size:0.78rem;padding:0.2rem 0.6rem;border-radius:100px;background:var(--color-accent-bg);color:var(--color-accent);font-weight:600;">${model ? model.t : m} (${count})</span>`;
                }).join('')}
              </div>
            </div>
          ` : ''}

          ${allEntries.length === 0 ? `
            <div style="text-align:center;padding:var(--space-2xl);color:var(--color-ink-muted);">
              <p style="font-size:1.2rem;margin-bottom:var(--space-sm);">No entries yet</p>
              <p style="font-size:0.88rem;">Start logging your decisions and the mental models you apply. Over time, patterns will emerge.</p>
            </div>
          ` : `
            ${allEntries.slice().reverse().map((e, ri) => {
              const i = allEntries.length - 1 - ri;
              return `
              <div style="padding:var(--space-lg);background:var(--color-bg);border:1px solid var(--color-border-light);border-radius:var(--radius-md);margin-bottom:var(--space-md);">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-sm);">
                  <span style="font-size:0.72rem;color:var(--color-ink-faint);">${formatDate(e.date)}</span>
                  <button onclick="journalDelete(${i})" style="background:none;border:none;color:var(--color-ink-faint);cursor:pointer;font-size:0.75rem;">Delete</button>
                </div>
                <p style="font-weight:700;color:var(--color-ink);font-size:0.92rem;margin-bottom:var(--space-xs);">${e.decision}</p>
                ${e.context ? `<p style="font-size:0.85rem;color:var(--color-ink-muted);margin-bottom:var(--space-sm);">${e.context}</p>` : ''}
                ${(e.models || []).length > 0 ? `
                  <div style="display:flex;gap:var(--space-xs);flex-wrap:wrap;margin-bottom:var(--space-sm);">
                    ${e.models.map(m => {
                      const model = MODELS_DATA.find(md => md.s === m);
                      return `<a href="/models/${m}/" style="font-size:0.72rem;padding:0.15rem 0.5rem;border-radius:100px;background:var(--color-teal-bg);color:var(--color-teal);font-weight:600;text-decoration:none;">${model ? model.t : m}</a>`;
                    }).join('')}
                  </div>
                ` : ''}
                ${e.outcome ? `
                  <div style="padding:var(--space-sm) var(--space-md);background:var(--color-bg-card);border-radius:var(--radius-sm);border-left:2px solid var(--color-accent);margin-top:var(--space-sm);">
                    <p style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-accent);margin-bottom:2px;">Outcome</p>
                    <p style="font-size:0.82rem;color:var(--color-ink-secondary);margin:0;">${e.outcome}</p>
                  </div>
                ` : `
                  <button onclick="journalOutcome(${i})" style="background:none;border:1px dashed var(--color-border);border-radius:var(--radius-sm);padding:var(--space-sm) var(--space-md);color:var(--color-ink-faint);cursor:pointer;font-family:var(--font-body);font-size:0.78rem;margin-top:var(--space-sm);">+ Add outcome</button>
                `}
              </div>
              `;
            }).join('')}
          `}
        </div>
      `;
    } else if (state.phase === 'new') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <button onclick="journalCancel()" style="background:none;border:none;color:var(--color-ink-muted);cursor:pointer;font-family:var(--font-body);font-size:0.82rem;margin-bottom:var(--space-lg);padding:0;">← Back</button>
          <h3 style="margin:0 0 var(--space-lg);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">New journal entry</h3>

          <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--color-ink);margin-bottom:var(--space-xs);">What decision did you make?</label>
          <input id="j-decision" type="text" placeholder="e.g. Accepted the job offer, Chose framework X for the project..." style="width:100%;padding:0.6rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.9rem;margin-bottom:var(--space-lg);">

          <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--color-ink);margin-bottom:var(--space-xs);">Context (optional)</label>
          <textarea id="j-context" rows="2" placeholder="What were the key factors?" style="width:100%;padding:0.6rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.9rem;resize:vertical;margin-bottom:var(--space-lg);"></textarea>

          <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--color-ink);margin-bottom:var(--space-sm);">Which mental models did you apply? (click to select)</label>
          <div id="j-models-selected" style="display:flex;gap:var(--space-xs);flex-wrap:wrap;margin-bottom:var(--space-sm);min-height:28px;"></div>
          <input id="j-model-search" type="text" placeholder="Search models..." oninput="journalSearchModels(this.value)" style="width:100%;padding:0.5rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.85rem;margin-bottom:var(--space-sm);">
          <div id="j-model-results" style="max-height:160px;overflow-y:auto;"></div>

          <button onclick="journalSave()" class="btn btn-primary" style="width:100%;margin-top:var(--space-xl);">Save entry</button>
        </div>
      `;
      window._selectedModels = [];
      setTimeout(() => { document.getElementById('j-decision').focus(); }, 50);
    } else if (state.phase === 'outcome') {
      const e = allEntries[state.editIdx];
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <button onclick="journalCancel()" style="background:none;border:none;color:var(--color-ink-muted);cursor:pointer;font-family:var(--font-body);font-size:0.82rem;margin-bottom:var(--space-lg);padding:0;">← Back</button>
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.2rem;">Add outcome</h3>
          <p style="color:var(--color-ink-muted);font-size:0.88rem;margin-bottom:var(--space-lg);">Decision: <em>${e.decision}</em></p>
          <textarea id="j-outcome" rows="3" placeholder="What happened? Was the decision good in retrospect? What would you do differently?" style="width:100%;padding:0.6rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.9rem;resize:vertical;"></textarea>
          <button onclick="journalSaveOutcome()" class="btn btn-primary" style="width:100%;margin-top:var(--space-lg);">Save outcome</button>
        </div>
      `;
    }
  }

  window._selectedModels = [];

  window.journalSearchModels = function(query) {
    const results = document.getElementById('j-model-results');
    if (!query || query.length < 2) { results.innerHTML = ''; return; }
    const q = query.toLowerCase();
    const matches = MODELS_DATA.filter(m =>
      m.t.toLowerCase().includes(q) || m.s.includes(q)
    ).slice(0, 8);

    results.innerHTML = matches.map(m => `
      <button onclick="journalAddModel('${m.s}')" style="display:block;width:100%;text-align:left;padding:var(--space-sm) var(--space-md);background:${window._selectedModels.includes(m.s) ? 'var(--color-teal-bg)' : 'transparent'};border:none;border-bottom:1px solid var(--color-border-light);cursor:pointer;font-family:var(--font-body);font-size:0.85rem;color:var(--color-ink-secondary);">
        <span style="margin-right:var(--space-sm);">${m.i}</span>${m.t}
      </button>
    `).join('');
  };

  window.journalAddModel = function(slug) {
    if (window._selectedModels.includes(slug)) {
      window._selectedModels = window._selectedModels.filter(s => s !== slug);
    } else {
      window._selectedModels.push(slug);
    }
    // Update selected display
    const container = document.getElementById('j-models-selected');
    container.innerHTML = window._selectedModels.map(s => {
      const m = MODELS_DATA.find(md => md.s === s);
      return `<span style="font-size:0.75rem;padding:0.2rem 0.5rem;border-radius:100px;background:var(--color-teal-bg);color:var(--color-teal);font-weight:600;cursor:pointer;" onclick="journalAddModel('${s}')">${m ? m.t : s} ✕</span>`;
    }).join('');
    // Re-render search results
    const search = document.getElementById('j-model-search');
    if (search.value) journalSearchModels(search.value);
  };

  window.journalNew = function() { state.phase = 'new'; render(); };
  window.journalCancel = function() { state.phase = 'list'; state.editIdx = null; render(); };

  window.journalSave = function() {
    const decision = document.getElementById('j-decision').value.trim();
    if (!decision) return;
    const context = document.getElementById('j-context').value.trim();
    const all = getEntries();
    all.push({
      date: new Date().toISOString(),
      decision: decision,
      context: context,
      models: [...window._selectedModels],
      outcome: ''
    });
    saveEntries(all);
    state.phase = 'list';
    render();
  };

  window.journalOutcome = function(i) {
    state.editIdx = i;
    state.phase = 'outcome';
    render();
  };

  window.journalSaveOutcome = function() {
    const outcome = document.getElementById('j-outcome').value.trim();
    if (!outcome) return;
    const all = getEntries();
    all[state.editIdx].outcome = outcome;
    saveEntries(all);
    state.phase = 'list';
    state.editIdx = null;
    render();
  };

  window.journalDelete = function(i) {
    if (!confirm('Delete this entry?')) return;
    const all = getEntries();
    all.splice(i, 1);
    saveEntries(all);
    render();
  };

  render();
})();
