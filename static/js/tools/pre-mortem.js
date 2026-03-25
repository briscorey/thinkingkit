
(function() {
  const app = document.getElementById('premortem-app');

  let state = {
    project: '',
    phase: 'setup',
    failures: [],
    currentInput: ''
  };

  const prompts = [
    "The timeline was completely unrealistic because...",
    "A key assumption turned out to be wrong, specifically...",
    "The team couldn't agree on...",
    "An external factor nobody predicted was...",
    "The biggest thing we underestimated was...",
    "Communication broke down when...",
    "The users/audience/customers hated it because...",
    "We ran out of resources because..."
  ];

  function render() {
    if (state.phase === 'setup') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);color:var(--color-text);">Pre-Mortem Generator</h3>
          <p style="color:var(--color-text-muted);font-size:0.9rem;margin-bottom:var(--space-xl);">Imagine it's six months from now. Your project has failed completely. Let's figure out why.</p>
          <label style="display:block;font-size:0.8rem;color:var(--color-text-secondary);margin-bottom:var(--space-sm);font-weight:500;">What's the project, decision, or plan?</label>
          <input id="pm-project" type="text" placeholder="e.g. Launching the new product line, Moving to Berlin, Starting a business..." style="width:100%;padding:0.75rem 1rem;background:var(--color-bg-elevated);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-text);font-family:var(--font-body);font-size:0.95rem;margin-bottom:var(--space-lg);">
          <button onclick="pmStart()" class="btn btn-primary" style="width:100%;">Begin the pre-mortem</button>
        </div>
      `;
    } else if (state.phase === 'generate') {
      const promptIdx = state.failures.length % prompts.length;
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);">
            <h3 style="margin:0;font-family:var(--font-display);color:var(--color-text);">Pre-Mortem: ${state.project}</h3>
            <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--color-amber);background:var(--color-amber-glow);padding:0.2rem 0.6rem;border-radius:var(--radius-sm);">${state.failures.length} risks found</span>
          </div>
          <div style="background:var(--color-bg-elevated);border-left:3px solid var(--color-amber);padding:var(--space-lg);border-radius:0 var(--radius-md) var(--radius-md) 0;margin-bottom:var(--space-lg);">
            <p style="color:var(--color-amber);font-family:var(--font-display);font-style:italic;font-size:1rem;margin-bottom:var(--space-sm);">"The project failed because..."</p>
            <p style="color:var(--color-text-muted);font-size:0.85rem;margin:0;">Prompt: ${prompts[promptIdx]}</p>
          </div>
          <textarea id="pm-input" rows="3" placeholder="Describe a specific way this could fail..." style="width:100%;padding:0.75rem 1rem;background:var(--color-bg-elevated);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-text);font-family:var(--font-body);font-size:0.9rem;resize:vertical;margin-bottom:var(--space-md);"></textarea>
          <div style="display:flex;gap:var(--space-sm);">
            <button onclick="pmAddFailure()" class="btn btn-primary" style="flex:1;">Add this risk</button>
            <button onclick="pmFinish()" class="btn btn-secondary">Finish →</button>
          </div>
          ${state.failures.length > 0 ? `
          <div style="margin-top:var(--space-xl);border-top:1px solid var(--color-border-subtle);padding-top:var(--space-lg);">
            <p style="font-size:0.75rem;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:var(--space-md);">Risks identified</p>
            ${state.failures.map((f, i) => `
              <div style="display:flex;gap:var(--space-md);align-items:flex-start;margin-bottom:var(--space-md);padding:var(--space-md);background:var(--color-bg-elevated);border-radius:var(--radius-md);">
                <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--color-amber);min-width:24px;">${String(i+1).padStart(2,'0')}</span>
                <div style="flex:1;">
                  <p style="color:var(--color-text-secondary);font-size:0.88rem;margin:0;">${f.text}</p>
                  ${f.severity ? `<span style="font-size:0.7rem;padding:0.15rem 0.5rem;border-radius:100px;background:${f.severity==='high'?'rgba(239,68,68,0.1)':f.severity==='medium'?'var(--color-amber-glow)':'rgba(34,197,94,0.1)'};color:${f.severity==='high'?'var(--color-red)':f.severity==='medium'?'var(--color-amber)':'var(--color-green)'};margin-top:var(--space-xs);display:inline-block;">${f.severity} risk</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      `;
      setTimeout(() => { const ta = document.getElementById('pm-input'); if(ta) ta.focus(); }, 50);
    } else if (state.phase === 'review') {
      const high = state.failures.filter(f => f.severity === 'high');
      const medium = state.failures.filter(f => f.severity === 'medium');
      const low = state.failures.filter(f => f.severity === 'low');
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);color:var(--color-text);">Pre-Mortem Report: ${state.project}</h3>
          <p style="color:var(--color-text-muted);font-size:0.88rem;margin-bottom:var(--space-xl);">You identified ${state.failures.length} potential failure modes. Now rate each by severity and decide what to do about them.</p>
          ${state.failures.map((f, i) => `
            <div style="background:var(--color-bg-elevated);border-radius:var(--radius-md);padding:var(--space-lg);margin-bottom:var(--space-md);border-left:3px solid ${f.severity==='high'?'var(--color-red)':f.severity==='medium'?'var(--color-amber)':f.severity==='low'?'var(--color-green)':'var(--color-border)'};">
              <p style="color:var(--color-text);font-size:0.92rem;margin-bottom:var(--space-sm);">${f.text}</p>
              <div style="display:flex;gap:var(--space-sm);align-items:center;">
                <span style="font-size:0.75rem;color:var(--color-text-muted);margin-right:var(--space-sm);">Severity:</span>
                <button onclick="pmRate(${i},'high')" style="font-size:0.72rem;padding:0.2rem 0.6rem;border-radius:100px;border:1px solid ${f.severity==='high'?'var(--color-red)':'var(--color-border)'};background:${f.severity==='high'?'rgba(239,68,68,0.15)':'transparent'};color:${f.severity==='high'?'var(--color-red)':'var(--color-text-muted)'};cursor:pointer;">High</button>
                <button onclick="pmRate(${i},'medium')" style="font-size:0.72rem;padding:0.2rem 0.6rem;border-radius:100px;border:1px solid ${f.severity==='medium'?'var(--color-amber)':'var(--color-border)'};background:${f.severity==='medium'?'var(--color-amber-glow)':'transparent'};color:${f.severity==='medium'?'var(--color-amber)':'var(--color-text-muted)'};cursor:pointer;">Medium</button>
                <button onclick="pmRate(${i},'low')" style="font-size:0.72rem;padding:0.2rem 0.6rem;border-radius:100px;border:1px solid ${f.severity==='low'?'var(--color-green)':'var(--color-border)'};background:${f.severity==='low'?'rgba(34,197,94,0.1)':'transparent'};color:${f.severity==='low'?'var(--color-green)':'var(--color-text-muted)'};cursor:pointer;">Low</button>
              </div>
            </div>
          `).join('')}
          <div style="margin-top:var(--space-xl);padding-top:var(--space-lg);border-top:1px solid var(--color-border-subtle);">
            <h4 style="font-family:var(--font-display);font-size:1.1rem;margin-bottom:var(--space-md);">Next step</h4>
            <p style="color:var(--color-text-secondary);font-size:0.9rem;">For each <span style="color:var(--color-red);">high-severity</span> risk, write down one specific action you can take this week to reduce it. That's the entire value of the pre-mortem — converting worry into prevention.</p>
          </div>
          <button onclick="pmReset()" class="btn btn-secondary" style="margin-top:var(--space-lg);">Start a new pre-mortem</button>
        </div>
      `;
    }
  }

  window.pmStart = function() {
    const input = document.getElementById('pm-project');
    if (!input.value.trim()) return;
    state.project = input.value.trim();
    state.phase = 'generate';
    render();
  };

  window.pmAddFailure = function() {
    const input = document.getElementById('pm-input');
    if (!input.value.trim()) return;
    state.failures.push({ text: input.value.trim(), severity: null });
    render();
  };

  window.pmFinish = function() {
    if (state.failures.length === 0) return;
    state.phase = 'review';
    render();
  };

  window.pmRate = function(i, severity) {
    state.failures[i].severity = state.failures[i].severity === severity ? null : severity;
    render();
  };

  window.pmReset = function() {
    state = { project: '', phase: 'setup', failures: [], currentInput: '' };
    render();
  };

  render();
})();
