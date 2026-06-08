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

  function render(state) {
    const day = state.day;
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
              <li class="exercise-item" data-group="${gi}">
                <span class="ex-name">${ex.name}</span>
                <span class="ex-sets">${ex.sets} sets</span>
              </li>`;
          } else {
            return `
              <li class="exercise-item superset-item" data-group="${gi}">
                <span class="ex-name">
                  ${group.exercises[0].name}
                  <span class="ss-badge">SS</span>
                  ${group.exercises[1].name}
                </span>
                <span class="ex-sets">${group.exercises[0].sets} sets</span>
              </li>`;
          }
        }).join('')}
      </ul>
    `;

    document.getElementById('back-to-days').addEventListener('click', () => {
      App.navigateTo('day-select');
    });

    container.querySelectorAll('.exercise-item').forEach(item => {
      item.addEventListener('click', () => {
        const gi = parseInt(item.dataset.group);
        App.navigateTo('exercise-log', { day, group: groups[gi] });
      });
    });
  }

  return { render };
})();
