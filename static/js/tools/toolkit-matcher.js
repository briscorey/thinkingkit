(function() {
  const app = document.getElementById('matcher-app');
  if (!app || typeof MODELS_DATA === 'undefined') return;

  // Situation type → usecase mapping + keywords
  const situations = [
    { id: 'decide', label: 'Making a decision', icon: '⊞', usecases: ['Making Decisions'], keywords: ['decide','choice','choose','option','tradeoff','compare','evaluate','pick','select','weigh'] },
    { id: 'solve', label: 'Solving a problem', icon: '⚡', usecases: ['Solving Problems','Innovation'], keywords: ['solve','fix','broken','stuck','obstacle','challenge','improve','create','build','design'] },
    { id: 'system', label: 'Understanding a system', icon: '↻', usecases: ['Understanding Systems'], keywords: ['system','pattern','loop','cause','effect','dynamic','complex','relationship','feedback','structure'] },
    { id: 'risk', label: 'Managing risk', icon: '⊘', usecases: ['Managing Risk'], keywords: ['risk','danger','fail','protect','downside','uncertainty','volatile','fragile','safety','prevent'] },
    { id: 'argue', label: 'Evaluating an argument', icon: '◉', usecases: ['Evaluating Arguments','Communication'], keywords: ['argument','claim','evidence','fallacy','bias','persuade','logic','debate','belief','opinion'] },
    { id: 'lead', label: 'Leading or collaborating', icon: '▦', usecases: ['Leading Teams','Communication'], keywords: ['team','lead','manage','people','motivate','delegate','communicate','conflict','culture','hire'] }
  ];

  // Additional keyword → tag matching
  const tagKeywords = {
    'money': ['economics','investing','Buffett','Munger'],
    'invest': ['economics','investing','Buffett','Munger','risk','optionality'],
    'career': ['decision-making','risk','optionality','tradeoffs'],
    'startup': ['risk','optionality','Taleb','innovation'],
    'negotiate': ['game-theory','incentives','reciprocity'],
    'learn': ['learning','Feynman','mental-performance'],
    'plan': ['planning','productivity','prioritisation'],
    'priorit': ['productivity','prioritisation','Eisenhower','Covey'],
    'predict': ['probability','Tetlock','forecasting','Bayes'],
    'complex': ['systems','Meadows','complexity','emergence'],
    'simple': ['simplicity','Ockham','heuristic'],
    'bias': ['Kahneman','cognitive-bias','psychology'],
    'emotion': ['psychology','Kahneman','stoic'],
    'habit': ['compounding','Clear','behaviour'],
    'grow': ['compounding','evolution','scaling'],
    'fail': ['risk','antifragile','Taleb','pre-mortem'],
    'innovat': ['first-principles','contrarian','Musk'],
    'strateg': ['game-theory','strategy','military','Boyd']
  };

  let state = { phase: 'choose', situation: null, context: '', results: [] };

  function scoreModels(situationId, contextText) {
    const sit = situations.find(s => s.id === situationId);
    if (!sit) return [];

    const contextLower = contextText.toLowerCase();
    const contextWords = contextLower.split(/\s+/);

    return MODELS_DATA.map(model => {
      let score = 0;
      let reasons = [];

      // Usecase match (strongest signal)
      const ucMatch = model.u.filter(u => sit.usecases.includes(u));
      if (ucMatch.length > 0) {
        score += ucMatch.length * 30;
        reasons.push('Directly relevant to ' + ucMatch[0].toLowerCase());
      }

      // Situation keyword match in model one-liner and tags
      const modelText = (model.o + ' ' + model.g.join(' ')).toLowerCase();
      sit.keywords.forEach(kw => {
        if (modelText.includes(kw)) score += 5;
      });

      // Context keyword matching
      if (contextText.length > 0) {
        // Direct word match in model text
        contextWords.forEach(word => {
          if (word.length > 3 && modelText.includes(word)) {
            score += 8;
          }
        });

        // Tag keyword matching
        Object.entries(tagKeywords).forEach(([keyword, tags]) => {
          if (contextLower.includes(keyword)) {
            tags.forEach(tag => {
              if (model.g.some(g => g.toLowerCase().includes(tag.toLowerCase()))) {
                score += 12;
                if (!reasons.some(r => r.includes('context'))) {
                  reasons.push('Matches your specific context');
                }
              }
            });
          }
        });
      }

      // Difficulty bonus (foundations first for broad situations)
      if (model.d === 'Foundation') score += 3;

      return { ...model, score, reasons };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  }

  function render() {
    if (state.phase === 'choose') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">What are you dealing with?</h3>
          <p style="color:var(--color-ink-muted);font-size:0.9rem;margin-bottom:var(--space-xl);">Pick the category that best describes your situation.</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:var(--space-md);">
            ${situations.map(s => `
              <button onclick="matcherSelect('${s.id}')" style="text-align:left;padding:var(--space-lg);background:var(--color-bg);border:1px solid var(--color-border-light);border-radius:var(--radius-md);cursor:pointer;transition:all 0.2s ease;font-family:var(--font-body);" onmouseover="this.style.borderColor='var(--color-accent)';this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.borderColor='var(--color-border-light)';this.style.boxShadow='none'">
                <span style="font-size:1.3rem;display:block;margin-bottom:var(--space-sm);">${s.icon}</span>
                <span style="font-size:0.95rem;font-weight:700;color:var(--color-ink);display:block;">${s.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    } else if (state.phase === 'context') {
      const sit = situations.find(s => s.id === state.situation);
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <button onclick="matcherBack()" style="background:none;border:none;color:var(--color-ink-muted);cursor:pointer;font-family:var(--font-body);font-size:0.82rem;margin-bottom:var(--space-lg);padding:0;">← Back</button>
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">${sit.icon} ${sit.label}</h3>
          <p style="color:var(--color-ink-muted);font-size:0.9rem;margin-bottom:var(--space-lg);">Add some detail about your specific situation. The more context you give, the better the recommendations.</p>
          <textarea id="matcher-context" rows="4" placeholder="e.g. I'm trying to decide whether to accept a job offer at a startup vs stay at my current company. The startup pays less but has equity..." style="width:100%;padding:0.75rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.92rem;resize:vertical;line-height:1.6;"></textarea>
          <div style="display:flex;gap:var(--space-sm);margin-top:var(--space-lg);">
            <button onclick="matcherRun()" class="btn btn-primary" style="flex:1;">Find the right models</button>
            <button onclick="matcherSkip()" class="btn btn-secondary">Skip — show all matches</button>
          </div>
        </div>
      `;
      setTimeout(() => { const ta = document.getElementById('matcher-context'); if(ta) ta.focus(); }, 50);
    } else if (state.phase === 'results') {
      const sit = situations.find(s => s.id === state.situation);
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);flex-wrap:wrap;gap:var(--space-md);">
            <div>
              <h3 style="margin:0 0 var(--space-xs);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Your toolkit</h3>
              <p style="color:var(--color-ink-muted);font-size:0.85rem;margin:0;">${state.results.length} models matched for: ${sit.label.toLowerCase()}</p>
            </div>
            <button onclick="matcherReset()" class="btn btn-secondary" style="padding:0.4rem 1rem;font-size:0.8rem;">Start over</button>
          </div>

          ${state.results.length === 0 ? `
            <div style="text-align:center;padding:var(--space-2xl);color:var(--color-ink-muted);">
              <p>No strong matches found. Try adding more context or choosing a different situation type.</p>
            </div>
          ` : ''}

          ${state.results.map((m, i) => `
            <a href="/models/${m.s}/" style="display:block;text-decoration:none;color:inherit;padding:var(--space-lg);background:${i === 0 ? 'var(--color-accent-bg)' : 'var(--color-bg)'};border:1px solid ${i === 0 ? 'rgba(232,82,63,0.15)' : 'var(--color-border-light)'};border-radius:var(--radius-md);margin-bottom:var(--space-md);transition:all 0.2s ease;" onmouseover="this.style.boxShadow='var(--shadow-md)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='none';this.style.transform='none'">
              <div style="display:flex;align-items:flex-start;gap:var(--space-md);">
                <span style="font-size:1.2rem;min-width:28px;text-align:center;line-height:1.6;">${m.i}</span>
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:4px;">
                    <span style="font-weight:700;color:var(--color-ink);font-size:0.95rem;">${m.t}</span>
                    ${i === 0 ? '<span style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:0.15rem 0.5rem;border-radius:100px;background:var(--color-accent);color:#fff;">Best match</span>' : ''}
                    <span style="font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:0.15rem 0.45rem;border-radius:100px;background:var(--color-teal-bg);color:var(--color-teal);">${m.d}</span>
                  </div>
                  <p style="color:var(--color-ink-muted);font-size:0.85rem;margin:0;line-height:1.5;">${m.o}</p>
                  ${m.reasons.length > 0 ? `<p style="color:var(--color-accent);font-size:0.78rem;margin:4px 0 0;font-weight:500;">${m.reasons[0]}</p>` : ''}
                </div>
                <span style="color:var(--color-ink-faint);font-size:0.85rem;">→</span>
              </div>
            </a>
          `).join('')}

          ${state.context ? `
          <div style="margin-top:var(--space-xl);padding-top:var(--space-lg);border-top:1px solid var(--color-border-light);">
            <p style="font-size:0.82rem;color:var(--color-ink-muted);margin:0;"><strong>Tip:</strong> Start with the best match. Read the "How it works" section, then try the "Try it now" exercise with your actual situation in mind. One model applied well beats ten models skimmed.</p>
          </div>
          ` : ''}
        </div>
      `;
    }
  }

  window.matcherSelect = function(id) {
    state.situation = id;
    state.phase = 'context';
    render();
  };

  window.matcherBack = function() {
    state.phase = 'choose';
    state.situation = null;
    render();
  };

  window.matcherRun = function() {
    const ta = document.getElementById('matcher-context');
    state.context = ta ? ta.value.trim() : '';
    state.results = scoreModels(state.situation, state.context);
    state.phase = 'results';
    render();
  };

  window.matcherSkip = function() {
    state.context = '';
    state.results = scoreModels(state.situation, '');
    state.phase = 'results';
    render();
  };

  window.matcherReset = function() {
    state = { phase: 'choose', situation: null, context: '', results: [] };
    render();
  };

  render();
})();
