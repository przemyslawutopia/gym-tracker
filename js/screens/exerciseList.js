// ── Variant bottom sheet ──────────────────────────────────────────────────

const VariantSheet = (() => {
  let el = null;
  let state = { ex: null, day: null, selectedId: null };
  let onSwap = null;

  function init() {
    if (document.getElementById('variant-sheet')) { el = document.getElementById('variant-sheet'); return; }
    el = document.createElement('div');
    el.id = 'variant-sheet';
    el.className = 'vs hidden';
    el.innerHTML = `
      <div class="vs-backdrop"></div>
      <div class="vs-panel">
        <div class="vs-handle"></div>
        <p class="vs-title" id="vs-title"></p>
        <ul class="vs-list" id="vs-list"></ul>
        <div class="vs-actions">
          <button class="vs-btn vs-cancel"  id="vs-cancel">Anuluj</button>
          <button class="vs-btn vs-session" id="vs-session">Tylko dziś</button>
          <button class="vs-btn vs-plan"    id="vs-plan">Zmień plan</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    el.querySelector('.vs-backdrop').addEventListener('click', close);
    el.querySelector('#vs-cancel').addEventListener('click', close);

    el.querySelector('#vs-session').addEventListener('click', () => {
      if (!state.selectedId) { close(); return; }
      const today = new Date().toISOString().slice(0, 10);
      const planned = Storage.getPlanVariantOverride(state.day, state.ex.id) || state.ex.defaultVariant;
      Storage.saveSessionVariant(today, state.day, state.ex.id, state.selectedId, planned);
      if (onSwap) onSwap();
      close();
    });

    el.querySelector('#vs-plan').addEventListener('click', () => {
      if (!state.selectedId) { close(); return; }
      const today = new Date().toISOString().slice(0, 10);
      const plannedBefore = Storage.getPlanVariantOverride(state.day, state.ex.id) || state.ex.defaultVariant;
      Storage.savePlanVariantOverride(state.day, state.ex.id, state.selectedId);
      Storage.saveSessionVariant(today, state.day, state.ex.id, state.selectedId, plannedBefore);
      if (onSwap) onSwap();
      close();
    });
  }

  function open(ex, day, callback) {
    init();
    state = { ex, day, selectedId: Storage.getActiveVariant(ex, day) };
    onSwap = callback;
    el.querySelector('#vs-title').textContent = ex.name;
    renderList();
    el.classList.remove('hidden');
    requestAnimationFrame(() => el.classList.add('vs-open'));
  }

  function renderList() {
    const variants = VARIANTS[state.ex.variantKey] || [];
    const activeId = Storage.getActiveVariant(state.ex, state.day);
    el.querySelector('#vs-list').innerHTML = variants.map(v => `
      <li class="vs-option${v.id === state.selectedId ? ' vs-selected' : ''}" data-vid="${v.id}">
        <span class="vs-check">${v.id === activeId ? '✓' : ''}</span>
        <span>${v.name}</span>
      </li>
    `).join('');
    el.querySelectorAll('.vs-option').forEach(opt => {
      opt.addEventListener('click', () => {
        state.selectedId = opt.dataset.vid;
        renderList();
      });
    });
  }

  function close() {
    el.classList.remove('vs-open');
    setTimeout(() => el.classList.add('hidden'), 260);
  }

  return { open };
})();

// ── Exercise list screen ──────────────────────────────────────────────────

const ExerciseListScreen = (() => {
  function groupExercises(exercises) {
    const groups = [];
    const seen = new Set();
    exercises.forEach(ex => {
      if (seen.has(ex.id)) return;
      seen.add(ex.id);
      if (ex.superset) {
        const partner = exercises.find(e => e.superset === ex.superset && e.id !== ex.id);
        if (partner && !seen.has(partner.id)) {
          seen.add(partner.id);
          groups.push({ type: 'superset', exercises: [ex, partner] });
          return;
        }
      }
      groups.push({ type: 'single', exercises: [ex] });
    });
    return groups;
  }

  function variantLabel(ex, day) {
    const activeId = Storage.getActiveVariant(ex, day);
    if (!activeId) return '';
    const v = (VARIANTS[ex.variantKey] || []).find(v => v.id === activeId);
    if (!v) return '';
    const planId = Storage.getPlanVariantOverride(day, ex.id) || ex.defaultVariant;
    const swapped = activeId !== planId;
    return `<span class="ex-variant${swapped ? ' ex-variant--swapped' : ''}">${swapped ? '↔ ' : ''}${v.name}</span>`;
  }

  function render(state) {
    const { day } = state;
    const plan = PLAN[day];
    const groups = groupExercises(plan.exercises);
    const container = document.getElementById('exercise-list-screen');

    container.innerHTML = `
      <header class="screen-header">
        <button class="back-btn" id="back-to-days">←</button>
        <h2>${plan.label}</h2>
      </header>
      <ul class="exercise-list">
        ${groups.map((group, gi) => {
          if (group.type === 'single') {
            const ex = group.exercises[0];
            return `
              <li class="exercise-item" data-group="${gi}"${ex.variantKey ? ' data-has-variants="1"' : ''}>
                <div class="ex-info">
                  <span class="ex-name">${ex.name}</span>
                  ${variantLabel(ex, day)}
                </div>
                <span class="ex-sets">${ex.sets} sets</span>
              </li>`;
          } else {
            const [ex1, ex2] = group.exercises;
            const vl1 = variantLabel(ex1, day);
            const vl2 = variantLabel(ex2, day);
            return `
              <li class="exercise-item superset-item" data-group="${gi}">
                <div class="ex-info">
                  <span class="ex-name">${ex1.name} <span class="ss-badge">SS</span> ${ex2.name}</span>
                  ${vl1 || vl2 ? `<div class="ex-variants-row">${vl1}${vl2}</div>` : ''}
                </div>
                <span class="ex-sets">${ex1.sets} sets</span>
              </li>`;
          }
        }).join('')}
      </ul>
    `;

    document.getElementById('back-to-days').addEventListener('click', () => {
      App.navigateTo('day-select');
    });

    container.querySelectorAll('.exercise-item').forEach(item => {
      const gi = parseInt(item.dataset.group);

      item.addEventListener('click', () => {
        App.navigateTo('exercise-log', { day, group: groups[gi] });
      });

      if (item.dataset.hasVariants) {
        const ex = groups[gi].exercises[0];
        attachLongPress(item, ex, day, () => refreshVariantLabel(item, ex, day));
      }
    });
  }

  function refreshVariantLabel(item, ex, day) {
    const existing = item.querySelector('.ex-variant');
    const newHtml = variantLabel(ex, day);
    if (existing) {
      existing.outerHTML = newHtml || '';
    } else if (newHtml) {
      item.querySelector('.ex-info').insertAdjacentHTML('beforeend', newHtml);
    }
  }

  function attachLongPress(item, ex, day, onSwap) {
    let timer = null;
    let startX = 0, startY = 0;
    let didLongPress = false;

    item.addEventListener('touchstart', e => {
      didLongPress = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      timer = setTimeout(() => {
        timer = null;
        didLongPress = true;
        VariantSheet.open(ex, day, onSwap);
      }, 500);
    }, { passive: true });

    item.addEventListener('touchmove', e => {
      if (!timer) return;
      if (Math.abs(e.touches[0].clientX - startX) > 10 ||
          Math.abs(e.touches[0].clientY - startY) > 10) {
        clearTimeout(timer); timer = null;
      }
    }, { passive: true });

    ['touchend', 'touchcancel'].forEach(evt =>
      item.addEventListener(evt, () => { if (timer) { clearTimeout(timer); timer = null; } }, { passive: true })
    );

    // Block the tap-to-navigate click that fires after a long press
    item.addEventListener('click', e => {
      if (didLongPress) { e.stopImmediatePropagation(); didLongPress = false; }
    }, true);
  }

  return { render };
})();
