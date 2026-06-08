const DaySelectScreen = (() => {
  function fmt(dateStr) {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  function render() {
    const lastDates = Storage.getLastDayDates();
    const container = document.getElementById('day-select-screen');
    container.innerHTML = `
      <header class="screen-header">
        <h1 class="app-title">Gym Tracker</h1>
      </header>
      <div class="day-grid">
        ${['A','B','C','D'].map(day => `
          <button class="day-btn" data-day="${day}">
            <span class="day-label">Day ${day}</span>
            <span class="day-last">Last: ${fmt(lastDates[day])}</span>
          </button>
        `).join('')}
      </div>
      <footer class="screen-footer">
        <button class="export-btn" id="export-btn">Export .xlsx</button>
      </footer>
    `;

    container.querySelectorAll('.day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        App.navigateTo('exercise-list', { day: btn.dataset.day });
      });
    });

    document.getElementById('export-btn').addEventListener('click', exportToXlsx);
  }

  return { render };
})();
