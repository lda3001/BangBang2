import { createGameEngine } from "../game/engine/createGameEngine";

export function setupCanvas(canvas, selectedTank, mode) {
  const context = canvas.getContext("2d");
  if (!context) {
    return () => {};
  }

  const engine = createGameEngine({ canvas, context, selectedTank, mode });

  return () => {
    engine.destroy();
  };
}
