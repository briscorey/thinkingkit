(function() {
  const app = document.getElementById('ai-matcher-app');
  if (!app || typeof MODELS_DATA === 'undefined') return;

  // Build a compact model catalog for the prompt
  const catalog = MODELS_DATA.map(m => 
    `${m.s}: ${m.t} — ${m.o} [${m.d}] (${m.u.join(', ')})`
  ).join('\n');

  let state = { phase: 'input', situation: '', loading: false, results: null, error: null };

  function render() {
    if (state.phase === 'input') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-lg);">
            <span style="font-size:1.4rem;">🧠</span>
            <h3 style="margin:0;font-family:var(--font-display);font-weight:400;font-size:1.4rem;">AI Thinking Advisor</h3>
          </div>
          <p style="color:var(--color-ink-muted);font-size:0.9rem;margin-bottom:var(--space-lg);">Describe your situation, challenge, or decision in plain language. Be as specific as you can — the more context, the better the recommendations.</p>
          <textarea id="ai-input" rows="5" placeholder="e.g. I'm a mid-career professional deciding whether to leave my stable corporate job to start a company. I have about 18 months of savings. My spouse is supportive but nervous. The startup idea is in a market I know well but the timing feels uncertain..." style="width:100%;padding:0.75rem 1rem;background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-ink);font-family:var(--font-body);font-size:0.92rem;resize:vertical;line-height:1.6;"></textarea>
          <button onclick="aiMatcherRun()" class="btn btn-primary" style="width:100%;margin-top:var(--space-lg);">Get AI recommendations</button>
          <p style="font-size:0.72rem;color:var(--color-ink-faint);text-align:center;margin-top:var(--space-md);margin-bottom:0;">Powered by Claude (Anthropic). Your input is analysed but not stored.</p>
        </div>
      `;
    } else if (state.phase === 'loading') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-2xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);text-align:center;">
          <div style="width:32px;height:32px;border:3px solid var(--color-border);border-top-color:var(--color-accent);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto var(--space-lg);"></div>
          <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
          <p style="color:var(--color-ink-secondary);font-size:0.92rem;margin:0;">Analysing your situation against 150 mental models...</p>
        </div>
      `;
    } else if (state.phase === 'error') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <p style="color:var(--color-accent);font-weight:700;margin-bottom:var(--space-md);">Unable to get AI recommendations</p>
          <p style="color:var(--color-ink-muted);font-size:0.88rem;margin-bottom:var(--space-lg);">${state.error}</p>
          <p style="color:var(--color-ink-muted);font-size:0.85rem;margin-bottom:var(--space-lg);">Try the <a href="/tools/toolkit-matcher/">standard Toolkit Matcher</a> instead — it works entirely offline.</p>
          <button onclick="aiMatcherReset()" class="btn btn-secondary">Try again</button>
        </div>
      `;
    } else if (state.phase === 'results') {
      app.innerHTML = `
        <div style="background:var(--color-bg-card);border:1px solid var(--color-border-light);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;box-shadow:var(--shadow-md);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);flex-wrap:wrap;gap:var(--space-md);">
            <div>
              <h3 style="margin:0 0 var(--space-xs);font-family:var(--font-display);font-weight:400;font-size:1.3rem;">🧠 AI Recommendations</h3>
              <p style="color:var(--color-ink-muted);font-size:0.82rem;margin:0;">Based on your specific situation</p>
            </div>
            <button onclick="aiMatcherReset()" class="btn btn-secondary" style="padding:0.4rem 1rem;font-size:0.8rem;">New analysis</button>
          </div>

          <div style="background:var(--color-bg);padding:var(--space-md);border-radius:var(--radius-md);margin-bottom:var(--space-xl);border-left:3px solid var(--color-border);">
            <p style="font-size:0.82rem;color:var(--color-ink-muted);margin:0;"><strong>Your situation:</strong> ${state.situation.substring(0, 200)}${state.situation.length > 200 ? '...' : ''}</p>
          </div>

          <div id="ai-results-content" style="font-size:0.92rem;color:var(--color-ink-secondary);line-height:1.75;">
            ${state.results}
          </div>
        </div>
      `;

      // Post-process: turn model slugs into links
      const content = document.getElementById('ai-results-content');
      if (content) {
        MODELS_DATA.forEach(m => {
          const regex = new RegExp('\\b' + m.t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
          content.innerHTML = content.innerHTML.replace(regex, '<a href="/models/' + m.s + '/" style="color:var(--color-accent);font-weight:600;">' + m.t + '</a>');
        });
      }
    }
  }

  window.aiMatcherRun = async function() {
    const input = document.getElementById('ai-input');
    if (!input || !input.value.trim()) return;
    state.situation = input.value.trim();
    state.phase = 'loading';
    render();

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a mental models advisor for ThinkingKit.org. A user has described their situation below. Recommend 3-5 mental models from the catalog that are most relevant, with a brief personalised explanation of how each applies to their specific situation.

CATALOG OF AVAILABLE MODELS:
${catalog}

USER'S SITUATION:
${state.situation}

Respond in this format for each recommendation:
**Model Name** — 2-3 sentences explaining specifically how this model applies to their situation. Be concrete and reference details from their description.

Start with the most relevant model. No preamble — go straight to recommendations.`
          }]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed (status ' + response.status + ')');
      }

      const data = await response.json();
      const text = data.content.map(c => c.text || '').join('');
      
      // Convert markdown bold to HTML
      state.results = text
        .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--color-ink);">$1</strong>')
        .replace(/\n\n/g, '</p><p style="margin-bottom:var(--space-lg);">')
        .replace(/\n/g, '<br>');
      state.results = '<p style="margin-bottom:var(--space-lg);">' + state.results + '</p>';
      
      state.phase = 'results';
    } catch (err) {
      state.error = err.message || 'Unknown error. The AI service may be temporarily unavailable.';
      state.phase = 'error';
    }
    render();
  };

  window.aiMatcherReset = function() {
    state = { phase: 'input', situation: '', loading: false, results: null, error: null };
    render();
  };

  render();
})();
