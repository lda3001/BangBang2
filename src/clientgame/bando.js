// ==========================================
// BAN_DO.JS - QUẢN LÝ MÔI TRƯỜNG & MÀN CHƠI
// ==========================================

class BlockWall {
    constructor(x, y, angle) { this.x = x; this.y = y; this.angle = angle; this.life = 300; this.width = 150; this.thickness = 30; this.active = true; }
    update() { this.life--; if (this.life <= 0) this.active = false; }
    draw() { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle); ctx.fillStyle = '#7f8c8d'; ctx.fillRect(-this.thickness / 2, -this.width / 2, this.thickness, this.width); ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 3; ctx.strokeRect(-this.thickness / 2, -this.width / 2, this.thickness, this.width); ctx.restore(); }
}

class Bush {
    constructor(x, y, w, h, c1 = '#27ae60', c2 = '#2ecc71', c3 = '#1e8449', c4 = '#145a32') {
        this.x = x; this.y = y; this.w = w; this.h = h; this.circles = []; this.c3 = c3; this.c4 = c4;
        for (let i = 0; i < 12; i++) this.circles.push({ ox: Math.random() * w, oy: Math.random() * h, r: 30 + Math.random() * 20, color: Math.random() > 0.5 ? c1 : c2 });
    }
    draw() { ctx.save(); ctx.translate(this.x, this.y); ctx.globalAlpha = 0.85; this.circles.forEach(c => { ctx.fillStyle = this.c3; ctx.beginPath(); ctx.arc(c.ox, c.oy, c.r + 4, 0, Math.PI * 2); ctx.fill(); }); this.circles.forEach(c => { ctx.fillStyle = c.color; ctx.beginPath(); ctx.arc(c.ox, c.oy, c.r, 0, Math.PI * 2); ctx.fill(); }); ctx.strokeStyle = this.c4; ctx.lineWidth = 2; this.circles.forEach(c => { ctx.beginPath(); ctx.arc(c.ox, c.oy, c.r * 0.5, 0, Math.PI / 2); ctx.stroke(); }); ctx.restore(); }
}

let mobaWave = 1;
let mobaMatchTimer = 0;
let mobaLanePaths = {};
let mobaSpawners = {};
let mobaTowers = [];
let mobaHpZones = [];

function isInZoneHp(x, y, team = 'ally') {
    if (gameMode !== 'moba' || !Array.isArray(mobaHpZones) || mobaHpZones.length === 0)
        return false;
    for (const zone of mobaHpZones) {
        if (zone.team !== team)
            continue;
        if (Math.hypot(x - zone.x, y - zone.y) <= zone.radius)
            return true;
    }
    return false;
}

function buildLanePathWithOffset(path, team, slot = 0) {
    const lateralOffset = (slot - 1.5) * 46 + (Math.random() - 0.5) * 10;
    const teamSign = team === 'ally' ? 1 : -1;
    return path.map((pt, i) => {
        const prev = i === 0 ? path[i] : path[i - 1];
        const next = i === path.length - 1 ? path[i] : path[i + 1];
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        return {
            x: pt.x + nx * lateralOffset * teamSign,
            y: pt.y + ny * lateralOffset * teamSign
        };
    });
}

function spawnCamp(startX, endX, numLight, numNorm, numHeavy) {
    for (let i = 0; i < numLight; i++) enemies.push(new Tank(startX + Math.random() * (endX - startX), 200 + Math.random() * (WORLD_H - 400), 'enemy', 'light'));
    for (let i = 0; i < numNorm; i++) enemies.push(new Tank(startX + Math.random() * (endX - startX), 200 + Math.random() * (WORLD_H - 400), 'enemy', 'normal'));
    for (let i = 0; i < numHeavy; i++) enemies.push(new Tank(startX + Math.random() * (endX - startX), 200 + Math.random() * (WORLD_H - 400), 'enemy', 'heavy'));
}

