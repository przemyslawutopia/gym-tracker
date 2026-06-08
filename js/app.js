const App = (() => {
  const screens = ['day-select-screen', 'exercise-list-screen', 'exercise-log-screen'];

  function show(id) {
    screens.forEach(s => {
      document.getElementById(s).classList.toggle('hidden', s !== id);
    });
  }

  function navigateTo(screen, state = {}) {
    switch (screen) {
      case 'day-select':
        show('day-select-screen');
        DaySelectScreen.render();
        break;
      case 'exercise-list':
        show('exercise-list-screen');
        ExerciseListScreen.render(state);
        break;
      case 'exercise-log':
        show('exercise-log-screen');
        ExerciseLogScreen.render(state);
        break;
    }
    window.scrollTo(0, 0);
  }

  function init() {
    KbToolbar.init();
    navigateTo('day-select');
  }

  return { navigateTo, init };
})();

document.addEventListener('DOMContentLoaded', App.init);
