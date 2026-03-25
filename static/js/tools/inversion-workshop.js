(function() {
  const app = document.getElementById('inversion-app');
  if (!app) return;

  let state = { phase: 'goal', goal: '', failures: [], actions: [] };

  function render() {
    if (state.phase === 'goal') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Step 1: Define your goal</h3>
          <p style="color:var(--color-ink-muted);font-size:0.9rem;margin-bottom:var(--space-lg);">What are you trying to achieve? Be specific.</p>
          <input id="inv-goal" type="text" placeholder="e.g. Launch the product successfully by Q3, Get promoted this year, Build a strong team..." style="width:100%;padding:0.75rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.95rem;margin-bottom:var(--space-lg);">
          <button onclick="invNext()" class="btn btn-primary" style="width:100%;">Now let's invert it →</button>
        </div>
      `;
    } else if (state.phase === 'invert') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Step 2: Invert</h3>
          <div style="background:var(--color-accent-bg);border-left:3px solid var(--color-accent);padding:var(--space-lg);border-radius:0 var(--radius-md) var(--radius-md) 0;margin-bottom:var(--space-lg);">
            <p style="font-family:var(--font-display);font-style:italic;font-size:1.05rem;color:var(--color-accent);margin-bottom:var(--space-xs);">Your goal: ${state.goal}</p>
            <p style="color:var(--color-ink-muted);font-size:0.85rem;margin:0;">Now imagine this has <strong>failed completely</strong>. What guaranteed the failure?</p>
          </div>
          <p style="color:var(--color-ink-secondary);font-size:0.88rem;margin-bottom:var(--space-md);">List everything that would guarantee this goal fails. Be honest — the more specific, the more useful.</p>
          <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-md);">
            <input id="inv-failure" type="text" placeholder="This would fail if..." style="flex:1;padding:0.6rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.9rem;" onkeydown="if(event.key==='Enter')invAddFailure()">
            <button onclick="invAddFailure()" class="btn btn-primary" style="padding:0.6rem 1.2rem;">Add</button>
          </div>
          ${state.failures.length > 0 ? `
            <div style="margin-bottom:var(--space-lg);">
              ${state.failures.map((f, i) => `
                <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);background:var(--color-bg);border-radius:var(--radius-md);margin-bottom:var(--space-sm);border:1px solid var(--color-border-light);">
                  <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--color-accent);min-width:20px;">${String(i+1).padStart(2,'0')}</span>
                  <span style="flex:1;font-size:0.88rem;color:var(--color-ink-secondary);">${f}</span>
                  <button onclick="invRemove(${i})" style="background:none;border:none;color:var(--color-ink-faint);cursor:pointer;font-size:0.8rem;">✕</button>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${state.failures.length >= 3 ? `
            <button onclick="invToActions()" class="btn btn-primary" style="width:100%;">Now flip it — what should I do? →</button>
          ` : `
            <p style="font-size:0.78rem;color:var(--color-ink-faint);text-align:center;margin:0;">Add at least 3 failure conditions to continue</p>
          `}
        </div>
      `;
      setTimeout(() => { const el = document.getElementById('inv-failure'); if(el) el.focus(); }, 50);
    } else if (state.phase === 'actions') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Step 3: Convert to actions</h3>
          <p style="color:var(--color-ink-muted);font-size:0.88rem;margin-bottom:var(--space-lg);">For each failure condition, write the specific action that prevents it.</p>

          ${state.failures.map((f, i) => `
            <div style="margin-bottom:var(--space-lg);padding:var(--space-lg);background:var(--color-bg);border-radius:var(--radius-md);border:1px solid var(--color-border-light);">
              <p style="font-size:0.82rem;color:var(--color-accent);margin-bottom:var(--space-sm);font-weight:700;">FAILURE: ${f}</p>
              <input id="inv-action-${i}" type="text" value="${state.actions[i] || ''}" placeholder="To prevent this, I will..." onchange="invSetAction(${i},this.value)" style="width:100%;padding:0.6rem 1rem;background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.9rem;">
            </div>
          `).join('')}

          <button onclick="invFinish()" class="btn btn-primary" style="width:100%;margin-top:var(--space-md);">See my inversion plan</button>
        </div>
      `;
    } else if (state.phase === 'result') {
      const filled = state.actions.filter(a => a && a.trim().length > 0);
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Your Inversion Plan</h3>
          <div style="background:var(--color-accent-bg);padding:var(--space-lg);border-radius:var(--radius-md);margin-bottom:var(--space-xl);">
            <p style="font-family:var(--font-display);font-style:italic;font-size:1.05rem;color:var(--color-ink);margin:0;">Goal: ${state.goal}</p>
          </div>

          ${state.failures.map((f, i) => `
            <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:var(--space-md);align-items:center;margin-bottom:var(--space-md);">
              <div style="padding:var(--space-md);background:rgba(232,82,63,0.04);border:1px solid rgba(232,82,63,0.12);border-radius:var(--radius-md);">
                <p style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-accent);margin-bottom:2px;">Avoid</p>
                <p style="font-size:0.85rem;color:var(--color-ink-secondary);margin:0;">${f}</p>
              </div>
              <span style="color:var(--color-ink-faint);">→</span>
              <div style="padding:var(--space-md);background:var(--color-teal-bg);border:1px solid rgba(27,158,143,0.15);border-radius:var(--radius-md);">
                <p style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-teal);margin-bottom:2px;">Do instead</p>
                <p style="font-size:0.85rem;color:var(--color-ink-secondary);margin:0;">${state.actions[i] || '(no action set)'}</p>
              </div>
            </div>
          `).join('')}

          <div style="margin-top:var(--space-xl);padding-top:var(--space-lg);border-top:1px solid var(--color-border-light);display:flex;gap:var(--space-sm);">
            <button onclick="invReset()" class="btn btn-secondary" style="flex:1;">Start a new inversion</button>
          </div>
        </div>
      `;
    }
  }

  window.invNext = function() {
    const el = document.getElementById('inv-goal');
    if (!el || !el.value.trim()) return;
    state.goal = el.value.trim();
    state.phase = 'invert';
    render();
  };

  window.invAddFailure = function() {
    const el = document.getElementById('inv-failure');
    if (!el || !el.value.trim()) return;
    state.failures.push(el.value.trim());
    render();
  };

  window.invRemove = function(i) {
    state.failures.splice(i, 1);
    render();
  };

  window.invToActions = function() {
    state.actions = state.failures.map(() => '');
    state.phase = 'actions';
    render();
  };

  window.invSetAction = function(i, val) {
    state.actions[i] = val;
  };

  window.invFinish = function() {
    // Collect current input values
    state.failures.forEach((_, i) => {
      const el = document.getElementById('inv-action-' + i);
      if (el) state.actions[i] = el.value;
    });
    state.phase = 'result';
    render();
  };

  window.invReset = function() {
    state = { phase: 'goal', goal: '', failures: [], actions: [] };
    render();
  };

  render();
})();
