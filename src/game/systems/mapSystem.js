import { mobaHpZones, mobaLanePaths, mobaSpawners, mobaTowers } from "../../data/Map";

function getWorldByMode(mode) {
  if (mode === "moba") {
    return {
      width: 3686,
      height: 3438,
      spawn: { x: 820, y: 3438 - 820 },
      zoom: 0.9,
    };
  }

  if (mode === "survival") {
    return {
      width: 12000,
      height: 2500,
      spawn: { x: 600, y: 1250 },
      zoom: 1,
    };
  }

  if (mode === "practice") {
    return {
      width: 6000,
      height: 3000,
      spawn: { x: 900, y: 1500 },
      zoom: 1,
    };
  }

  // story/default
  return {
    width: 12000,
    height: 2500,
    spawn: { x: 200, y: 1250 },
    zoom: 1,
  };
}

export function setupMap(state) {
  const world = getWorldByMode(state.mode);

  state.world.width = world.width;
  state.world.height = world.height;
  state.camera.zoom = world.zoom;

  state.entities.enemies = [];
  state.entities.allies = [];
  state.entities.bullets = [];
  state.entities.items = [];
  state.entities.floatTexts = [];
  state.entities.walls = [];
  state.entities.bushes = [];
  state.entities.zones = [];
  state.entities.rProjs = [];
  state.entities.particles = [];
  state.entities.expOrbs = [];
  state.entities.warnings = [];
  state.entities.telegraphs = [];
  state.entities.pets = [];
  state.entities.slashes = [];
  state.entities.blockWalls = [];
  state.entities.barrels = [];

  state.moba = {
    lanePaths: mobaLanePaths,
    spawners: mobaSpawners,
    towers: mobaTowers,
    hpZones: mobaHpZones,
  };

  return world.spawn;
}

