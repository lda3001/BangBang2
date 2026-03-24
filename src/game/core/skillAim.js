export const SKILL_AIM = {
  kyuubi: {
    q: { type: "dash", range: 400, width: 60 },
    e: { type: "self", range: 100 },
    r: { type: "skillshot", range: 800, width: 60 },
    space: { type: "skillshot", range: 1000, width: 80 },
  },
  pikachu: {
    q: { type: "self", range: 100 },
    e: { type: "target", range: 800 },
    r: { type: "self", range: 250 },
    space: { type: "aoe", range: 600, radius: 150 },
  },
  trieuvan: {
    q: { type: "cone", range: 200, angle: Math.PI / 2 },
    e: { type: "dash", range: 450, width: 80 },
    r: { type: "self", range: 240 },
    space: { type: "skillshot", range: 800, width: 80 },
  },
  lubu: {
    q: { type: "skillshot", range: 600, width: 50 },
    e: { type: "cone", range: 250, angle: Math.PI },
    r: { type: "self", range: 100 },
    space: { type: "aoe", range: 700, radius: 180 },
  },
  ichigo: {
    q: { type: "skillshot", range: 600, width: 80 },
    e: { type: "target", range: 600 },
    r: { type: "self", range: 100 },
    space: { type: "target", range: 1500 },
  },
  thachsanh: {
    q: { type: "dash", range: 350, width: 50 },
    e: { type: "cone", range: 600, angle: 0.8 },
    r: { type: "aoe", range: 800, radius: 200 },
    space: { type: "self", range: 100 },
  },
  quancong: {
    q: { type: "self", range: 200 },
    e: { type: "dash", range: 400, width: 60 },
    r: { type: "skillshot", range: 700, width: 100 },
    space: { type: "target", range: 600 },
  },
  phuonghoang: {
    q: { type: "self", range: 250 },
    e: { type: "dash", range: 500, width: 80 },
    r: { type: "self", range: 300 },
    space: { type: "self", range: 350 },
  },
};

