// ==========================================
// NHAN_VAT_LOGIC.JS - QUẢN LÝ THÔNG SỐ, CHIÊU THỨC VÀ AI (BỘ NÃO)
// ==========================================

class Tank {
    constructor(x, y, type = 'player', tier = 'normal', heroClass = 'kyuubi', isInZoneHp = false) {
        this.x = x; this.y = y; this.type = type; this.tier = tier; this.heroClass = heroClass;
        this.isInZoneHp = !!isInZoneHp;
        if (type === 'boss') {
            this.radius = 90; this.maxHp = 8000 * currentLevel; this.baseSpeed = 1.0; this.color = '#8e44ad'; this.xp = 5000;
            if (currentLevel >= 10) this.maxHp = 80000;
        } else if (type === 'player') {
            this.radius = 30; this.maxHp = 500; this.baseSpeed = 3.2; this.color = '#e67e22'; this.maxMp = 100; this.mp = this.maxMp;
            this.level = 1; this.maxLevel = 50; this.xp = 0; this.baseDmgMult = 1.0;
            if (this.heroClass === 'trieuvan') { this.maxHp *= 1.1; this.hp = this.maxHp; this.baseSpeed *= 1.15; this.speed = this.baseSpeed; this.baseDmgMult *= 1.1; }
            
            // --- THÊM THÔNG SỐ PHƯỢNG HOÀNG LỬA ---
            else if (this.heroClass === 'phuonghoang') { 
                this.maxHp = 450; this.hp = 450; this.baseSpeed = 3.5; this.speed = this.baseSpeed; this.baseDmgMult = 1.1; this.color = '#e74c3c'; 
                this.skills = { q: new Skill(480, 15), e: new Skill(180, 15), r: new Skill(300, 20), space: new Skill(900, 40) }; 
                this.heroImage = imgPhuongHoang; 
                this.isImageBased = true; 
                this.imageAngleOffset = 0; 
                this.phAura = 0; this.phEgg = 0; this.phECastLeft = 0; this.phEWindow = 0;
            }
        } else {
            let scale = typeof currentLevel !== 'undefined' ? 1 + (currentLevel - 1) * 0.5 : 1;
            if (tier === 'light') { this.radius = 20; this.maxHp = 80 * scale; this.baseSpeed = 3.8; this.color = '#f1c40f'; this.xp = 15; } else if (tier === 'heavy') { this.radius = 50; this.maxHp = 400 * scale; this.baseSpeed = 1.2; this.color = '#c0392b'; this.xp = 50; } else { this.radius = 30; this.maxHp = 150 * scale; this.baseSpeed = 2.0; this.color = '#3498db'; this.xp = 25; }
            this.baseDmgMult = scale;

            if (heroClass === 'kamikaze') { this.radius = 25; this.maxHp = 60 * scale; this.baseSpeed = 6.5; this.color = '#9b59b6'; }
            if (heroClass === 'sniper') { this.radius = 25; this.maxHp = 100 * scale; this.baseSpeed = 1.5; this.color = '#2ecc71'; }
            if (heroClass === 'spread') { this.radius = 35; this.maxHp = 180 * scale; this.baseSpeed = 2.6; this.color = '#e67e22'; }
            if (heroClass === 'machinegun') { this.radius = 30; this.maxHp = 150 * scale; this.baseSpeed = 3.2; this.color = '#e74c3c'; }
            if (heroClass === 'shield') { this.radius = 35; this.maxHp = 600 * scale; this.baseSpeed = 1.5; this.color = '#7f8c8d'; }
            if (heroClass === 'melee') { this.radius = 25; this.maxHp = 200 * scale; this.baseSpeed = 4.8; this.color = '#d35400'; }
            if (heroClass === 'spider') { this.radius = 28; this.maxHp = 120 * scale; this.baseSpeed = 3.0; this.color = '#8e44ad'; }
            if (heroClass === 'cannon') { this.radius = 55; this.maxHp = 800 * scale; this.baseSpeed = 1.2; this.color = '#2c3e50'; }
            if (heroClass === 'waller') { this.radius = 40; this.maxHp = 250 * scale; this.baseSpeed = 2.2; this.color = '#f39c12'; }
            if (heroClass === 'snake') { this.radius = 20; this.maxHp = 150 * scale; this.baseSpeed = 4.2; this.color = '#27ae60'; }
            if (heroClass === 'dummy') { this.radius = 40; this.maxHp = 9999999; this.baseSpeed = 1.0; this.color = '#e67e22'; }
            if (heroClass === 'saw') { this.radius = 30; this.maxHp = 180 * scale; this.baseSpeed = 4.8; this.color = '#7f8c8d'; }
            if (heroClass === 'archer') { this.radius = 25; this.maxHp = 100 * scale; this.baseSpeed = 3.5; this.color = '#27ae60'; }
            if (heroClass === 'rock') { this.radius = 45; this.maxHp = 1500 * scale; this.baseSpeed = 1.0; this.color = '#95a5a6'; }
            if (heroClass === 'dog') { this.radius = 18; this.maxHp = 80 * scale; this.baseSpeed = 6.2; this.color = '#d35400'; }
            if (heroClass === 'ghost') { this.radius = 25; this.maxHp = 120 * scale; this.baseSpeed = 3.0; this.color = 'rgba(236, 240, 241, 0.6)'; this.isGhost = true; }
            if (heroClass === 'healer') { this.radius = 25; this.maxHp = 150 * scale; this.baseSpeed = 2.6; this.color = '#2ecc71'; }
            if (heroClass === 'trapper') { this.radius = 30; this.maxHp = 200 * scale; this.baseSpeed = 2.2; this.color = '#e67e22'; }
            if (heroClass === 'charger') { this.radius = 40; this.maxHp = 800 * scale; this.baseSpeed = 5.5; this.color = '#e74c3c'; } 
            if (heroClass === 'venom') { this.radius = 45; this.maxHp = 1200 * scale; this.baseSpeed = 1.5; this.color = '#8e44ad'; } 
            if (heroClass === 'icer') { this.radius = 50; this.maxHp = 1000 * scale; this.baseSpeed = 1.2; this.color = '#00ffff'; } 
        }

        this.hp = this.maxHp; this.speed = this.baseSpeed; this.angle = 0; this.targetAngle = 0; this.bodyAngle = 0; this.targetBodyAngle = 0; this.trackOffset = 0; this.atkCooldown = 0;
        this.buffs = { invis: 0, spread: 0, attackSpeed: 0, cloneAttacks: 0, nineTails: 0, shield: 0, rapid: 0, speed: 0, lifesteal: 0, pikaQ: 0, pikaR: 0, trieuvanQ: 0, trieuvanR: 0, chienThan: 0 };
        this.states = { slowed: 0, knockup: 0, silenced: 0, stunned: 0, bleeding: 0, untargetable: false }; this.hitFlash = 0;

        if (this.type === 'player') {
            if (this.heroClass === 'kyuubi') { this.skills = { q: new Skill(300, 15), e: new Skill(480, 25), r: new Skill(480, 30), space: new Skill(900, 50) }; }
            else if (this.heroClass === 'pikachu') { this.skills = { q: new Skill(300, 15), e: new Skill(180, 25), r: new Skill(420, 30), space: new Skill(1200, 50) }; }
            else if (this.heroClass === 'trieuvan') { this.skills = { q: new Skill(180, 10), e: new Skill(180, 15), r: new Skill(420, 20), space: new Skill(600, 30) }; this.hitTargetsE = new Set(); }
            else if (this.heroClass === 'lubu') { this.skills = { q: new Skill(180, 10), e: new Skill(180, 10), r: new Skill(900, 30), space: new Skill(300, 20) }; this.passiveCrit = false; this.lubuRStage = 1; this.lubuRDelay = 0; this.lubuRTarget = { x: 0, y: 0 }; }
            else if (this.heroClass === 'ichigo') {
                this.maxHp = 450; this.hp = 450; this.baseSpeed = 3.6; this.speed = this.baseSpeed; this.baseDmgMult = 1.2;
                this.skills = { q: new Skill(240, 15), e: new Skill(60, 5), r: new Skill(900, 30), space: new Skill(300, 50) };
                this.heroImage = new Image();
                this.heroImage.src = 'tank/ichigo.png';
                this.isImageBased = true;
                this.imageAngleOffset = -Math.PI / 2; 
                this.barHpOffset = -this.radius * 1.5;
            }
            else if (this.heroClass === 'thachsanh') { this.maxHp = 500; this.hp = 500; this.baseSpeed = 3.8; this.speed = this.baseSpeed; this.baseDmgMult = 1.0; this.color = '#f1c40f'; this.skills = { q: new Skill(300, 15), e: new Skill(360, 20), r: new Skill(720, 30), space: new Skill(1200, 50) }; }
            else if (this.heroClass === 'quancong') {
                this.maxHp = 1050; this.hp = 1050; this.baseSpeed = 3.5; this.speed = this.baseSpeed; this.baseDmgMult = 1.15; this.color = '#27ae60';
                this.skills = { q: new Skill(300, 5), e: new Skill(420, 10), r: new Skill(420, 15), space: new Skill(1200, 30) };
                this.qcEStage = 1; this.qcETarget = null; this.qcEWindow = 0;
                this.heroImage = new Image();
                this.heroImage.src = 'music/quan_cong.png';
                this.isImageBased = true;
                this.imageAngleOffset = 0; 
            }
            this.dashTimer = 0; this.dashAngle = 0; this.dashTrail = [];
        } else {
            this.aggro = false; this.patrolAngle = Math.random() * Math.PI * 2; this.patrolTimer = 0;
            this.skillCooldown = 180; this.isCasting = false; this.castTimer = 0;
            this.jumpTimer = 0; this.rocketVolley = 0;
        }
    }

