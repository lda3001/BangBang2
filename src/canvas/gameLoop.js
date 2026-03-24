export function startGameLoop(onFrame) {
  let animationFrameId = 0;

  const loop = (time) => {
    onFrame(time);
    animationFrameId = window.requestAnimationFrame(loop);
  };

  animationFrameId = window.requestAnimationFrame(loop);

  return function stopGameLoop() {
    window.cancelAnimationFrame(animationFrameId);
  };
}

