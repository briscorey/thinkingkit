(function() {
  const app = document.getElementById('calibration-app');
  if (!app) return;

  const questions = [
    { q: "What year was the first email sent?", a: 1971, unit: "", hint: "Think early computing era" },
    { q: "How many bones are in the adult human body?", a: 206, unit: "", hint: "More than 100, fewer than 300" },
    { q: "What is the height of Mount Everest in metres?", a: 8849, unit: "m", hint: "The world's tallest mountain" },
    { q: "What is the diameter of Earth in kilometres?", a: 12742, unit: "km", hint: "A very large sphere" },
    { q: "How many countries are members of the United Nations?", a: 193, unit: "", hint: "Nearly every country" },
    { q: "What year was the printing press invented by Gutenberg?", a: 1440, unit: "", hint: "Medieval Europe" },
    { q: "What is the speed of light in km/s (approximately)?", a: 300000, unit: "km/s", hint: "Extremely fast" },
    { q: "How many chromosomes do humans have?", a: 46, unit: "", hint: "Pairs of genetic material" },
    { q: "What is the surface temperature of the Sun in degrees Celsius?", a: 5500, unit: "°C", hint: "Thousands of degrees" },
    { q: "How many languages are spoken in the world today (approximately)?", a: 7000, unit: "", hint: "Thousands" },
    { q: "What year did the Berlin Wall fall?", a: 1989, unit: "", hint: "Late Cold War era" },
    { q: "How many teeth does an adult human typically have?", a: 32, unit: "", hint: "Including wisdom teeth" },
    { q: "What is the distance from Earth to the Moon in kilometres?", a: 384400, unit: "km", hint: "Hundreds of thousands" },
    { q: "What year was Wikipedia launched?", a: 2001, unit: "", hint: "Early internet era" },
    { q: "How many hearts does an octopus have?", a: 3, unit: "", hint: "More than one" },
    { q: "What is the boiling point of water at sea level in Fahrenheit?", a: 212, unit: "°F", hint: "Above 200" },
    { q: "How many piano keys on a standard piano?", a: 88, unit: "", hint: "Close to 90" },
    { q: "What year was the first iPhone released?", a: 2007, unit: "", hint: "Mid-2000s" },
    { q: "How many time zones are there in the world?", a: 24, unit: "", hint: "One per hour" },
    { q: "What percentage of Earth's surface is covered by water?", a: 71, unit: "%", hint: "The majority" }
  ];

  let state = {
    phase: 'intro',
    questionIdx: 0,
    selectedQuestions: [],
    answers: [],
    totalQuestions: 10
  };

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function render() {
    if (state.phase === 'intro') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-sm);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Calibration Trainer</h3>
          <p style="color:var(--color-ink-secondary);font-size:0.92rem;margin-bottom:var(--space-md);">You'll be asked ${state.totalQuestions} factual questions. For each one, give a <strong>range</strong> you're <strong>90% confident</strong> contains the correct answer.</p>
          <p style="color:var(--color-ink-muted);font-size:0.85rem;margin-bottom:var(--space-xl);">If you're well-calibrated, about 9 out of 10 of your ranges should contain the true answer. Most people find that far fewer do — revealing systematic overconfidence.</p>
          <button onclick="calStart()" class="btn btn-primary" style="width:100%;">Start the test</button>
        </div>
      `;
    } else if (state.phase === 'question') {
      const q = state.selectedQuestions[state.questionIdx];
      const progress = (state.questionIdx / state.totalQuestions) * 100;
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-md);">
            <span style="font-size:0.78rem;color:var(--color-ink-muted);">Question ${state.questionIdx + 1} of ${state.totalQuestions}</span>
            <span style="font-size:0.72rem;color:var(--color-accent);font-weight:700;">90% CONFIDENCE INTERVAL</span>
          </div>
          <div style="height:3px;background:var(--color-surface);border-radius:2px;margin-bottom:var(--space-xl);overflow:hidden;">
            <div style="height:100%;width:${progress}%;background:var(--color-accent);border-radius:2px;transition:width 0.3s ease;"></div>
          </div>
          <p style="font-family:var(--font-display);font-size:1.15rem;color:var(--color-ink);margin-bottom:var(--space-xs);">${q.q}</p>
          <p style="font-size:0.78rem;color:var(--color-ink-faint);margin-bottom:var(--space-xl);font-style:italic;">Hint: ${q.hint}</p>
          <p style="font-size:0.82rem;color:var(--color-ink-secondary);margin-bottom:var(--space-md);">Give a range you're <strong>90% sure</strong> contains the answer:</p>
          <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-lg);">
            <div style="flex:1;">
              <label style="font-size:0.72rem;color:var(--color-ink-muted);font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Low end</label>
              <input id="cal-low" type="number" style="width:100%;padding:0.6rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-mono);font-size:1rem;margin-top:4px;" placeholder="Lower bound">
            </div>
            <span style="color:var(--color-ink-faint);font-size:1.2rem;padding-top:16px;">—</span>
            <div style="flex:1;">
              <label style="font-size:0.72rem;color:var(--color-ink-muted);font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">High end</label>
              <input id="cal-high" type="number" style="width:100%;padding:0.6rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-mono);font-size:1rem;margin-top:4px;" placeholder="Upper bound">
            </div>
            ${q.unit ? `<span style="color:var(--color-ink-muted);font-size:0.9rem;padding-top:16px;min-width:30px;">${q.unit}</span>` : ''}
          </div>
          <button onclick="calAnswer()" class="btn btn-primary" style="width:100%;">Submit</button>
        </div>
      `;
      setTimeout(() => { document.getElementById('cal-low').focus(); }, 50);
    } else if (state.phase === 'results') {
      const hits = state.answers.filter(a => a.hit).length;
      const pct = Math.round((hits / state.totalQuestions) * 100);
      const isCalibrated = hits >= 8 && hits <= 10;
      const isOverconfident = hits < 8;

      let assessment;
      if (hits >= 9) {
        assessment = { label: 'Well calibrated', color: 'var(--color-teal)', detail: 'Your confidence intervals match your actual knowledge well. This is rare and valuable — it means your "90% sure" actually means something.' };
      } else if (hits >= 7) {
        assessment = { label: 'Slightly overconfident', color: 'var(--color-gold)', detail: 'Your ranges are a bit too narrow. When you say 90% confident, you\'re actually right about ' + pct + '% of the time. Try making your ranges wider.' };
      } else if (hits >= 5) {
        assessment = { label: 'Significantly overconfident', color: 'var(--color-accent)', detail: 'You\'re right only ' + pct + '% of the time when you claim 90% confidence. This is common — most people\'s ranges are far too narrow. Practice widening your uncertainty bands.' };
      } else {
        assessment = { label: 'Very overconfident', color: 'var(--color-accent)', detail: 'At ' + pct + '% accuracy for a 90% target, your confidence significantly exceeds your accuracy. This is the most common result — and recognising it is the first step to better calibration.' };
      }

      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <h3 style="margin:0 0 var(--space-lg);font-family:var(--font-display);font-weight:400;font-size:1.4rem;">Your Calibration Score</h3>

          <div style="display:flex;gap:var(--space-xl);margin-bottom:var(--space-xl);flex-wrap:wrap;">
            <div style="text-align:center;flex:1;min-width:120px;">
              <div style="font-family:var(--font-display);font-size:3rem;color:${assessment.color};">${hits}/${state.totalQuestions}</div>
              <div style="font-size:0.78rem;color:var(--color-ink-muted);">answers inside your range</div>
            </div>
            <div style="text-align:center;flex:1;min-width:120px;">
              <div style="font-family:var(--font-display);font-size:3rem;color:var(--color-ink);">${pct}%</div>
              <div style="font-size:0.78rem;color:var(--color-ink-muted);">actual accuracy (target: 90%)</div>
            </div>
          </div>

          <div style="background:var(--color-bg);padding:var(--space-lg);border-radius:var(--radius-md);margin-bottom:var(--space-xl);border-left:3px solid ${assessment.color};">
            <p style="font-weight:700;color:${assessment.color};margin-bottom:var(--space-xs);">${assessment.label}</p>
            <p style="font-size:0.88rem;color:var(--color-ink-secondary);margin:0;">${assessment.detail}</p>
          </div>

          <details style="margin-bottom:var(--space-xl);">
            <summary style="cursor:pointer;font-size:0.85rem;color:var(--color-ink-secondary);font-weight:600;">See all answers</summary>
            <div style="margin-top:var(--space-md);">
              ${state.answers.map((a, i) => `
                <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);background:${a.hit ? 'var(--color-teal-bg)' : 'var(--color-accent-bg)'};border-radius:var(--radius-md);margin-bottom:var(--space-sm);border-left:3px solid ${a.hit ? 'var(--color-teal)' : 'var(--color-accent)'};">
                  <span style="font-size:0.9rem;min-width:16px;">${a.hit ? '✓' : '✗'}</span>
                  <div style="flex:1;">
                    <p style="font-size:0.82rem;color:var(--color-ink);margin:0 0 2px;font-weight:500;">${a.question}</p>
                    <p style="font-size:0.78rem;color:var(--color-ink-muted);margin:0;">Your range: ${a.low.toLocaleString()} – ${a.high.toLocaleString()} | Actual: <strong>${a.actual.toLocaleString()}</strong></p>
                  </div>
                </div>
              `).join('')}
            </div>
          </details>

          <button onclick="calReset()" class="btn btn-primary" style="width:100%;">Try again with new questions</button>
        </div>
      `;
    }
  }

  window.calStart = function() {
    state.selectedQuestions = shuffle(questions).slice(0, state.totalQuestions);
    state.questionIdx = 0;
    state.answers = [];
    state.phase = 'question';
    render();
  };

  window.calAnswer = function() {
    const low = parseFloat(document.getElementById('cal-low').value);
    const high = parseFloat(document.getElementById('cal-high').value);
    if (isNaN(low) || isNaN(high)) return;
    const q = state.selectedQuestions[state.questionIdx];
    const hit = q.a >= Math.min(low, high) && q.a <= Math.max(low, high);
    state.answers.push({
      question: q.q,
      low: Math.min(low, high),
      high: Math.max(low, high),
      actual: q.a,
      hit: hit
    });
    state.questionIdx++;
    if (state.questionIdx >= state.totalQuestions) {
      state.phase = 'results';
    }
    render();
  };

  window.calReset = function() {
    state = { phase: 'intro', questionIdx: 0, selectedQuestions: [], answers: [], totalQuestions: 10 };
    render();
  };

  render();
})();
