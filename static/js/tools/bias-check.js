
(function() {
  const app = document.getElementById('bias-check-app');

  const biases = [
    {
      name: "Confirmation Bias",
      question: "Have I mostly sought out information that supports what I already believe?",
      debrief: "We naturally gravitate toward evidence that confirms our existing views. Actively seek out the strongest argument against your position.",
      antidote: "Find the best argument against your current leaning and steelman it."
    },
    {
      name: "Sunk Cost Fallacy",
      question: "Am I continuing because I've already invested time, money, or effort — even though the future outlook doesn't justify it?",
      debrief: "Past investments are gone regardless of what you decide. The only thing that matters is the expected value from here forward.",
      antidote: "Ask: 'If I were starting from scratch today, would I choose this path?'"
    },
    {
      name: "Anchoring",
      question: "Is my judgment being heavily influenced by the first number, price, or piece of information I encountered?",
      debrief: "The first data point we encounter disproportionately shapes all subsequent estimates. The anchor is often arbitrary.",
      antidote: "Generate your own estimate before looking at anyone else's. Consider multiple reference points."
    },
    {
      name: "Availability Bias",
      question: "Am I overweighting recent, vivid, or emotionally charged examples while ignoring base rates?",
      debrief: "Dramatic events feel more probable than they are. A plane crash makes flying feel dangerous even though driving is statistically far riskier.",
      antidote: "Look up the actual statistics or base rates. How common is this outcome really?"
    },
    {
      name: "Overconfidence",
      question: "Am I more certain about this outcome than the evidence actually warrants?",
      debrief: "Most people's 90% confidence intervals contain the true answer only about 50% of the time. We systematically overestimate what we know.",
      antidote: "Assign a probability to your prediction. Would you bet real money at those odds?"
    },
    {
      name: "Status Quo Bias",
      question: "Am I favouring the current situation simply because it's the default, not because it's actually the best option?",
      debrief: "Humans have a strong preference for the current state of affairs. Change feels risky even when staying put is riskier.",
      antidote: "Imagine you're in the alternative situation. Would you switch back to where you are now?"
    },
    {
      name: "Social Proof",
      question: "Am I choosing this because other people are doing it, rather than because it's the right choice for my specific situation?",
      debrief: "Following the crowd is a useful heuristic in uncertain situations, but it can lead you astray when your situation differs from theirs.",
      antidote: "Ask: 'Would I make this same choice if nobody else was doing it?'"
    },
    {
      name: "Framing Effect",
      question: "Would I make a different decision if the same information were presented differently?",
      debrief: "How information is framed — as a gain vs. a loss, as a percentage vs. a number — dramatically changes our choices, even when the underlying facts are identical.",
      antidote: "Reframe the decision: state it as a gain and as a loss. If your answer changes, the framing is doing the thinking."
    }
  ];

  let state = {
    phase: 'intro',
    current: 0,
    responses: {},
    decision: ''
  };

  function flagCount() {
    return Object.values(state.responses).filter(r => r === 'yes' || r === 'maybe').length;
  }

  function render() {
    if (state.phase === 'intro') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);color:var(--color-text);">Bias Check</h3>
          <p style="color:var(--color-text-muted);font-size:0.9rem;margin-bottom:var(--space-xl);">Before you commit to a decision, run it through ${biases.length} common cognitive biases. Takes about 3 minutes.</p>
          <label style="display:block;font-size:0.8rem;color:var(--color-text-secondary);margin-bottom:var(--space-sm);font-weight:500;">What decision are you making?</label>
          <input id="bc-decision" type="text" placeholder="e.g. Accepting the job offer, Investing in X, Launching the feature..." style="width:100%;padding:0.75rem 1rem;background:var(--color-bg-warm);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-text);font-family:var(--font-body);font-size:0.95rem;margin-bottom:var(--space-lg);">
          <button onclick="bcStart()" class="btn btn-primary" style="width:100%;">Run the check</button>
        </div>
      `;
    } else if (state.phase === 'check') {
      const b = biases[state.current];
      const progress = ((state.current) / biases.length) * 100;
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);">
            <span style="font-size:0.75rem;color:var(--color-text-muted);">${state.current + 1} of ${biases.length}</span>
            ${flagCount() > 0 ? `<span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--color-amber);background:var(--color-amber-glow);padding:0.2rem 0.6rem;border-radius:var(--radius-sm);">${flagCount()} flagged</span>` : ''}
          </div>
          <div style="height:3px;background:var(--color-bg-warm);border-radius:2px;margin-bottom:var(--space-xl);overflow:hidden;">
            <div style="height:100%;width:${progress}%;background:var(--color-amber);border-radius:2px;transition:width 0.3s ease;"></div>
          </div>
          <span class="label" style="display:block;margin-bottom:var(--space-md);">${b.name}</span>
          <p style="font-family:var(--font-display);font-size:1.15rem;color:var(--color-text);line-height:1.5;margin-bottom:var(--space-xl);">${b.question}</p>
          <div style="display:flex;gap:var(--space-sm);">
            <button onclick="bcAnswer('yes')" class="btn" style="flex:1;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:var(--color-red);">Yes — this might be affecting me</button>
            <button onclick="bcAnswer('maybe')" class="btn" style="flex:1;background:var(--color-amber-glow);border:1px solid rgba(245,158,11,0.3);color:var(--color-amber);">Maybe</button>
            <button onclick="bcAnswer('no')" class="btn" style="flex:1;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);color:var(--color-green);">No — I'm clear here</button>
          </div>
        </div>
      `;
    } else if (state.phase === 'results') {
      const flagged = biases.filter((_, i) => state.responses[i] === 'yes' || state.responses[i] === 'maybe');
      const clear = biases.filter((_, i) => state.responses[i] === 'no');
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);color:var(--color-text);">Bias Check Results</h3>
          <p style="color:var(--color-text-muted);font-size:0.9rem;margin-bottom:var(--space-lg);">Decision: <em>${state.decision}</em></p>

          <div style="display:flex;gap:var(--space-lg);margin-bottom:var(--space-xl);flex-wrap:wrap;">
            <div style="text-align:center;flex:1;min-width:120px;padding:var(--space-lg);background:var(--color-bg-warm);border-radius:var(--radius-md);">
              <div style="font-family:var(--font-display);font-size:2rem;color:${flagged.length > 3 ? 'var(--color-red)' : flagged.length > 1 ? 'var(--color-amber)' : 'var(--color-green)'};">${flagged.length}</div>
              <div style="font-size:0.75rem;color:var(--color-text-muted);">biases flagged</div>
            </div>
            <div style="text-align:center;flex:1;min-width:120px;padding:var(--space-lg);background:var(--color-bg-warm);border-radius:var(--radius-md);">
              <div style="font-family:var(--font-display);font-size:2rem;color:var(--color-green);">${clear.length}</div>
              <div style="font-size:0.75rem;color:var(--color-text-muted);">clear</div>
            </div>
          </div>

          ${flagged.length > 0 ? `
            <h4 style="font-family:var(--font-display);font-size:1rem;margin-bottom:var(--space-md);color:var(--color-amber);">Watch out for:</h4>
            ${flagged.map(b => `
              <div style="background:var(--color-bg-warm);border-radius:var(--radius-md);padding:var(--space-lg);margin-bottom:var(--space-md);border-left:3px solid var(--color-amber);">
                <p style="font-weight:600;color:var(--color-text);font-size:0.9rem;margin-bottom:var(--space-xs);">${b.name}</p>
                <p style="color:var(--color-text-secondary);font-size:0.85rem;margin-bottom:var(--space-sm);">${b.debrief}</p>
                <p style="color:var(--color-amber);font-size:0.82rem;margin:0;"><strong>Antidote:</strong> ${b.antidote}</p>
              </div>
            `).join('')}
          ` : `
            <div style="background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.2);border-radius:var(--radius-md);padding:var(--space-xl);text-align:center;">
              <p style="color:var(--color-green);font-size:1rem;margin:0;">All clear. No obvious bias flags on this decision.</p>
            </div>
          `}

          <button onclick="bcReset()" class="btn btn-secondary" style="margin-top:var(--space-xl);">Run another check</button>
        </div>
      `;
    }
  }

  window.bcStart = function() {
    const input = document.getElementById('bc-decision');
    if (!input.value.trim()) return;
    state.decision = input.value.trim();
    state.phase = 'check';
    render();
  };

  window.bcAnswer = function(answer) {
    state.responses[state.current] = answer;
    if (state.current < biases.length - 1) {
      state.current++;
    } else {
      state.phase = 'results';
    }
    render();
  };

  window.bcReset = function() {
    state = { phase: 'intro', current: 0, responses: {}, decision: '' };
    render();
  };

  render();
})();
