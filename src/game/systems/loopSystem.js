export function startLoop(onTick) {
  let rafId = 0;

  const tick = (time) => {
    onTick(time);
    rafId = window.requestAnimationFrame(tick);
  };

  rafId = window.requestAnimationFrame(tick);

  return function stopLoop() {
    window.cancelAnimationFrame(rafId);
  };
}

