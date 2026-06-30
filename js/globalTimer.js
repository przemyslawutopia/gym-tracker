const GlobalTimer = (() => {
  let sessionStart = null;

  function fmtSession(ms) {
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}:${String(m).padStart(2, '0')}`;
  }

  function startSessionClock(sessionEl) {
    if (sessionStart) return;
    sessionStart = Date.now();
    sessionEl.classList.remove('hidden');
    sessionEl.textContent = fmtSession(0);
    setInterval(() => {
      sessionEl.textContent = fmtSession(Date.now() - sessionStart);
    }, 30000);
  }

  function init() {
    const display    = document.getElementById('gt-display');
    const sessionEl  = document.getElementById('gt-session');
    const startBtn   = document.getElementById('gt-start');
    const stopBtn    = document.getElementById('gt-stop');
    const resetBtn   = document.getElementById('gt-reset');

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
      startSessionClock(sessionEl);
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
