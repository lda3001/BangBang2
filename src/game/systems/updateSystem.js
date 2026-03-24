function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalize(x, y) {
  const len = Math.hypot(x, y);
  if (!len) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
}

function updatePlayer(state, deltaSeconds) {
  const player = state.entities.player;
  if (!player) return;

  const keys = state.input.keys;
  let moveX = 0;
  let moveY = 0;

  if (keys.KeyW) moveY -= 1;
  if (keys.KeyS) moveY += 1;
  if (keys.KeyA) moveX -= 1;
  if (keys.KeyD) moveX += 1;

  const direction = normalize(moveX, moveY);
  const speedPerSecond = player.speed * 140;
  const acceleration = speedPerSecond * 10;
  const damping = 8;

  if (typeof player.vx !== "number") player.vx = 0;
  if (typeof player.vy !== "number") player.vy = 0;

  if (direction.x || direction.y) {
    player.vx += direction.x * acceleration * deltaSeconds;
    player.vy += direction.y * acceleration * deltaSeconds;

    const currentSpeed = Math.hypot(player.vx, player.vy);
    if (currentSpeed > speedPerSecond) {
      const scale = speedPerSecond / currentSpeed;
      player.vx *= scale;
      player.vy *= scale;
    }

    const targetBodyAngle = Math.atan2(direction.y, direction.x);
    let delta = targetBodyAngle - (player.bodyAngle || 0);
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    player.bodyAngle = (player.bodyAngle || 0) + delta * Math.min(1, 18 * deltaSeconds);
  } else {
    const decay = Math.exp(-damping * deltaSeconds);
    player.vx *= decay;
    player.vy *= decay;

    if (Math.abs(player.vx) < 0.5) player.vx = 0;
    if (Math.abs(player.vy) < 0.5) player.vy = 0;
  }

  player.x += player.vx * deltaSeconds;
  player.y += player.vy * deltaSeconds;

  player.x = clamp(player.x, player.radius, state.world.width - player.radius);
  player.y = clamp(player.y, player.radius, state.world.height - player.radius);

  player.angle = Math.atan2(
    state.input.worldMouseY - player.y,
    state.input.worldMouseX - player.x
  );
}

function shootPlayer(state, deltaSeconds) {
  const player = state.entities.player;
  if (!player) return;

  if (typeof player.attackCooldown !== "number") {
    player.attackCooldown = 0;
  }

  if (player.attackCooldown > 0) {
    player.attackCooldown = Math.max(0, player.attackCooldown - deltaSeconds);
  }

  if (!state.input.isShooting || player.attackCooldown > 0) {
    return;
  }

  const muzzleDistance = player.radius + 16;
  const bulletSpeed = 900; // px/s
  const bulletLife = 1.2; // seconds
  const angle = player.angle || 0;
  const bullet = {
    x: player.x + Math.cos(angle) * muzzleDistance,
    y: player.y + Math.sin(angle) * muzzleDistance,
    vx: Math.cos(angle) * bulletSpeed,
    vy: Math.sin(angle) * bulletSpeed,
    radius: 6,
    life: bulletLife,
    color: "#38bdf8",
  };

  state.entities.bullets.push(bullet);
  player.attackCooldown = 0.14;
}

function updateBullets(state, deltaSeconds) {
  const { bullets } = state.entities;
  if (!bullets.length) return;

  const width = state.world.width;
  const height = state.world.height;

  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const b = bullets[i];
    b.x += b.vx * deltaSeconds;
    b.y += b.vy * deltaSeconds;
    b.life -= deltaSeconds;

    const outOfBounds = b.x < -40 || b.y < -40 || b.x > width + 40 || b.y > height + 40;
    if (b.life <= 0 || outOfBounds) {
      bullets.splice(i, 1);
    }
  }
}

function updateCamera(state, deltaSeconds) {
  const player = state.entities.player;
  if (!player) return;

  const targetX = clamp(player.x - state.camera.w / 2, 0, state.world.width - state.camera.w);
  const targetY = clamp(player.y - state.camera.h / 2, 0, state.world.height - state.camera.h);

  const lerp = Math.min(1, 8 * deltaSeconds);
  state.camera.x += (targetX - state.camera.x) * lerp;
  state.camera.y += (targetY - state.camera.y) * lerp;
}

export function updateFrame(state, deltaSeconds) {
  updatePlayer(state, deltaSeconds);
  shootPlayer(state, deltaSeconds);
  updateBullets(state, deltaSeconds);
  updateCamera(state, deltaSeconds);
}

