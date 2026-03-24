// ==========================================
// VONG_LAP_GAME.JS - LOGIC XỬ LÝ VA CHẠM VÀ VÒNG LẶP RENDER (TỐI ƯU DELTA TIME)
// ==========================================

function checkCollisions() {
    bullets.forEach(b => {
        if (!b.active)
            return;
        barrels.forEach(barrel => {
            if (barrel.active && Math.hypot(b.x - barrel.x, b.y - barrel.y) < b.radius + barrel.radius) {
                barrel.hp -= b.damage;
                barrel.hitFlash = 5;
                b.active = false;
                if (barrel.hp <= 0) {
                    barrel.active = false;
                    explode(barrel.x, barrel.y, 300, 600);
                }
            }
        }
        );
        for (let w of blockWalls) {
            if (w.active && b.owner === 'player') {
                let dist = Math.hypot(b.x - w.x, b.y - w.y);
                if (dist < 50) {
                    b.active = false;
                    for (let i = 0; i < 5; i++)
                        particles.push(new Particle(b.x,b.y,'#7f8c8d'));
                    w.life -= b.damage;
                    return;
                }
            }
        }

        if (b.owner === 'ally' || b.type === 'player' || b.type === 'trieuvan_attack' || b.type.includes('clone') || b.type === 'shuriken_r' || b.type.includes('pika') || b.type.includes('lubu') || b.type.includes('ichigo') || b.type.includes('thachsanh') || b.type.includes('quancong')) {
            enemies.forEach(e => {
                if (Math.hypot(b.x - e.x, b.y - e.y) < e.radius + b.radius && !b.hitTargets.has(e)) {
                    b.hitTargets.add(e);
                    if (e.heroClass === 'shield') {
                        let angToB = Math.atan2(b.y - e.y, b.x - e.x);
                        let angDiff = Math.abs(angToB - e.angle);
                        while (angDiff > Math.PI)
                            angDiff = Math.abs(angDiff - Math.PI * 2);
                        if (angDiff < Math.PI / 2.5) {
                            b.damage *= 0.1;
                            for (let i = 0; i < 5; i++)
                                particles.push(new Particle(b.x,b.y,'#bdc3c7'));
                        }
                    }
                    if (player.buffs.lifesteal > 0 && b.type === 'player') {
                        let healAmount = b.damage * 0.3;
                        player.hp = Math.min(player.maxHp, player.hp + healAmount);
                        floatTexts.push(new FloatText(player.x + (Math.random() * 20 - 10),player.y - player.radius - 10,"+" + Math.floor(healAmount),"#2ecc71",16));
                    }
                    if (player.buffs.nineTails > 0 && b.type.includes('clone')) {
                        let healAmount = b.damage * 1.0;
                        player.hp = Math.min(player.maxHp, player.hp + healAmount);
                        floatTexts.push(new FloatText(player.x + (Math.random() * 20 - 10),player.y - player.radius - 10,"+" + Math.floor(healAmount),"#2ecc71",16));
                    }

                    if (b.type === 'shuriken_r') {
                        triggerShake(25);
                        explode(b.x, b.y, 250, b.damage);
                        b.active = false;
                    } else if (b.type === 'pika_ball') {
                        triggerShake(5);
                        explode(b.x, b.y, 150, b.damage);
                        b.active = false;
                    } else {
                        if (b.type === 'quancong_r') {
                            e.states.silenced = 60;
                            floatTexts.push(new FloatText(e.x,e.y - 50,"CÂM LẶNG!","#9b59b6",20));
                        }
                        e.hp -= b.damage;
                        e.hitFlash = 5;
                        if (b.isCrit) {
                            floatTexts.push(new FloatText(e.x,e.y - 40,`-${Math.floor(b.damage)} CRIT!`,'#e74c3c',26));
                            triggerShake(5);
                        } else {
                            floatTexts.push(new FloatText(e.x,e.y - 30,`-${Math.floor(b.damage)}`,'#fff',18));
                        }
                        if (player.augVampire && b.owner === 'player') {
                            let healAmount = b.damage * 0.15;
                            player.hp = Math.min(player.maxHp, player.hp + healAmount);
                            floatTexts.push(new FloatText(player.x + (Math.random() * 20 - 10),player.y - player.radius - 20,"+" + Math.floor(healAmount),"#2ecc71",14));
                        }
                        if (b.type === 'lubu_q') {
                            e.states.stunned = 60;
                            floatTexts.push(new FloatText(e.x,e.y - 50,"STUNNED!","#f1c40f",20));
                        }
                        if (player.heroClass === 'lubu' && player.buffs.chienThan > 0) {
                            let healAmount = b.damage * 0.3;
                            player.hp = Math.min(player.maxHp, player.hp + healAmount);
                            floatTexts.push(new FloatText(player.x + (Math.random() * 20 - 10),player.y - player.radius - 10,"+" + Math.floor(healAmount),"#2ecc71",16));
                        }
                        if (player.heroClass === 'trieuvan' && b.type === 'trieuvan_attack')
                            player.applyTrieuVanLifesteal(b.damage);
                        if (b.type === 'clone_slow') {
                            e.states.slowed = 120;
                            floatTexts.push(new FloatText(e.x,e.y - 50,"SLOWED!","#00ffff",15));
                        }
                        if (b.type === 'clone_knockup') {
                            e.states.knockup = 90;
                            floatTexts.push(new FloatText(e.x,e.y - 60,"HẤT TUNG!","red",22));
                        }
                        if (b.type === 'pika_e') {
                            b.bounceCount++;
                            drawLightning(ctx, b.x, b.y, e.x, e.y, '#00ffff');
                            SFX.play('zap');
                            if (b.bounceCount < 4) {
                                let nextT = null;
                                let minD = 500;
                                enemies.forEach(en => {
                                    if (!b.hitTargets.has(en)) {
                                        let d = Math.hypot(en.x - b.x, en.y - b.y);
                                        if (d < minD) {
                                            minD = d;
                                            nextT = en;
                                        }
                                    }
                                }
                                );
                                if (nextT) {
                                    let ang = Math.atan2(nextT.y - b.y, nextT.x - b.x);
                                    b.vx = Math.cos(ang) * b.speed;
                                    b.vy = Math.sin(ang) * b.speed;
                                } else
                                    b.active = false;
                            } else
                                b.active = false;
                        }
                        if (b.type === 'ichigo_q' && b.isBankai)
                            e.states.knockup = 45;
                        if (b.type === 'ichigo_knife') {
                            if (b.distTraveled > b.maxRange * 0.7) {
                                e.states.knockup = 30;
                                floatTexts.push(new FloatText(e.x,e.y - 50,"HẤT TUNG!","red",20));
                            } else {
                                e.states.slowed = 60;
                                let healAmount = b.damage * 0.5;
                                player.hp = Math.min(player.maxHp, player.hp + healAmount);
                                floatTexts.push(new FloatText(e.x,e.y - 50,"SLOW!","#00ffff",16));
                                floatTexts.push(new FloatText(player.x + (Math.random() * 20 - 10),player.y - player.radius - 20,"+" + Math.floor(healAmount),"#2ecc71",16));
                            }
                        }
                        if (b.type === 'thachsanh_e_arrow' || b.type === 'thachsanh_giant_arrow') {
                            e.states.slowed = 60;
                            floatTexts.push(new FloatText(e.x,e.y - 40,"SLOW!","#00ffff",14));
                            if (b.type === 'thachsanh_giant_arrow') {
                                let healAmount = b.damage * 0.50;
                                player.hp = Math.min(player.maxHp, player.hp + healAmount);
                                floatTexts.push(new FloatText(player.x + (Math.random() * 20 - 10),player.y - player.radius - 20,"+" + Math.floor(healAmount),"#2ecc71",16));
                            }
                        }
                        if (!b.type.includes('clone') && b.type !== 'pika_e' && !b.type.includes('lubu') && b.type !== 'ichigo_q' && b.type !== 'ichigo_knife' && b.type !== 'thachsanh_giant_arrow')
                            b.active = false;
                    }
                }
            }
            );
        } else {
            if (Math.hypot(b.x - player.x, b.y - player.y) < player.radius + b.radius) {
                if (player.states.untargetable)
                    return;
                if (player.buffs.shield > 0) {
                    floatTexts.push(new FloatText(player.x,player.y - 30,"BLOCKED","#3498db",20));
                    b.active = false;
                } else {
                    if (b.type === 'spider_web') {
                        player.states.silenced = 120;
                        floatTexts.push(new FloatText(player.x,player.y - 50,"SILENCED!","#9b59b6",20));
                    }
                    if (b.type === 'snake_poison') {
                        player.states.bleeding = 180;
                        floatTexts.push(new FloatText(player.x,player.y - 50,"BLEEDING!","#e74c3c",20));
                    }
                    if (b.type === 'cannon_ball' || b.type === 'boss_rocket') {
                        explode(b.x, b.y, 200, b.damage);
                        b.active = false;
                        return;
                    }
                    player.hp -= b.damage;
                    player.hitFlash = 8;
                    triggerShake(5);
                    if (b.type === 'enemy_stun') {
                        player.states.stunned = 30;
                        floatTexts.push(new FloatText(player.x,player.y - 50,`STUNNED!`,'#f1c40f',20));
                    }
                    document.getElementById('damage-vignette').style.boxShadow = "inset 0 0 100px rgba(255,0,0,0.7)";
                    setTimeout( () => document.getElementById('damage-vignette').style.boxShadow = "inset 0 0 100px rgba(255,0,0,0)", 100);
                    floatTexts.push(new FloatText(player.x,player.y - 30,`-${Math.floor(b.damage)}`,'#e74c3c',22));
                    b.active = false;
                }
            }
            if (b.active && gameMode === 'moba' && typeof allies !== 'undefined' && allies.length > 0) {
                for (const ally of allies) {
                    if (Math.hypot(b.x - ally.x, b.y - ally.y) < ally.radius + b.radius) {
                        ally.hp -= b.damage;
                        ally.hitFlash = 4;
                        b.active = false;
                        break;
                    }
                }
            }
        }
    }
    );

    items.forEach(i => {
        if (!player.states.untargetable && Math.hypot(i.x - player.x, i.y - player.y) < player.radius + i.radius) {
            i.active = false;
            floatTexts.push(new FloatText(player.x,player.y - 60,i.data.text,i.data.color,22));
            if (i.data.id === 'heal')
                player.hp = Math.min(player.maxHp, player.hp + 300);
            if (i.data.id === 'invis')
                player.buffs.invis = 420;
            if (i.data.id === 'spread')
                player.buffs.spread = 420;
            if (i.data.id === 'shield')
                player.buffs.shield = 300;
            if (i.data.id === 'rapid')
                player.buffs.rapid = 300;
            if (i.data.id === 'speed')
                player.buffs.speed = 300;
            if (i.data.id === 'red_buff') {
                player.buffs.redBuff = 900;
                player.hp = player.maxHp;
                floatTexts.push(new FloatText(player.x,player.y - 90,"X2 SÁT THƯƠNG (15s)","#e74c3c",18));
            }
            if (i.data.id === 'blue_buff') {
                player.buffs.blueBuff = 900;
                player.mp = player.maxMp;
                floatTexts.push(new FloatText(player.x,player.y - 90,"HỒI CHIÊU NHANH (15s)","#3498db",18));
            }
        }
    }
    );

    enemies = enemies.filter(e => {
        if (e.hp <= 0) {
            if (player.heroClass === 'thachsanh' && player.buffs.xuyenTamTien > 0) {
                player.buffs.xuyenTamTien += 60;
                floatTexts.push(new FloatText(player.x,player.y - 80,"+1s ULTI!","#f1c40f",18));
            }
            expOrbs.push(new ExpOrb(e.x,e.y,e.xp));
            if (e.type === 'boss') {
                levelCleared();
            }
            if (e.isElite) {
                let buffItem = new Item(e.x,e.y);
                if (e.color === '#e74c3c')
                    buffItem.data = {
                        id: 'red_buff',
                        color: '#e74c3c',
                        text: 'BÙA ĐỎ'
                    };
                else
                    buffItem.data = {
                        id: 'blue_buff',
                        color: '#3498db',
                        text: 'BÙA XANH'
                    };
                items.push(buffItem);
            } else if (Math.random() < 0.25) {
                items.push(new Item(e.x,e.y));
            }
            SFX.play('explosion');
            for (let i = 0; i < 30; i++)
                particles.push(new Particle(e.x,e.y,e.color));
            return false;
        }
        return true;
    }
    );
    allies = allies.filter(a => a.hp > 0);

    bullets = bullets.filter(b => b.active);
    items = items.filter(i => i.active);
    floatTexts = floatTexts.filter(t => t.life > 0);
    zones = zones.filter(z => z.life > 0);
    particles = particles.filter(p => p.life > 0);
    rProjs = rProjs.filter(rp => rp.active);
    expOrbs = expOrbs.filter(eo => eo.active);
    warnings = warnings.filter(w => w.active);
    telegraphs = telegraphs.filter(t => t.active);
    pets = pets.filter(p => p.active);
    blockWalls = blockWalls.filter(w => w.active);
}