function setupMobaMap() {
    currentLevel = 1;
    document.getElementById('ui-current-level').innerText = 'MOBA 30:00';
    // mobamap.png is square, so keep MOBA world square to avoid distortion.
    WORLD_W = 3686;
    WORLD_H = 3438;
    player.x = 820;
    player.y = WORLD_H - 820;

    camera.zoom = 0.85;
    if (typeof syncCameraViewport === 'function')
        syncCameraViewport();
    camera.x = Math.max(0, Math.min(WORLD_W - camera.w, player.x - camera.w / 2));
    camera.y = Math.max(0, Math.min(WORLD_H - camera.h, player.y - camera.h / 2));

    mobaWave = 1;
    mobaMatchTimer = 30 * 60 * 60;
    wave = 1;
   mobaLanePaths = {
    top: {
        ally: [
            { x: 400, y: 3050 },
            { x: 350, y: 935 },
            { x: 700, y: 595 },
            { x: 3350, y: 550 }
        ],
        enemy: [
            { x: 3350, y: 550 },
            { x: 700, y: 595 },
            { x: 350, y: 935 },
            { x: 400, y: 3050 }
        ]
    },

    mid: {
        ally: [
            { x: 400, y: 3050 },
            { x: 1885, y: 1840 },
            { x: 3350, y: 550 }
        ],
        enemy: [
            { x: 3350, y: 550 },
            { x: 1885, y: 1840 },
            { x: 400, y: 3050 }
        ]
    },

    bot: {
        ally: [
            { x: 400, y: 3050 },
            { x: 3000, y: 3100 },
            { x: 3350, y: 2900 },
            { x: 3350, y: 550 }
        ],
        enemy: [
            { x: 3350, y: 550 },
            { x: 3350, y: 2900 },
            { x: 3000, y: 3100 },
            { x: 400, y: 3050 }
        ]
    }
};
    mobaSpawners = {
        top: { lane: 'top', cooldown: 10 * 60, wave: 0 },
        mid: { lane: 'mid', cooldown: 10 * 60, wave: 0 },
        bot: { lane: 'bot', cooldown: 10 * 60, wave: 0 }
    };
    mobaTowers = [
        { id: 'ally_core', team: 'ally', x:400, y: 3050, radius: 100, hp: 1000, maxHp: 1000 },
        { id: 'enemy_core', team: 'enemy', x: 3350, y: 550, radius: 100, hp: 1000, maxHp: 1000 }
    ];
    mobaHpZones = [
        { team: 'ally', x: 0, y: WORLD_H-320, radius: 320 },
        { team: 'enemy', x: WORLD_W - 760, y: 760, radius: 320 }
    ];

    const addWall = (x, y, w, h) => walls.push({ x, y, w, h, fill: 'rgba(0,0,0,0)', stroke: 'rgba(0,0,0,0)' });
    const addBush = (x, y, w, h) => bushes.push(new Bush(x, y, w, h, '#27ae60', '#2ecc71', '#1e8449', '#145a32'));

    // Collision layout remapped from mobamap.png landmarks.
    // Blue/Red bases
    // addWall(300, 2956, 232, 185);
    // addWall(3228, 461, 232, 185);

    // wall Around the map
    addWall(0, 0, WORLD_W, 400);
    addWall(0, WORLD_H-150, WORLD_W, 150);
    addWall(0, 320, 150, WORLD_H-640);
    addWall(WORLD_W-150, 320, 150, WORLD_H-640);

    // Core ruins cluster (center)
    // addWall(2790, 2780, 420, 430);
    // addWall(2520, 3000, 220, 150);
    // addWall(3260, 2940, 220, 150);
    // addWall(2870, 2480, 240, 170);
    // addWall(2890, 3330, 220, 170);

    // // Upper river / top lane blocks
    // addWall(970, 1220, 290, 170);
    // addWall(1460, 1020, 210, 150);
    // addWall(2010, 1140, 230, 140);
    // addWall(2550, 980, 280, 160);
    // addWall(3310, 1130, 230, 140);
    // addWall(3890, 1000, 230, 150);
    // addWall(4500, 1180, 310, 180);

    // // Lower river / bot lane mirrored blocks
    // addWall(1180, 4510, 300, 180);
    // addWall(1760, 4680, 220, 140);
    // addWall(2350, 4850, 230, 140);
    // addWall(3040, 4720, 280, 170);
    // addWall(3640, 4890, 220, 140);
    // addWall(4200, 4710, 220, 140);
    // addWall(4730, 4460, 300, 180);

    // // Left jungle pockets
    // addWall(930, 2740, 230, 160);
    // addWall(1320, 2340, 220, 150);
    // addWall(1660, 3120, 220, 150);
    // addWall(2100, 2750, 260, 170);

    // // Right jungle pockets
    // addWall(3870, 2690, 260, 170);
    // addWall(4260, 2330, 220, 150);
    // addWall(4620, 3070, 220, 150);
    // addWall(4950, 2700, 230, 160);

    

    // Bushes in river/jungle pockets from the artwork.
    addBush(920, 1000, 420, 220);
    addBush(2050, 820, 500, 220);
    addBush(3550, 820, 500, 220);
    addBush(4680, 960, 360, 220);
    addBush(900, 4780, 420, 220);
    addBush(2050, 4940, 500, 220);
    addBush(3550, 4940, 500, 220);
    addBush(4680, 4760, 360, 220);
    addBush(2760, 2360, 480, 220);
    addBush(2760, 3420, 480, 220);

    

    // Neutral camps near the center/jungle.
    // for (let i = 0; i < 6; i++) {
    //     enemies.push(new Tank(2300 + Math.random() * 380, 2400 + Math.random() * 380, 'enemy', 'normal', 'spider'));
    //     enemies.push(new Tank(3300 + Math.random() * 380, 3200 + Math.random() * 380, 'enemy', 'normal', 'snake'));
    // }

    // Enemy base objective (counts as tower target as well).
    // const mobaBoss = new Tank(WORLD_W - 760, 760, 'boss');
    // mobaBoss.name = 'TRỤ CHÍNH ĐỊCH';
    // mobaBoss.bossType = 'golem';
    // mobaBoss.maxHp = 30000;
    // mobaBoss.hp = mobaBoss.maxHp;
    // mobaBoss.isTower = true;
    // mobaBoss.team = 'enemy';
    // enemies.push(mobaBoss);
    gameState = 'PLAYING';
}