    castBossSkill(skill) {
        if (skill === 'rockets') { this.rocketVolley = 90; floatTexts.push(new FloatText(this.x, this.y - 120, "MƯA TÊN LỬA!", "#e74c3c", 30)); }
        else if (skill === 'blackhole') { zones.push(new BlackHoleZone(player.x, player.y, 450)); floatTexts.push(new FloatText(this.x, this.y - 120, "HỐ ĐEN!", "#9b59b6", 30)); }
        else if (skill === 'jump') { this.jumpTimer = 90; this.jumpTarget = { x: Math.max(150, Math.min(WORLD_W - 150, player.x)), y: Math.max(150, Math.min(WORLD_H - 150, player.y)) }; warnings.push(new AoeWarning(this.jumpTarget.x, this.jumpTarget.y, 350, 90, 'shockwave', 300)); floatTexts.push(new FloatText(this.x, this.y - 120, "TRỜI SẬP!", "#f1c40f", 30)); }
        else if (skill === 'laser8') { for (let i = 0; i < 8; i++) { telegraphs.push(new LaserTelegraph(this, this.x + Math.cos(i * Math.PI / 4) * 100, this.y + Math.sin(i * Math.PI / 4) * 100, 90, 250)); } floatTexts.push(new FloatText(this.x, this.y - 120, "LAZE HỦY DIỆT!", "#00ffff", 30)); }
        else if (skill === 'summon') { for (let i = 0; i < 4; i++) { let spawnType = ['venom', 'charger', 'icer'][Math.floor(Math.random() * 3)]; let e = new Tank(this.x + (Math.random() - 0.5) * 300, this.y + (Math.random() - 0.5) * 300, 'enemy', 'heavy', spawnType); e.maxHp *= 0.5; e.hp = e.maxHp; enemies.push(e); particles.push(new Particle(e.x, e.y, '#9b59b6')); } floatTexts.push(new FloatText(this.x, this.y - 120, "GỌI ĐỆ!", "#2ecc71", 30)); }
    }

    gainXp(amount) { if (this.level >= this.maxLevel) return; this.xp += amount; let reqXp = this.level * 60; while (this.xp >= reqXp && this.level < this.maxLevel) { this.xp -= reqXp; this.level++; this.maxHp += 75; this.hp = Math.min(this.maxHp, this.hp + 225); this.baseDmgMult += 0.225; SFX.play('levelup'); triggerShake(15); floatTexts.push(new FloatText(this.x, this.y - this.radius - 40, "LEVEL UP!", "#f1c40f", 35)); document.getElementById('ui-lv').innerText = this.level; reqXp = this.level * 60; if (this.type === 'player' && this.level % 5 === 0) { setTimeout(() => { if (typeof showAugments === 'function') showAugments(); }, 1000); } } let percent = (this.xp / (this.level * 60)) * 100; if (this.level === this.maxLevel) percent = 100; document.getElementById('ui-exp-bar').style.width = percent + '%'; }
    
    applyTrieuVanLifesteal(dmg) { let heal = dmg * 0.2; this.hp = Math.min(this.maxHp, this.hp + heal); floatTexts.push(new FloatText(this.x + (Math.random() * 20 - 10), this.y - this.radius - 10, "+" + Math.floor(heal), "#2ecc71", 16)); }