// ==========================================
// HỆ THỐNG DELTA TIME - CỐ ĐỊNH BƯỚC NHẢY (FIXED TIME STEP)
// ==========================================
const LOGIC_TICK_RATE = 1000 / 60;
let lastTime = 0;
let accumulator = 0;

function updateGameLogic() {
    if (gameState !== 'PLAYING' && gameState !== 'CLEARING')
        return;

    // Keep mouse world position accurate while camera moves or zoom changes.
    worldMouseX = mouseX / camera.zoom + camera.x;
    worldMouseY = mouseY / camera.zoom + camera.y;

    if (player.hp <= 0 && gameState !== 'LOSE') {
        if (gameMode === 'story' && playerLives > 1) {
            playerLives--;
            player.hp = player.maxHp;
            player.states.untargetable = true;
            setTimeout( () => player.states.untargetable = false, 3000);
            updateLivesUI();
            floatTexts.push(new FloatText(player.x,player.y - 80,"HỒI SINH!","#2ecc71",40));
            triggerShake(20);
        } else {
            gameState = 'LOSE';
            if (gameMode === 'survival') {
                let isNewRecord = false;
                if (wave > highScoreWave) {
                    highScoreWave = wave;
                    localStorage.setItem('bangbang_highestWave', highScoreWave);
                    isNewRecord = true;
                }
                let statsEl = document.getElementById('go-stats');
                statsEl.style.display = 'block';
                statsEl.innerHTML = `WAVE ĐẠT ĐƯỢC: ${wave} <br> KỶ LỤC CAO NHẤT: ${highScoreWave}`;
                if (isNewRecord)
                    statsEl.innerHTML += `<br><span style="color:#f1c40f; font-size:35px; text-shadow:0 0 15px #e67e22;">🔥 KỶ LỤC MỚI! 🔥</span>`;
            } else {
                document.getElementById('go-stats').style.display = 'none';
            }
        }
    }

    player.update();
    enemies.forEach(e => e.update());
    allies.forEach(a => a.update());
    bullets.forEach(b => b.update());
    items.forEach(i => i.update());
    barrels.forEach(b => b.update());
    zones.forEach(z => z.update());
    rProjs.forEach(rp => rp.update());
    floatTexts.forEach(t => t.update());
    particles.forEach(p => p.update());
    expOrbs.forEach(eo => eo.update());
    warnings.forEach(w => w.update());
    telegraphs.forEach(tl => tl.update());
    pets.forEach(p => p.update());
    slashes.forEach(s => s.update());
    slashes = slashes.filter(s => s.life > 0);
    blockWalls.forEach(w => w.update());
    checkCollisions();

    let targetCamX = Math.max(0, Math.min(WORLD_W - camera.w, player.x - camera.w / 2));
    let targetCamY = Math.max(0, Math.min(WORLD_H - camera.h, player.y - camera.h / 2));
    camera.x += (targetCamX - camera.x) * 0.1;
    camera.y += (targetCamY - camera.y) * 0.1;

    if (screenShake > 0) {
        screenShake *= 0.9;
        if (screenShake < 0.5)
            screenShake = 0;
    }

    if (gameMode === 'survival' && enemies.length === 0) {
        wave++;
        spawnSurvivalWave();
        if (wave % 2 === 0)
            barrels.push(new Barrel(player.x + (Math.random() - 0.5) * 1200,player.y + (Math.random() - 0.5) * 1200));
    }
    if (gameMode === 'moba' && typeof mobaSpawners !== 'undefined') {
        if (typeof mobaMatchTimer !== 'undefined' && mobaMatchTimer > 0) {
            mobaMatchTimer--;
            const remainSec = Math.ceil(mobaMatchTimer / 60);
            const mm = Math.floor(remainSec / 60);
            const ss = String(remainSec % 60).padStart(2, '0');
            const mobaClockEl = document.getElementById('ui-current-level');
            if (mobaClockEl)
                mobaClockEl.innerText = `MOBA ${mm}:${ss}`;

            if (mobaMatchTimer <= 0) {
                gameState = 'LOSE';
                const statsEl = document.getElementById('go-stats');
                if (statsEl) {
                    statsEl.style.display = 'block';
                    statsEl.innerHTML = `HẾT GIỜ 30:00<br>TRẬN MOBA KẾT THÚC`;
                }
                return;
            }
        }

        for (const key of Object.keys(mobaSpawners)) {
            const sp = mobaSpawners[key];
            sp.cooldown--;
            if (sp.cooldown <= 0) {
                spawnLaneCreeps(sp);
                sp.cooldown = 30 * 60;
                mobaWave = Math.max(mobaWave, sp.wave);
            }
        }

        if (typeof mobaTowers !== 'undefined' && mobaTowers.length > 0) {
            const allyCore = mobaTowers.find(t => t.id === 'ally_core');
            const enemyCore = mobaTowers.find(t => t.id === 'enemy_core');
            if (allyCore && allyCore.hp <= 0) {
                gameState = 'LOSE';
                return;
            }
            if (enemyCore && enemyCore.hp <= 0) {
                gameState = 'WIN';
                return;
            }
        }
    }
    barrels = barrels.filter(b => b.active);
}

