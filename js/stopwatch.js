const Stopwatch = (() => {
  let start = null;
  let elapsed = 0;
  let running = false;
  let interval = null;
  let onTick = null;

  function fmt(ms) {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function tick() {
    if (onTick) onTick(fmt(elapsed + (Date.now() - start)));
  }

  function startTimer(cb) {
    if (running) return;
    onTick = cb;
    start = Date.now();
    running = true;
    interval = setInterval(tick, 500);
    tick();
  }

  function stop() {
    if (!running) return;
    elapsed += Date.now() - start;
    clearInterval(interval);
    running = false;
  }

  function reset(cb) {
    stop();
    elapsed = 0;
    start = null;
    if (cb) cb('0:00');
  }

  function isRunning() { return running; }

  function getDisplay() {
    if (running) return fmt(elapsed + (Date.now() - start));
    return fmt(elapsed);
  }

  return { start: startTimer, stop, reset, isRunning, getDisplay };
})();
