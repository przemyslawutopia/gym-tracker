const Storage = (() => {
  const KEY = 'gymtracker_v1';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  // Save a completed set for an exercise on a given date/day
  // entry: { weight, reps, rir }
  function saveSet(date, day, exerciseId, exerciseName, setIndex, entry) {
    const data = load();
    if (!data[exerciseId]) data[exerciseId] = [];

    let session = data[exerciseId].find(s => s.date === date && s.day === day);
    if (!session) {
      session = { date, day, exerciseName, sets: [] };
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

  // Returns last N sessions for an exercise (sorted newest first)
  function getHistory(exerciseId, n = 5) {
    const data = load();
    const sessions = data[exerciseId] || [];
    return [...sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
  }

  // Returns the most recent session for an exercise (for pre-fill)
  function getLastSession(exerciseId) {
    const history = getHistory(exerciseId, 1);
    return history[0] || null;
  }

  // Returns the last date each day was performed
  function getLastDayDates() {
    const data = load();
    const result = { A: null, B: null, C: null, D: null };
    Object.values(data).forEach(sessions => {
      sessions.forEach(s => {
        if (!result[s.day] || s.date > result[s.day]) {
          result[s.day] = s.date;
        }
      });
    });
    return result;
  }

  // Returns all data in flat tidy format for export
  function getAllFlat() {
    const data = load();
    const rows = [];
    Object.entries(data).forEach(([exerciseId, sessions]) => {
      sessions.forEach(session => {
        session.sets.forEach((set, i) => {
          if (!set) return;
          rows.push({
            date: session.date,
            day: session.day,
            exercise: session.exerciseName || exerciseId,
            set_num: i + 1,
            kg: set.weight,
            reps: set.reps,
            rir: set.rir,
            notes: session.note || ''
          });
        });
      });
    });
    return rows.sort((a, b) => a.date.localeCompare(b.date) || a.exercise.localeCompare(b.exercise) || a.set_num - b.set_num);
  }

  return { saveSet, deleteSet, saveNote, getHistory, getLastSession, getLastDayDates, getAllFlat };
})();
