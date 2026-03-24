import { mobaMapImage } from "../../data/Map";
import tanks from "../../data/Tank";

const tankModelById = new Map(tanks.map((tank) => [tank.id, tank]));
const tankSpriteCache = new Map();
const HERO_RENDER_CONFIG = {
  ichigo: {
    angleOffset: -Math.PI / 2,
    sizeScale: 4.5,
    glow: "#e74c3c",
    glowBlur: 20,
  },
  phuonghoang: {
    angleOffset: 0,
    sizeScale: 6.2,
    glow: "#e67e22",
    glowBlur: 14,
  },
  quancong: {
    angleOffset: 0,
    sizeScale: 4.8,
  },
  lubu: {
    angleOffset: 0,
    sizeScale: 4.8,
  },
  trieuvan: {
    angleOffset: -Math.PI / 2,
    sizeScale: 4.8,
  },
};

function getTankSprite(heroClass) {
  if (!heroClass) return null;
  if (tankSpriteCache.has(heroClass)) {
    return tankSpriteCache.get(heroClass);
  }

  const model = tankModelById.get(heroClass);
  const spritePath = model?.modal;
  if (!spritePath) {
    tankSpriteCache.set(heroClass, null);
    return null;
  }

  const image = new Image();
  // Use in-game sprite first (img). `modal` is only fallback to avoid missing texture.
  image.src = `/${spritePath}`;
  tankSpriteCache.set(heroClass, image);
  return image;
}

function getHeroRenderConfig(heroClass) {
  return HERO_RENDER_CONFIG[heroClass] || { angleOffset: Math.PI / 2, sizeScale: 4.2 };
}

function drawFallbackTank(context, player, px, py, pr) {
  context.fillStyle = player.color || "#22d3ee";
  context.beginPath();
  context.arc(px, py, pr, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#ffffff";
  context.lineWidth = 2;
  context.stroke();
}

function drawPlayerTank(context, player, px, py, pr) {
  const sprite = getTankSprite(player.heroClass);
  const config = getHeroRenderConfig(player.heroClass);

  if (!(sprite && sprite.complete && sprite.naturalWidth > 0)) {
    drawFallbackTank(context, player, px, py, pr);
    return;
  }

  const drawSize = pr * config.sizeScale;
  context.save();
  context.translate(px, py);
  context.rotate((player.bodyAngle || player.angle || 0) + (config.angleOffset || 0));
  if (config.glow) {
    context.shadowColor = config.glow;
    context.shadowBlur = config.glowBlur || 0;
  }
  context.drawImage(sprite, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
  context.restore();
}

export function renderFrame(context, state, time) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cameraX = state.camera.x;
  const cameraY = state.camera.y;
  const cameraW = Math.max(1, state.camera.w || width);
  const cameraH = Math.max(1, state.camera.h || height);
  const scaleX = width / cameraW;
  const scaleY = height / cameraH;
  const worldToScreenX = (x) => (x - cameraX) * scaleX;
  const worldToScreenY = (y) => (y - cameraY) * scaleY;
  const worldToScreenR = (r) => r * ((scaleX + scaleY) * 0.5);

  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(1, "#020617");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  // Render map in world space, then project into viewport.
  if (mobaMapImage.complete && mobaMapImage.naturalWidth > 0 && state.mode === "moba") {
    context.drawImage(
      mobaMapImage,
      cameraX,
      cameraY,
      cameraW,
      cameraH,
      0,
      0,
      width,
      height
    );
  } else {
    const gridSize = 100;
    const startX = Math.floor(cameraX / gridSize) * gridSize;
    const startY = Math.floor(cameraY / gridSize) * gridSize;
    const endX = cameraX + cameraW + gridSize;
    const endY = cameraY + cameraH + gridSize;

    context.strokeStyle = "rgba(148, 163, 184, 0.16)";
    context.lineWidth = 1;
    for (let x = startX; x <= endX; x += gridSize) {
      context.beginPath();
      context.moveTo(worldToScreenX(x), 0);
      context.lineTo(worldToScreenX(x), height);
      context.stroke();
    }
    for (let y = startY; y <= endY; y += gridSize) {
      context.beginPath();
      context.moveTo(0, worldToScreenY(y));
      context.lineTo(width, worldToScreenY(y));
      context.stroke();
    }
  }

  // World bounds overlay.
  context.strokeStyle = "rgba(241, 245, 249, 0.35)";
  context.lineWidth = 2;
  context.strokeRect(
    worldToScreenX(0),
    worldToScreenY(0),
    state.world.width * scaleX,
    state.world.height * scaleY
  );

  const bullets = state.entities.bullets;
  if (bullets.length) {
    context.save();
    for (let i = 0; i < bullets.length; i += 1) {
      const b = bullets[i];
      context.fillStyle = b.color || "#38bdf8";
      context.beginPath();
      context.arc(
        worldToScreenX(b.x),
        worldToScreenY(b.y),
        worldToScreenR(b.radius || 5),
        0,
        Math.PI * 2
      );
      context.fill();
    }
    context.restore();
  }

  const player = state.entities.player;
  if (player) {
    context.save();
    const px = worldToScreenX(player.x);
    const py = worldToScreenY(player.y);
    const pr = worldToScreenR(player.radius);
    drawPlayerTank(context, player, px, py, pr);

    // Turret direction.
    context.strokeStyle = "#cbd5e1";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(px, py);
    context.lineTo(
      worldToScreenX(player.x + Math.cos(player.angle || 0) * (player.radius + 18)),
      worldToScreenY(player.y + Math.sin(player.angle || 0) * (player.radius + 18))
    );
    context.stroke();

    context.fillStyle = "#e2e8f0";
    context.font = '600 14px "Segoe UI", sans-serif';
    context.textAlign = "center";
    context.fillText(
      `${player.playerName.toUpperCase()}  HP ${Math.floor(player.hp)}/${player.maxHp}`,
      worldToScreenX(player.x),
      worldToScreenY(player.y)+100
    );
    context.restore();
  }

  // state.pulse = 0.5 + Math.sin(time * 0.0025) * 0.5;
  // context.fillStyle = `rgba(56, 189, 248, ${0.3 + state.pulse * 0.4})`;
  // context.font = '600 32px "Segoe UI", sans-serif';
  // context.textAlign = "center";
  // context.fillText("Bang Bang 2 Canvas Ready", width / 2, height / 2);
}