    update() {
        if (this.hitFlash > 0) this.hitFlash--; for (let k in this.buffs) if (this.buffs[k] > 0 && k !== 'cloneAttacks') this.buffs[k]--; for (let k in this.states) if (this.states[k] > 0) this.states[k]--;
        if (this.type === 'player' && this.mp < this.maxMp) this.mp = Math.min(this.maxMp, this.mp + 0.15);
        if (gameMode === 'moba' && typeof isInZoneHp === 'function') {
            const zoneTeam = this.type === 'player' ? 'ally' : (this.team || 'enemy');
            this.isInZoneHp = isInZoneHp(this.x, this.y, zoneTeam);
            if (this.isInZoneHp) {
                const regen = this.maxHp * (this.type === 'player' ? 0.01 : 0.0045);
                this.hp = Math.min(this.maxHp, this.hp + regen);
            }
        } else {
            this.isInZoneHp = false;
        }
        if (this.states.bleeding > 0 && this.states.bleeding % 15 === 0) { this.hp -= 5; floatTexts.push(new FloatText(this.x, this.y - 20, "-5", "red", 14)); }
        if (this.states.knockup > 0 || this.states.stunned > 0) return;

        let currentSpeed = this.speed; 
        if (this.states.slowed > 0) currentSpeed *= 0.3; 
        if (this.buffs.speed > 0) currentSpeed *= 1.5; 
        currentSpeed = Math.min(currentSpeed, 8.0); 

        if (this.type === 'player') {
            for (let k in this.skills) this.skills[k].update(); if (this.dashTrail.length > 0 && this.dashTimer <= 0) this.dashTrail.shift();
            if (this.buffs.blueBuff > 0) { for (let k in this.skills) if (this.skills[k].cdTimer > 0) this.skills[k].cdTimer -= 2; if (this.atkCooldown > 0) this.atkCooldown -= 1; }
            
            let castQ = (pendingCast === 'q');
            let castE = (pendingCast === 'e');
            let castR = (pendingCast === 'r');
            let castSpace = (pendingCast === 'space');
            if (castQ) pendingCast = null;
            if (castE) pendingCast = null;
            if (castR) pendingCast = null;
            if (castSpace) pendingCast = null;

            let vx = 0, vy = 0;
            
            // ==========================================
            // LOGIC TƯỚNG PHƯỢNG HOÀNG LỬA
            // ==========================================
            if (this.heroClass === 'phuonghoang') {
                if (this.phEWindow > 0) {
                    this.phEWindow--;
                    if (this.phEWindow <= 0 && this.phECastLeft > 0) {
                        this.phECastLeft = 0;
                        this.skills.e.cdTimer = this.skills.e.cdMax;
                    }
                }

                if (this.phAura > 0) {
                    this.phAura--;
                    if (this.phAura % 15 === 0) {
                        let totalHeal = 0;
                        enemies.forEach(e => {
                            if (Math.hypot(e.x - this.x, e.y - this.y) < 250) {
                                let dmg = 15 * this.baseDmgMult;
                                e.hp -= dmg;
                                e.states.bleeding = Math.max(e.states.bleeding, 60);
                                e.hitFlash = 3;
                                totalHeal += dmg;
                                floatTexts.push(new FloatText(e.x, e.y - 20, `-${Math.floor(dmg)}`, '#e74c3c', 16));
                            }
                        });
                        if (totalHeal > 0) {
                            this.hp = Math.min(this.maxHp, this.hp + totalHeal); // 100% lifesteal
                            floatTexts.push(new FloatText(this.x, this.y - 40, `+${Math.floor(totalHeal)}`, '#2ecc71', 18));
                        }
                    }
                }

                if (this.phEgg > 0) {
                    this.phEgg--;
                    this.states.untargetable = true; 
                    
                    if (this.phEgg % 15 === 0) {
                        enemies.forEach(e => {
                            if (Math.hypot(e.x - this.x, e.y - this.y) < 350) {
                                let dmg = 30 * this.baseDmgMult;
                                e.hp -= dmg;
                                e.hitFlash = 3;
                                floatTexts.push(new FloatText(e.x, e.y - 20, `-${Math.floor(dmg)}`, '#f1c40f', 18));
                            }
                        });
                        particles.push(new Particle(this.x + (Math.random()-0.5)*100, this.y + (Math.random()-0.5)*100, '#e74c3c'));
                    }

                    if (this.phEgg <= 0) {
                        this.states.untargetable = false;
                        this.hp = this.maxHp;
                        this.skills.q.cdTimer = 0;
                        this.skills.e.cdTimer = 0;
                        this.skills.r.cdTimer = 0;
                        triggerShake(30);
                        SFX.play('explosion');
                        floatTexts.push(new FloatText(this.x, this.y - 60, "NIẾT BÀN!", "#f1c40f", 30));
                        for(let i=0; i<40; i++) particles.push(new Particle(this.x, this.y, '#f1c40f'));
                    }
                }

                if (this.dashTimer > 0) {
                    this.dashTimer--;
                    if (this.dashTimer % 2 === 0) this.dashTrail.push({ x: this.x, y: this.y, ba: this.bodyAngle, ta: this.angle });
                    if (this.dashTrail.length > 8) this.dashTrail.shift();

                    vx = Math.cos(this.dashAngle) * 28; 
                    vy = Math.sin(this.dashAngle) * 28;
                    this.targetBodyAngle = this.dashAngle;
                    
                    if (this.dashTimer % 3 === 0) {
                        zones.push(new FireTrailZone(this.x, this.y, this.baseDmgMult));
                    }

                    if (this.phEActive) {
                        enemies.forEach(e => {
                            if (Math.hypot(e.x - this.x, e.y - this.y) < this.radius + e.radius + 20 && !this.hitTargetsE.has(e)) {
                                this.hitTargetsE.add(e);
                                let dmg = 40 * this.baseDmgMult;
                                e.hp -= dmg;
                                e.states.bleeding = Math.max(e.states.bleeding, 120);
                                e.hitFlash = 5;
                                floatTexts.push(new FloatText(e.x, e.y - 40, "THIÊU ĐỐT!", "#e74c3c", 20));
                                
                                if (this.phECastLeft === 0 && !this.phEHit) {
                                    this.phEHit = true;
                                    this.phECastLeft = 1;
                                    this.phEWindow = 180;
                                    this.skills.e.cdTimer = 0;
                                    floatTexts.push(new FloatText(this.x, this.y - 60, "TÁI KÍCH HOẠT LƯỚT!", "#f1c40f", 20));
                                }
                            }
                        });
                    }
                }

                if (!this.states.untargetable && this.phEgg <= 0) {
                    if (castQ && this.skills.q.activate(this)) {
                        this.phAura = 300; 
                        SFX.play('levelup');
                        floatTexts.push(new FloatText(this.x, this.y - 40, "HỎA VỰC!", "#e74c3c", 20));
                    }
                    
                    if (castE) {
                        if (this.phECastLeft > 0) {
                            this.phECastLeft = 0;
                            this.phEWindow = 0;
                            this.skills.e.cdTimer = this.skills.e.cdMax; 
                            this.dashTimer = 18;
                            this.dashAngle = Math.atan2(worldMouseY - this.y, worldMouseX - this.x);
                            this.hitTargetsE = new Set();
                            this.phEActive = true;
                            if(typeof sfxEPhuongHoang !== 'undefined') playVoice(sfxEPhuongHoang);
                        } else if (this.skills.e.isReady(this.mp)) {
                            this.skills.e.activate(this);
                            this.skills.e.cdTimer = this.skills.e.cdMax;
                            this.dashTimer = 18;
                            this.dashAngle = Math.atan2(worldMouseY - this.y, worldMouseX - this.x);
                            this.hitTargetsE = new Set();
                            this.phEActive = true;
                            this.phEHit = false; 
                            if(typeof sfxEPhuongHoang !== 'undefined') playVoice(sfxEPhuongHoang);
                        }
                    }
                    
                    if (castR && this.skills.r.activate(this)) {
                        triggerShake(20);
                        SFX.play('explosion');
                        if (typeof slashes !== 'undefined') slashes.push(new PhoenixNovaVFX(this.x, this.y, 300));
                        for (let i = 0; i < 40; i++) particles.push(new Particle(this.x, this.y, '#e74c3c'));
                        enemies.forEach(e => {
                            if (Math.hypot(e.x - this.x, e.y - this.y) < 300) {
                                let dmg = 80 * this.baseDmgMult;
                                e.hp -= dmg;
                                e.states.silenced = 180; 
                                e.hitFlash = 5;
                                floatTexts.push(new FloatText(e.x, e.y - 40, "CÂM LẶNG!", "#9b59b6", 20));
                            }
                        });
                    }

                    if (castSpace && this.skills.space.activate(this)) {
                        this.phEgg = 180; 
                        SFX.play('rasengan_cast');
                    }
                }
            }

            else if (this.heroClass === 'kyuubi') {
                if (castQ && this.skills.q.activate(this)) {
                    this.dashTimer = 30;
                    this.dashAngle = this.targetAngle;
                    this.buffs.nineTails = 600;
                    this.buffs.lifesteal = 360; 
                    SFX.play('dash');
                    floatTexts.push(new FloatText(this.x, this.y - 40, "HÓA CỬU VĨ!", "#e67e22", 20));
                }

                if (this.dashTimer > 0) {
                    this.dashTimer--;
                    if (this.dashTimer % 2 === 0) this.dashTrail.push({ x: this.x, y: this.y, ba: this.bodyAngle, ta: this.angle });
                    if (this.dashTrail.length > 8) this.dashTrail.shift();

                    vx = Math.cos(this.dashAngle) * 14; 
                    vy = Math.sin(this.dashAngle) * 14;
                    this.targetBodyAngle = this.dashAngle;

                    enemies.forEach(e => {
                        if (Math.hypot(e.x - this.x, e.y - this.y) < this.radius + e.radius + 15) {
                            this.buffs.nineTails = 600;
                            this.buffs.lifesteal = 360;
                            e.states.stunned = 30;
                            e.hitFlash = 5;
                            floatTexts.push(new FloatText(e.x, e.y - 40, "STUNNED!", "#f1c40f", 20));
                        }
                    });
                }
            }
            else if (this.heroClass === 'pikachu') {
                if (castQ && this.skills.q.activate(this)) {
                    this.buffs.pikaQ = 300;
                    SFX.play('zap');
                }
                if (this.buffs.pikaQ > 0) {
                    currentSpeed *= 1.5;
                    if (Math.random() > 0.5) particles.push(new Particle(this.x + (Math.random() - 0.5) * 40, this.y + (Math.random() - 0.5) * 40, '#00ffff'));

                    enemies.forEach(e => {
                        if (Math.hypot(e.x - this.x, e.y - this.y) < this.radius + e.radius + 20) {
                            e.hp -= 0.5 * this.baseDmgMult;
                            e.states.slowed = 30;
                            e.hitFlash = 2;
                        }
                    });
                }
                if (castR && this.skills.r.activate(this)) {
                    this.buffs.pikaR = 240;
                    SFX.play('zap');
                    triggerShake(10);
                }
                if (this.buffs.pikaR > 0 && this.buffs.pikaR % 15 === 0) {
                    SFX.play('zap');
                    enemies.forEach(e => {
                        if (Math.hypot(e.x - this.x, e.y - this.y) < 250) {
                            let dmg = 25 * this.baseDmgMult;
                            e.hp -= dmg;
                            e.states.silenced = 30;
                            e.hitFlash = 5;
                            floatTexts.push(new FloatText(e.x, e.y - 30, `-${Math.floor(dmg)}`, '#fff', 18));

                            let healAmount = dmg * 0.5;
                            this.hp = Math.min(this.maxHp, this.hp + healAmount);
                            floatTexts.push(new FloatText(this.x + (Math.random() * 40 - 20), this.y - this.radius - 20, "+" + Math.floor(healAmount), "#2ecc71", 18));
                        }
                    });
                }
            }
            else if (this.heroClass === 'trieuvan') {
                if (castQ && this.skills.q.activate(this)) {
                    this.buffs.trieuvanQ = 60;
                    SFX.play('dash');
                }
                if (this.buffs.trieuvanQ > 0 && this.buffs.trieuvanQ % 3 === 0) {
                    enemies.forEach(e => {
                        let dist = Math.hypot(e.x - this.x, e.y - this.y);
                        let ang = Math.atan2(e.y - this.y, e.x - this.x);
                        let diff = Math.abs(ang - this.angle);

                        while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2);
                        if (dist < 200 && diff < Math.PI / 3) {
                            let dmg = 8 * this.baseDmgMult;
                            e.hp -= dmg;
                            e.hitFlash = 3;
                            floatTexts.push(new FloatText(e.x, e.y - 20, `-${Math.floor(dmg)}`, '#fff', 18));
                            this.applyTrieuVanLifesteal(dmg);
                        }
                    });
                }
                if (castE && this.skills.e.activate(this)) {
                    this.dashTimer = 20;
                    this.dashAngle = this.targetAngle;
                    this.hitTargetsE = new Set();
                    SFX.play('dash');
                }
                if (this.dashTimer > 0) {
                    this.dashTimer--;
                    if (this.dashTimer % 2 === 0) this.dashTrail.push({ x: this.x, y: this.y, ba: this.bodyAngle, ta: this.angle });
                    if (this.dashTrail.length > 8) this.dashTrail.shift();

                    vx = Math.cos(this.dashAngle) * 18; 
                    vy = Math.sin(this.dashAngle) * 18;
                    this.targetBodyAngle = this.dashAngle;

                    enemies.forEach(e => {
                        if (Math.hypot(e.x - this.x, e.y - this.y) < this.radius + e.radius + 20 && !this.hitTargetsE.has(e)) {
                            this.hitTargetsE.add(e);
                            let dmg = 30 * this.baseDmgMult;
                            e.hp -= dmg;
                            e.hitFlash = 5;
                            e.states.slowed = 60;
                            this.applyTrieuVanLifesteal(dmg);

                            ['q', 'e', 'r', 'space'].forEach(sk => {
                                this.skills[sk].cdTimer = Math.max(0, this.skills[sk].cdTimer - 60);
                            });
                            floatTexts.push(new FloatText(this.x, this.y - 40, "-1s ALL CD!", "#00ffff", 16));
                        }
                        if (this.hitTargetsE.has(e)) {
                            if (!checkWall(e, e.x + vx, e.y)) e.x += vx;
                            if (!checkWall(e, e.x, e.y + vy)) e.y += vy;
                        }
                    });
                }
            }
            else if (this.heroClass === 'lubu') {
                if (this.lubuRStage === 2) {
                    this.states.untargetable = true; 
                    this.skills.space.cdTimer = this.skills.space.cdMax; 
                    this.lubuRDelay--;

                    if (this.lubuRDelay <= 0) {
                        this.states.untargetable = false; 
                        this.lubuRStage = 3; 

                        this.x = this.lubuRTarget.x;
                        this.y = this.lubuRTarget.y;

                        triggerShake(30);
                        SFX.play('explosion');
                        for (let i = 0; i < 30; i++) particles.push(new Particle(this.x, this.y, '#00e5ff'));

                        enemies.forEach(e => {
                            if (Math.hypot(e.x - this.x, e.y - this.y) < 180) {
                                e.hp -= 40 * this.baseDmgMult * (this.buffs.chienThan > 0 ? 2 : 1);
                                e.states.knockup = 45; 
                                e.hitFlash = 5;
                                floatTexts.push(new FloatText(e.x, e.y - 40, "HẤT TUNG!", "red", 20));
                            }
                        });
                    }
                } else {
                    this.states.untargetable = false;
                }

                if (this.lubuRStage === 3) {
                    this.skills.space.cdTimer = this.skills.space.cdMax;
                }

                if (!this.states.untargetable) {
                    if (castQ && this.skills.q.activate(this)) {
                        this.passiveCrit = true;
                        SFX.play('dash');
                        shoot(this.x, this.y, this.angle, 'lubu_q', this.baseDmgMult * (this.buffs.chienThan > 0 ? 2 : 1));
                    }
                    if (castE && this.skills.e.activate(this)) {
                        this.passiveCrit = true;
                        SFX.play('dash');
                        if (typeof slashes !== 'undefined') slashes.push(new SlashVFX(this.x, this.y, this.angle));
                        enemies.forEach(e => {
                            let dist = Math.hypot(e.x - this.x, e.y - this.y);
                            let ang = Math.atan2(e.y - this.y, e.x - this.x);
                            let diff = Math.abs(ang - this.angle);
                            while (diff > Math.PI) diff -= Math.PI * 2;
                            while (diff < -Math.PI) diff += Math.PI * 2;
                            
                            if (dist < 250 && Math.abs(diff) < Math.PI / 2) {
                                e.hp -= 30 * this.baseDmgMult * (this.buffs.chienThan > 0 ? 2 : 1);
                                e.states.knockup = 30;
                                e.states.slowed = 60;
                                e.hitFlash = 5;
                                floatTexts.push(new FloatText(e.x, e.y - 40, "HẤT TUNG & SLOW!", "red", 16));
                            }
                        });
                    }
                    if (castR && this.skills.r.activate(this)) {
                        this.passiveCrit = true;
                        this.buffs.chienThan = 600;
                        triggerShake(20);
                        SFX.play('levelup');
                    }
                }

                if (castSpace) {
                    if (this.lubuRStage === 1 && this.skills.space.isReady(this.mp)) {
                        this.skills.space.activate(this);
                        this.passiveCrit = true;
                        this.lubuRStage = 2; 
                        this.lubuRDelay = 60; 

                        let tX = worldMouseX; let tY = worldMouseY;
                        let dist = Math.hypot(tX - this.x, tY - this.y);
                        if (dist > 700) {
                            let ang = Math.atan2(tY - this.y, tX - this.x);
                            tX = this.x + Math.cos(ang) * 700; tY = this.y + Math.sin(ang) * 700;
                        }
                        this.lubuRTarget = { x: tX, y: tY };

                        SFX.play('dash');
                        floatTexts.push(new FloatText(this.x, this.y - 40, "CHIẾN THẦN!", "#00e5ff", 20));
                    }
                    else if (this.lubuRStage === 3) {
                        this.passiveCrit = true;
                        this.lubuRStage = 1; 

                        let tX = worldMouseX; let tY = worldMouseY;
                        let dist = Math.hypot(tX - this.x, tY - this.y);
                        if (dist > 700) {
                            let ang = Math.atan2(tY - this.y, tX - this.x);
                            tX = this.x + Math.cos(ang) * 700; tY = this.y + Math.sin(ang) * 700;
                        }
                        this.x = tX; this.y = tY;

                        triggerShake(20);
                        SFX.play('explosion');
                        for (let i = 0; i < 30; i++) particles.push(new Particle(this.x, this.y, '#00e5ff'));

                        enemies.forEach(e => {
                            if (Math.hypot(e.x - this.x, e.y - this.y) < 180) {
                                e.hp -= 60 * this.baseDmgMult * (this.buffs.chienThan > 0 ? 2 : 1);
                                e.states.slowed = 120; 
                                e.hitFlash = 5;
                                floatTexts.push(new FloatText(e.x, e.y - 40, "SLOW!", "#00ffff", 20));
                            }
                        });
                    }
                }
            }
            else if (this.heroClass === 'ichigo') {
                if (castR && this.skills.r.activate(this)) {
                    this.buffs.bankai = 600;
                    triggerShake(20);
                    SFX.play('levelup');
                    floatTexts.push(new FloatText(this.x, this.y - 60, "BANKAI!", "#e74c3c", 30));
                }
                if (this.buffs.bankai > 0) {
                    currentSpeed *= 2.0;
                    this.buffs.lifesteal = 2;
                }
                
                if (this.ichigoUltTimer > 0) {
                    this.ichigoUltTimer--;
                    this.states.untargetable = true;

                    if (this.ichigoUltTargets) {
                        this.ichigoUltTargets = this.ichigoUltTargets.filter(e => e.hp > 0);

                        if (this.ichigoUltTargets.length > 0) {
                            this.ichigoUltTargets.forEach(e => {
                                e.states.knockup = Math.max(e.states.knockup, 5);
                            });

                            if (this.ichigoUltTimer % 8 === 0) {
                                let randomTarget = this.ichigoUltTargets[Math.floor(Math.random() * this.ichigoUltTargets.length)];
                                this.x = randomTarget.x + (Math.random() - 0.5) * 50;
                                this.y = randomTarget.y + (Math.random() - 0.5) * 50;

                                this.ichigoUltTargets.forEach(e => {
                                    e.hp -= 25 * this.baseDmgMult;
                                    e.hitFlash = 4;
                                    if (typeof slashes !== 'undefined') slashes.push(new SharpSlashVFX(e.x + (Math.random() - 0.5) * 100, e.y + (Math.random() - 0.5) * 100, Math.random() * Math.PI * 2, 1.5));
                                });
                                SFX.play('dash');
                            }
                        }
                    }

                    if (this.ichigoUltTimer <= 0) {
                        this.states.untargetable = false;
                        this.ichigoUltTargets = null; 
                    }
                }

                if (this.dashTimer > 0) {
                    this.dashTimer--;
                    if (this.dashTimer % 2 === 0) this.dashTrail.push({ x: this.x, y: this.y, ba: this.bodyAngle, ta: this.angle });
                    if (this.dashTrail.length > 8) this.dashTrail.shift();

                    this.x += Math.cos(this.dashAngle) * this.ichigoDashSpeed;
                    this.y += Math.sin(this.dashAngle) * this.ichigoDashSpeed;
                    vx = 0; vy = 0; 
                    
                    this.targetBodyAngle = this.dashAngle;
                }

                if (!this.states.untargetable && (this.ichigoUltTimer === undefined || this.ichigoUltTimer <= 0)) {
                    if (castQ && this.skills.q.activate(this)) {
                        let b = new Bullet(this.x, this.y, this.angle, 'ichigo_q', this.baseDmgMult);
                        b.isBankai = this.buffs.bankai > 0;
                        bullets.push(b);
                        SFX.play('dash');
                    }
                    if (castE && this.skills.e.isReady(this.mp) && this.dashTimer <= 0) {
                        let target = null;
                        let minDist = 600;
                        enemies.forEach(e => {
                            let d = Math.hypot(e.x - worldMouseX, e.y - worldMouseY);
                            if (d < 150 && Math.hypot(e.x - this.x, e.y - this.y) < minDist) {
                                minDist = d;
                                target = e;
                            }
                        });
                        if (target) {
                            this.skills.e.activate(this);
                            this.dashTimer = 10;
                            this.dashAngle = Math.atan2(target.y - this.y, target.x - this.x);
                            
                            let dist = Math.hypot(target.y - this.y, target.x - this.x);
                            this.ichigoDashSpeed = dist / 10;
                            
                            this.buffs.ichigoEmpowered = 300;
                            this.buffs.speed = 120; 
                            SFX.play('dash');
                        } else {
                            floatTexts.push(new FloatText(this.x, this.y - 40, "CHỈ CHUỘT VÀO ĐỊCH!", "gray", 15));
                        }
                    }

                    if (castSpace && this.skills.space.isReady(this.mp)) {
                        let targets = enemies.filter(e => e.states.knockup > 0 && Math.hypot(e.x - this.x, e.y - this.y) < 1500);

                        if (targets.length > 0) {
                            this.skills.space.activate(this);
                            this.ichigoUltTimer = 120;
                            this.ichigoUltTargets = targets; 
                            
                            this.x = targets[0].x;
                            this.y = targets[0].y;

                            triggerShake(25);
                            SFX.play('rasengan_boom');
                            floatTexts.push(new FloatText(this.x, this.y - 60, "TRẢM SÁT TOÀN DIỆN!", "#e74c3c", 25));
                        } else {
                            floatTexts.push(new FloatText(this.x, this.y - 40, "CHƯA CÓ ĐỊCH BỊ HẤT TUNG!", "gray", 15));
                        }
                    }
                }
            }
            else if (this.heroClass === 'thachsanh') {
                if (this.buffs.xuyenTamTien > 0) {
                    currentSpeed *= 1.5;
                    this.buffs.lifesteal = 4;
                }
                if (this.tsRainTimer > 0) {
                    this.tsRainTimer--;
                    if (this.tsRainTimer === 0) {
                        triggerShake(15);
                        SFX.play('rasengan_boom');
                        if (typeof particles !== 'undefined') {
                            for (let i = 0; i < 30; i++) particles.push(new Particle(this.tsRainPos.x + (Math.random() - 0.5) * 300, this.tsRainPos.y + (Math.random() - 0.5) * 300, '#f1c40f', 5));
                        }
                        enemies.forEach(e => {
                            if (Math.hypot(e.x - this.tsRainPos.x, e.y - this.tsRainPos.y) < 200 + e.radius) {
                                e.hp -= 80 * this.baseDmgMult;
                                e.states.slowed = 180;
                                e.states.silenced = 180;
                                e.hitFlash = 5;
                                floatTexts.push(new FloatText(e.x, e.y - 40, "CÂM LẶNG!", "#9b59b6", 18));
                            }
                        });
                    }
                }
                if (this.dashTimer > 0) {
                    this.dashTimer--;
                    if (this.dashTimer % 2 === 0) this.dashTrail.push({ x: this.x, y: this.y, ba: this.bodyAngle, ta: this.angle });
                    if (this.dashTrail.length > 8) this.dashTrail.shift();

                    vx = Math.cos(this.dashAngle) * 22; 
                    vy = Math.sin(this.dashAngle) * 22;
                    this.targetBodyAngle = this.dashAngle;
                }

                if (castQ && this.skills.q.activate(this)) {
                    this.dashTimer = 15;
                    this.dashAngle = Math.atan2(worldMouseY - this.y, worldMouseX - this.x);
                    this.skills.e.cdTimer = 0;
                    SFX.play('dash');
                    floatTexts.push(new FloatText(this.x, this.y - 40, "RESET E!", "#2ecc71", 16));
                }
                if (castE && this.skills.e.activate(this)) {
                    SFX.play('shoot');
                    let baseAng = this.angle;
                    for (let i = -2; i <= 2; i++) {
                        let b = new Bullet(this.x, this.y, baseAng + i * 0.15, 'thachsanh_e_arrow', this.baseDmgMult * 0.8);
                        bullets.push(b);
                    }
                }
                if (castR && this.skills.r.activate(this)) {
                    this.tsRainTimer = 30;

                    let tX = worldMouseX;
                    let tY = worldMouseY;
                    let dist = Math.hypot(tX - this.x, tY - this.y);
                    if (dist > 800) {
                        let ang = Math.atan2(tY - this.y, tX - this.x);
                        tX = this.x + Math.cos(ang) * 800;
                        tY = this.y + Math.sin(ang) * 800;
                    }
                    this.tsRainPos = { x: tX, y: tY };

                    if (typeof warnings !== 'undefined') warnings.push(new AoeWarning(this.tsRainPos.x, this.tsRainPos.y, 200, 30, 'shockwave', 0));
                    floatTexts.push(new FloatText(this.x, this.y - 60, "MƯA TÊN!", "#f1c40f", 20));
                }
                if (castSpace && this.skills.space.activate(this)) {
                    this.buffs.xuyenTamTien = 600;
                    SFX.play('levelup');
                    floatTexts.push(new FloatText(this.x, this.y - 60, "XUYÊN TÂM TIỄN!", "#f1c40f", 25));
                }
            } else if (this.heroClass === 'quancong') {
                if (this.qcEWindow > 0) {
                    this.qcEWindow--;
                    if (this.qcEWindow <= 0) {
                        this.qcEStage = 1;
                        this.skills.e.cdTimer = this.skills.e.cdMax;
                    }
                }

                if (this.dashTimer > 0) {
                    this.dashTimer--;
                    if (this.dashTimer % 2 === 0) this.dashTrail.push({ x: this.x, y: this.y, ba: this.bodyAngle, ta: this.angle });
                    if (this.dashTrail.length > 8) this.dashTrail.shift();
                    vx = Math.cos(this.dashAngle) * 24; 
                    vy = Math.sin(this.dashAngle) * 24;
                    this.targetBodyAngle = this.dashAngle;

                    if (this.qcEStage === 2) {
                        enemies.forEach(e => {
                            if (Math.hypot(e.x - this.x, e.y - this.y) < this.radius + e.radius + 20) {
                                e.states.stunned = 30; 
                                e.hitFlash = 5;
                                this.qcETarget = e; 
                            }
                        });
                    }
                }

                if (!this.states.untargetable) {
                    if (castQ && this.skills.q.activate(this)) {
                        this.states.stunned = 0; this.states.silenced = 0; this.states.slowed = 0; this.states.knockup = 0;
                        SFX.play('dash');

                        if (typeof particles !== 'undefined') {
                            particles.push(new SpinSlashVFX(this.x, this.y, 180));
                        }

                        let hitCount = 0;
                        let qHeal = 0;

                        enemies.forEach(e => {
                            if (Math.hypot(e.x - this.x, e.y - this.y) < 200) {
                                let dmg = 40 * this.baseDmgMult;
                                e.hp -= dmg;
                                e.states.slowed = 60;
                                e.hitFlash = 5;
                                floatTexts.push(new FloatText(e.x, e.y - 40, "SLOW!", "#00ffff", 18));

                                qHeal += dmg * 0.5; 
                                hitCount++;
                            }
                        });

                        if (qHeal > 0) {
                            this.hp = Math.min(this.maxHp, this.hp + qHeal);
                            floatTexts.push(new FloatText(this.x, this.y - 60, "+" + Math.floor(qHeal), "#2ecc71", 20));
                        }

                        if (hitCount > 0) {
                            this.skills.e.cdTimer = Math.max(0, this.skills.e.cdTimer - (60 * hitCount));
                            floatTexts.push(new FloatText(this.x, this.y - 40, "-" + hitCount + "s CD E!", "#2ecc71", 18));
                        }
                    }

                    if (castE) {
                        if (this.qcEStage === 1 && this.skills.e.isReady(this.mp)) {
                            this.skills.e.activate(this);
                            this.skills.e.cdTimer = 0;
                            this.qcEStage = 2;
                            this.qcEWindow = 180;
                            this.dashTimer = 15;
                            this.dashAngle = Math.atan2(worldMouseY - this.y, worldMouseX - this.x);
                            SFX.play('dash');

                        } else if (this.qcEStage === 2 && this.qcEWindow > 0) {
                            let target = this.qcETarget;

                            if (target && Math.hypot(target.x - this.x, target.y - this.y) > 800) {
                                target = null;
                            }

                            if (!target || target.hp <= 0) {
                                let minDist = 300;
                                enemies.forEach(e => {
                                    let dMouse = Math.hypot(e.x - worldMouseX, e.y - worldMouseY);
                                    let dPlayer = Math.hypot(e.x - this.x, e.y - this.y);
                                    if (dMouse < minDist && dPlayer <= 600) {
                                        minDist = dMouse;
                                        target = e;
                                    }
                                });
                            }

                            if (target) {
                                this.x = target.x + (Math.random() > 0.5 ? 40 : -40);
                                this.y = target.y + (Math.random() > 0.5 ? 40 : -40);

                                if (typeof sfxChemE2QC !== 'undefined') {
                                    for (let v = 0; v < 1; v++) {
                                        let loudSfx = sfxChemE2QC.cloneNode();
                                        loudSfx.volume = 1.0;
                                        loudSfx.play().catch(e => { });
                                    }
                                }

                                for (let i = 0; i < 8; i++) {
                                    setTimeout(() => {
                                        if (target && target.hp > 0) {
                                            this.x = target.x + (Math.random() > 0.5 ? 30 : -30);
                                            this.y = target.y + (Math.random() > 0.5 ? 30 : -30);

                                            let dmg = 25 * this.baseDmgMult;
                                            target.hp -= dmg;
                                            target.hitFlash = 3;

                                            target.x += (target.x - this.x) * 0.1;
                                            target.y += (target.y - this.y) * 0.1;

                                            this.hp = Math.min(this.maxHp, this.hp + dmg * 0.5);
                                            floatTexts.push(new FloatText(this.x, this.y - 40, "+" + Math.floor(dmg * 0.5), "#2ecc71", 15));

                                            if (typeof particles !== 'undefined') {
                                                particles.push(new GreenSlashVFX(target.x, target.y, Math.random() * Math.PI * 2, 1.0));
                                                particles.push(new CrossSlashVFX(target.x, target.y));
                                            }
                                        }
                                    }, i * 150);
                                }
                                this.qcEStage = 1; this.qcEWindow = 0; this.skills.e.cdTimer = this.skills.e.cdMax;
                            } else {
                                floatTexts.push(new FloatText(this.x, this.y - 40, "CHƯA CÓ MỤC TIÊU!", "gray", 15));
                            }
                        }
                    }

                    if (castR && this.skills.r.activate(this)) {
                        SFX.play('dash');
                        shoot(this.x, this.y, this.angle, 'quancong_r', this.baseDmgMult, false, 'player');
                    }

                    if (castSpace && this.skills.space.isReady(this.mp)) {
                        let target = null;
                        let minDist = 300; 

                        enemies.forEach(e => {
                            let dMouse = Math.hypot(e.x - worldMouseX, e.y - worldMouseY);
                            let dPlayer = Math.hypot(e.x - this.x, e.y - this.y);
                            if (dMouse < minDist && dPlayer <= 600) {
                                minDist = dMouse;
                                target = e;
                            }
                        });

                        if (target) {
                            this.skills.space.activate(this);
                            zones.push(new QuanCongSpaceDrop(target.x, target.y, this.baseDmgMult, this));
                        } else {
                            floatTexts.push(new FloatText(this.x, this.y - 40, "CHỌN SAI HOẶC QUÁ TẦM!", "gray", 15));
                        }
                    }
                }
            }
            if (!this.states.untargetable) {
                if (this.dashTimer <= 0) { if (keys['KeyW']) vy -= currentSpeed; if (keys['KeyS']) vy += currentSpeed; if (keys['KeyA']) vx -= currentSpeed; if (keys['KeyD']) vx += currentSpeed; if ((vx !== 0 || vy !== 0) && this.buffs.speed > 0) { if (Math.random() > 0.5) particles.push(new Particle(this.x - Math.cos(this.bodyAngle) * 20, this.y - Math.sin(this.bodyAngle) * 20, '#f1c40f')); } if (vx !== 0 || vy !== 0) this.targetBodyAngle = Math.atan2(vy, vx); }
                if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy;
                let diffBody = this.targetBodyAngle - this.bodyAngle; while (diffBody < -Math.PI) diffBody += Math.PI * 2; while (diffBody > Math.PI) diffBody -= Math.PI * 2; this.bodyAngle += diffBody * 0.15; let dot = vx * Math.cos(this.bodyAngle) + vy * Math.sin(this.bodyAngle); this.trackOffset -= dot * 0.8;
                this.targetAngle = Math.atan2(worldMouseY - this.y, worldMouseX - this.x); let diffTurret = this.targetAngle - this.angle; while (diffTurret < -Math.PI) diffTurret += Math.PI * 2; while (diffTurret > Math.PI) diffTurret -= Math.PI * 2; this.angle += diffTurret * 0.25;

                if (this.heroClass === 'kyuubi') { if (castE && this.skills.e.activate(this)) { this.buffs.cloneAttacks = 4; floatTexts.push(new FloatText(this.x, this.y - 40, "LINH ẢNH CÁO!", "#f1c40f", 15)); } let counterUI = document.getElementById('clone-counter'); if (this.buffs.cloneAttacks > 0) { counterUI.style.display = 'block'; counterUI.innerText = `LINH ẢNH: ${this.buffs.cloneAttacks}/4`; counterUI.style.color = this.buffs.cloneAttacks === 1 ? 'red' : '#f1c40f'; } else { counterUI.style.display = 'none'; } if (castR && this.skills.r.activate(this)) { triggerShake(15); SFX.play('dash'); shoot(this.x, this.y, this.angle, 'shuriken_r', this.baseDmgMult); } if (castSpace && this.skills.space.activate(this)) { floatTexts.push(new FloatText(this.x, this.y - 70, "RASENGAN!", "#3498db", 30)); triggerShake(10); SFX.play('rasengan_cast'); rProjs.push(new RasenganProj(this.x, this.y, worldMouseX, worldMouseY, this.baseDmgMult)); } }
                else if (this.heroClass === 'pikachu') {
                    if (castE && this.skills.e.isReady(this.mp)) { let target = null; let minDist = 800; enemies.forEach(e => { let d = Math.hypot(e.x - worldMouseX, e.y - worldMouseY); if (d < 200 && Math.hypot(e.x - this.x, e.y - this.y) < 800) { if (d < minDist) { minDist = d; target = e; } } }); if (!target) enemies.forEach(e => { let d = Math.hypot(e.x - this.x, e.y - this.y); if (d < minDist) { minDist = d; target = e; } }); if (target) { this.skills.e.activate(this); SFX.play('zap'); let ang = Math.atan2(target.y - this.y, target.x - this.x); let b = new Bullet(this.x, this.y, ang, 'pika_e', this.baseDmgMult); b.speed = 8; b.vx = Math.cos(ang) * b.speed; b.vy = Math.sin(ang) * b.speed; bullets.push(b); floatTexts.push(new FloatText(this.x, this.y - 40, "BÓNG NẢY!", "#00ffff", 15)); } else { floatTexts.push(new FloatText(this.x, this.y - 40, "CHƯA CÓ MỤC TIÊU!", "red", 15)); } } if (castSpace && this.skills.space.activate(this)) {
                        let tX = worldMouseX;
                        let tY = worldMouseY;
                        let dist = Math.hypot(tX - this.x, tY - this.y);
                        if (dist > 600) {
                            let ang = Math.atan2(tY - this.y, tX - this.x);
                            tX = this.x + Math.cos(ang) * 600;
                            tY = this.y + Math.sin(ang) * 600;
                        }

                        floatTexts.push(new FloatText(tX, tY - 50, "TRIỆU HỒI!", "#f1c40f", 30));
                        SFX.play('dash');
                        pets.push(new Pet(tX, tY, this));
                        
                    }
                }
                else if (this.heroClass === 'trieuvan') { if (castR && this.skills.r.activate(this)) { this.buffs.trieuvanR = 15; SFX.play('dash'); triggerShake(15); enemies.forEach(e => { let dist = Math.hypot(e.x - this.x, e.y - this.y); let ang = Math.atan2(e.y - this.y, e.x - this.x); let diff = Math.abs(ang - this.angle); while (diff > Math.PI) diff = Math.abs(diff - Math.PI * 2); if (dist < 240 && diff < Math.PI / 2.5) { let dmg = 50 * this.baseDmgMult; e.hp -= dmg; e.states.knockup = 90; e.hitFlash = 5; this.applyTrieuVanLifesteal(dmg); } }); } if (castSpace && this.skills.space.activate(this)) { floatTexts.push(new FloatText(this.x, this.y - 70, "LONG KÍCH!", "#0984e3", 30)); SFX.play('rasengan_cast'); rProjs.push(new DragonProj(this.x, this.y, this.angle, this.baseDmgMult, this)); } }

                if (this.atkCooldown > 0) this.atkCooldown--; let finalAtkCd = 60; 
                if ((isShooting || window.autoShoot) && this.atkCooldown <= 0 && this.states.silenced <= 0) {
                    if (this.heroClass === 'kyuubi' && this.buffs.cloneAttacks > 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle, this.buffs.cloneAttacks === 1 ? 'clone_knockup' : 'clone_slow', this.baseDmgMult); this.buffs.cloneAttacks--; this.atkCooldown = this.buffs.nineTails > 0 ? 10 : 20; }
                    else {
                        let bType = 'player'; let isCrit = false;
                        if (this.heroClass === 'phuonghoang') { bType = 'phuonghoang_attack'; SFX.play('shoot'); finalAtkCd = 40; }
                        else if (this.heroClass === 'pikachu') { bType = 'pika_attack'; SFX.play('zap'); }
                        else if (this.heroClass === 'trieuvan') { bType = 'trieuvan_attack'; SFX.play('shoot'); }
                        else if (this.heroClass === 'lubu') { bType = 'lubu_attack'; SFX.play('dash'); finalAtkCd = (this.buffs.chienThan > 0) ? 15 : 30; if (this.passiveCrit) { isCrit = true; this.passiveCrit = false; } }
                        else if (this.heroClass === 'ichigo') {
                            isCrit = true;
                            if (this.buffs.bankai > 0) isCrit = true;

                            if (this.buffs.ichigoEmpowered > 0) {
                                bType = 'ichigo_knife';
                                this.buffs.ichigoEmpowered = 0;
                                if (typeof playVoice === 'function') playVoice(sfxChemE);
                            } else {
                                // --- GỌI ĐẠN BẮN THƯỜNG ---
                                bType = 'ichigo_attack';

                                // --- PHÁT ÂM THANH ---
                                if (window.sfxIchigoShoot) {
                                    window.sfxIchigoShoot.currentTime = 0;
                                    window.sfxIchigoShoot.play().catch(e => console.log(e));
                                }
                            }}
                        else if (this.heroClass === 'quancong') {
                            bType = 'quancong_bullet';
                            SFX.play('dash'); 
                            finalAtkCd = 45; 
                        }
                        else if (this.heroClass === 'thachsanh') { if (typeof playVoice === 'function') playVoice(sfxThachSanhShoot); if (this.buffs.xuyenTamTien > 0) { bType = 'thachsanh_giant_arrow'; finalAtkCd = 30; } else { bType = 'thachsanh_arrow'; finalAtkCd = 50; } shoot(this.x, this.y, this.angle, bType, this.baseDmgMult, isCrit); }

                        let finalDmgMult = this.baseDmgMult; if (this.heroClass === 'lubu' && this.buffs.chienThan > 0) finalDmgMult *= 2; if (this.heroClass === 'ichigo' && bType === 'ichigo_knife') finalDmgMult *= 1.5; if (isCrit) finalDmgMult *= 2; if (this.buffs.redBuff > 0) finalDmgMult *= 2;
                        if (this.buffs.rapid > 0) { shoot(this.x, this.y, this.angle, bType, finalDmgMult, isCrit); setTimeout(() => { if (this.hp > 0 && !this.states.untargetable) { shoot(this.x, this.y, this.angle, bType, finalDmgMult, false); SFX.play(bType === 'pika_attack' ? 'zap' : (bType === 'lubu_attack' ? 'dash' : 'shoot')); } }, 80); setTimeout(() => { if (this.hp > 0 && !this.states.untargetable) { shoot(this.x, this.y, this.angle, bType, finalDmgMult, false); SFX.play(bType === 'pika_attack' ? 'zap' : (bType === 'lubu_attack' ? 'dash' : 'shoot')); } }, 160); finalAtkCd = 20; }
                        else if (this.buffs.spread > 0) { shoot(this.x, this.y, this.angle - 0.2, bType, finalDmgMult, isCrit); shoot(this.x, this.y, this.angle + 0.2, bType, finalDmgMult, isCrit); shoot(this.x, this.y, this.angle, bType, finalDmgMult, isCrit); }
                        else { shoot(this.x, this.y, this.angle, bType, finalDmgMult, isCrit); } this.atkCooldown = finalAtkCd;
                    }
                }
            }

