const DaySelectScreen = (() => {
  function fmt(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  }

  function render() {
    const lastDates = Storage.getLastDayDates();
    const container = document.getElementById('day-select-screen');
    container.innerHTML = `
      <header class="screen-header">
        <button class="back-btn" id="ds-back">←</button>
        <h2>Siłka</h2>
      </header>
      <div class="day-grid">
        ${['A','B','C','D'].map(day => `
          <button class="day-btn" data-day="${day}">
            <span class="day-label">Day ${day}</span>
            <span class="day-last">Ostatnio: ${fmt(lastDates[day])}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.day-btn').forEach(btn => {
      btn.addEventListener('click', () =>
        App.navigateTo('exercise-list', { day: btn.dataset.day }));
    });

    document.getElementById('ds-back').addEventListener('click', () =>
      App.navigateTo('home'));
  }

  return { render };
})();
