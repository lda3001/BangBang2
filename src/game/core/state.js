import { SKILL_AIM } from "./skillAim";

export function createInitialGameState({ selectedTank, mode }) {
  return {
    // Session
    selectedTank,
    mode,
    gameState: "START",
    currentLevel: 1,
    wave: 1,
    playerName: "Player",

    // World
    world: {
      width: 12000,
      height: 2500,
    },
    camera: {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      zoom: 1,
    },

    // Input
    input: {
      keys: {},
      mouseX: 0,
      mouseY: 0,
      worldMouseX: 0,
      worldMouseY: 0,
      isShooting: false,
      aimingSkill: null,
      pendingCast: null,
      cancelAim: false,
    },

    // Gameplay collections (ported from clientgame)
    entities: {
      player: null,
      enemies: [],
      allies: [],
      bullets: [],
      items: [],
      floatTexts: [],
      walls: [],
      bushes: [],
      zones: [],
      rProjs: [],
      particles: [],
      expOrbs: [],
      warnings: [],
      telegraphs: [],
      pets: [],
      slashes: [],
      blockWalls: [],
      barrels: [],
    },

    // Misc runtime
    screenShake: 0,
    playerLives: 3,
    pulse: 0,
    skillAim: SKILL_AIM,
  };
}