function spawnLaneCreeps(spawner) {
    spawner.wave++;
    const lane = spawner.lane;
    const elapsedSec = (30 * 60 * 60 - mobaMatchTimer) / 60;
    const creepBonus = elapsedSec >= 15 * 60 ? 1 + ((elapsedSec - 15 * 60) / 60) * 0.03 : 1;
    const cannonWave = spawner.wave % 3 === 0 || elapsedSec >= 5 * 60;

    const mkCreep = (team, tier, heroClass, slot, row) => {
        const basePath = mobaLanePaths[lane][team];
        const path = buildLanePathWithOffset(basePath, team, slot);
        const start = path[0];
        const next = path[1] || start;
        const dirX = next.x - start.x;
        const dirY = next.y - start.y;
        const dirLen = Math.hypot(dirX, dirY) || 1;
        const backSpacing = 58 + row * 44;
        const creep = new Tank(
            start.x - (dirX / dirLen) * backSpacing + (Math.random() - 0.5) * 10,
            start.y - (dirY / dirLen) * backSpacing + (Math.random() - 0.5) * 10,
            'enemy',
            tier,
            heroClass
        );
        creep.isCreep = true;
        creep.team = team;
        creep.lane = lane;
        creep.path = path;
        creep.pathIndex = 1;
        creep.laneSlot = slot;
        creep.spawnWave = spawner.wave;
        creep.xp = 0;
        creep.maxHp *= creepBonus;
        creep.hp = creep.maxHp;
        creep.baseDmgMult *= creepBonus;
        if (team === 'ally') {
            creep.color = heroClass === 'archer' ? '#7dc0ff' : '#4aa3ff';
        }
        return creep;
    };

    for (let i = 0; i < 3; i++) {
        enemies.push(mkCreep('enemy', 'normal', 'melee', i, 0));
        enemies.push(mkCreep('enemy', 'light', 'archer', i, 1));
        allies.push(mkCreep('ally', 'normal', 'melee', i, 0));
        allies.push(mkCreep('ally', 'light', 'archer', i, 1));
    }

    if (cannonWave) {
        enemies.push(mkCreep('enemy', 'heavy', 'cannon', 3, 2));
        allies.push(mkCreep('ally', 'heavy', 'cannon', 3, 2));
    }

    floatTexts.push(new FloatText(player.x, player.y - 130, `${lane.toUpperCase()} WAVE ${spawner.wave}`, '#f1c40f', 24));
}

