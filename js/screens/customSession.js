const CustomSessionScreen = (() => {
  const CUSTOM_DAY = 'Custom';
  const SESSION_KEY = 'gymtracker_custom_session';
  const ORDER_KEY   = 'gymtracker_custom_order';

  let pickerEl = null;

  function loadTodaySession() {
    try {
      const data = JSON.parse(localStorage.getItem(SESSION_KEY));
      const today = new Date().toISOString().slice(0, 10);
      if (data && data.date === today) return data.exercises || [];
    } catch {}
    return [];
  }

  function saveTodaySession(exercises) {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ date: today, exercises }));
  }

  function getOrder() {
    try { return JSON.parse(localStorage.getItem(ORDER_KEY)) || {}; } catch { return {}; }
  }

  function markUsed(exerciseId) {
    const order = getOrder();
    order[exerciseId] = new Date().toISOString();
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  }

  function getAllExercises() {
    const seen = new Set();
    const result = [];
    Object.values(PLAN).forEach(dayPlan => {
      dayPlan.exercises.forEach(ex => {
        if (!seen.has(ex.id)) { seen.add(ex.id); result.push(ex); }
      });
    });
    const order = getOrder();
    return result.sort((a, b) => (order[b.id] || '').localeCompare(order[a.id] || ''));
  }

  // ── Picker overlay ────────────────────────────────────────────────────────

  function openPicker() {
    if (!pickerEl) {
      pickerEl = document.createElement('div');
      pickerEl.id = 'custom-picker';
      pickerEl.className = 'picker-overlay hidden';
      document.body.appendChild(pickerEl);
    }

    const all = getAllExercises();

    pickerEl.innerHTML = `
      <div class="picker-header">
        <input class="picker-search" type="text" placeholder="Szukaj…"
          autocomplete="off" autocorrect="off" spellcheck="false">
        <button class="picker-cancel">Anuluj</button>
      </div>
      <ul class="picker-list"></ul>
    `;

    pickerEl.classList.remove('hidden');

    const searchInput = pickerEl.querySelector('.picker-search');
    const listEl      = pickerEl.querySelector('.picker-list');
    const current     = loadTodaySession().map(e => e.id);

    function renderList(query) {
      const q = query.toLowerCase().trim();
      const filtered = q ? all.filter(ex => ex.name.toLowerCase().includes(q)) : all;
      listEl.innerHTML = filtered.length
        ? filtered.map(ex => `
            <li class="picker-item${current.includes(ex.id) ? ' picker-item--added' : ''}"
                data-exid="${ex.id}">${ex.name}
              ${current.includes(ex.id) ? '<span class="picker-check">✓</span>' : ''}
            </li>`).join('')
        : '<li class="picker-empty">Brak wyników</li>';

      listEl.querySelectorAll('.picker-item:not(.picker-item--added)').forEach(item => {
        item.addEventListener('click', () => {
          const ex = all.find(e => e.id === item.dataset.exid);
          if (!ex) return;
          closePicker();
          addExercise(ex);
        });
      });
    }

    renderList('');
    searchInput.addEventListener('input', () => renderList(searchInput.value));
    pickerEl.querySelector('.picker-cancel').addEventListener('click', closePicker);
    setTimeout(() => searchInput.focus(), 50);
  }

  function closePicker() {
    if (pickerEl) pickerEl.classList.add('hidden');
  }

  // ── Session screen ────────────────────────────────────────────────────────

  function addExercise(ex) {
    const exercises = loadTodaySession();
    if (!exercises.find(e => e.id === ex.id)) {
      exercises.push(ex);
      saveTodaySession(exercises);
      markUsed(ex.id);
    }
    render();
  }

  function render() {
    const exercises = loadTodaySession();
    const today     = new Date().toISOString().slice(0, 10);
    const container = document.getElementById('custom-session-screen');

    container.innerHTML = `
      <header class="screen-header">
        <button class="back-btn" id="cs-back">←</button>
        <h2>Custom</h2>
      </header>
      <div class="cs-body">
        ${exercises.length === 0
          ? '<p class="cs-empty">Naciśnij "+ Dodaj ćwiczenie" żeby zacząć</p>'
          : `<ul class="cs-list">
              ${exercises.map((ex, i) => {
                const history  = Storage.getHistory(ex.id, 50);
                const sess     = history.find(s => s.date === today && s.day === CUSTOM_DAY);
                const setCount = sess ? sess.sets.filter(Boolean).length : 0;
                return `
                  <li class="cs-item" data-idx="${i}">
                    <span class="cs-item-name">${ex.name}</span>
                    <span class="cs-item-meta">
                      ${setCount > 0 ? `<span class="cs-item-sets">${setCount} sets</span>` : ''}
                      <span class="cs-item-chevron">›</span>
                    </span>
                  </li>`;
              }).join('')}
            </ul>`
        }
      </div>
      <div class="cs-footer">
        <button class="cs-add-btn" id="cs-add">+ Dodaj ćwiczenie</button>
      </div>
    `;

    document.getElementById('cs-back').addEventListener('click', () =>
      App.navigateTo('day-select'));

    document.getElementById('cs-add').addEventListener('click', openPicker);

    container.querySelectorAll('.cs-item').forEach(item => {
      item.addEventListener('click', () => {
        const ex = exercises[parseInt(item.dataset.idx)];
        App.navigateTo('exercise-log', {
          day: CUSTOM_DAY,
          group: { type: 'single', exercises: [ex] },
          returnTo: 'custom-session',
        });
      });
    });
  }

  return { render };
})();
