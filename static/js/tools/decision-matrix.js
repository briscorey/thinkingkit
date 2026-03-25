
(function() {
  const app = document.getElementById('decision-matrix-app');

  let state = {
    options: ['Option A', 'Option B'],
    criteria: [{ name: 'Cost', weight: 3 }, { name: 'Quality', weight: 4 }],
    scores: {}
  };

  function getKey(oi, ci) { return oi + '-' + ci; }

  function getScore(oi, ci) {
    return state.scores[getKey(oi, ci)] || 0;
  }

  function calcTotal(oi) {
    return state.criteria.reduce((sum, c, ci) => {
      return sum + (getScore(oi, ci) * c.weight);
    }, 0);
  }

  function maxWeight() {
    return state.criteria.reduce((sum, c) => sum + c.weight * 5, 0);
  }

  function render() {
    const totals = state.options.map((_, oi) => calcTotal(oi));
    const maxTotal = Math.max(...totals, 1);
    const winner = totals.indexOf(Math.max(...totals));

    app.innerHTML = `
      <div style="background:var(--color-bg-card);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-xl);margin:var(--space-xl) 0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);flex-wrap:wrap;gap:var(--space-md);">
          <h3 style="margin:0;font-family:var(--font-display);color:var(--color-text);">Your Decision Matrix</h3>
          <div style="display:flex;gap:var(--space-sm);">
            <button onclick="dmAddOption()" class="btn btn-secondary" style="padding:0.4rem 1rem;font-size:0.8rem;">+ Option</button>
            <button onclick="dmAddCriteria()" class="btn btn-secondary" style="padding:0.4rem 1rem;font-size:0.8rem;">+ Criteria</button>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.88rem;">
            <thead>
              <tr>
                <th style="text-align:left;padding:0.6rem;color:var(--color-text-muted);font-weight:500;border-bottom:1px solid var(--color-border);min-width:140px;">Criteria</th>
                <th style="text-align:center;padding:0.6rem;color:var(--color-text-muted);font-weight:500;border-bottom:1px solid var(--color-border);width:70px;">Weight</th>
                ${state.options.map((o, oi) => `
                  <th style="text-align:center;padding:0.6rem;border-bottom:1px solid var(--color-border);min-width:110px;">
                    <input value="${o}" onchange="dmRenameOption(${oi},this.value)" style="background:transparent;border:1px solid var(--color-border);border-radius:var(--radius-sm);padding:0.3rem 0.5rem;color:${oi===winner?'var(--color-amber)':'var(--color-text)'};text-align:center;width:100%;font-family:var(--font-body);font-weight:600;font-size:0.85rem;">
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${state.criteria.map((c, ci) => `
                <tr>
                  <td style="padding:0.6rem;border-bottom:1px solid var(--color-border-subtle);">
                    <input value="${c.name}" onchange="dmRenameCriteria(${ci},this.value)" style="background:transparent;border:none;color:var(--color-text-secondary);font-family:var(--font-body);font-size:0.88rem;width:100%;">
                  </td>
                  <td style="text-align:center;padding:0.6rem;border-bottom:1px solid var(--color-border-subtle);">
                    <select onchange="dmSetWeight(${ci},this.value)" style="background:var(--color-bg-elevated);border:1px solid var(--color-border);border-radius:var(--radius-sm);padding:0.25rem;color:var(--color-amber);text-align:center;font-family:var(--font-mono);font-size:0.8rem;">
                      ${[1,2,3,4,5].map(w => `<option value="${w}" ${c.weight===w?'selected':''}>${w}</option>`).join('')}
                    </select>
                  </td>
                  ${state.options.map((_, oi) => `
                    <td style="text-align:center;padding:0.6rem;border-bottom:1px solid var(--color-border-subtle);">
                      <div style="display:flex;align-items:center;justify-content:center;gap:4px;">
                        ${[1,2,3,4,5].map(s => `
                          <button onclick="dmSetScore(${oi},${ci},${s})" style="width:28px;height:28px;border-radius:50%;border:1px solid ${getScore(oi,ci)>=s?'var(--color-amber)':'var(--color-border)'};background:${getScore(oi,ci)>=s?'var(--color-amber-glow-strong)':'transparent'};color:${getScore(oi,ci)>=s?'var(--color-amber)':'var(--color-text-muted)'};cursor:pointer;font-size:0.7rem;font-family:var(--font-mono);">${s}</button>
                        `).join('')}
                      </div>
                    </td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding:0.8rem 0.6rem;font-weight:600;color:var(--color-text);">Total</td>
                <td style="text-align:center;padding:0.8rem 0.6rem;color:var(--color-text-muted);font-size:0.75rem;">/ ${maxWeight()}</td>
                ${state.options.map((_, oi) => `
                  <td style="text-align:center;padding:0.8rem 0.6rem;">
                    <span style="font-family:var(--font-mono);font-size:1.1rem;font-weight:700;color:${oi===winner?'var(--color-amber)':'var(--color-text)'};">${totals[oi]}</span>
                    ${oi===winner && totals[oi]>0 ? '<span style="display:block;font-size:0.7rem;color:var(--color-amber);margin-top:2px;">★ Best</span>' : ''}
                  </td>
                `).join('')}
              </tr>
            </tfoot>
          </table>
        </div>

        ${totals.some(t => t > 0) ? `
        <div style="margin-top:var(--space-xl);">
          <p style="font-size:0.8rem;color:var(--color-text-muted);margin-bottom:var(--space-sm);">Score comparison</p>
          ${state.options.map((o, oi) => `
            <div style="display:flex;align-items:center;gap:var(--space-md);margin-bottom:var(--space-sm);">
              <span style="min-width:80px;font-size:0.85rem;color:${oi===winner?'var(--color-amber)':'var(--color-text-secondary)'};">${o}</span>
              <div style="flex:1;height:24px;background:var(--color-bg-elevated);border-radius:var(--radius-sm);overflow:hidden;">
                <div style="height:100%;width:${(totals[oi]/maxWeight())*100}%;background:${oi===winner?'var(--color-amber)':'var(--color-border)'};border-radius:var(--radius-sm);transition:width 0.3s ease;"></div>
              </div>
              <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--color-text-muted);min-width:40px;text-align:right;">${Math.round((totals[oi]/maxWeight())*100)}%</span>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <p style="font-size:0.78rem;color:var(--color-text-muted);margin-top:var(--space-lg);margin-bottom:0;">Click the numbers (1–5) to score each option against each criterion. Weight determines how important each criterion is. All data stays in your browser.</p>
      </div>
    `;
  }

  window.dmAddOption = function() {
    state.options.push('Option ' + String.fromCharCode(65 + state.options.length));
    render();
  };
  window.dmAddCriteria = function() {
    state.criteria.push({ name: 'New criteria', weight: 3 });
    render();
  };
  window.dmRenameOption = function(oi, val) { state.options[oi] = val; render(); };
  window.dmRenameCriteria = function(ci, val) { state.criteria[ci].name = val; };
  window.dmSetWeight = function(ci, val) { state.criteria[ci].weight = parseInt(val); render(); };
  window.dmSetScore = function(oi, ci, s) {
    const key = getKey(oi, ci);
    state.scores[key] = (state.scores[key] === s) ? 0 : s;
    render();
  };

  render();
})();
