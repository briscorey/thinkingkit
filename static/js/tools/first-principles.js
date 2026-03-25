(function() {
  const app = document.getElementById('fpt-app');
  if (!app) return;

  let state = {
    phase: 'problem',
    problem: '',
    assumptions: [],
    challenged: {},  // index -> 'true' | 'false' | 'uncertain'
    truths: [],
    solution: ''
  };

  const challengePrompts = [
    "Is this based on direct evidence, or something I've heard repeated?",
    "Would a smart outsider with no background knowledge agree this is true?",
    "Has anyone ever achieved the outcome while violating this assumption?",
    "Is this a law of physics, or a convention that could change?"
  ];

  function render() {
    if (state.phase === 'problem') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Step 1: State your problem</h3>
          <p style="color:var(--color-ink-muted);font-size:0.9rem;margin-bottom:var(--space-lg);">What problem are you trying to solve, or what do you believe to be true that you want to examine?</p>
          <textarea id="fpt-problem" rows="3" placeholder="e.g. Building a mobile app is too expensive for our budget, or: We need a university degree to get a good job..." style="width:100%;padding:0.75rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.92rem;resize:vertical;line-height:1.6;"></textarea>
          <button onclick="fptNext()" class="btn btn-primary" style="width:100%;margin-top:var(--space-lg);">Surface the assumptions →</button>
        </div>
      `;
    } else if (state.phase === 'assumptions') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Step 2: List your assumptions</h3>
          <div style="background:var(--color-accent-bg);padding:var(--space-md);border-radius:var(--radius-md);margin-bottom:var(--space-lg);">
            <p style="font-size:0.85rem;color:var(--color-ink-secondary);margin:0;"><strong>Problem:</strong> ${state.problem}</p>
          </div>
          <p style="color:var(--color-ink-muted);font-size:0.88rem;margin-bottom:var(--space-md);">What do you assume to be true about this problem? List everything — even things that seem obvious.</p>
          <div style="display:flex;gap:var(--space-sm);margin-bottom:var(--space-md);">
            <input id="fpt-assumption" type="text" placeholder="I assume that..." style="flex:1;padding:0.6rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.9rem;" onkeydown="if(event.key==='Enter')fptAddAssumption()">
            <button onclick="fptAddAssumption()" class="btn btn-primary" style="padding:0.6rem 1.2rem;">Add</button>
          </div>
          ${state.assumptions.length > 0 ? `
            ${state.assumptions.map((a, i) => `
              <div style="padding:var(--space-md);background:var(--color-bg);border:1px solid var(--color-border-light);border-radius:var(--radius-md);margin-bottom:var(--space-sm);display:flex;align-items:center;gap:var(--space-md);">
                <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--color-ink-faint);">${i+1}</span>
                <span style="flex:1;font-size:0.88rem;color:var(--color-ink-secondary);">${a}</span>
              </div>
            `).join('')}
          ` : ''}
          ${state.assumptions.length >= 3 ? `
            <button onclick="fptToChallenge()" class="btn btn-primary" style="width:100%;margin-top:var(--space-lg);">Challenge each assumption →</button>
          ` : `
            <p style="font-size:0.78rem;color:var(--color-ink-faint);text-align:center;margin-top:var(--space-md);">Add at least 3 assumptions to continue</p>
          `}
        </div>
      `;
      setTimeout(() => { const el = document.getElementById('fpt-assumption'); if(el) el.focus(); }, 50);
    } else if (state.phase === 'challenge') {
      const promptIdx = Object.keys(state.challenged).length % challengePrompts.length;
      const remaining = state.assumptions.filter((_, i) => !state.challenged[i]);
      const currentIdx = state.assumptions.findIndex((_, i) => !state.challenged[i]);
      const done = remaining.length === 0;

      if (done) {
        fptToRebuild();
        return;
      }

      const progress = ((state.assumptions.length - remaining.length) / state.assumptions.length) * 100;

      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-md);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Step 3: Challenge each assumption</h3>
          <div style="height:3px;background:var(--color-surface);border-radius:2px;margin-bottom:var(--space-xl);overflow:hidden;">
            <div style="height:100%;width:${progress}%;background:var(--color-accent);border-radius:2px;transition:width 0.3s ease;"></div>
          </div>
          <p style="font-size:0.78rem;color:var(--color-ink-faint);margin-bottom:var(--space-sm);">Assumption ${state.assumptions.length - remaining.length + 1} of ${state.assumptions.length}</p>
          <div style="background:var(--color-bg);padding:var(--space-lg);border-radius:var(--radius-md);border:1px solid var(--color-border-light);margin-bottom:var(--space-lg);">
            <p style="font-size:1.05rem;color:var(--color-ink);margin-bottom:var(--space-md);font-weight:500;">"${state.assumptions[currentIdx]}"</p>
            <p style="font-size:0.85rem;color:var(--color-ink-muted);margin:0;font-style:italic;">${challengePrompts[promptIdx]}</p>
          </div>
          <div style="display:flex;gap:var(--space-sm);">
            <button onclick="fptChallenge(${currentIdx},'true')" style="flex:1;padding:var(--space-md);background:var(--color-teal-bg);border:1px solid rgba(27,158,143,0.2);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);font-weight:700;color:var(--color-teal);font-size:0.85rem;">Fundamentally true</button>
            <button onclick="fptChallenge(${currentIdx},'uncertain')" style="flex:1;padding:var(--space-md);background:var(--color-gold-bg);border:1px solid rgba(196,149,42,0.2);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);font-weight:700;color:var(--color-gold);font-size:0.85rem;">Uncertain</button>
            <button onclick="fptChallenge(${currentIdx},'false')" style="flex:1;padding:var(--space-md);background:var(--color-accent-bg);border:1px solid rgba(232,82,63,0.2);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);font-weight:700;color:var(--color-accent);font-size:0.85rem;">Convention, not truth</button>
          </div>
        </div>
      `;
    } else if (state.phase === 'rebuild') {
      const truths = state.assumptions.filter((_, i) => state.challenged[i] === 'true');
      const uncertain = state.assumptions.filter((_, i) => state.challenged[i] === 'uncertain');
      const conventions = state.assumptions.filter((_, i) => state.challenged[i] === 'false');

      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-lg);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Your First Principles Decomposition</h3>

          <div style="background:var(--color-accent-bg);padding:var(--space-md);border-radius:var(--radius-md);margin-bottom:var(--space-xl);">
            <p style="font-size:0.85rem;color:var(--color-ink-secondary);margin:0;"><strong>Problem:</strong> ${state.problem}</p>
          </div>

          ${conventions.length > 0 ? `
            <div style="margin-bottom:var(--space-xl);">
              <p style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-accent);margin-bottom:var(--space-md);">Stripped away — conventions, not truths</p>
              ${conventions.map(c => `
                <div style="padding:var(--space-md);background:var(--color-accent-bg);border-radius:var(--radius-md);margin-bottom:var(--space-sm);text-decoration:line-through;color:var(--color-ink-muted);font-size:0.88rem;">${c}</div>
              `).join('')}
            </div>
          ` : ''}

          ${uncertain.length > 0 ? `
            <div style="margin-bottom:var(--space-xl);">
              <p style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-gold);margin-bottom:var(--space-md);">Needs investigation</p>
              ${uncertain.map(u => `
                <div style="padding:var(--space-md);background:var(--color-gold-bg);border-radius:var(--radius-md);margin-bottom:var(--space-sm);color:var(--color-ink-secondary);font-size:0.88rem;">${u}</div>
              `).join('')}
            </div>
          ` : ''}

          ${truths.length > 0 ? `
            <div style="margin-bottom:var(--space-xl);">
              <p style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-teal);margin-bottom:var(--space-md);">Fundamental truths — build from here</p>
              ${truths.map(t => `
                <div style="padding:var(--space-md);background:var(--color-teal-bg);border:1px solid rgba(27,158,143,0.15);border-radius:var(--radius-md);margin-bottom:var(--space-sm);color:var(--color-ink);font-size:0.88rem;font-weight:500;">${t}</div>
              `).join('')}
            </div>
          ` : ''}

          <div style="padding-top:var(--space-lg);border-top:1px solid var(--color-border-light);">
            <h4 style="font-family:var(--font-display);font-weight:400;font-size:1.1rem;margin-bottom:var(--space-md);">Step 4: Rebuild</h4>
            <p style="color:var(--color-ink-muted);font-size:0.88rem;margin-bottom:var(--space-md);">Using only the fundamental truths above, what new solution or approach becomes possible?</p>
            <textarea id="fpt-solution" rows="4" placeholder="Now that I've stripped away conventions, I can see that..." style="width:100%;padding:0.75rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.92rem;resize:vertical;line-height:1.6;">${state.solution}</textarea>
          </div>

          <button onclick="fptReset()" class="btn btn-secondary" style="margin-top:var(--space-lg);">Decompose a new problem</button>
        </div>
      `;
    }
  }

  window.fptNext = function() {
    const el = document.getElementById('fpt-problem');
    if (!el || !el.value.trim()) return;
    state.problem = el.value.trim();
    state.phase = 'assumptions';
    render();
  };

  window.fptAddAssumption = function() {
    const el = document.getElementById('fpt-assumption');
    if (!el || !el.value.trim()) return;
    state.assumptions.push(el.value.trim());
    render();
  };

  window.fptToChallenge = function() {
    state.phase = 'challenge';
    render();
  };

  window.fptChallenge = function(idx, verdict) {
    state.challenged[idx] = verdict;
    render();
  };

  window.fptToRebuild = function() {
    state.phase = 'rebuild';
    render();
  };

  window.fptReset = function() {
    state = { phase: 'problem', problem: '', assumptions: [], challenged: {}, truths: [], solution: '' };
    render();
  };

  render();
})();
