export function createGameState({ selectedTank, mode }) {
  return {
    selectedTank,
    mode,
    camera: {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      zoom: 1,
    },
    pulse: 0,
  };
}

