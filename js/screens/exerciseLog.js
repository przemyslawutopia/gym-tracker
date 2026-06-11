const ExerciseLogScreen = (() => {
  let currentState = null;
  const today = new Date().toISOString().slice(0, 10);

  // Build input block for one exercise
  function buildInputBlock(ex, last) {
    const lastSet = last && last.sets && last.sets[0];
    const defWeight = lastSet ? lastSet.weight : '';
    const defReps = lastSet ? lastSet.reps : '';
    const defRir = lastSet != null && lastSet.rir != null ? lastSet.rir : '';
    const activeId = Storage.getActiveVariant(ex, currentState.day);
    const vEntry = activeId && ex.variantKey
      ? (VARIANTS[ex.variantKey] || []).find(v => v.id === activeId)
      : null;
    return `
      <div class="input-block" data-exid="${ex.id}" data-exname="${ex.name}">
        <h3 class="input-block-title">${ex.name}</h3>
        ${vEntry ? `<p class="input-block-variant">${vEntry.name}</p>` : ''}
        <div class="input-row">
          <label>kg<input type="text" class="inp inp-weight" inputmode="decimal" enterkeyhint="next" value="${defWeight}" placeholder="0"></label>
          <label>reps<input type="text" class="inp inp-reps" inputmode="decimal" enterkeyhint="next" value="${defReps}" placeholder="0"></label>
          <label>RIR<input type="text" class="inp inp-rir" inputmode="numeric" enterkeyhint="done" value="${defRir}" placeholder="0"></label>
          <button class="log-btn" data-exid="${ex.id}">+</button>
        </div>
      </div>
    `;
  }

  function buildTrendPanel(exId, exName) {
    const history = Storage.getHistory(exId, 5);
    if (history.length === 0) return `<div class="trend-panel"><span class="trend-empty">No history yet</span></div>`;
    return `
      <div class="trend-panel">
        <div class="trend-title">Last ${history.length} sessions</div>
        ${history.map(s => `
          <div class="trend-row">
            <span class="trend-date">${fmtDate(s.date)}</span>
            <span class="trend-sets">${s.sets.filter(Boolean).map(st => `${st.weight}×${st.reps}`).join(', ')}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  function fmtDate(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  function renderSetList(exId) {
    const history = Storage.getHistory(exId, 50);
    const todaySess = history.find(s => s.date === today);
    const sets = todaySess ? todaySess.sets.filter(Boolean) : [];
    const el = document.querySelector(`.set-list[data-exid="${exId}"]`);
    if (!el) return;
    if (sets.length === 0) {
      el.innerHTML = '<div class="no-sets">No sets logged yet</div>';
      return;
    }
    el.innerHTML = sets.map((s, i) => `
      <div class="set-row" data-index="${i}">
        <span>Set ${i + 1} — ${s.weight}kg × ${s.reps} @ RIR ${s.rir}</span>
        <button class="del-set-btn" data-index="${i}" data-exid="${exId}">×</button>
      </div>
    `).join('');

    el.querySelectorAll('.del-set-btn').forEach(btn => {
      let pressTimer;
      const doDelete = () => {
        if (!confirm(`Delete Set ${parseInt(btn.dataset.index) + 1}?`)) return;
        Storage.deleteSet(today, currentState.day, btn.dataset.exid, parseInt(btn.dataset.index));
        renderSetList(btn.dataset.exid);
      };
      btn.addEventListener('click', doDelete);
    });
  }

  function attachFieldChaining(exId) {
    const block = document.querySelector(`.input-block[data-exid="${exId}"]`);
    if (!block) return;
    const weight = block.querySelector('.inp-weight');
    const reps   = block.querySelector('.inp-reps');
    const rir    = block.querySelector('.inp-rir');

    weight.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); reps.focus(); reps.select(); } });
    reps.addEventListener('keydown',   e => { if (e.key === 'Enter') { e.preventDefault(); rir.focus();  rir.select();  } });
    rir.addEventListener('keydown',    e => { if (e.key === 'Enter') { e.preventDefault(); rir.blur(); } });
  }

  function attachLogButton(ex) {
    const btn = document.querySelector(`.log-btn[data-exid="${ex.id}"]`);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const block = document.querySelector(`.input-block[data-exid="${ex.id}"]`);
      const weight = parseFloat(block.querySelector('.inp-weight').value.replace(',', '.'));
      const reps = parseFloat(block.querySelector('.inp-reps').value.replace(',', '.'));
      const rir = parseInt(block.querySelector('.inp-rir').value);
      if (isNaN(weight) || isNaN(reps)) { alert('Enter weight and reps.'); return; }

      const history = Storage.getHistory(ex.id, 50);
      const todaySess = history.find(s => s.date === today);
      const nextIndex = todaySess ? todaySess.sets.filter(Boolean).length : 0;

      const variantInfo = ex.variantKey ? {
        variantUsed:    Storage.getActiveVariant(ex, currentState.day),
        plannedVariant: Storage.getPlanVariantOverride(currentState.day, ex.id) || ex.defaultVariant,
      } : null;

      Storage.saveSet(today, currentState.day, ex.id, ex.name, nextIndex, {
        weight, reps, rir: isNaN(rir) ? null : rir,
      }, variantInfo);

      // Pre-fill next set from what was just logged
      block.querySelector('.inp-weight').value = weight;
      block.querySelector('.inp-reps').value = reps;
      block.querySelector('.inp-rir').value = isNaN(rir) ? '' : rir;

      renderSetList(ex.id);

    });
  }

  function render(state) {
    currentState = state;
    const { day, group } = state;
    const exercises = group.exercises;

    const container = document.getElementById('exercise-log-screen');
    const isSS = group.type === 'superset';

    const lastSessions = exercises.map(ex => Storage.getLastSession(ex.id));

    container.innerHTML = `
      <header class="screen-header">
        <button class="back-btn" id="back-to-list">←</button>
        <h2>${isSS ? exercises.map(e => e.name).join(' + ') : exercises[0].name}</h2>
      </header>

      <div class="log-body">
        ${exercises.map((ex, i) => buildTrendPanel(ex.id, ex.name)).join('')}

        ${isSS ? '<div class="ss-label">Superset</div>' : ''}

        ${exercises.map((ex, i) => buildInputBlock(ex, lastSessions[i])).join('')}

        ${exercises.map(ex => `
          <div class="set-list" data-exid="${ex.id}">
            <div class="no-sets">No sets logged yet</div>
          </div>
        `).join('')}

        <div class="notes-section">
          ${exercises.map(ex => `
            <label class="notes-label">${ex.name} notes
              <textarea class="notes-input" data-exid="${ex.id}" rows="2" placeholder="Optional notes…">${getNoteForToday(ex.id, day)}</textarea>
            </label>
          `).join('')}
        </div>

      </div>
    `;

    // Render existing sets
    exercises.forEach(ex => renderSetList(ex.id));

    // Wire log buttons, field chaining, and keyboard toolbar
    exercises.forEach(ex => {
      attachLogButton(ex);
      attachFieldChaining(ex.id);
    });

    // Attach keyboard toolbar to all numeric inputs across all blocks
    const allInputs = Array.from(container.querySelectorAll('.inp-weight, .inp-reps, .inp-rir'));
    KbToolbar.attach(allInputs);

    // Notes autosave
    container.querySelectorAll('.notes-input').forEach(ta => {
      ta.addEventListener('blur', () => {
        Storage.saveNote(today, day, ta.dataset.exid, ta.value);
      });
    });


    document.getElementById('back-to-list').addEventListener('click', () => {
      App.navigateTo('exercise-list', { day });
    });
  }

  function getNoteForToday(exId, day) {
    const history = Storage.getHistory(exId, 50);
    const s = history.find(s => s.date === today && s.day === day);
    return (s && s.note) ? s.note : '';
  }

  return { render };
})();
