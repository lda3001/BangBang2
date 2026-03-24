export function syncCameraViewport(canvas, camera) {
  camera.w = canvas.width / camera.zoom;
  camera.h = canvas.height / camera.zoom;
}

export function resizeCanvas(canvas, context, camera) {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.floor(width * devicePixelRatio);
  canvas.height = Math.floor(height * devicePixelRatio);

  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  syncCameraViewport(canvas, camera);
}

