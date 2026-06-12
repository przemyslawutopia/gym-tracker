const DaySelectScreen = (() => {
  function fmt(dateStr) {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  function openSheet(sheet) {
    sheet.classList.remove('hidden');
    requestAnimationFrame(() => sheet.classList.add('vs-open'));
  }

  function closeSheet(sheet) {
    sheet.classList.remove('vs-open');
    sheet.addEventListener('transitionend', () => sheet.classList.add('hidden'), { once: true });
  }

  function render() {
    const lastDates = Storage.getLastDayDates();
    const container = document.getElementById('day-select-screen');
    container.innerHTML = `
      <header class="screen-header">
        <h1 class="app-title">Gym Tracker</h1>
        <button class="menu-btn" id="menu-btn">···</button>
      </header>
      <div class="day-grid">
        ${['A','B','C','D'].map(day => `
          <button class="day-btn" data-day="${day}">
            <span class="day-label">Day ${day}</span>
            <span class="day-last">Last: ${fmt(lastDates[day])}</span>
          </button>
        `).join('')}
      </div>

      <div class="vs hidden" id="settings-sheet">
        <div class="vs-backdrop" id="settings-backdrop"></div>
        <div class="vs-panel">
          <div class="vs-handle"></div>
          <div class="vs-title">Options</div>
          <ul class="vs-list">
            <li class="vs-option" id="sm-export">Export .xlsx</li>
            <li class="vs-option" id="sm-backup">Backup JSON</li>
            <li class="vs-option" id="sm-restore">Restore JSON</li>
            <li class="vs-option" id="sm-debug" style="color:#aaa;font-size:0.85rem">Debug Info</li>
          </ul>
          <div class="vs-actions">
            <button class="vs-btn vs-cancel" id="sm-cancel">Cancel</button>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        App.navigateTo('exercise-list', { day: btn.dataset.day });
      });
    });

    const sheet = document.getElementById('settings-sheet');
    document.getElementById('menu-btn').addEventListener('click', () => openSheet(sheet));
    document.getElementById('settings-backdrop').addEventListener('click', () => closeSheet(sheet));
    document.getElementById('sm-cancel').addEventListener('click', () => closeSheet(sheet));

    document.getElementById('sm-export').addEventListener('click', () => { closeSheet(sheet); exportToXlsx(); });
    document.getElementById('sm-backup').addEventListener('click', () => { closeSheet(sheet); backupJSON(); });
    document.getElementById('sm-restore').addEventListener('click', () => { closeSheet(sheet); restoreJSON(); });
    document.getElementById('sm-debug').addEventListener('click', () => { closeSheet(sheet); debugStorage(); });
  }

  return { render };
})();
