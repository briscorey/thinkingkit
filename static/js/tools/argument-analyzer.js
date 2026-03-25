(function() {
  const app = document.getElementById('argument-app');
  if (!app) return;

  const fallacies = [
    { id: 'ad_hominem', name: 'Ad Hominem', q: 'Does it attack the person making the argument rather than the argument itself?', desc: 'Dismissing a claim by criticising who said it, not what they said.' },
    { id: 'straw_man', name: 'Straw Man', q: 'Does it misrepresent or oversimplify the opposing position to make it easier to attack?', desc: 'Arguing against a distorted version of someone\'s position rather than their actual position.' },
    { id: 'appeal_authority', name: 'Appeal to Authority', q: 'Does it rely primarily on who said it rather than the quality of the evidence?', desc: 'Using an authority figure\'s opinion as proof, especially outside their expertise.' },
    { id: 'false_dilemma', name: 'False Dilemma', q: 'Does it present only two options when more exist?', desc: 'Reducing a complex situation to an either/or choice when other possibilities are available.' },
    { id: 'slippery_slope', name: 'Slippery Slope', q: 'Does it claim one small step will inevitably lead to extreme consequences without evidence?', desc: 'Asserting that a minor action will trigger a chain of events leading to disaster.' },
    { id: 'circular', name: 'Circular Reasoning', q: 'Does the conclusion just restate the premise in different words?', desc: 'Using the conclusion as one of the premises — the argument assumes what it\'s trying to prove.' },
    { id: 'anecdotal', name: 'Anecdotal Evidence', q: 'Does it use a personal story or single example as proof of a general claim?', desc: 'Treating a vivid individual case as representative of a broader pattern.' },
    { id: 'bandwagon', name: 'Bandwagon / Appeal to Popularity', q: 'Does it claim something is true or good because many people believe it or do it?', desc: 'Popularity is not evidence. Many people can be wrong simultaneously.' }
  ];

  let state = {
    phase: 'input',
    argument: '',
    claim: '',
    evidence: '',
    fallacyIdx: 0,
    flagged: {},
    evidenceRating: null
  };

  function render() {
    if (state.phase === 'input') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Argument Analyzer</h3>
          <p style="color:var(--color-ink-muted);font-size:0.9rem;margin-bottom:var(--space-lg);">Paste any argument, claim, or opinion you want to evaluate.</p>
          <textarea id="arg-input" rows="4" placeholder='e.g. "We should switch to remote work because studies show productivity increases by 13% and employee satisfaction rises significantly..."' style="width:100%;padding:0.75rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.92rem;resize:vertical;line-height:1.6;"></textarea>
          <button onclick="argNext()" class="btn btn-primary" style="width:100%;margin-top:var(--space-lg);">Analyze this argument →</button>
        </div>
      `;
    } else if (state.phase === 'decompose') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Step 1: Decompose the argument</h3>
          <div style="background:var(--color-bg);padding:var(--space-md);border-radius:var(--radius-md);margin-bottom:var(--space-xl);border-left:3px solid var(--color-border);">
            <p style="font-size:0.88rem;color:var(--color-ink-secondary);margin:0;font-style:italic;">"${state.argument}"</p>
          </div>
          <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--color-ink);margin-bottom:var(--space-sm);">What is the core claim?</label>
          <input id="arg-claim" type="text" placeholder="The main thing they're asserting is..." style="width:100%;padding:0.6rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.9rem;margin-bottom:var(--space-lg);">
          <label style="display:block;font-size:0.82rem;font-weight:700;color:var(--color-ink);margin-bottom:var(--space-sm);">What evidence or reasoning do they offer?</label>
          <input id="arg-evidence" type="text" placeholder="They support this with..." style="width:100%;padding:0.6rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.9rem;margin-bottom:var(--space-lg);">
          <button onclick="argToFallacies()" class="btn btn-primary" style="width:100%;">Check for fallacies →</button>
        </div>
      `;
    } else if (state.phase === 'fallacies') {
      const f = fallacies[state.fallacyIdx];
      const progress = (state.fallacyIdx / fallacies.length) * 100;
      const flagCount = Object.values(state.flagged).filter(v => v).length;
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md);">
            <h3 style="margin:0;font-family:var(--font-display);font-weight:400;font-size:1.2rem;">Step 2: Fallacy check</h3>
            ${flagCount > 0 ? `<span style="font-size:0.75rem;font-weight:700;color:var(--color-accent);background:var(--color-accent-bg);padding:0.2rem 0.6rem;border-radius:100px;">${flagCount} flagged</span>` : ''}
          </div>
          <div style="height:3px;background:var(--color-surface);border-radius:2px;margin-bottom:var(--space-xl);overflow:hidden;">
            <div style="height:100%;width:${progress}%;background:var(--color-accent);border-radius:2px;transition:width 0.3s ease;"></div>
          </div>
          <span class="label" style="display:block;margin-bottom:var(--space-md);">${f.name}</span>
          <p style="font-size:1.02rem;color:var(--color-ink);line-height:1.5;margin-bottom:var(--space-sm);">${f.q}</p>
          <p style="font-size:0.82rem;color:var(--color-ink-muted);margin-bottom:var(--space-xl);font-style:italic;">${f.desc}</p>
          <div style="display:flex;gap:var(--space-sm);">
            <button onclick="argFallacy(true)" style="flex:1;padding:var(--space-md);background:var(--color-accent-bg);border:1px solid rgba(232,82,63,0.2);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);font-weight:700;color:var(--color-accent);font-size:0.88rem;">Yes — I see this</button>
            <button onclick="argFallacy(false)" style="flex:1;padding:var(--space-md);background:var(--color-teal-bg);border:1px solid rgba(27,158,143,0.2);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);font-weight:700;color:var(--color-teal);font-size:0.88rem;">No — not present</button>
          </div>
        </div>
      `;
    } else if (state.phase === 'evidence') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-lg);font-family:var(--font-display);font-weight:400;font-size:1.2rem;">Step 3: Rate the evidence</h3>
          <p style="color:var(--color-ink-muted);font-size:0.88rem;margin-bottom:var(--space-md);">Considering the evidence offered: <em>"${state.evidence || 'not specified'}"</em></p>
          <p style="color:var(--color-ink-secondary);font-size:0.9rem;margin-bottom:var(--space-xl);">How strong is the evidence for the core claim?</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);">
            <button onclick="argRate('strong')" style="padding:var(--space-lg);background:var(--color-teal-bg);border:1px solid rgba(27,158,143,0.2);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);text-align:left;">
              <span style="font-weight:700;color:var(--color-teal);display:block;margin-bottom:4px;">Strong</span>
              <span style="font-size:0.78rem;color:var(--color-ink-muted);">Multiple independent sources, empirical data, peer review</span>
            </button>
            <button onclick="argRate('moderate')" style="padding:var(--space-lg);background:var(--color-gold-bg);border:1px solid rgba(196,149,42,0.2);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);text-align:left;">
              <span style="font-weight:700;color:var(--color-gold);display:block;margin-bottom:4px;">Moderate</span>
              <span style="font-size:0.78rem;color:var(--color-ink-muted);">Some supporting data but limited scope or methodology concerns</span>
            </button>
            <button onclick="argRate('weak')" style="padding:var(--space-lg);background:var(--color-accent-bg);border:1px solid rgba(232,82,63,0.15);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);text-align:left;">
              <span style="font-weight:700;color:var(--color-accent);display:block;margin-bottom:4px;">Weak</span>
              <span style="font-size:0.78rem;color:var(--color-ink-muted);">Anecdotal, single source, no data, or appeals to authority</span>
            </button>
            <button onclick="argRate('none')" style="padding:var(--space-lg);background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);text-align:left;">
              <span style="font-weight:700;color:var(--color-ink-muted);display:block;margin-bottom:4px;">No evidence</span>
              <span style="font-size:0.78rem;color:var(--color-ink-muted);">Pure assertion, opinion stated as fact, emotional appeal only</span>
            </button>
          </div>
        </div>
      `;
    } else if (state.phase === 'results') {
      const flagged = fallacies.filter(f => state.flagged[f.id]);
      const clear = fallacies.filter(f => !state.flagged[f.id]);
      const ratingColors = { strong: 'var(--color-teal)', moderate: 'var(--color-gold)', weak: 'var(--color-accent)', none: 'var(--color-ink-muted)' };
      const ratingLabels = { strong: 'Strong evidence', moderate: 'Moderate evidence', weak: 'Weak evidence', none: 'No real evidence' };

      // Overall assessment
      let assessment;
      if (flagged.length === 0 && (state.evidenceRating === 'strong' || state.evidenceRating === 'moderate')) {
        assessment = { label: 'Reasonably sound', color: 'var(--color-teal)', detail: 'No obvious fallacies detected and the evidence has some substance. Worth taking seriously, though independent verification is always wise.' };
      } else if (flagged.length <= 2 && state.evidenceRating !== 'none') {
        assessment = { label: 'Proceed with caution', color: 'var(--color-gold)', detail: 'Some logical issues detected. The core claim may have merit, but the reasoning has weak points that should be examined.' };
      } else {
        assessment = { label: 'Significant issues', color: 'var(--color-accent)', detail: 'Multiple fallacies or very weak evidence. This argument needs substantially better support before it should influence your decisions.' };
      }

      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-lg);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Analysis Results</h3>

          <!-- Overall -->
          <div style="background:var(--color-bg);padding:var(--space-lg);border-radius:var(--radius-md);margin-bottom:var(--space-xl);border-left:3px solid ${assessment.color};">
            <p style="font-weight:700;font-size:1rem;color:${assessment.color};margin-bottom:var(--space-xs);">${assessment.label}</p>
            <p style="font-size:0.88rem;color:var(--color-ink-secondary);margin:0;">${assessment.detail}</p>
          </div>

          <!-- Claim & Evidence -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-xl);">
            <div style="padding:var(--space-md);background:var(--color-bg);border-radius:var(--radius-md);">
              <p style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-ink-muted);margin-bottom:4px;">Core claim</p>
              <p style="font-size:0.88rem;color:var(--color-ink);margin:0;">${state.claim || 'Not specified'}</p>
            </div>
            <div style="padding:var(--space-md);background:var(--color-bg);border-radius:var(--radius-md);">
              <p style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-ink-muted);margin-bottom:4px;">Evidence strength</p>
              <p style="font-size:0.88rem;color:${ratingColors[state.evidenceRating]};margin:0;font-weight:700;">${ratingLabels[state.evidenceRating]}</p>
            </div>
          </div>

          <!-- Fallacies found -->
          ${flagged.length > 0 ? `
            <p style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-accent);margin-bottom:var(--space-md);">Fallacies detected (${flagged.length})</p>
            ${flagged.map(f => `
              <div style="padding:var(--space-md);background:var(--color-accent-bg);border-radius:var(--radius-md);margin-bottom:var(--space-sm);border-left:3px solid var(--color-accent);">
                <p style="font-weight:700;font-size:0.88rem;color:var(--color-ink);margin-bottom:2px;">${f.name}</p>
                <p style="font-size:0.82rem;color:var(--color-ink-muted);margin:0;">${f.desc}</p>
              </div>
            `).join('')}
          ` : `
            <div style="padding:var(--space-md);background:var(--color-teal-bg);border-radius:var(--radius-md);margin-bottom:var(--space-md);">
              <p style="font-size:0.88rem;color:var(--color-teal);margin:0;font-weight:500;">No fallacies detected in this argument.</p>
            </div>
          `}

          <div style="margin-top:var(--space-xl);padding-top:var(--space-lg);border-top:1px solid var(--color-border-light);">
            <p style="font-size:0.82rem;color:var(--color-ink-muted);margin-bottom:var(--space-md);"><strong>Next step:</strong> If the argument has issues, try <a href="/models/steelmanning/">steelmanning</a> it — rebuild the strongest possible version of their position. If you still disagree, you've earned that disagreement honestly.</p>
            <button onclick="argReset()" class="btn btn-secondary">Analyze another argument</button>
          </div>
        </div>
      `;
    }
  }

  window.argNext = function() {
    const el = document.getElementById('arg-input');
    if (!el || !el.value.trim()) return;
    state.argument = el.value.trim();
    state.phase = 'decompose';
    render();
  };

  window.argToFallacies = function() {
    const c = document.getElementById('arg-claim');
    const e = document.getElementById('arg-evidence');
    state.claim = c ? c.value.trim() : '';
    state.evidence = e ? e.value.trim() : '';
    state.phase = 'fallacies';
    state.fallacyIdx = 0;
    render();
  };

  window.argFallacy = function(present) {
    state.flagged[fallacies[state.fallacyIdx].id] = present;
    state.fallacyIdx++;
    if (state.fallacyIdx >= fallacies.length) {
      state.phase = 'evidence';
    }
    render();
  };

  window.argRate = function(rating) {
    state.evidenceRating = rating;
    state.phase = 'results';
    render();
  };

  window.argReset = function() {
    state = { phase: 'input', argument: '', claim: '', evidence: '', fallacyIdx: 0, flagged: {}, evidenceRating: null };
    render();
  };

  render();
})();
