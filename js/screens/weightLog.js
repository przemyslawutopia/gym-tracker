const WeightLogScreen = (() => {
  const today = new Date().toISOString().slice(0, 10);

  function fmtDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  }

  function fmtDateShort(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' });
  }

  function fmtWeekRange(days) {
    const first = days[0].date;
    const last  = days[days.length - 1].date;
    return `${fmtDateShort(first)} – ${fmtDateShort(last)}`;
  }

  function build7DayStrip(days7) {
    return `
      <div class="w7-strip">
        ${days7.map(({ date, entry }) => {
          const isToday = date === today;
          const missing = !entry;
          return `
            <div class="w7-cell ${missing ? 'w7-cell--missing' : ''} ${isToday ? 'w7-cell--today' : ''}">
              <span class="w7-date">${fmtDate(date)}</span>
              <span class="w7-val">${entry ? entry.kg : '—'}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function buildWeeklyHistory(weeks) {
    if (weeks.every(w => w.avg === null)) return '';
    return `
      <div class="wh-section">
        <div class="wh-title">Historia tygodniowa</div>
        ${weeks.map((w, i) => {
          const isLast = i === weeks.length - 1;
          const prev = weeks[i - 1];
          let trend = '';
          if (w.avg !== null && prev && prev.avg !== null) {
            const diff = w.avg - prev.avg;
            trend = diff === 0 ? '' : diff > 0
              ? `<span class="wh-trend wh-trend--up">+${diff.toFixed(1)}</span>`
              : `<span class="wh-trend wh-trend--down">${diff.toFixed(1)}</span>`;
          }
          return `
            <div class="wh-row ${isLast ? 'wh-row--current' : ''}">
              <span class="wh-range">${fmtWeekRange(w.days)}</span>
              <span class="wh-avg">
                ${w.avg !== null ? `${w.avg.toFixed(1)} kg` : '—'}
                ${trend}
              </span>
              <span class="wh-days">${w.filled}/7</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function buildTodayForm(existing) {
    return `
      <div class="w-today-form">
        <div class="w-today-label">${existing ? 'Dziś (edytuj)' : 'Dziś'}</div>
        <div class="w-entry-row">
          <input type="text" id="wl-kg" class="inp wl-inp" inputmode="decimal"
            value="${existing ? existing.kg : ''}" placeholder="0.0" autocomplete="off">
          <span class="w-unit">kg</span>
          <button class="log-btn" id="wl-save">✓</button>
        </div>
        <textarea id="wl-note" class="notes-input wl-note" rows="2"
          placeholder="Uwagi (opcjonalnie)…">${existing ? existing.note : ''}</textarea>
      </div>
    `;
  }

  function render() {
    const container = document.getElementById('weight-screen');
    const existing  = Storage.getWeight(today);
    const days7     = Storage.getWeightRange(7);
    const weeks     = Storage.getWeightWeeklyAvgs(5);

    container.innerHTML = `
      <header class="screen-header">
        <button class="back-btn" id="wl-back">←</button>
        <h2>Waga</h2>
      </header>
      <div class="wl-body">
        ${buildTodayForm(existing)}
        ${build7DayStrip(days7)}
        ${buildWeeklyHistory(weeks)}
      </div>
    `;

    document.getElementById('wl-back').addEventListener('click', () =>
      App.navigateTo('home'));

    document.getElementById('wl-save').addEventListener('click', () => {
      const raw = document.getElementById('wl-kg').value.replace(',', '.');
      const kg  = parseFloat(raw);
      if (isNaN(kg) || kg < 20 || kg > 300) { alert('Wpisz poprawną wagę.'); return; }
      const note = document.getElementById('wl-note').value.trim();
      Storage.saveWeight(today, kg, note);
      render();
    });
  }

  return { render };
})();
