const GlobalTimer = (() => {
  function init() {
    const display  = document.getElementById('gt-display');
    const startBtn = document.getElementById('gt-start');
    const stopBtn  = document.getElementById('gt-stop');
    const resetBtn = document.getElementById('gt-reset');

    function updateButtons() {
      if (Stopwatch.isRunning()) {
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        display.classList.add('active');
      } else {
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        display.classList.remove('active');
      }
    }

    startBtn.addEventListener('click', () => {
      Stopwatch.start(t => { display.textContent = t; });
      updateButtons();
    });

    stopBtn.addEventListener('click', () => {
      Stopwatch.stop();
      display.textContent = Stopwatch.getDisplay();
      updateButtons();
    });

    resetBtn.addEventListener('click', () => {
      Stopwatch.reset(t => { display.textContent = t; });
      updateButtons();
    });
  }

  return { init };
})();