function setupLevel(lv) {
    enemies = []; allies = []; bullets = []; items = []; floatTexts = []; walls = []; bushes = []; zones = []; rProjs = []; particles = []; expOrbs = []; warnings = []; telegraphs = []; pets = []; slashes = []; blockWalls = []; barrels = [];

    if (camera.zoom !== 1) {
        camera.zoom = 1;
        if (typeof syncCameraViewport === 'function')
            syncCameraViewport();
    }

    if (gameMode === 'practice') {
        currentLevel = 0; document.getElementById('ui-current-level').innerText = 'TẬP HUẤN';
        for (let i = 0; i < 10; i++) enemies.push(new Tank(800 + Math.random() * 3000, 300 + Math.random() * 1500, 'enemy', 'heavy', 'dummy'));
        let red = new Item(300, 300); red.data = { id: 'red_buff', color: '#e74c3c', text: 'BÙA ĐỎ' }; items.push(red);
        let blue = new Item(300, 500); blue.data = { id: 'blue_buff', color: '#3498db', text: 'BÙA XANH' }; items.push(blue);
        gameState = 'PLAYING'; return;
    }

    if (gameMode === 'survival') {
        currentLevel = 1; document.getElementById('ui-current-level').innerText = 'VÔ TẬN'; wave = 1;
        for (let i = 0; i < 15; i++) barrels.push(new Barrel(1000 + Math.random() * 10000, 200 + Math.random() * 2000));
        spawnSurvivalWave(); gameState = 'PLAYING'; return;
    }

    if (gameMode === 'moba') {
        setupMobaMap();
        return;
    }

    currentLevel = lv; document.getElementById('ui-current-level').innerText = lv;

    if (lv === 5 || lv === 9) { WORLD_W = 4000; WORLD_H = 12000; player.x = WORLD_W / 2; player.y = WORLD_H - 500; }
    else if (lv === 6 || lv === 8) { WORLD_W = 15000; WORLD_H = 3000; player.x = 300; player.y = WORLD_H / 2; }
    else { WORLD_W = 12000; WORLD_H = 2500; player.x = 200; player.y = WORLD_H / 2; }

    let wallFill = '#7f8c8d', wallStroke = '#2c3e50', bC1 = '#27ae60', bC2 = '#2ecc71', bC3 = '#1e8449', bC4 = '#145a32';
    if (lv === 2 || lv === 7) { wallFill = '#e67e22'; wallStroke = '#d35400'; bC1 = '#f1c40f'; }
    if (lv === 3 || lv === 8) { wallFill = '#bdc3c7'; wallStroke = '#95a5a6'; bC1 = '#ecf0f1'; }
    if (lv === 4 || lv === 10) { wallFill = '#2c3e50'; wallStroke = '#e74c3c'; bC1 = '#e74c3c'; }
    if (lv === 5 || lv === 9) { wallFill = '#2980b9'; wallStroke = '#1abc9c'; bC1 = '#16a085'; }
    const addWall = (x, y, w, h) => walls.push({ x, y, w, h, fill: wallFill, stroke: wallStroke });

    if (lv <= 4) {
        for (let w = 1000; w < 11000; w += 1200) { addWall(w, 0, 150, 700 + Math.random() * 300); addWall(w + 500, WORLD_H - 900 + Math.random() * 200, 150, 900); }
        spawnCamp(800, 3000, 10, 5, 2);
        for (let i = 0; i < lv * 5; i++) enemies.push(new Tank(3000 + Math.random() * 5000, 200 + Math.random() * 2000, 'enemy', 'heavy', 'charger'));
        for (let i = 0; i < 10; i++) enemies.push(new Tank(4000 + Math.random() * 5000, 200 + Math.random() * 2000, 'enemy', 'heavy', 'venom'));
    }
    else if (lv === 5 || lv === 9) {
        for (let y = WORLD_H - 1500; y > 1500; y -= 1200) { addWall(0, y, WORLD_W / 2 - 300, 200); addWall(WORLD_W / 2 + 300, y, WORLD_W / 2, 200); }
        for (let i = 0; i < 20; i++) enemies.push(new Tank(1000 + Math.random() * 2000, 2000 + Math.random() * 8000, 'enemy', 'normal', 'archer'));
        for (let i = 0; i < 15; i++) enemies.push(new Tank(500 + Math.random() * 3000, 2000 + Math.random() * 8000, 'enemy', 'heavy', 'venom'));
        for (let i = 0; i < 20; i++) enemies.push(new Tank(500 + Math.random() * 3000, 2000 + Math.random() * 8000, 'enemy', 'normal', 'saw'));
    }
    else if (lv === 6 || lv === 8) {
        for (let x = 1500; x < WORLD_W - 1500; x += 1500) { addWall(x, 0, 300, WORLD_H / 2 + 300); addWall(x + 750, WORLD_H / 2 - 300, 300, WORLD_H / 2 + 300); }
        for (let i = 0; i < 20; i++) enemies.push(new Tank(2000 + Math.random() * 10000, 500 + Math.random() * 2000, 'enemy', 'heavy', 'icer'));
        for (let i = 0; i < 25; i++) enemies.push(new Tank(2000 + Math.random() * 10000, 500 + Math.random() * 2000, 'enemy', 'normal', 'ghost'));
        for (let i = 0; i < 20; i++) enemies.push(new Tank(2000 + Math.random() * 10000, 500 + Math.random() * 2000, 'enemy', 'normal', 'trapper'));
    }
    else {
        for (let w = 1500; w < WORLD_W - 1500; w += 2000) { addWall(w, 0, 300, 800); addWall(w, WORLD_H - 800, 300, 800); }
        for (let i = 0; i < 20; i++) enemies.push(new Tank(2000 + Math.random() * (WORLD_W - 3000), 200 + Math.random() * (WORLD_H - 400), 'enemy', 'normal', 'saw'));
        for (let i = 0; i < 20; i++) enemies.push(new Tank(2000 + Math.random() * (WORLD_W - 3000), 200 + Math.random() * (WORLD_H - 400), 'enemy', 'normal', 'ghost'));
        for (let i = 0; i < 15; i++) enemies.push(new Tank(2000 + Math.random() * (WORLD_W - 3000), 200 + Math.random() * (WORLD_H - 400), 'enemy', 'heavy', 'charger'));
        for (let i = 0; i < 15; i++) enemies.push(new Tank(2000 + Math.random() * (WORLD_W - 3000), 200 + Math.random() * (WORLD_H - 400), 'enemy', 'heavy', 'venom'));
    }

    let bossX = (lv === 5 || lv === 9) ? WORLD_W / 2 : WORLD_W - 500;
    let bossY = (lv === 5 || lv === 9) ? 500 : WORLD_H / 2;
    let boss = new Tank(bossX, bossY, 'boss');

    const bossNames = ["CÁO CHÍN ĐUÔI", "CHUỘT ĐIỆN ĐỘT BIẾN", "CHIẾN BINH THÉP", "NHỆN CHÚA ĐỊA NGỤC", "BỌ CẠP ĐỘC TÔN", "NGƯỜI ĐÁ KHỔNG LỒ", "DƠI HÚT MÁU", "CUA BĂNG GIÁ", "RỒNG NƯỚC", "CHÚA TỂ HƯ KHÔNG"];
    const bossTypes = ['kyuubi', 'pikachu', 'lubu', 'spider', 'scorpion', 'golem', 'bat', 'crab', 'dragon', 'alien'];
    boss.name = bossNames[lv - 1] || "BÍ ẨN CỔ ĐẠI";
    boss.bossType = bossTypes[lv - 1] || 'alien';
    enemies.push(boss);

    gameState = 'PLAYING';
}