            ['q', 'e', 'r', 'space'].forEach(k => { 
                let skill = this.skills[k]; 
                let cdEl = document.getElementById('cd-' + k); 
                
                let textEl = document.getElementById('cd-text-' + k);
                if (!textEl) {
                    textEl = document.createElement('div');
                    textEl.id = 'cd-text-' + k;
                    textEl.style.position = 'absolute';
                    textEl.style.top = '45%';
                    textEl.style.left = '50%';
                    textEl.style.transform = 'translate(-50%, -50%)';
                    textEl.style.color = '#fff';
                    textEl.style.fontSize = '22px';
                    textEl.style.fontWeight = 'bold';
                    textEl.style.textShadow = '0 0 5px #000, 0 0 5px #000, 0 0 5px #e74c3c';
                    textEl.style.zIndex = '10';
                    textEl.style.pointerEvents = 'none';
                    document.getElementById('ui-' + k).appendChild(textEl);
                }

                if (skill.cdTimer > 0) { 
                    cdEl.style.height = (skill.cdTimer / skill.cdMax * 100) + '%'; 
                    cdEl.style.background = 'rgba(231, 76, 60, 0.7)'; 
                    textEl.innerText = (skill.cdTimer / 60).toFixed(1); 
                } else if (this.mp < skill.manaCost) { 
                    cdEl.style.height = '100%'; 
                    cdEl.style.background = 'rgba(52, 152, 219, 0.5)'; 
                    textEl.innerText = ''; 
                } else { 
                    cdEl.style.height = '0%'; 
                    textEl.innerText = ''; 
                } 
            });

