const Storage = (() => {
  const KEY = 'gymtracker_v1';
  const PLAN_VAR_KEY = 'gymtracker_plan_variants';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function saveSet(date, day, exerciseId, exerciseName, setIndex, entry, variantInfo) {
    const data = load();
    if (!data[exerciseId]) data[exerciseId] = [];
    let session = data[exerciseId].find(s => s.date === date && s.day === day);
    if (!session) {
      session = { date, day, exerciseName, sets: [] };
      if (variantInfo) {
        session.variantUsed    = variantInfo.variantUsed;
        session.plannedVariant = variantInfo.plannedVariant;
      }
      data[exerciseId].push(session);
    }
    session.sets[setIndex] = entry;
    save(data);
  }

  function deleteSet(date, day, exerciseId, setIndex) {
    const data = load();
    const sessions = data[exerciseId];
    if (!sessions) return;
    const session = sessions.find(s => s.date === date && s.day === day);
    if (!session) return;
    session.sets.splice(setIndex, 1);
    if (session.sets.length === 0) {
      data[exerciseId] = sessions.filter(s => !(s.date === date && s.day === day));
    }
    save(data);
  }

  function saveNote(date, day, exerciseId, note) {
    const data = load();
    if (!data[exerciseId]) data[exerciseId] = [];
    let session = data[exerciseId].find(s => s.date === date && s.day === day);
    if (!session) {
      session = { date, day, sets: [] };
      data[exerciseId].push(session);
    }
    session.note = note;
    save(data);
  }

  // ── Variant tracking ──────────────────────────────────────────────────────

  function savePlanVariantOverride(day, exerciseId, variantId) {
    let overrides = {};
    try { overrides = JSON.parse(localStorage.getItem(PLAN_VAR_KEY)) || {}; } catch {}
    overrides[`${day}-${exerciseId}`] = variantId;
    localStorage.setItem(PLAN_VAR_KEY, JSON.stringify(overrides));
  }

  function getPlanVariantOverride(day, exerciseId) {
    let overrides = {};
    try { overrides = JSON.parse(localStorage.getItem(PLAN_VAR_KEY)) || {}; } catch {}
    return overrides[`${day}-${exerciseId}`] || null;
  }

  function saveSessionVariant(date, day, exerciseId, variantId, plannedVariant) {
    const data = load();
    if (!data[exerciseId]) data[exerciseId] = [];
    let session = data[exerciseId].find(s => s.date === date && s.day === day);
    if (!session) {
      session = { date, day, sets: [] };
      data[exerciseId].push(session);
    }
    session.variantUsed    = variantId;
    session.plannedVariant = plannedVariant;
    save(data);
  }

  function getSessionVariant(date, day, exerciseId) {
    const s = (load()[exerciseId] || []).find(s => s.date === date && s.day === day);
    return s ? (s.variantUsed || null) : null;
  }

  // Returns the variant that should be used for ex on day right now
  function getActiveVariant(ex, day) {
    const today = new Date().toISOString().slice(0, 10);
    return getSessionVariant(today, day, ex.id)
        || getPlanVariantOverride(day, ex.id)
        || ex.defaultVariant;
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  function getHistory(exerciseId, n = 5) {
    const sessions = load()[exerciseId] || [];
    return [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
  }

  function getLastSession(exerciseId) {
    return getHistory(exerciseId, 1)[0] || null;
  }

  function getLastDayDates() {
    const data = load();
    const result = { A: null, B: null, C: null, D: null };
    Object.values(data).forEach(sessions => {
      sessions.forEach(s => {
        if (!result[s.day] || s.date > result[s.day]) result[s.day] = s.date;
      });
    });
    return result;
  }

  function getAllFlat() {
    const data = load();
    const rows = [];
    Object.entries(data).forEach(([exerciseId, sessions]) => {
      sessions.forEach(session => {
        session.sets.forEach((set, i) => {
          if (!set) return;
          rows.push({
            date:            session.date,
            day:             session.day,
            exercise:        session.exerciseName || exerciseId,
            variant:         session.variantUsed    || '',
            planned_variant: session.plannedVariant || '',
            set_num:         i + 1,
            kg:              set.weight,
            reps:            set.reps,
            rir:             set.rir,
            notes:           session.note || '',
          });
        });
      });
    });
    return rows.sort((a, b) =>
      a.date.localeCompare(b.date) ||
      a.exercise.localeCompare(b.exercise) ||
      a.set_num - b.set_num
    );
  }

  return {
    saveSet, deleteSet, saveNote,
    savePlanVariantOverride, getPlanVariantOverride,
    saveSessionVariant, getSessionVariant, getActiveVariant,
    getHistory, getLastSession, getLastDayDates, getAllFlat,
  };
})();
