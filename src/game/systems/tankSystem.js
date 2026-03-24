import tanks from "../../data/Tank";

const HERO_BASE_STATS = {
  kyuubi: { maxHp: 500, maxMp: 100, speed: 3.2, color: "#e67e22" },
  pikachu: { maxHp: 500, maxMp: 100, speed: 3.2, color: "#f1c40f" },
  trieuvan: { maxHp: 550, maxMp: 100, speed: 2, color: "#3498db" },
  lubu: { maxHp: 620, maxMp: 100, speed: 3.3, color: "#e74c3c" },
  ichigo: { maxHp: 450, maxMp: 100, speed: 3.6, color: "#111111" },
  thachsanh: { maxHp: 500, maxMp: 100, speed: 3.8, color: "#f1c40f" },
  quancong: { maxHp: 1050, maxMp: 100, speed: 22, color: "#27ae60" },
  phuonghoang: { maxHp: 450, maxMp: 100, speed: 3.5, color: "#e74c3c" },
};

export function initPlayerTank(state, spawnPoint) {
  const fallbackTank = "kyuubi";
  const hasTank = tanks.some((tank) => tank.id === state.selectedTank);
  const heroClass = hasTank ? state.selectedTank : fallbackTank;
  const base = HERO_BASE_STATS[heroClass] || HERO_BASE_STATS.kyuubi;

  state.entities.player = {
    id: "player",
    type: "player",
    playerName: "Player",
    heroClass,
    x: spawnPoint.x,
    y: spawnPoint.y,
    radius: 30,
    maxHp: base.maxHp,
    hp: base.maxHp,
    maxMp: base.maxMp,
    mp: base.maxMp,
    speed: base.speed,
    color: base.color,
    angle: 0,
    bodyAngle: 0,
    buffs: {},
    states: {},
  };

  return state.entities.player;
}