// --- HÀM VẼ TẦM CHIÊU VÀ TÂM KHÓA MỤC TIÊU ---
function drawAimIndicator(ctx, player, skillKey) {
    let aimData = SKILL_AIM[player.heroClass]?.[skillKey];
    if (!aimData)
        return;

    if (player.heroClass === 'quancong' && skillKey === 'e' && player.qcEStage === 2)
        aimData = {
            type: 'target',
            range: 600
        };
    if (player.heroClass === 'lubu' && skillKey === 'space' && player.lubuRStage === 3)
        aimData = {
            type: 'aoe',
            range: 700,
            radius: 150
        };

    let mouseDist = Math.hypot(worldMouseX - player.x, worldMouseY - player.y);
    let angle = Math.atan2(worldMouseY - player.y, worldMouseX - player.x);

    ctx.save();
    ctx.translate(player.x, player.y);

    // Vòng tròn tầm giới hạn tối đa
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, aimData.range || 600, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    let themeColor = 'rgba(52, 152, 219,';
    // Xanh biển nhạt
    if (aimData.type === 'target')
        themeColor = 'rgba(231, 76, 60,';
    // Đỏ nhạt

    if (aimData.type === 'skillshot' || aimData.type === 'dash') {
        let range = aimData.range || 600;
        let w = aimData.width || 40;
        ctx.rotate(angle);
        ctx.fillStyle = themeColor + '0.25)';
        ctx.strokeStyle = themeColor + '0.8)';
        ctx.beginPath();
        ctx.rect(0, -w / 2, range, w);
        ctx.fill();
        ctx.stroke();
    } else if (aimData.type === 'cone') {
        let range = aimData.range || 400;
        let a = aimData.angle || Math.PI / 3;
        ctx.rotate(angle);
        ctx.fillStyle = themeColor + '0.25)';
        ctx.strokeStyle = themeColor + '0.8)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, range, -a / 2, a / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (aimData.type === 'aoe') {
        let radius = aimData.radius || 150;
        let range = aimData.range || 600;
        let d = Math.min(mouseDist, range);
        let cx = Math.cos(angle) * d;
        let cy = Math.sin(angle) * d;

        ctx.fillStyle = themeColor + '0.25)';
        ctx.strokeStyle = themeColor + '0.8)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    } else if (aimData.type === 'target') {
        let range = aimData.range || 600;
        let target = null;
        let minDist = 300;
        enemies.forEach(e => {
            let dMouse = Math.hypot(e.x - worldMouseX, e.y - worldMouseY);
            let dPlayer = Math.hypot(e.x - player.x, e.y - player.y);
            if (dMouse < minDist && dPlayer <= range) {
                minDist = dMouse;
                target = e;
            }
        }
        );

        if (target) {
            ctx.restore();
            ctx.save();
            ctx.translate(target.x, target.y);
            ctx.rotate(Date.now() * 0.005);
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 3;
            let tr = target.radius + 20;
            ctx.beginPath();
            ctx.arc(0, 0, tr, 0, Math.PI * 2);
            ctx.stroke();
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(tr, 0);
                ctx.lineTo(tr + 15, 0);
                ctx.stroke();
                ctx.rotate(Math.PI / 2);
            }
            ctx.restore();
            ctx.save();
        } else {
            ctx.rotate(angle);
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.4)';
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(range, 0);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    } else if (aimData.type === 'self') {
        let radius = aimData.range || player.radius + 20;
        ctx.fillStyle = themeColor + '0.25)';
        ctx.strokeStyle = themeColor + '0.8)';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}

