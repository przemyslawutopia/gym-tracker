const App = (() => {
  const screens = [
    'home-screen',
    'day-select-screen',
    'exercise-list-screen',
    'exercise-log-screen',
    'weight-screen',
  ];

  function show(id) {
    screens.forEach(s => {
      document.getElementById(s).classList.toggle('hidden', s !== id);
    });
  }

  function navigateTo(screen, state = {}) {
    switch (screen) {
      case 'home':
        show('home-screen');
        HomeScreen.render();
        break;
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
      case 'weight':
        show('weight-screen');
        WeightLogScreen.render();
        break;
    }
    window.scrollTo(0, 0);
  }

  function init() {
    GlobalTimer.init();
    navigateTo('home');
  }

  return { navigateTo, init };
})();

document.addEventListener('DOMContentLoaded', App.init);