            let updateBuffUI = (id, timer, maxTimer) => { let el = document.getElementById('buff-' + id); if (timer > 0) { el.style.display = 'flex'; let pct = (timer / maxTimer) * 100; document.getElementById('sweep-' + id).style.background = `conic-gradient(rgba(0,0,0,0.85) ${100 - pct}%, transparent 0%)`; } else el.style.display = 'none'; };
            updateBuffUI('invis', this.buffs.invis, 420); updateBuffUI('spread', this.buffs.spread, 420); updateBuffUI('shield', this.buffs.shield, 300); updateBuffUI('rapid', this.buffs.rapid, 300); updateBuffUI('speed', this.buffs.speed, 300); updateBuffUI('lifesteal', this.buffs.lifesteal, 180); updateBuffUI('redBuff', this.buffs.redBuff, 900); updateBuffUI('blueBuff', this.buffs.blueBuff, 900);
            document.getElementById('ui-hp').innerText = `${Math.floor(this.hp)}/${this.maxHp}`; document.getElementById('ui-mp').innerText = `${Math.floor(this.mp)}/${this.maxMp}`;

        } else {
            if (this.isCreep && gameMode === 'moba') {
                if (this.atkCooldown > 0)
                    this.atkCooldown--;

                const enemyCreepsRaw = this.team === 'ally'
                    ? enemies.filter(e => e.isCreep && e.hp > 0)
                    : allies.filter(a => a.isCreep && a.hp > 0);
                const enemyCreeps = this.lane
                    ? enemyCreepsRaw.filter(c => c.lane === this.lane)
                    : enemyCreepsRaw;
                const enemyHero = this.team === 'enemy' ? player : null;
                const enemyTower = (typeof mobaTowers !== 'undefined') ? mobaTowers.find(t => t.team !== this.team && t.hp > 0) : null;

                let target = null;
                let targetType = 'path';
                let minDist = Infinity;

                // Priority 1: enemy creep
                enemyCreeps.forEach(c => {
                    const d = Math.hypot(c.x - this.x, c.y - this.y);
                    if (d < 460 && d < minDist) {
                        minDist = d;
                        target = c;
                        targetType = 'creep';
                    }
                });

                // Priority 2: hero
                if (!target && enemyHero && !enemyHero.states.untargetable) {
                    const dHero = Math.hypot(enemyHero.x - this.x, enemyHero.y - this.y);
                    if (dHero < 420) {
                        minDist = dHero;
                        target = enemyHero;
                        targetType = 'hero';
                    }
                }

                // Priority 3: tower
                if (!target && enemyTower) {
                    const dTower = Math.hypot(enemyTower.x - this.x, enemyTower.y - this.y);
                    if (dTower < 620) {
                        minDist = dTower;
                        target = enemyTower;
                        targetType = 'tower';
                    }
                }

                const isCannon = this.heroClass === 'cannon';
                const isRanged = this.heroClass === 'archer' || isCannon;
                const atkRange = isRanged ? (isCannon ? 520 : 430) : 78;
                const attackMovePadding = isRanged ? 24 : 8;

                let moveAngle = this.angle;
                let shouldMove = true;
                if (target) {
                    moveAngle = Math.atan2(target.y - this.y, target.x - this.x);
                    const stopRange = targetType === 'creep'
                        ? this.radius + (target.radius || 32) + attackMovePadding
                        : atkRange - attackMovePadding;
                    if (minDist <= stopRange)
                        shouldMove = false;
                } else if (this.path && this.pathIndex < this.path.length) {
                    const wp = this.path[this.pathIndex];
                    const dWp = Math.hypot(wp.x - this.x, wp.y - this.y);
                    if (dWp < 80 && this.pathIndex < this.path.length - 1)
                        this.pathIndex++;
                    const nwp = this.path[this.pathIndex];
                    moveAngle = Math.atan2(nwp.y - this.y, nwp.x - this.x);
                }

                if (shouldMove) {
                    const vx = Math.cos(moveAngle) * (currentSpeed * 0.9);
                    const vy = Math.sin(moveAngle) * (currentSpeed * 0.9);
                    if (!checkWall(this, this.x + vx, this.y))
                        this.x += vx;
                    if (!checkWall(this, this.x, this.y + vy))
                        this.y += vy;
                }

                this.targetBodyAngle = moveAngle;
                this.targetAngle = moveAngle;
                let diffBody = this.targetBodyAngle - this.bodyAngle;
                while (diffBody < -Math.PI)
                    diffBody += Math.PI * 2;
                while (diffBody > Math.PI)
                    diffBody -= Math.PI * 2;
                this.bodyAngle += diffBody * 0.15;
                this.angle = this.bodyAngle;

                if (target && this.atkCooldown <= 0) {
                    const meleeRange = this.radius + (target.radius || 32) + 20;
                    const realAtkRange = isRanged ? atkRange : meleeRange;
                    const atkDmg = (isCannon ? 28 : (isRanged ? 14 : 18)) * this.baseDmgMult;
                    if (minDist <= realAtkRange) {
                        if (targetType === 'tower') {
                            target.hp -= atkDmg;
                        } else if (targetType === 'hero') {
                            if (player.buffs.shield <= 0 && !player.states.untargetable)
                                player.hp -= atkDmg;
                        } else {
                            target.hp -= atkDmg;
                            target.hitFlash = 3;
                        }
                        this.atkCooldown = isCannon ? 85 : (isRanged ? 60 : 35);
                    }
                }
            } else {
            if (this.isCasting) { this.castTimer--; if (this.castTimer <= 0) this.isCasting = false; return; }

            let distToPlayer = Math.hypot(player.x - this.x, player.y - this.y); let playerInBush = isInBush(player.x, player.y);
            if (player.buffs.invis > 0 || playerInBush || player.states.untargetable || this.heroClass === 'dummy') { this.aggro = false; } else { if (distToPlayer < 1500) this.aggro = true; }
            if (this.heroClass === 'dummy') this.hp = this.maxHp;

            let vx = 0, vy = 0;
            if (this.aggro) {
                this.targetAngle = Math.atan2(player.y - this.y, player.x - this.x); let diff = this.targetAngle - this.angle; while (diff < -Math.PI) diff += Math.PI * 2; while (diff > Math.PI) diff -= Math.PI * 2; this.angle += diff * 0.1;
                if (this.atkCooldown > 0) this.atkCooldown--; if (this.skillCooldown > 0) this.skillCooldown--;

                if (this.type === 'boss') {
                    if (distToPlayer > 400 && !this.states.untargetable) { vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; }

                    if (this.jumpTimer > 0) {
                        this.jumpTimer--; this.states.untargetable = true;
                        if (this.jumpTimer <= 0) {
                            this.x = this.jumpTarget.x; this.y = this.jumpTarget.y; this.states.untargetable = false; triggerShake(30); SFX.play('explosion');
                        }
                    }

                    if (this.skillCooldown <= 0 && this.states.silenced <= 0 && this.jumpTimer <= 0 && !this.states.untargetable) {
                        let skills = ['rockets', 'blackhole', 'jump', 'laser8', 'summon']; let chosen = skills[Math.floor(Math.random() * skills.length)];
                        this.castBossSkill(chosen);
                        this.skillCooldown = 360 - (currentLevel * 10); 
                    }

                    if (this.rocketVolley > 0) {
                        this.rocketVolley--;
                        if (this.rocketVolley % 15 === 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle + (Math.random() - 0.5) * 0.5, 'boss_rocket', 1.0, false, 'enemy'); }
                    }

                    if (this.atkCooldown <= 0 && this.states.silenced <= 0 && !this.states.untargetable) {
                        SFX.play('shoot'); shoot(this.x, this.y, this.angle - 0.2, 'enemy_heavy', 1.5, false, 'enemy'); shoot(this.x, this.y, this.angle, 'enemy_heavy', 1.5, false, 'enemy'); shoot(this.x, this.y, this.angle + 0.2, 'enemy_heavy', 1.5, false, 'enemy'); this.atkCooldown = 90;
                    }
                }
                else if (this.heroClass === 'kamikaze' || this.heroClass === 'melee' || this.heroClass === 'charger') {
                    vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed;
                    if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy;
                    if (distToPlayer < this.radius + player.radius + 15 && !player.states.untargetable) {
                        if (this.heroClass === 'kamikaze') {
                            player.hp -= 150 * this.baseDmgMult; this.hp = 0; triggerShake(25); SFX.play('explosion');
                        }
                        else if (this.atkCooldown <= 0) {
                            player.hp -= (this.heroClass === 'charger' ? 60 : 40) * this.baseDmgMult;
                            triggerShake(10);

                            if (this.heroClass === 'charger') {
                                player.states.stunned = 30;
                                floatTexts.push(new FloatText(player.x, player.y - 40, "Choáng!", "#f1c40f", 20));
                                this.atkCooldown = 140; 
                            } else {
                                this.atkCooldown = 45;  
                            }
                        }
                    }
                } else if (this.heroClass === 'venom') {
                    vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed;
                    if (!checkWall(this, this.x + vx, this.y)) this.x += vx;
                    if (!checkWall(this, this.x, this.y + vy)) this.y += vy;
                    if (distToPlayer < this.radius + player.radius + 15 && !player.states.untargetable && this.atkCooldown <= 0) {
                        player.hp -= 20 * this.baseDmgMult;
                        player.states.bleeding = 180; 
                        floatTexts.push(new FloatText(player.x, player.y - 40, "Chảy máu!", "#e74c3c", 20));
                        triggerShake(5);
                        this.atkCooldown = 240; 
                    }
                } else if (this.heroClass === 'icer') {
                    vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy;
                    if (distToPlayer < this.radius + player.radius + 15 && !player.states.untargetable && this.atkCooldown <= 0) { player.hp -= 40 * this.baseDmgMult; player.states.slowed = 120; floatTexts.push(new FloatText(player.x, player.y - 40, "SLOWED!", "#00ffff", 20)); triggerShake(5); this.atkCooldown = 45; }
                } else if (this.heroClass === 'saw' || this.heroClass === 'dog') {
                    vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy;
                    if (distToPlayer < this.radius + player.radius + 15 && !player.states.untargetable && this.atkCooldown <= 0) { player.hp -= (this.heroClass === 'saw' ? 80 : 30) * this.baseDmgMult; triggerShake(5); this.atkCooldown = this.heroClass === 'saw' ? 20 : 35; } if (this.heroClass === 'saw') this.bodyAngle += 0.5;
                } else if (this.heroClass === 'snake') {
                    let wave = Math.sin(Date.now() * 0.005) * 1.5; vx = Math.cos(this.angle + wave) * currentSpeed; vy = Math.sin(this.angle + wave) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; if (distToPlayer < 700 && this.atkCooldown <= 0 && this.states.silenced <= 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle, 'snake_poison', this.baseDmgMult, false, 'enemy'); this.atkCooldown = 70; }
                } else if (this.heroClass === 'shield') {
                    if (distToPlayer > 150) { vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; } if (distToPlayer < 400 && this.atkCooldown <= 0 && this.states.silenced <= 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle, 'enemy', this.baseDmgMult, false, 'enemy'); this.atkCooldown = 75; }
                } else if (this.heroClass === 'spider') {
                    if (distToPlayer > 400) { vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; } if (distToPlayer < 600 && this.atkCooldown <= 0 && this.states.silenced <= 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle, 'spider_web', this.baseDmgMult, false, 'enemy'); this.atkCooldown = 90; }
                } else if (this.heroClass === 'waller' || this.heroClass === 'trapper') {
                    if (distToPlayer > 500) { vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; } if (distToPlayer < 800 && this.atkCooldown <= 0 && this.states.silenced <= 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle, 'wall_maker', this.baseDmgMult, false, 'enemy'); this.atkCooldown = 180; }
                } else if (this.heroClass === 'cannon' || this.heroClass === 'rock') {
                    if (distToPlayer > 600) { vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; } if (distToPlayer < 900 && this.atkCooldown <= 0 && this.states.silenced <= 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle, 'cannon_ball', this.baseDmgMult, false, 'enemy'); this.atkCooldown = 150; }
                } else if (this.heroClass === 'sniper' || this.heroClass === 'archer') {
                    if (distToPlayer > 600) { vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; } if (distToPlayer < 1200 && this.atkCooldown <= 0 && this.states.silenced <= 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle, 'sniper', this.baseDmgMult, false, 'enemy'); this.atkCooldown = 70 + Math.random() * 40; }
                } else if (this.heroClass === 'spread') {
                    if (distToPlayer > 400) { vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; }
                    if (distToPlayer < 600 && this.atkCooldown <= 0 && this.states.silenced <= 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle - 0.2, 'enemy', this.baseDmgMult, false, 'enemy'); shoot(this.x, this.y, this.angle, 'enemy', this.baseDmgMult, false, 'enemy'); shoot(this.x, this.y, this.angle + 0.2, 'enemy', this.baseDmgMult, false, 'enemy'); this.atkCooldown = 90 + Math.random() * 30; }
                } else if (this.heroClass === 'machinegun') {
                    if (distToPlayer > 500) { vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; }
                    if (distToPlayer < 700 && this.atkCooldown <= 0 && this.states.silenced <= 0) { SFX.play('shoot'); shoot(this.x, this.y, this.angle + (Math.random() - 0.5) * 0.2, 'enemy', this.baseDmgMult * 0.4, false, 'enemy'); this.atkCooldown = 10 + Math.random() * 8; }
                } else {
                    if (this.tier === 'light') { if (this.skillCooldown <= 0 && this.states.silenced <= 0) { this.skillCooldown = 180; this.buffs.speed = 60; floatTexts.push(new FloatText(this.x, this.y - 30, "DASH!", "#f1c40f", 15)); } let dodgeAng = this.angle + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2); vx = Math.cos(dodgeAng) * currentSpeed; vy = Math.sin(dodgeAng) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; }
                    else { if (distToPlayer > (this.tier === 'heavy' ? 350 : 250)) { vx = Math.cos(this.angle) * currentSpeed; vy = Math.sin(this.angle) * currentSpeed; if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy; } }
                    if (distToPlayer < 600 && this.atkCooldown <= 0 && this.states.silenced <= 0) { SFX.play('shoot'); let bType = this.tier === 'heavy' ? 'enemy_heavy' : 'enemy'; shoot(this.x, this.y, this.angle + (Math.random() - 0.5) * 0.2, bType, this.baseDmgMult, false, 'enemy'); let cdBase = this.tier === 'heavy' ? 90 : (this.tier === 'light' ? 45 : 70); this.atkCooldown = cdBase + Math.random() * 30; }
                    if (this.tier === 'normal' && this.skillCooldown <= 0 && this.states.silenced <= 0 && distToPlayer < 350) {
                        this.skillCooldown = 360;
                        SFX.play('shoot');
                        shoot(this.x, this.y, this.angle, 'enemy_stun', 1.0, false, 'enemy');
                        floatTexts.push(new FloatText(this.x, this.y - 30, "STUN SHOT!", "#9b59b6", 15));
                        this.atkCooldown = 45;
                    }
                }

                if (vx !== 0 || vy !== 0) this.targetBodyAngle = Math.atan2(vy, vx); let diffBody = this.targetBodyAngle - this.bodyAngle; while (diffBody < -Math.PI) diffBody += Math.PI * 2; while (diffBody > Math.PI) diffBody -= Math.PI * 2; this.bodyAngle += diffBody * 0.15; let dot = vx * Math.cos(this.bodyAngle) + vy * Math.sin(this.bodyAngle); this.trackOffset -= dot * 0.8;
            } else {
                if (this.patrolTimer <= 0) { this.patrolAngle = Math.random() * Math.PI * 2; this.patrolTimer = 120 + Math.random() * 180; } this.patrolTimer--;
                if (this.patrolTimer > 60) {
                    vx = Math.cos(this.patrolAngle) * (currentSpeed * 0.4); vy = Math.sin(this.patrolAngle) * (currentSpeed * 0.4); if (!checkWall(this, this.x + vx, this.y)) this.x += vx; if (!checkWall(this, this.x, this.y + vy)) this.y += vy;
                    this.targetBodyAngle = Math.atan2(vy, vx); let diffBody = this.targetBodyAngle - this.bodyAngle; while (diffBody < -Math.PI) diffBody += Math.PI * 2; while (diffBody > Math.PI) diffBody -= Math.PI * 2; this.bodyAngle += diffBody * 0.1; this.angle = this.bodyAngle; let dot = vx * Math.cos(this.bodyAngle) + vy * Math.sin(this.bodyAngle); this.trackOffset -= dot * 0.8;
                }
            }
            }
        }

        walls.forEach(w => { let r = this.radius; if (this.x + r > w.x && this.x - r < w.x + w.w && this.y + r > w.y && this.y - r < w.y + w.h) { let overlapLeft = (this.x + r) - w.x; let overlapRight = (w.x + w.w) - (this.x - r); let overlapTop = (this.y + r) - w.y; let overlapBottom = (w.y + w.h) - (this.y - r); let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom); if (minOverlap === overlapLeft) this.x -= overlapLeft; else if (minOverlap === overlapRight) this.x += overlapRight; else if (minOverlap === overlapTop) this.y -= overlapTop; else if (minOverlap === overlapBottom) this.y += overlapBottom; } });
        this.x = Math.max(this.radius, Math.min(WORLD_W - this.radius, this.x)); this.y = Math.max(this.radius, Math.min(WORLD_H - this.radius, this.y));
    }
}