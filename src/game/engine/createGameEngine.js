import { createInitialGameState } from "../core/state";
import { bindInput } from "../systems/inputSystem";
import { startLoop } from "../systems/loopSystem";
import { setupMap } from "../systems/mapSystem";
import { renderFrame } from "../systems/renderSystem";
import { initPlayerTank } from "../systems/tankSystem";
import { updateFrame } from "../systems/updateSystem";
import { resizeCanvas } from "../systems/viewportSystem";

export function createGameEngine({ canvas, context, selectedTank, mode }) {
  const state = createInitialGameState({ selectedTank, mode });
  state.gameState = "PLAYING";
  const spawnPoint = setupMap(state);
  const player = initPlayerTank(state, spawnPoint);

  const handleResize = () => {
    resizeCanvas(canvas, context, state.camera);

    // Keep camera centered on player after resize.
    if (player) {
      state.camera.x = Math.max(
        0,
        Math.min(state.world.width - state.camera.w, player.x - state.camera.w / 2)
      );
      state.camera.y = Math.max(
        0,
        Math.min(state.world.height - state.camera.h, player.y - state.camera.h / 2)
      );
    }
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  const unbindInput = bindInput(state);
  let lastTime = performance.now();
  const stopLoop = startLoop((time) => {
    const deltaSeconds = Math.min(0.05, Math.max(0.001, (time - lastTime) / 1000));
    lastTime = time;
    updateFrame(state, deltaSeconds);
    renderFrame(context, state, time);
  });

  return {
    state,
    destroy() {
      stopLoop();
      unbindInput();
      window.removeEventListener("resize", handleResize);
    },
  };
}