function spawnSurvivalWave() {
    let count = 5 + wave * 3;
    for (let i = 0; i < count; i++) {
        let types = ['light', 'normal'];
        if (wave >= 2) types.push('spider', 'snake', 'charger');
        if (wave >= 3) types.push('kamikaze', 'shield', 'venom');
        if (wave >= 5) types.push('heavy', 'sniper', 'saw', 'ghost');
        if (wave >= 7) types.push('cannon', 'icer', 'rock', 'healer', 'trapper');
        let t = types[Math.floor(Math.random() * types.length)];
        let spawnDistX = (Math.random() > 0.5 ? 1 : -1) * (800 + Math.random() * 600); let spawnDistY = (Math.random() > 0.5 ? 1 : -1) * (800 + Math.random() * 600);
        let e = new Tank(player.x + spawnDistX, player.y + spawnDistY, 'enemy', 'normal', t);
        let waveScale = (wave - 1); e.maxHp *= (1 + waveScale * 0.15); e.hp = e.maxHp; e.baseDmgMult *= (1 + waveScale * 0.1); e.xp *= (1 + waveScale * 0.2); enemies.push(e);
    }
    if (wave % 4 === 0) {
        let elite = new Tank(player.x + 1000, player.y, 'enemy', 'heavy', 'cannon'); elite.radius *= 1.5; elite.maxHp *= 3; elite.hp = elite.maxHp; elite.xp *= 10; elite.isElite = true; elite.color = Math.random() > 0.5 ? '#e74c3c' : '#3498db'; enemies.push(elite); floatTexts.push(new FloatText(elite.x, elite.y - 100, "QUÁI TINH ANH XUẤT HIỆN!", "#e74c3c", 30));
    }
    floatTexts.push(new FloatText(player.x, player.y - 150, "WAVE " + wave, "#f1c40f", 60));
}

function levelCleared() {
    if (gameMode === 'moba') {
        gameState = 'WIN';
        return;
    }
    if (currentLevel < 10) {
        gameState = 'CLEARING'; let notice = document.getElementById('level-clear-notice');
        notice.innerHTML = `HOÀN THÀNH MÀN ${currentLevel}!<br><span style="font-size:30px">Đang chuyển sang màn ${currentLevel + 1}...</span>`; notice.style.display = 'block';
        setTimeout(() => { notice.style.display = 'none'; player.hp = player.maxHp; setupLevel(currentLevel + 1); }, 3000);
    } else gameState = 'WIN';
}