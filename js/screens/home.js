const HomeScreen = (() => {
  const today = new Date().toISOString().slice(0, 10);

  function needsWeightPopup() {
    return !Storage.getWeight(today) && !Storage.wasWeightSkippedToday();
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
    const container = document.getElementById('home-screen');
    container.innerHTML = `
      <header class="screen-header">
        <h1 class="app-title">Tracker</h1>
        <button class="menu-btn" id="menu-btn">···</button>
      </header>

      <div class="home-grid">
        <button class="home-tile" id="tile-gym">
          <span class="home-tile-label">Siłka</span>
          <span class="home-tile-sub" id="tile-gym-sub"></span>
        </button>
        <button class="home-tile" id="tile-weight">
          <span class="home-tile-label">Waga</span>
          <span class="home-tile-sub" id="tile-weight-sub"></span>
        </button>
      </div>

      <!-- Settings sheet -->
      <div class="vs hidden" id="settings-sheet">
        <div class="vs-backdrop" id="settings-backdrop"></div>
        <div class="vs-panel">
          <div class="vs-handle"></div>
          <div class="vs-title">Options</div>
          <ul class="vs-list">
            <li class="vs-option" id="sm-export">Export .xlsx</li>
            <li class="vs-option" id="sm-backup">Backup JSON</li>
            <li class="vs-option" id="sm-restore">Restore JSON</li>
          </ul>
          <div class="vs-actions">
            <button class="vs-btn vs-cancel" id="sm-cancel">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Weight popup -->
      <div class="vs hidden" id="weight-popup">
        <div class="vs-backdrop" id="wp-backdrop"></div>
        <div class="vs-panel">
          <div class="vs-handle"></div>
          <div class="vs-title">Waga poranna</div>
          <div class="wp-input-row">
            <input type="text" id="wp-kg" class="inp wp-inp" inputmode="decimal"
              placeholder="0.0" autocomplete="off">
            <span class="wp-unit">kg</span>
          </div>
          <textarea id="wp-note" class="notes-input wp-note" rows="2"
            placeholder="Uwagi (opcjonalnie)…"></textarea>
          <div class="vs-actions wp-actions">
            <button class="vs-btn vs-cancel" id="wp-skip">Pomiń dzisiaj</button>
            <button class="vs-btn vs-plan" id="wp-save">Zapisz</button>
          </div>
        </div>
      </div>
    `;

    // Tile subtitles
    const w = Storage.getWeight(today);
    document.getElementById('tile-weight-sub').textContent = w ? `dziś: ${w.kg} kg` : '';
    const lastDates = Storage.getLastDayDates();
    const lastDay = Object.entries(lastDates)
      .filter(([, d]) => d)
      .sort((a, b) => b[1].localeCompare(a[1]))[0];
    if (lastDay) {
      document.getElementById('tile-gym-sub').textContent =
        `ostatnio: Day ${lastDay[0]}`;
    }

    // Tile navigation
    document.getElementById('tile-gym').addEventListener('click', () =>
      App.navigateTo('day-select'));
    document.getElementById('tile-weight').addEventListener('click', () =>
      App.navigateTo('weight'));

    // Settings menu
    const sheet = document.getElementById('settings-sheet');
    document.getElementById('menu-btn').addEventListener('click', () => openSheet(sheet));
    document.getElementById('settings-backdrop').addEventListener('click', () => closeSheet(sheet));
    document.getElementById('sm-cancel').addEventListener('click', () => closeSheet(sheet));
    document.getElementById('sm-export').addEventListener('click', () => { closeSheet(sheet); exportToXlsx(); });
    document.getElementById('sm-backup').addEventListener('click', () => { closeSheet(sheet); backupJSON(); });
    document.getElementById('sm-restore').addEventListener('click', () => { closeSheet(sheet); restoreJSON(); });

    // Weight popup
    if (needsWeightPopup()) {
      const popup = document.getElementById('weight-popup');
      setTimeout(() => openSheet(popup), 120);

      document.getElementById('wp-skip').addEventListener('click', () => {
        Storage.skipWeightToday();
        closeSheet(popup);
      });

      document.getElementById('wp-save').addEventListener('click', () => {
        const raw = document.getElementById('wp-kg').value.replace(',', '.');
        const kg = parseFloat(raw);
        if (isNaN(kg) || kg < 20 || kg > 300) {
          alert('Wpisz poprawną wagę (np. 84.5)');
          return;
        }
        const note = document.getElementById('wp-note').value.trim();
        Storage.saveWeight(today, kg, note);
        closeSheet(popup);
        document.getElementById('tile-weight-sub').textContent = `dziś: ${kg} kg`;
      });
    }
  }

  return { render };
})();
