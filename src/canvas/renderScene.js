import { mobaMapImage } from "../data/Map";

export function renderScene(context, state, time) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(1, "#020617");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(148, 163, 184, 0.18)";
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
  console.log(state);
  

  if (mobaMapImage.complete && mobaMapImage.naturalWidth > 0 && state.gameMode === 'moba') {
    context.drawImage(mobaMapImage, 0, 0, width, height);
  }

  const pulse = 0.5 + Math.sin(time * 0.0025) * 0.5;
  state.pulse = pulse;

  context.fillStyle = `rgba(56, 189, 248, ${0.3 + pulse * 0.4})`;
  context.font = '600 32px "Segoe UI", sans-serif';
  context.textAlign = "center";
  context.fillText("Bang Bang 2 Canvas Ready", width / 2, height / 2);

  context.fillStyle = "rgba(226, 232, 240, 0.95)";
  context.font = '500 16px "Segoe UI", sans-serif';
  context.fillText(
    `Mode: ${state.mode} | Tank: ${state.selectedTank}`,
    width / 2,
    height / 2 + 32
  );
}