function drawGameGraphics() {
    if (gameState === 'WIN' || gameState === 'LOSE') {
        bgmGame.pause();
        document.getElementById('game-over').style.display = 'flex';
        document.getElementById('go-title').innerText = gameState === 'WIN' ? 'CHINH PHỤC THÀNH CÔNG!' : 'XE TĂNG ĐÃ NỔ!';
        document.getElementById('go-title').style.color = gameState === 'WIN' ? '#f1c40f' : '#e74c3c';
        return;
    }

    if (gameState !== 'PLAYING' && gameState !== 'CLEARING')
        return;

    let shakeOffX = 0;
    let shakeOffY = 0;
    if (screenShake > 0) {
        shakeOffX = (Math.random() - 0.5) * screenShake;
        shakeOffY = (Math.random() - 0.5) * screenShake;
    }

    ctx.save();
    ctx.translate(shakeOffX, shakeOffY);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);
    if (gameMode === 'moba' && typeof mobaMapImage !== 'undefined' && mobaMapImage.complete && mobaMapImage.naturalWidth > 0) {
        ctx.drawImage(mobaMapImage, 0, 0, WORLD_W, WORLD_H);
    } else {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(camera.x, camera.y, camera.w, camera.h);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        let sX = Math.floor(camera.x / 100) * 100;
        let sY = Math.floor(camera.y / 100) * 100;
        for (let i = sX; i < camera.x + camera.w + 100; i += 100) {
            ctx.beginPath();
            ctx.moveTo(i, camera.y - 100);
            ctx.lineTo(i, camera.y + camera.h + 100);
            ctx.stroke();
        }
        for (let i = sY; i < camera.y + camera.h + 100; i += 100) {
            ctx.beginPath();
            ctx.moveTo(camera.x - 100, i);
            ctx.lineTo(camera.x + camera.w + 100, i);
            ctx.stroke();
        }
    }

    ctx.lineWidth = 4;
    walls.forEach(w => {
        ctx.fillStyle = w.fill || '#444';
        ctx.strokeStyle = w.stroke || '#222';
        ctx.fillRect(w.x, w.y, w.w, w.h);
        ctx.strokeRect(w.x, w.y, w.w, w.h);
    }
    );

    if (gameMode === 'moba' && typeof mobaTowers !== 'undefined') {
        mobaTowers.forEach(t => {
            ctx.save();
            ctx.translate(t.x, t.y);
            ctx.fillStyle = t.team === 'ally' ? 'rgba(0, 126, 252, 0.22)' : 'rgba(94, 0, 245, 0.22)';
            ctx.strokeStyle = t.team === 'ally' ? '#4aa3ff' : '#e74c3c';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            const hpPct = Math.max(0, t.hp) / t.maxHp;
            ctx.fillStyle = '#000';
            ctx.fillRect(-45, -t.radius - 18, 90, 8);
            ctx.fillStyle = t.team === 'ally' ? '#4aa3ff' : '#e74c3c';
            ctx.fillRect(-45, -t.radius - 18, 90 * hpPct, 8);
            ctx.restore();
        });

    }
    if (gameMode === 'moba' && window.showMobaSurface) {
        // Debug overlay: show collision surface and bushes on top of map image.
        ctx.save();
        ctx.fillStyle = 'rgba(0, 170, 255, 0.18)';
        ctx.strokeStyle = 'rgba(0, 220, 255, 0.85)';
        ctx.lineWidth = 2;
        walls.forEach(w => {
            ctx.fillRect(w.x, w.y, w.w, w.h);
            ctx.strokeRect(w.x, w.y, w.w, w.h);
        });

        ctx.fillStyle = 'rgba(46, 204, 113, 0.22)';
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.9)';
        bushes.forEach(b => {
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.strokeRect(b.x, b.y, b.w, b.h);
        });
        mobaHpZones.forEach(z => {
            ctx.fillStyle = 'rgba(0, 170, 255, 0.18)';
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.85)';
            ctx.lineWidth = 2;
            ctx.fillRect(z.x, z.y, z.radius, z.radius);
            ctx.strokeRect(z.x, z.y, z.radius, z.radius);
        });
              

        // Center marker helps anchoring coordinates while tuning.
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(WORLD_W / 2 - 40, WORLD_H / 2);
        ctx.lineTo(WORLD_W / 2 + 40, WORLD_H / 2);
        ctx.moveTo(WORLD_W / 2, WORLD_H / 2 - 40);
        ctx.lineTo(WORLD_W / 2, WORLD_H / 2 + 40);
        ctx.stroke();
        ctx.restore();
    }
    if (gameMode === 'moba' && window.showMobaLaneFrames && typeof mobaLanePaths !== 'undefined') {
        const drawLaneFrame = (lanePath, laneName, teamName) => {
            if (!lanePath || lanePath.length < 2)
                return;
            const laneColor = teamName === 'ally' ? '#4aa3ff' : '#ff6b6b';
            const laneFill = teamName === 'ally' ? 'rgba(74, 163, 255, 0.11)' : 'rgba(255, 107, 107, 0.11)';
            const laneWidth = 150;

            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Corridor surface for quick lane-width tuning.
            ctx.strokeStyle = laneFill;
            ctx.lineWidth = laneWidth;
            ctx.beginPath();
            ctx.moveTo(lanePath[0].x, lanePath[0].y);
            for (let i = 1; i < lanePath.length; i++)
                ctx.lineTo(lanePath[i].x, lanePath[i].y);
            ctx.stroke();

            // Center line and frame border.
            ctx.strokeStyle = laneColor;
            ctx.lineWidth = 5;
            ctx.setLineDash([16, 10]);
            ctx.beginPath();
            ctx.moveTo(lanePath[0].x, lanePath[0].y);
            for (let i = 1; i < lanePath.length; i++)
                ctx.lineTo(lanePath[i].x, lanePath[i].y);
            ctx.stroke();
            ctx.setLineDash([]);

            // Waypoint handles.
            lanePath.forEach((pt, idx) => {
                ctx.fillStyle = laneColor;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                if (idx === 0 || idx === lanePath.length - 1) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 16px Arial';
                    ctx.textAlign = 'left';
                    ctx.fillText(`${laneName.toUpperCase()} ${teamName}`, pt.x + 12, pt.y - 10);
                }
            });
            ctx.restore();
        };

        ['top', 'mid', 'bot'].forEach(laneName => {
            const laneData = mobaLanePaths[laneName];
            if (!laneData)
                return;
            // drawLaneFrame(laneData.ally, laneName, 'ally');
            drawLaneFrame(laneData.enemy, laneName, 'enemy');
        });
    }
    if (player.heroClass === 'lubu' && player.lubuRDelay > 0) {
        ctx.save();
        ctx.translate(player.lubuRTarget.x, player.lubuRTarget.y);
        ctx.rotate(Date.now() * 0.01);
        let p = player.lubuRDelay / 60;
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 150 * p, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 150, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
        ctx.beginPath();
        ctx.moveTo(-160, 0);
        ctx.lineTo(160, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -160);
        ctx.lineTo(0, 160);
        ctx.stroke();
        ctx.restore();
    }

    bushes.forEach(b => b.draw());
    expOrbs.forEach(eo => eo.draw());
    items.forEach(i => i.draw());
    zones.forEach(z => z.draw());
    warnings.forEach(w => w.draw());
    telegraphs.forEach(tl => tl.draw());
    rProjs.forEach(rp => rp.draw());
    slashes.forEach(s => s.draw());
    bullets.forEach(b => b.draw());
    particles.forEach(p => p.draw());
    blockWalls.forEach(w => w.draw());
    allies.forEach(a => a.draw());
    enemies.forEach(e => e.draw());
    pets.forEach(p => p.draw());
    player.draw();
    floatTexts.forEach(t => t.draw());
    barrels.forEach(b => b.draw());

    if (aimingSkill && player && player.hp > 0 && !player.states.untargetable) {
        drawAimIndicator(ctx, player, aimingSkill);
    }

    ctx.restore();

    let boss = enemies.find(e => e.type === 'boss');
    if (boss && Math.hypot(player.x - boss.x, player.y - boss.y) < 1800) {
        ctx.fillStyle = '#000';
        ctx.fillRect(canvas.width / 2 - 300, 20, 600, 25);
        ctx.fillStyle = '#8e44ad';
        ctx.fillRect(canvas.width / 2 - 300, 20, 600 * (Math.max(0, boss.hp) / boss.maxHp), 25);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(canvas.width / 2 - 300, 20, 600, 25);
        ctx.fillStyle = '#fff';
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${boss.name}: ${Math.floor(Math.max(0, boss.hp))}`, canvas.width / 2, 38);
    }

    const miniW = miniCanvas.width;
    const miniH = miniCanvas.height;
    miniCtx.clearRect(0, 0, miniW, miniH);

    const scX = miniW / WORLD_W;
    const scY = miniH / WORLD_H;

    if (gameMode === 'moba' && typeof mobaMapImage !== 'undefined' && mobaMapImage.complete && mobaMapImage.naturalWidth > 0) {
        miniCtx.globalAlpha = 0.9;
        miniCtx.drawImage(mobaMapImage, 0, 0, miniW, miniH);
        miniCtx.globalAlpha = 1;
    } else {
        miniCtx.fillStyle = '#101722';
        miniCtx.fillRect(0, 0, miniW, miniH);
        miniCtx.fillStyle = 'rgba(128, 138, 150, 0.85)';
        walls.forEach(w => miniCtx.fillRect(w.x * scX, w.y * scY, w.w * scX, w.h * scY));
        miniCtx.fillStyle = 'rgba(46, 204, 113, 0.8)';
        bushes.forEach(b => miniCtx.fillRect(b.x * scX, b.y * scY, b.w * scX, b.h * scY));
    }

    if (boss) {
        miniCtx.fillStyle = '#b26cff';
        miniCtx.beginPath();
        miniCtx.arc(boss.x * scX, boss.y * scY, 4, 0, Math.PI * 2);
        miniCtx.fill();
    }

    miniCtx.fillStyle = '#ff5c5c';
    enemies.forEach(e => {
        if (e.type === 'boss')
            return;
        miniCtx.fillRect(e.x * scX - 1.5, e.y * scY - 1.5, 3, 3);
    });
    if (typeof allies !== 'undefined' && allies.length > 0) {
        miniCtx.fillStyle = '#59b0ff';
        allies.forEach(a => miniCtx.fillRect(a.x * scX - 1.5, a.y * scY - 1.5, 3, 3));
    }

    if (!player.states.untargetable) {
        miniCtx.fillStyle = '#00d2ff';
        miniCtx.beginPath();
        miniCtx.arc(player.x * scX, player.y * scY, 4, 0, Math.PI * 2);
        miniCtx.fill();
    }

    miniCtx.strokeStyle = '#ffffff';
    miniCtx.lineWidth = 1.5;
    miniCtx.strokeRect(camera.x * scX, camera.y * scY, camera.w * scX, camera.h * scY);
}

function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);

    if (gameState === 'AUGMENT')
        return;

    if (!timestamp)
        timestamp = performance.now();
    let frameTime = timestamp - lastTime;

    if (frameTime > 250)
        frameTime = 250;
    lastTime = timestamp;

    accumulator += frameTime;

    while (accumulator >= LOGIC_TICK_RATE) {
        updateGameLogic();
        accumulator -= LOGIC_TICK_RATE;
    }

    drawGameGraphics();
}

function startGame() {
    playerName = document.getElementById('player-name-input').value.trim() || 'Player';
    document.getElementById('lobby-screen').style.display = 'none';
    let instTitle = document.getElementById('inst-title');
    let instContent = document.getElementById('inst-content');

    if (gameMode === 'story') {
        instTitle.innerText = "CHẾ ĐỘ CỐT TRUYỆN (10 MÀN)";
        instContent.innerHTML = `
            <ul style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 15px;"><b>🎯 Nhiệm vụ tối thượng:</b> Chinh phục liên tiếp <b>10 Màn chơi</b> với độ khó tăng dần để giải cứu Đa Vũ Trụ. Bạn được hệ thống cấp <b>❤️ 3 Mạng (Hồi sinh tại chỗ)</b> - hãy trân trọng từng cơ hội!</li>
                <li style="margin-bottom: 15px;"><b>🗺️ Địa hình hiểm trở:</b> Trải nghiệm chiến đấu nghẹt thở qua nhiều môi trường: từ luồn lách trong hang động chật hẹp, lội ngược dòng suối xiết, đến việc sống sót giữa tâm địa ngục dung nham.</li>
                <li style="margin-bottom: 15px;"><b>👹 Đối đầu Cực Hạn:</b> Chạm trán 7 loại quái vật mới (Trâu điên, Sên độc, Thạch băng...). Đặc biệt, <b>Boss Trấn Ải có ngoại hình độc dị và tung 5 chiêu ngập màn hình</b>. Tuy nhiên chúng xài chiêu chậm, đây là cơ hội để bạn trổ tài "múa phím" né chiêu!</li>
            </ul>`;
    } else if (gameMode === 'practice') {
        instTitle.innerText = "PHÒNG TẬP THỜI GIAN";
        instContent.innerHTML = `
            <ul style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 15px;"><b>🎯 Mục tiêu:</b> Nơi lý tưởng để bạn làm quen với bộ kỹ năng, kiểm tra sát thương (DPS) và sáng tạo các chuỗi Combo hủy diệt.</li>
                <li style="margin-bottom: 15px;"><b>🤖 Quái gỗ huấn luyện:</b> Những bao cát di động máu vô hạn, di chuyển siêu chậm và hoàn toàn vô hại. Có sẵn Bùa Xanh/Đỏ để test sức mạnh max tầm.</li>
                <li style="margin-bottom: 15px;"><b>💡 Mẹo:</b> Nhấn phím <b>F5</b> để trở về Sảnh Chờ bất cứ lúc nào bạn muốn đổi xe tăng khác.</li>
            </ul>`;
    } else if (gameMode === 'moba') {
        instTitle.innerText = "BẢN ĐỒ MOBA 3 ĐƯỜNG";
        instContent.innerHTML = `
            <ul style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 15px;"><b>🛣️ 3 lane cổ điển:</b> Bản đồ chia thành Top/Mid/Bot với khu rừng và bụi cỏ để ẩn nấp.</li>
                <li style="margin-bottom: 15px;"><b>🌊 Lính theo đợt:</b> Quái địch sẽ spawn theo từng wave, mạnh dần theo thời gian.</li>
                <li style="margin-bottom: 15px;"><b>🏹 Cách chơi:</b> Farm, giữ vị trí, dọn wave và tiến sâu vào căn cứ đối phương để tiêu diệt Boss.</li>
            </ul>`;
    } else {
        instTitle.innerText = "SINH TỒN VÔ TẬN";
        instContent.innerHTML = `
            <ul style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 15px;"><b>🌊 Cơn lốc quái vật:</b> Đối mặt với những đợt tấn công (Wave) không hồi kết. Sức mạnh, tốc độ và số lượng quái vật sẽ tiến hóa điên cuồng. Liệu bạn có thể phá vỡ Kỷ Lục?</li>
                <li style="margin-bottom: 15px;"><b>🧬 Đột biến Gen (Lõi Công Nghệ):</b> Nhặt Ngọc Kinh Nghiệm để thăng cấp. Cứ <b>mỗi 5 Cấp Độ</b>, thời gian sẽ đóng băng để bạn lựa chọn 1 trong 3 <b>Lõi Công Nghệ</b> giúp thăng tiến sức mạnh vượt bậc.</li>
                <li style="margin-bottom: 15px;"><b>🧨 Chiến thuật bản đồ:</b> Bắn nổ các <b>Thùng TNT</b> để thiêu rụi bầy quái, và rình rập săn lùng <b>Quái Tinh Anh (Elite)</b> xuất hiện mỗi 4 Wave để đoạt lấy Bùa Đỏ/Xanh đầy quyền năng!</li>
            </ul>`;
    }
    document.getElementById('instruction-screen').style.display = 'flex';
}

function actuallyStartGame() {
    document.getElementById('instruction-screen').style.display = 'none';
    document.getElementById('hud-wrapper').style.display = 'flex';
    document.getElementById('minimap-container').style.display = 'block';
    SFX.init();
    bgmLobby.pause();
    bgmGame.play().catch(e => console.log("Cần tương tác để phát nhạc: ", e));
    player = new Tank(0,0,'player','normal',selectedTankID);
    playerLives = 3;
    document.getElementById('ui-lives-row').style.display = gameMode === 'story' ? 'flex' : 'none';
    updateLivesUI();
    setupHUD();
    setupTooltips();
    setupLevel(1);

    lastTime = performance.now();
    requestAnimationFrame(gameLoop);

    document.getElementById('settings-btn').style.display = 'block';
    if (document.querySelector('#ui-q .skill-key')) {
        ['q', 'e', 'r', 'space'].forEach(k => document.querySelector('#ui-' + k + ' .skill-key').innerText = keybindDisplay[k]);
    }
}
