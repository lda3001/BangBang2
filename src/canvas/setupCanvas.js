export function setupCanvas(canvas) {
  const context = canvas.getContext('2d');
  if (!context) {
    return () => {};
  }

  let animationFrameId = 0;

  const resizeCanvas = () => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };

  const render = (time) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#020617');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    context.lineWidth = 1;
    const gridSize = 48;

    for (let x = 0; x <= width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    const pulse = 0.5 + Math.sin(time * 0.0025) * 0.5;
    context.fillStyle = `rgba(56, 189, 248, ${0.3 + pulse * 0.4})`;
    context.font = '600 32px "Segoe UI", sans-serif';
    context.textAlign = 'center';
    context.fillText('Bang Bang 2 Canvas Ready', width / 2, height / 2);

    animationFrameId = window.requestAnimationFrame(render);
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animationFrameId = window.requestAnimationFrame(render);

  return () => {
    window.cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resizeCanvas);
  };
}
