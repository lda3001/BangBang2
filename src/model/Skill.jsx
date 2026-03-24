// 1. Chặn bấm chuột phải (menu ngữ cảnh)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 2. Chặn các phím tắt mở công cụ Hack (DevTools)
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
    }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
    }
});

const imgDanQC = new Image();
imgDanQC.src = 'music/dan_qc.png';
const imgTrieuVan = new Image();
imgTrieuVan.src = 'music/trieu_van.jpg';
const imgNaruto = new Image();
imgNaruto.src = 'music/naru.png';
const imgThachSanh = new Image();
imgThachSanh.src = 'music/thach_sanh.jpg';
const imgLubu = new Image();
imgLubu.src = 'music/lu_bo.jpg';

// --- BỘ KỸ NĂNG VÀ ÂM THANH REMAKE ICHIGO ---
window.sfxIchigoShoot = new Audio('music/ichigo/am_dan_ban_thuong_ichigo.mp3');
window.sfxIchigoShoot.volume = 0.8;
// Bạn có thể chỉnh âm lượng to nhỏ ở đây

// --- KHAI BÁO ẢNH ICHIGO (Đã bọc thép toàn cục) ---
window.imgIchigoAttack = new Image();
window.imgIchigoAttack.src = 'music/ichigo/dan_ban_thuong_ichigo.png';
window.imgIchigoQSprite = new Image();
window.imgIchigoQSprite.src = 'music/ichigo/anh_chieu_q.png';
window.imgIchigoE = new Image();
window.imgIchigoE.src = 'music/ichigo/dam_cuong_hoa_e_ichigo.png';
window.imgIchigoEShadow = new Image();
window.imgIchigoEShadow.src = 'music/ichigo/du_anh_e_ichigo.jpg';
window.imgIchigoSpace = new Image();
window.imgIchigoSpace.src = 'music/ichigo/chem_space.jpg';

window.imgLuboQ = new Image();
window.imgLuboQ.src = 'music/q_lu_bo.png';

// --- ẢNH VÀ ÂM THANH PHƯỢNG HOÀNG LỬA ---
const imgPhuongHoang = new Image();
imgPhuongHoang.src = 'music/phuong_hoang_lua.png';
const sfxEPhuongHoang = new Audio('music/E_Phuonghoang.mp3');
sfxEPhuongHoang.volume = 1.0;

// --- CLASS VẾT LỬA LƯỚT E ---
class FireTrailZone {
    constructor(x, y, dmgMult) {
        this.x = x;
        this.y = y;
        this.life = 120;
        this.radius = 60;
        this.dmg = 10 * dmgMult;
    }
    update() {
        this.life--;
        if (this.life % 15 === 0) {
            enemies.forEach(e => {
                if (Math.hypot(e.x - this.x, e.y - this.y) < this.radius) {
                    e.hp -= this.dmg;
                    e.states.bleeding = Math.max(e.states.bleeding, 60);
                    e.hitFlash = 2;
                }
            }
            );
            if (Math.random() > 0.5)
                particles.push(new Particle(this.x + (Math.random() - 0.5) * 40,this.y + (Math.random() - 0.5) * 40,'#e67e22'));
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.life / 120;
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawPostCharacterEffects(ctx) {
    if (typeof bullets !== 'undefined') {
        bullets.forEach(b => {
            if (b.type === 'ichigo_knife') {
                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.rotate(b.angle + Math.PI / 2);
                let beRong = 180;
                let muiKiem = -180;
                let doDai = b.distTraveled + 250;
                ctx.drawImage(imgIchigoE, -beRong / 2, muiKiem, beRong, doDai);
                ctx.restore();
            }
        }
        );
    }
}

function drawTankQuanCong(ctx, radius, bodyAngle, turretAngle) {
    ctx.save();
    ctx.rotate(bodyAngle);
    ctx.fillStyle = '#111';
    ctx.fillRect(-radius * 0.8, radius * 0.7, radius * 1.6, 12);
    ctx.fillRect(-radius * 0.8, -radius * 0.7 - 12, radius * 1.6, 12);
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.7);
    ctx.lineTo(-radius * 1.8, -radius * 0.7);
    ctx.lineTo(-radius * 2.2, -radius * 1.2);
    ctx.lineTo(-radius * 1.2, -radius * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(-radius * 1.6, -radius * 0.75);
    ctx.lineTo(-radius * 2.5, -radius * 0.75);
    ctx.lineTo(-radius * 2.2, -radius * 1.2);
    ctx.fill();
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(0, radius * 0.7);
    ctx.lineTo(-radius * 1.8, radius * 0.7);
    ctx.lineTo(-radius * 2.2, radius * 1.2);
    ctx.lineTo(-radius * 1.2, radius * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(-radius * 1.6, radius * 0.75);
    ctx.lineTo(-radius * 2.5, radius * 0.75);
    ctx.lineTo(-radius * 2.2, radius * 1.2);
    ctx.fill();
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.roundRect(-radius * 0.9, -radius * 0.7, radius * 1.8, radius * 1.4, 8);
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.rotate(turretAngle);
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(0, -5, radius * 0.8, 10);
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(radius * 0.8, -8);
    ctx.lineTo(radius * 1.2, 0);
    ctx.lineTo(radius * 0.8, 8);
    ctx.fill();
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.stroke();
    ctx.restore();
}

class SpinSlashVFX {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.life = 20;
        this.maxLife = 20;
        this.angle = 0;
    }
    update() {
        this.life--;
        this.angle += 0.3;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        let pct = this.life / this.maxLife;
        ctx.globalAlpha = pct;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#27ae60';
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 15 * pct;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            ctx.arc(this.radius, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(this.radius, -10);
            ctx.lineTo(this.radius + 60, 0);
            ctx.lineTo(this.radius, 10);
            ctx.fill();
            ctx.rotate(Math.PI);
        }
        ctx.restore();
    }
}

class GreenSlashVFX {
    constructor(x, y, angle, speedMult=1) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.life = 20;
        this.maxLife = 20;
        this.speedMult = speedMult;
    }
    update() {
        this.life--;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        let pct = this.life / this.maxLife;
        ctx.globalAlpha = pct;
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#2ecc71';
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(0, 0, 140, -Math.PI / 2, Math.PI / 2);
        ctx.quadraticCurveTo(60, 0, 0, -140);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 140, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.restore();
    }
}

class CrossSlashVFX {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 15;
        this.maxLife = 15;
        this.size = 150;
        this.angle = Math.random() * Math.PI;
    }
    update() {
        this.life--;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        let pct = this.life / this.maxLife;
        ctx.globalAlpha = pct;
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#2ecc71';
        ctx.lineCap = 'round';
        for (let i = 0; i < 2; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineWidth = 26 * pct;
            ctx.strokeStyle = '#27ae60';
            ctx.beginPath();
            ctx.moveTo(-this.size, 0);
            ctx.lineTo(this.size, 0);
            ctx.stroke();
            ctx.lineWidth = 8 * pct;
            ctx.strokeStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.8, 0);
            ctx.lineTo(this.size * 0.8, 0);
            ctx.stroke();
        }
        ctx.restore();
    }
}

class QuanCongSpaceDrop {
    constructor(x, y, dmgMult, master) {
        this.x = x;
        this.y = y;
        this.life = 20;
        this.maxLife = 20;
        this.dmgMult = dmgMult;
        this.master = master;
        this.radius = 250;
        this.hitDone = false;
        if (typeof playVoice === 'function' && typeof sfxSpaceQC !== 'undefined')
            playVoice(sfxSpaceQC);
    }
    update() {
        this.life--;
        if (this.life === 10 && !this.hitDone) {
            this.hitDone = true;
            triggerShake(40);
            let totalDmgDealt = 0;
            let killedAny = false;
            enemies.forEach(e => {
                if (Math.hypot(e.x - this.x, e.y - this.y) < this.radius) {
                    let dmg = 150 * this.dmgMult;
                    if (e.hp / e.maxHp < 0.3) {
                        dmg = e.hp + 9999;
                        killedAny = true;
                        floatTexts.push(new FloatText(e.x,e.y - 70,"KẾT LIỄU!","#e74c3c",35));
                    }
                    e.hp -= dmg;
                    e.hitFlash = 5;
                    e.states.knockup = 45;
                    totalDmgDealt += dmg;
                    floatTexts.push(new FloatText(e.x,e.y - 40,`-${Math.floor(dmg)}`,'#fff',25));
                }
            }
            );
            if (totalDmgDealt > 0) {
                let heal = Math.min(totalDmgDealt, this.master.maxHp * 0.5);
                this.master.hp = Math.min(this.master.maxHp, this.master.hp + heal);
                floatTexts.push(new FloatText(this.master.x,this.master.y - 50,"+" + Math.floor(heal),"#2ecc71",25));
            }
            if (killedAny) {
                this.master.skills.q.cdTimer = 0;
                this.master.skills.e.cdTimer = 0;
                this.master.skills.r.cdTimer = 0;
                this.master.skills.space.cdTimer = 0;
                floatTexts.push(new FloatText(this.master.x,this.master.y - 80,"RESET CHIÊU!","#f1c40f",20));
            }
            for (let i = 0; i < 40; i++)
                particles.push(new Particle(this.x,this.y,'#27ae60'));
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.life > 10) {
            let heightOffset = (this.life - 10) * 60;
            ctx.globalAlpha = 1 - (this.life - 10) / 10;
            ctx.translate(0, -heightOffset - 150);
            ctx.shadowBlur = 40;
            ctx.shadowColor = '#2ecc71';
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(-8, -250, 16, 250);
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(0, -250, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(25, 0);
            ctx.lineTo(15, 30);
            ctx.lineTo(-15, 30);
            ctx.fill();
            ctx.fillStyle = '#27ae60';
            ctx.beginPath();
            ctx.moveTo(-15, 30);
            ctx.quadraticCurveTo(-120, 150, -30, 280);
            ctx.lineTo(40, 180);
            ctx.lineTo(15, 30);
            ctx.fill();
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.moveTo(-5, 35);
            ctx.quadraticCurveTo(-80, 140, -15, 250);
            ctx.lineTo(20, 170);
            ctx.lineTo(5, 35);
            ctx.fill();
        } else {
            let pct = 1 - (this.life / 10);
            ctx.strokeStyle = `rgba(39, 174, 96, ${1 - pct})`;
            ctx.lineWidth = 20;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * pct, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function drawTankIchigo(ctx, radius, bodyAngle, turretAngle, isBankai) {
    ctx.save();
    ctx.rotate(bodyAngle);
    ctx.fillStyle = '#111';
    ctx.strokeStyle = isBankai ? '#e74c3c' : '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-radius, -radius * 0.8, radius * 2, radius * 1.6, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(radius * 0.8, 0);
    ctx.bezierCurveTo(radius, radius * 0.8, -radius * 0.2, radius, -radius * 0.4, 0);
    ctx.bezierCurveTo(-radius * 0.2, -radius, radius, -radius * 0.8, radius * 0.8, 0);
    ctx.fill();
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.2, 0);
    ctx.lineTo(radius * 0.6, radius * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-radius * 0.2, 0);
    ctx.lineTo(radius * 0.6, -radius * 0.5);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.rotate(turretAngle);
    ctx.fillStyle = '#222';
    ctx.fillRect(0, -5, radius * 1.5, 10);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e74c3c';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#e74c3c';
    ctx.beginPath();
    ctx.arc(radius * 0.2, 0, radius * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
class SharpSlashVFX {
    constructor(x, y, angle, speedMult=1) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.life = 20;
        this.maxLife = 20;
        this.speedMult = speedMult;
    }
    update() {
        this.life--;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        let pct = this.life / this.maxLife;
        ctx.globalAlpha = pct;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#e74c3c';
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(-100 * pct, -10);
        ctx.lineTo(100 * pct, 0);
        ctx.lineTo(-100 * pct, 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-100 * pct, -10);
        ctx.lineTo(100 * pct, 0);
        ctx.lineTo(-100 * pct, 10);
        ctx.stroke();
        ctx.restore();
    }
}
function drawTankNormal(ctx, radius, color, isPlayer, trackOffset, bodyAngle, turretAngle) {
    ctx.save();
    ctx.rotate(bodyAngle);
    ctx.fillStyle = '#222';
    let tw = radius * 0.8;
    let th = radius * 0.5;
    let offsetX = radius * 0.6;
    let offsetY = radius * 0.8;
    let drawTrack = (x, y) => {
        ctx.fillRect(x - tw / 2, y - th / 2, tw, th);
        ctx.fillStyle = '#444';
        let moveAnim = trackOffset % 8;
        if (moveAnim < 0)
            moveAnim += 8;
        for (let i = -tw / 2 - 8; i <= tw / 2 + 8; i += 8) {
            let lineX = i + moveAnim;
            if (lineX >= -tw / 2 && lineX <= tw / 2)
                ctx.fillRect(x + lineX - 1.5, y - th / 2 - 1, 3, th + 2);
        }
        ctx.fillStyle = '#222';
    }
    ;
    drawTrack(offsetX, offsetY);
    drawTrack(offsetX, -offsetY);
    drawTrack(-offsetX, offsetY);
    drawTrack(-offsetX, -offsetY);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-radius * 0.9, -radius * 0.7, radius * 1.8, radius * 1.4, 8);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.fillStyle = isPlayer ? '#f39c12' : '#c0392b';
    ctx.beginPath();
    ctx.roundRect(-radius * 0.5, -radius * 0.5, radius * 1.2, radius, 5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.rotate(turretAngle);
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(0, -radius * 0.25, radius * 1.5, radius * 0.5);
    ctx.strokeRect(0, -radius * 0.25, radius * 1.5, radius * 0.5);
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(radius * 1.2, -radius * 0.35, radius * 0.4, radius * 0.7);
    ctx.strokeRect(radius * 1.2, -radius * 0.35, radius * 0.4, radius * 0.7);
    ctx.fillStyle = '#34495e';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (isPlayer) {
        ctx.save();
        ctx.rotate(Date.now() * 0.015);
        ctx.fillStyle = '#bdc3c7';
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(radius * 0.4, radius * 0.2);
            ctx.lineTo(radius * 1.1, -radius * 0.6);
            ctx.lineTo(radius * 0.2, -radius * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.rotate((Math.PI * 2) / 3);
        }
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    ctx.restore();
  }
  

function drawTankHover(ctx, radius, bodyAngle, turretAngle) {
    ctx.save();
    ctx.rotate(bodyAngle);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.2, radius * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f1c40f';
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(radius * 1.2, 0);
    ctx.lineTo(radius * 0.5, radius * 0.8);
    ctx.lineTo(-radius, radius * 0.6);
    ctx.lineTo(-radius * 0.5, 0);
    ctx.lineTo(-radius, -radius * 0.6);
    ctx.lineTo(radius * 0.5, -radius * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    let drawCore = (x, y, s) => {
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    ;
    drawCore(-radius * 0.6, radius * 0.5, radius * 0.2);
    drawCore(-radius * 0.6, -radius * 0.5, radius * 0.2);
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.moveTo(radius * 0.8, radius * 0.4);
    ctx.lineTo(radius * 1.5, radius * 0.6);
    ctx.lineTo(radius, radius * 0.2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(radius * 0.8, -radius * 0.4);
    ctx.lineTo(radius * 1.5, -radius * 0.6);
    ctx.lineTo(radius, -radius * 0.2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.rotate(turretAngle);
    ctx.fillStyle = '#d35400';
    ctx.beginPath();
    ctx.roundRect(-radius * 0.4, -radius * 0.4, radius * 0.8, radius * 0.8, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(radius * 0.2, -radius * 0.15, radius * 1.2, radius * 0.3);
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.fillRect(radius * 1.3, -radius * 0.1, radius * 0.2, radius * 0.2);
    ctx.shadowBlur = 0;
    drawCore(0, 0, radius * 0.3);
    ctx.restore();
}
function drawTankTrieuVan(ctx, radius, bodyAngle, turretAngle) {
    ctx.save();
    ctx.rotate(bodyAngle);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.3, radius * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f1c40f';
    let drawSpike = (x, y, ang) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.3);
        ctx.lineTo(radius * 0.7, 0);
        ctx.lineTo(0, radius * 0.3);
        ctx.fill();
        ctx.restore();
    }
    ;
    drawSpike(-radius * 0.7, radius * 0.8, Math.PI * 0.75);
    drawSpike(-radius * 0.7, -radius * 0.8, -Math.PI * 0.75);
    drawSpike(radius * 0.6, radius * 0.8, Math.PI * 0.25);
    drawSpike(radius * 0.6, -radius * 0.8, -Math.PI * 0.25);
    ctx.fillStyle = '#0652DD';
    ctx.strokeStyle = '#12CBC4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.8, radius * 0.9);
    ctx.lineTo(radius * 0.6, radius * 0.9);
    ctx.lineTo(radius * 1.3, 0);
    ctx.lineTo(radius * 0.6, -radius * 0.9);
    ctx.lineTo(-radius * 0.8, -radius * 0.9);
    ctx.lineTo(-radius * 0.3, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.1, radius * 0.6);
    ctx.lineTo(radius * 0.5, 0);
    ctx.lineTo(-radius * 0.1, -radius * 0.6);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.rotate(turretAngle);
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.fillRect(radius * 0.4, -radius * 0.15, radius * 1.2, radius * 0.3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(radius * 0.4, -radius * 0.05, radius * 1.2, radius * 0.1);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#1e272e';
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.5, radius * 0.4);
    ctx.lineTo(radius * 0.5, radius * 0.3);
    ctx.lineTo(radius * 0.7, 0);
    ctx.lineTo(radius * 0.5, -radius * 0.3);
    ctx.lineTo(-radius * 0.5, -radius * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(radius * 0.4, radius * 0.15, radius * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(radius * 0.4, -radius * 0.15, radius * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.rotate(Date.now() * 0.01);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(radius * 0.12, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate((Math.PI * 2) / 3);
    }
    ctx.restore();
    ctx.restore();
}
function drawTankLuBu(ctx, radius, bodyAngle, turretAngle, isChienThan, passiveCrit) {
    ctx.save();
    ctx.rotate(bodyAngle);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.4, radius * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    if (isChienThan) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#f1c40f';
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.5)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.8 + Math.sin(Date.now() * 0.01) * 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    ctx.fillStyle = '#00e5ff';
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 2;
    let drawBlade = (yMult) => {
        ctx.beginPath();
        ctx.moveTo(-radius * 0.8, radius * 0.8 * yMult);
        ctx.lineTo(radius * 0.2, radius * 1.4 * yMult);
        ctx.lineTo(radius * 1.5, radius * 0.6 * yMult);
        ctx.lineTo(radius * 0.5, radius * 0.5 * yMult);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    ;
    drawBlade(1);
    drawBlade(-1);
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.moveTo(-radius, radius * 0.6);
    ctx.lineTo(radius * 1.2, 0);
    ctx.lineTo(-radius, -radius * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(-radius * 0.5, radius * 0.4);
    ctx.lineTo(radius * 1.4, 0);
    ctx.lineTo(-radius * 0.5, -radius * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1;
    let drawHorn = (yMult) => {
        ctx.beginPath();
        ctx.moveTo(-radius * 0.2, radius * 0.3 * yMult);
        ctx.quadraticCurveTo(-radius * 1.5, radius * 0.8 * yMult, -radius * 2.5, radius * 0.5 * yMult);
        ctx.quadraticCurveTo(-radius * 1.2, radius * 0.4 * yMult, -radius * 0.5, radius * 0.1 * yMult);
        ctx.fill();
        ctx.stroke();
    }
    ;
    drawHorn(1);
    drawHorn(-1);
    ctx.restore();
    ctx.save();
    ctx.rotate(turretAngle);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, -5, radius * 2, 10);
    if (passiveCrit) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#e74c3c';
        ctx.fillStyle = '#e74c3c';
    } else {
        ctx.fillStyle = '#00e5ff';
    }
    ctx.beginPath();
    ctx.moveTo(radius * 1.8, -15);
    ctx.lineTo(radius * 2.5, 0);
    ctx.lineTo(radius * 1.8, 15);
    ctx.lineTo(radius * 1.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(radius * 1.5, 10);
    ctx.lineTo(radius * 1.8, 25);
    ctx.lineTo(radius * 2.0, 5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(radius * 1.5, -10);
    ctx.lineTo(radius * 1.8, -25);
    ctx.lineTo(radius * 2.0, -5);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00e676';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
function drawTankThachSanh(ctx, r, color, isSpace, ba, ta, opacity=1) {
    ctx.globalAlpha = opacity;
    ctx.save();
    if (isSpace) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.6)';
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    ctx.rotate(ba);
    let wW = r * 0.6;
    let wH = r * 0.9;
    let drawWheel = (x, y) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.roundRect(-wW / 2 - 3, -wH / 2 - 3, wW + 6, wH + 6, 4);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        for (let i = -wH / 2 + 3; i <= wH / 2 - 3; i += 6) {
            ctx.beginPath();
            ctx.moveTo(-wW / 2 - 3, i);
            ctx.lineTo(wW / 2 + 3, i);
            ctx.stroke();
        }
        ctx.fillStyle = '#b87333';
        ctx.beginPath();
        ctx.roundRect(-wW / 2, -wH / 2 + 2, wW, wH - 4, 2);
        ctx.fill();
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, wW * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8b4513';
        for (let i = 0; i < 8; i++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath();
            ctx.moveTo(-1, 0);
            ctx.lineTo(1, 0);
            ctx.lineTo(0, -wW * 0.3);
            ctx.fill();
        }
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.arc(0, 0, wW * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    ;
    let offX = r * 0.8;
    let offY = r * 0.85;
    drawWheel(offX, offY);
    drawWheel(offX, -offY);
    drawWheel(-offX, offY);
    drawWheel(-offX, -offY);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-r * 0.9, -r * 0.7, r * 1.8, r * 1.4, 5);
    ctx.fill();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.rotate(ta - ba);
    let bowW = r * 2.8;
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(r * 0.3, -bowW / 2);
    ctx.quadraticCurveTo(r * 1.5, -bowW / 4, r * 1.2, 0);
    ctx.quadraticCurveTo(r * 1.5, bowW / 4, r * 0.3, bowW / 2);
    ctx.quadraticCurveTo(r * 0.8, bowW / 4, r * 0.5, 0);
    ctx.quadraticCurveTo(r * 0.8, -bowW / 4, r * 0.3, -bowW / 2);
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r * 0.6, -bowW * 0.3);
    ctx.quadraticCurveTo(r * 1.0, -bowW * 0.15, r * 0.8, -10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r * 0.6, bowW * 0.3);
    ctx.quadraticCurveTo(r * 1.0, bowW * 0.15, r * 0.8, 10);
    ctx.stroke();
    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.moveTo(-r * 0.2, -15);
    ctx.lineTo(r * 0.9, 0);
    ctx.lineTo(-r * 0.2, 15);
    ctx.fill();
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = '#e0ffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(r * 0.3, -bowW / 2);
    ctx.lineTo(-r * 0.5, 0);
    ctx.lineTo(r * 0.3, bowW / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(-r * 0.6, -2, r * 1.8, 4);
    ctx.fillStyle = '#ecf0f1';
    ctx.beginPath();
    ctx.moveTo(r * 1.2, -6);
    ctx.lineTo(r * 1.8, 0);
    ctx.lineTo(r * 1.2, 6);
    ctx.fill();
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, -2);
    ctx.lineTo(-r * 0.8, -8);
    ctx.lineTo(-r * 0.4, -2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-r * 0.6, 2);
    ctx.lineTo(-r * 0.8, 8);
    ctx.lineTo(-r * 0.4, 2);
    ctx.fill();
    ctx.restore();
}

function drawLightning(ctx, x1, y1, x2, y2, color) {
    let segments = 5;
    let dx = (x2 - x1) / segments;
    let dy = (y2 - y1) / segments;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let i = 1; i < segments; i++) {
        let nx = x1 + dx * i + (Math.random() - 0.5) * 20;
        let ny = y1 + dy * i + (Math.random() - 0.5) * 20;
        ctx.lineTo(nx, ny);
    }
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function drawBossGeneric(ctx, radius, bossType, bodyAngle) {
    ctx.save();
    ctx.rotate(bodyAngle);
    if (bossType === 'kyuubi') {
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 9; i++) {
            ctx.save();
            ctx.rotate(Math.PI + (i - 4) * 0.3);
            ctx.fillStyle = '#d35400';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(radius, radius * 1.5, radius * 2, 0);
            ctx.quadraticCurveTo(radius, -radius * 1.5, 0, 0);
            ctx.fill();
            ctx.restore();
        }
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(radius * 0.5, radius * 0.3, 10, 0, Math.PI * 2);
        ctx.arc(radius * 0.5, -radius * 0.3, 10, 0, Math.PI * 2);
        ctx.fill();
    } else if (bossType === 'pikachu') {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(-radius * 1.5, -5, radius * 3, 10);
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(0, radius * 0.6, 20, 0, Math.PI * 2);
        ctx.arc(0, -radius * 0.6, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        ctx.lineTo(-radius * 2.5, -radius);
        ctx.lineTo(-radius * 2, 0);
        ctx.lineTo(-radius * 2.5, radius);
        ctx.fill();
    } else if (bossType === 'spider') {
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(-radius * 0.5, 0, radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(radius * 0.8, 0, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 15;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(radius * 1.5, radius * (0.5 + i * 0.5));
            ctx.lineTo(radius * 2, radius * (1 + i * 0.5));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(radius * 1.5, -radius * (0.5 + i * 0.5));
            ctx.lineTo(radius * 2, -radius * (1 + i * 0.5));
            ctx.stroke();
        }
    } else if (bossType === 'scorpion') {
        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(radius * 0.5, radius * 0.5);
        ctx.lineTo(radius * 1.5, radius);
        ctx.arc(radius * 1.5, radius, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(radius * 0.5, -radius * 0.5);
        ctx.lineTo(radius * 1.5, -radius);
        ctx.arc(radius * 1.5, -radius, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        ctx.quadraticCurveTo(-radius * 2, radius * 1.5, -radius * 0.5, radius * 2);
        ctx.stroke();
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(-radius * 0.5, radius * 2, 20, 0, Math.PI * 2);
        ctx.fill();
    } else if (bossType === 'golem') {
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(-radius, -radius * 0.8, radius * 2, radius * 1.6);
        ctx.fillStyle = '#95a5a6';
        ctx.fillRect(radius * 0.2, radius * 0.9, radius, radius * 0.8);
        ctx.fillRect(radius * 0.2, -radius * 1.7, radius, radius * 0.8);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(radius * 0.6, -10, 20, 20);
    } else {
        ctx.fillStyle = '#8e44ad';
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        for (let i = 0; i < 10; i++) {
            let r = (i % 2 === 0) ? radius : radius * 0.5;
            let a = (i / 10) * Math.PI * 2;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.fill();
    }
    ctx.restore();
}

class Barrel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hp = 100;
        this.radius = 25;
        this.active = true;
        this.hitFlash = 0;
    }
    update() {
        if (this.hitFlash > 0)
            this.hitFlash--;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.hitFlash > 0 ? '#fff' : '#c0392b';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fillRect(-10, -this.radius, 20, 6);
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TNT', 0, 4);
        ctx.restore();
    }
}
class Skill {
    constructor(cdFrames, manaCost) {
        this.cdMax = cdFrames;
        this.cdTimer = 0;
        this.manaCost = manaCost;
    }
    isReady(playerMp) {
        // Nếu có lõi Huyết Tế, chỉ cần đủ máu (không cần mana)
        if (typeof player !== 'undefined' && player.augBloodMagic) {
            return this.cdTimer <= 0 && player.hp > this.manaCost;
        }
        return this.cdTimer <= 0 && playerMp >= this.manaCost;
    }
    activate(player) {
        if (this.cdTimer <= 0) {
            if (player.augBloodMagic) {
                if (player.hp > this.manaCost) {
                    // Trừ máu để xài chiêu
                    player.hp -= this.manaCost;
                    this.cdTimer = this.cdMax;
                    floatTexts.push(new FloatText(player.x,player.y + 30,`-${this.manaCost} HP`,'#e74c3c',16));
                    return true;
                }
            } else if (player.mp >= this.manaCost) {
                this.cdTimer = this.cdMax;
                player.mp -= this.manaCost;
                return true;
            }
        }
        return false;
    }
    update() {
        if (this.cdTimer > 0)
            this.cdTimer--;
    }
}
class SlashVFX {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.life = 20;
        this.maxLife = 20;
        this.radius = 200;
    }
    update() {
        this.life--;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        let progress = 1 - (this.life / this.maxLife);
        let startAng = -Math.PI / 2;
        let endAng = Math.PI / 2;
        let currentAng = startAng + (endAng - startAng) * progress;

        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);

        // --- ĐÃ FIX CHÍNH TẢ: lubu ---
        let isLubu = (typeof player !== 'undefined' && player.heroClass === 'lubu');
        ctx.fillStyle = isLubu ? 'rgba(231, 76, 60, 0.3)' : 'rgba(0, 229, 255, 0.25)';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, this.radius, startAng, currentAng);
        ctx.closePath();
        ctx.fill();

        ctx.rotate(currentAng);
        ctx.translate(this.radius * 0.7, 0);
        ctx.rotate(Math.PI / 2);

        // --- ĐÃ FIX CHÍNH TẢ: isLubu ---
        if (isLubu && window.imgLuboQ && window.imgLuboQ.complete) {
            let img = window.imgLuboQ;
            let wCua1O = img.naturalWidth / 6;
            let hCua1O = img.naturalHeight;

            let beRong = 120;
            let chieuDai = 180;

            ctx.rotate(Math.PI);

            ctx.drawImage(img, 0, 0, wCua1O, hCua1O, -beRong / 2, -chieuDai / 2 - 30, beRong, chieuDai);
        } else {
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(-4, -70, 8, 140);
            ctx.fillStyle = '#00e5ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00e676';
            ctx.beginPath();
            ctx.moveTo(-10, -70);
            ctx.lineTo(0, -110);
            ctx.lineTo(10, -70);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(6, -45);
            ctx.quadraticCurveTo(45, -25, 6, 25);
            ctx.lineTo(6, 15);
            ctx.quadraticCurveTo(30, -10, 6, -35);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }
}
class AoeWarning {
    constructor(x, y, radius, time, type, dmg) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.maxTime = time;
        this.time = time;
        this.type = type;
        this.dmg = dmg;
        this.active = true;
    }
    update() {
        this.time--;
        if (this.time <= 0) {
            this.active = false;
            if (this.type === 'rocket') {
                explode(this.x, this.y, this.radius, this.dmg);
            } else if (this.type === 'shockwave') {
                triggerShake(30);
                SFX.play('explosion');
                let dist = Math.hypot(player.x - this.x, player.y - this.y);
                if (dist < this.radius && player.buffs.shield <= 0 && !player.states.untargetable) {
                    player.hp -= this.dmg;
                    player.hitFlash = 10;
                    player.x += (player.x - this.x) * 0.2;
                    player.y += (player.y - this.y) * 0.2;
                    floatTexts.push(new FloatText(player.x,player.y - 30,`-${Math.floor(this.dmg)}`,'#e74c3c',25));
                }
                for (let i = 0; i < 30; i++)
                    particles.push(new Particle(this.x,this.y,'#9b59b6'));
            } else if (this.type === 'poison') {
                zones.push(new PoisonZone(this.x,this.y));
            }
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        let pct = 1 - (this.time / this.maxTime);
        ctx.fillStyle = this.type === 'poison' ? 'rgba(46, 204, 113, 0.4)' : 'rgba(231, 76, 60, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * pct, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
class PoisonZone {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 300;
        this.radius = 120;
    }
    update() {
        this.life--;
        if (!player.states.untargetable && Math.hypot(player.x - this.x, player.y - this.y) < this.radius) {
            player.states.bleeding = 10;
            if (this.life % 30 === 0 && player.buffs.shield <= 0) {
                player.hp -= 2.5;
                floatTexts.push(new FloatText(player.x,player.y - 20,"-2.5","#2ecc71",14));
            }
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(46, 204, 113, 0.4)';
        ctx.fill();
        ctx.restore();
    }
}
class BlackHoleZone {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.life = 300;
        this.radius = radius;
        this.angle = 0;
    }
    update() {
        this.life--;
        this.angle += 0.2;
        let dist = Math.hypot(player.x - this.x, player.y - this.y);
        if (dist < this.radius && !player.states.untargetable) {
            player.x += (this.x - player.x) * 0.05;
            player.y += (this.y - player.y) * 0.05;
            if (this.life % 20 === 0) {
                player.hp -= 10;
                player.hitFlash = 3;
                floatTexts.push(new FloatText(player.x,player.y - 20,"-10","#9b59b6",18));
            }
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * (this.life / 300), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8e44ad';
        ctx.lineWidth = 5;
        ctx.stroke();
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * (this.life / 300) * (0.3 + i * 0.3), 0, Math.PI * 1.5);
            ctx.stroke();
        }
        ctx.restore();
    }
}
class LaserTelegraph {
    constructor(source, targetX, targetY, time, dmg) {
        this.source = source;
        this.angle = Math.atan2(targetY - source.y, targetX - source.x);
        this.maxTime = time;
        this.time = time;
        this.dmg = dmg;
        this.active = true;
        this.length = 1500;
        SFX.play('zap');
    }
    update() {
        this.time--;
        if (this.time <= 0) {
            this.active = false;
            SFX.play('shoot');
            triggerShake(15);
            let endX = this.source.x + Math.cos(this.angle) * this.length;
            let endY = this.source.y + Math.sin(this.angle) * this.length;
            let lineLen = Math.hypot(endX - this.source.x, endY - this.source.y);
            let dot = (((player.x - this.source.x) * (endX - this.source.x)) + ((player.y - this.source.y) * (endY - this.source.y))) / Math.pow(lineLen, 2);
            let closestX = this.source.x + dot * (endX - this.source.x);
            let closestY = this.source.y + dot * (endY - this.source.y);
            if (!player.states.untargetable && dot >= 0 && dot <= 1 && Math.hypot(player.x - closestX, player.y - closestY) < player.radius + 20) {
                if (player.buffs.shield <= 0) {
                    player.hp -= this.dmg;
                    player.hitFlash = 10;
                    player.states.stunned = 30;
                    floatTexts.push(new FloatText(player.x,player.y - 30,`-${Math.floor(this.dmg)}`,'#e74c3c',25));
                    floatTexts.push(new FloatText(player.x,player.y - 50,`STUNNED!`,'#f1c40f',20));
                }
            }
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
            ctx.lineWidth = 40;
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'red';
            ctx.beginPath();
            ctx.moveTo(this.source.x, this.source.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.source.x, this.source.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = `rgba(255, 0, 0, ${0.3 + (1 - this.time / this.maxTime) * 0.7})`;
        ctx.lineWidth = 2 + (1 - this.time / this.maxTime) * 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.length, 0);
        ctx.stroke();
        ctx.restore();
    }
}
class ExpOrb {
    constructor(x, y, amount) {
        this.x = x;
        this.y = y;
        this.amount = amount;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.active = true;
        this.magnetized = false;
    }
    update() {
        if (this.magnetized && !player.states.untargetable) {
            let dx = player.x - this.x;
            let dy = player.y - this.y;
            let dist = Math.hypot(dx, dy);
            if (dist < 20) {
                player.gainXp(this.amount);
                SFX.play('coin');
                this.active = false;
            } else {
                this.x += (dx / dist) * 15;
                this.y += (dy / dist) * 15;
            }
        } else {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.85;
            this.vy *= 0.85;
            if (!player.states.untargetable && Math.hypot(player.x - this.x, player.y - this.y) < 300)
                this.magnetized = true;
        }
    }
    draw() {
        ctx.fillStyle = '#9b59b6';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#8e44ad';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.5) * 12;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
        this.size = Math.random() * 6 + 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.9;
        this.vy *= 0.9;
        this.life -= this.decay;
    }
    draw() {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}
class Pet {
    constructor(x, y, master) {
        this.x = x;
        this.y = y;
        this.master = master;
        this.radius = master.radius * 2;
        this.maxHp = master.maxHp * 2.0;
        this.hp = this.maxHp;
        this.atk = master.baseDmgMult;
        this.life = 600;
        this.atkCooldown = 0;
        this.active = true;
    }
    update() {
        this.life--;
        if (this.life <= 0 || this.hp <= 0) {
            this.active = false;
            for (let i = 0; i < 20; i++)
                particles.push(new Particle(this.x,this.y,'#f1c40f'));
            return;
        }
        let target = null;
        let minDist = 600;
        enemies.forEach(e => {
            let d = Math.hypot(e.x - this.x, e.y - this.y);
            if (d < minDist) {
                minDist = d;
                target = e;
            }
        }
        );
        if (target && minDist > 200) {
            this.x += (target.x - this.x) * 0.02;
            this.y += (target.y - this.y) * 0.02;
        }
        if (this.atkCooldown > 0)
            this.atkCooldown--;
        if (target && this.atkCooldown <= 0) {
            let angle = Math.atan2(target.y - this.y, target.x - this.x);
            SFX.play('zap');
            shoot(this.x, this.y, angle, 'pika_ball', this.atk);
            this.atkCooldown = 35;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y + Math.sin(Date.now() * 0.01) * 5);
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(-this.radius * 0.5, -this.radius * 0.8);
        ctx.lineTo(-this.radius, -this.radius * 1.5);
        ctx.lineTo(0, -this.radius);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.radius * 0.5, -this.radius * 0.8);
        ctx.lineTo(this.radius, -this.radius * 1.5);
        ctx.lineTo(0, -this.radius);
        ctx.fill();
        let barW = this.radius * 1.5;
        ctx.fillStyle = '#000';
        ctx.fillRect(-barW / 2, -this.radius - 15, barW, 6);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(-barW / 2, -this.radius - 15, barW * (this.hp / this.maxHp), 6);
        ctx.restore();
    }
}
class DragonProj {
    constructor(x, y, angle, dmgMult, master) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.dmgMult = dmgMult;
        this.master = master;
        this.speed = 36;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.active = true;
        this.radius = 40;
        this.dist = 0;
        this.maxDist = 800;
        this.trail = [];
        this.hitTargets = new Set();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.dist += this.speed;
        this.trail.push({
            x: this.x,
            y: this.y
        });
        if (this.trail.length > 20)
            this.trail.shift();

        if (!checkWall(this.master, this.x, this.master.y))
            this.master.x = this.x;
        if (!checkWall(this.master, this.master.x, this.y))
            this.master.y = this.y;
        this.master.states.stunned = 2;

        enemies.forEach(e => {
            if (Math.hypot(e.x - this.x, e.y - this.y) < 150) {
                let pX = this.vx * 0.7;
                let pY = this.vy * 0.7;
                if (!checkWall(e, e.x + pX, e.y))
                    e.x += pX;
                if (!checkWall(e, e.x, e.y + pY))
                    e.y += pY;

                if (!this.hitTargets.has(e)) {
                    this.hitTargets.add(e);
                    let dmg = 25 * this.dmgMult;
                    e.hp -= dmg;
                    e.hitFlash = 5;
                    floatTexts.push(new FloatText(e.x,e.y - 30,`-${Math.floor(dmg)}`,'#fff',18));

                    // ĐÃ SỬA: Hút 100% máu (nhân với 1.0)
                    let heal = dmg * 1.0;
                    this.master.hp = Math.min(this.master.maxHp, this.master.hp + heal);
                    floatTexts.push(new FloatText(this.master.x,this.master.y - 40,`+${Math.floor(heal)}`,'#2ecc71',16));
                }
            }
        }
        );

        if (checkWall({
            radius: this.master.radius + 15
        }, this.x, this.y) || this.dist > this.maxDist) {
            this.active = false;
            if (typeof SFX !== 'undefined' && SFX.play)
                SFX.play('rasengan_boom');
            triggerShake(15);
            zones.push(new DragonVortex(this.x,this.y,this.dmgMult,this.master));
        }
    }

    draw() {
        ctx.save();
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 8;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#0984e3';
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
            let p = this.trail[i];
            let offset = Math.sin(i * 0.5 - Date.now() * 0.01) * 30;
            let nx = p.x + Math.cos(this.angle + Math.PI / 2) * offset;
            let ny = p.y + Math.sin(this.angle + Math.PI / 2) * offset;
            if (i === 0)
                ctx.moveTo(nx, ny);
            else
                ctx.lineTo(nx, ny);
        }
        ctx.stroke();
        ctx.strokeStyle = '#0984e3';
        ctx.beginPath();
        for (let i = 0; i < this.trail.length; i++) {
            let p = this.trail[i];
            let offset = Math.sin(i * 0.5 - Date.now() * 0.01 + Math.PI) * 30;
            let nx = p.x + Math.cos(this.angle + Math.PI / 2) * offset;
            let ny = p.y + Math.sin(this.angle + Math.PI / 2) * offset;
            if (i === 0)
                ctx.moveTo(nx, ny);
            else
                ctx.lineTo(nx, ny);
        }
        ctx.stroke();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class DragonVortex {
    constructor(x, y, dmgMult, master) {
        this.x = x;
        this.y = y;
        this.life = 45;
        this.radius = 300;
        this.angle = 0;
        this.dmg = 50 * dmgMult;
        this.master = master;
    }

    update() {
        this.life--;
        this.angle += 0.2;
        enemies.forEach(e => {
            let d = Math.hypot(e.x - this.x, e.y - this.y);
            if (d < this.radius) {
                e.x += (this.x - e.x) * 0.08;
                e.y += (this.y - e.y) * 0.08;
                e.states.silenced = 5;
            }
        }
        );

        if (this.life <= 0) {
            triggerShake(20);
            if (typeof SFX !== 'undefined' && SFX.play)
                SFX.play('explosion');
            for (let i = 0; i < 40; i++)
                particles.push(new Particle(this.x,this.y,'#0984e3'));

            enemies.forEach(e => {
                if (Math.hypot(e.x - this.x, e.y - this.y) < this.radius) {
                    e.hp -= this.dmg;
                    e.hitFlash = 5;
                    e.states.knockup = 30;
                    e.states.slowed = 120;
                    floatTexts.push(new FloatText(e.x,e.y - 30,`-${Math.floor(this.dmg)}`,'#fff',25));
                    floatTexts.push(new FloatText(e.x,e.y - 50,"SLOWED!","#00ffff",15));

                    // ĐÃ SỬA: Hút 100% máu khi nổ lốc xoáy (nhân với 1.0)
                    let heal = this.dmg * 1.0;
                    this.master.hp = Math.min(this.master.maxHp, this.master.hp + heal);
                    floatTexts.push(new FloatText(this.master.x,this.master.y - 40,`+${Math.floor(heal)}`,'#2ecc71',16));
                }
            }
            );
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = 'rgba(9, 132, 227, 0.6)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * (this.life / 45), 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 210, 211, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * (this.life / 45) * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
class RasenganProj {
    constructor(x, y, tx, ty, dmgMult) {
        this.x = x;
        this.y = y;
        this.tx = tx;
        this.ty = ty;
        this.dmgMult = dmgMult;
        let angle = Math.atan2(ty - y, tx - x);
        this.speed = 24;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.active = true;
        this.radius = 35;
        this.angle = 0;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += 0.25;
        let dist = Math.hypot(this.tx - this.x, this.ty - this.y);
        if (dist < this.speed || checkWall({
            radius: this.radius
        }, this.x, this.y)) {
            this.active = false;
            SFX.play('rasengan_boom');
            triggerShake(20);
            zones.push(new RasenganZone(this.x,this.y,this.dmgMult));
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.radius * 0.5, this.radius * 0.2, this.radius, 0);
            ctx.quadraticCurveTo(this.radius * 0.5, -this.radius * 0.1, 0, 0);
            ctx.fill();
            ctx.rotate(Math.PI / 2);
        }
        ctx.fillStyle = '#a9cce3';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
class RasenganZone {
    constructor(x, y, dmgMult) {
        this.x = x;
        this.y = y;
        this.life = 300;
        this.radius = 200;
        this.angle = 0;
        this.dmg = 2.0 * dmgMult;
    }
    update() {
        this.life--;
        this.angle += 0.15;
        enemies.forEach(e => {
            let d = Math.hypot(e.x - this.x, e.y - this.y);
            if (d < this.radius) {
                e.hp -= this.dmg;
                e.hitFlash = 2;
                e.states.silenced = 5;
                e.x += (this.x - e.x) * 0.01;
                e.y += (this.y - e.y) * 0.01;
                if (player && player.heroClass === 'kyuubi' && player.buffs.nineTails > 0) {
                    let heal = this.dmg * 0.5;
                    player.hp = Math.min(player.maxHp, player.hp + heal);
                    if (this.life % 15 === 0)
                        floatTexts.push(new FloatText(player.x,player.y - 40,"+" + Math.floor(heal * 15),"#2ecc71",14));
                }
            }
        }
        );
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.radius * 0.5, this.radius * 0.2, this.radius, 0);
            ctx.quadraticCurveTo(this.radius * 0.5, -this.radius * 0.1, 0, 0);
            ctx.fill();
            ctx.rotate(Math.PI / 2);
        }
        ctx.fillStyle = 'rgba(169, 204, 227, 0.6)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Bullet {
    constructor(x, y, angle, type, damageMult=1.0, owner='player') {
        this.x = x + Math.cos(angle) * 45;
        this.y = y + Math.sin(angle) * 45;
        this.type = type;
        this.angle = angle;
        this.owner = owner;

        let sMap = {
            'player': 16,
            'phuonghoang_attack': 18,
            'ichigo_q': 15,
            'ichigo_knife': 32,
            'ichigo_attack': 18,
            'ichigo_attack_bankai': 28,
            'pika_attack': 20,
            'trieuvan_attack': 20,
            'lubu_attack': 25,
            'lubu_q': 10,
            'pika_e': 10,
            'pika_ball': 16,
            'enemy': 8,
            'enemy_heavy': 12,
            'enemy_stun': 5,
            'shuriken_r': 20,
            'clone_slow': 7,
            'clone_knockup': 7,
            'kamikaze': 18,
            'sniper': 30,
            'spider_web': 12,
            'cannon_ball': 7,
            'snake_poison': 12,
            'wall_maker': 10,
            'thachsanh_arrow': 20,
            'thachsanh_e_arrow': 20,
            'thachsanh_giant_arrow': 30,
            'boss_rocket': 6,
            'quancong_r': 24,
            'quancong_bullet': 12
        };
        let dMap = {
            'player': 15,
            'phuonghoang_attack': 15,
            'pika_attack': 12,
            'ichigo_attack': 15,
            'ichigo_attack_bankai': 30,
            'trieuvan_attack': 15,
            'lubu_attack': 20,
            'lubu_q': 45,
            'pika_e': 40,
            'pika_ball': 25,
            'enemy': 15,
            'enemy_heavy': 50,
            'enemy_stun': 16,
            'shuriken_r': 150,
            'clone_slow': 40,
            'clone_knockup': 80,
            'kamikaze': 15,
            'sniper': 40,
            'spider_web': 10,
            'cannon_ball': 80,
            'snake_poison': 15,
            'wall_maker': 0,
            'ichigo_q': 50,
            'ichigo_knife': 40,
            'thachsanh_arrow': 20,
            'thachsanh_e_arrow': 12,
            'thachsanh_giant_arrow': 45,
            'boss_rocket': 60,
            'quancong_r': 40,
            'quancong_bullet': 15
        };
        let rMap = {
            'player': 8,
            'phuonghoang_attack': 12,
            'pika_attack': 6,
            'ichigo_attack': 10,
            'ichigo_attack_bankai': 15,
            'trieuvan_attack': 12,
            'lubu_attack': 15,
            'lubu_q': 20,
            'pika_e': 15,
            'pika_ball': 10,
            'enemy': 6,
            'enemy_heavy': 12,
            'enemy_stun': 8,
            'shuriken_r': 40,
            'clone_slow': 20,
            'clone_knockup': 25,
            'kamikaze': 6,
            'sniper': 8,
            'spider_web': 12,
            'cannon_ball': 25,
            'snake_poison': 10,
            'wall_maker': 15,
            'ichigo_q': 30,
            'ichigo_knife': 30,
            'thachsanh_arrow': 16,
            'thachsanh_e_arrow': 20,
            'thachsanh_giant_arrow': 30,
            'boss_rocket': 20,
            'quancong_r': 35,
            'quancong_bullet': 10
        };
        let rangeMap = {
            'player': 600,
            'phuonghoang_attack': 600,
            'pika_attack': 700,
            'trieuvan_attack': 600,
            'lubu_attack': 350,
            'lubu_q': 600,
            'pika_e': 1200,
            'pika_ball': 500,
            'enemy': 600,
            'enemy_heavy': 600,
            'enemy_stun': 600,
            'shuriken_r': 800,
            'clone_slow': 800,
            'clone_knockup': 800,
            'kamikaze': 600,
            'sniper': 1200,
            'spider_web': 600,
            'cannon_ball': 800,
            'snake_poison': 600,
            'wall_maker': 400,
            'thachsanh_arrow': 600,
            'thachsanh_e_arrow': 600,
            'thachsanh_giant_arrow': 1200,
            'boss_rocket': 1500,
            'quancong_r': 700,
            'quancong_bullet': 700
        };

        this.maxRange = rangeMap[type] || 600;
        this.distTraveled = 0;
        this.speed = sMap[type] || 10;
        this.damage = (dMap[type] || 10) * damageMult;
        this.radius = rMap[type] || 10;
        if (this.type === 'ichigo_knife') {
            this.maxRange = 280;
            this.speed = 45;
        }

        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.active = true;
        this.hitTargets = new Set();
        this.trail = [];
        this.bounceCount = 0;
        this.isCrit = false;
    }
    update() {
        if (this.type === 'boss_rocket' && !player.states.untargetable) {
            let pa = Math.atan2(player.y - this.y, player.x - this.x);
            let diff = pa - this.angle;
            while (diff < -Math.PI)
                diff += Math.PI * 2;
            while (diff > Math.PI)
                diff -= Math.PI * 2;
            this.angle += diff * 0.05;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.distTraveled += this.speed;
        this.trail.push({
            x: this.x,
            y: this.y
        });
        if (this.trail.length > 8)
            this.trail.shift();
        // --- LOGIC VA CHẠM QUÁI: NỔ LAN KHI CHẠM ---
        if (this.owner === 'player' && typeof enemies !== 'undefined') {
            for (let e of enemies) {
                // Kiểm tra khoảng cách giữa đạn và quái
                if (this.active && Math.hypot(this.x - e.x, this.y - e.y) < this.radius + (e.radius || 25)) {
                    if (this.type === 'ichigo_attack_bankai') {
                        this.active = false;
                        // Đạn biến mất để kích hoạt hiệu ứng nổ bên dưới
                        break;
                    } else if (this.type === 'ichigo_attack') {
                        e.hp -= this.damage;
                        e.hitFlash = 5;
                        floatTexts.push(new FloatText(e.x,e.y - 30,`-${Math.floor(this.damage)}`,'#f1f1f1',20));
                        this.active = false;
                        // Đạn thường chạm là mất
                        break;
                    }
                }
            }
        }
        if (this.type === 'wall_maker' && this.distTraveled > this.maxRange) {
            this.active = false;
            blockWalls.push(new BlockWall(this.x,this.y,this.angle + Math.PI / 2));
            return;
        }
        let hitWall = checkWall(this, this.x, this.y);
        let isPiercing = this.type.includes('clone') || this.type === 'pika_e' || this.type === 'ichigo_q' || this.type === 'ichigo_knife' || this.type === 'thachsanh_giant_arrow' || this.type === 'lubu_q';
        // Kiểm tra điều kiện đạn biến mất (ra ngoài map, đụng tường, hoặc đã chạm quái ở trên)
        if (this.x < 0 || this.x > WORLD_W || this.y < 0 || this.y > WORLD_H || (!isPiercing && hitWall) || this.distTraveled > this.maxRange || !this.active) {

            // --- KÍCH HOẠT NỔ LAN CHO ĐẠN BANKAI ---
            // --- LOGIC NỔ BANKAI: MẶC ĐỊNH 100% CHÍ MẠNG ---
            if (this.type === 'ichigo_attack_bankai') {
                let explosionRadius = 140;
                let totalDamageDealt = 0;
                triggerShake(15);

                enemies.forEach(e => {
                    let dist = Math.hypot(this.x - e.x, this.y - e.y);
                    if (dist < explosionRadius) {
                        // Bơm thẳng x1.5 sát thương luôn, không cần check if(isCrit) nữa
                        let finalDmg = this.damage * 1.5;

                        // Chữ và số Máu Đỏ Rực
                        floatTexts.push(new FloatText(e.x,e.y - 65,"CRIT!","#ff0000",28));
                        floatTexts.push(new FloatText(e.x,e.y - 35,`-${Math.floor(finalDmg)}`,'#ff0000',24));

                        e.hp -= finalDmg;
                        e.hitFlash = 5;
                        totalDamageDealt += finalDmg;
                    }
                }
                );

                // XỬ LÝ HÚT MÁU
                if (totalDamageDealt > 0 && typeof player !== 'undefined') {
                    let healAmount = totalDamageDealt * 0.3;
                    // Hút 30% máu
                    player.hp = Math.min(player.maxHp, player.hp + healAmount);
                    floatTexts.push(new FloatText(player.x,player.y - 50,`+${Math.floor(healAmount)} HP`,"#2ecc71",22));
                }

                if (typeof explode === 'function')
                    explode(this.x, this.y, explosionRadius, 0);
            }

            this.active = false;
            if (this.type === 'shuriken_r') {
                triggerShake(20);
                explode(this.x, this.y, 250, this.damage);
            }
            if (this.type === 'pika_ball') {
                explode(this.x, this.y, 150, this.damage);
            }
            if (this.type === 'cannon_ball' || this.type === 'boss_rocket') {
                explode(this.x, this.y, 200, this.damage);
            }
            if (this.type === 'wall_maker') {
                blockWalls.push(new BlockWall(this.x,this.y,this.angle + Math.PI / 2));
            }
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.type === 'player') {
            ctx.rotate(Date.now() * 0.05);
            ctx.fillStyle = '#f1c40f';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#e67e22';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(this.radius * 0.5, this.radius);
                ctx.lineTo(0, this.radius * 1.8);
                ctx.lineTo(-this.radius * 0.5, this.radius);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.rotate((Math.PI * 2) / 3);
            }
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else if (this.type === 'phuonghoang_attack') {
            ctx.rotate(this.angle);
            ctx.fillStyle = '#e74c3c';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#e67e22';
            ctx.beginPath();
            ctx.moveTo(this.radius, 0);
            ctx.lineTo(-this.radius, this.radius * 0.8);
            ctx.lineTo(-this.radius * 0.5, 0);
            ctx.lineTo(-this.radius, -this.radius * 0.8);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        } else if (this.type === 'pika_attack') {
            ctx.rotate(this.angle);
            ctx.fillStyle = '#00ffff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ffff';
            ctx.fillRect(-this.radius, -this.radius * 0.2, this.radius * 2, this.radius * 0.4);
            ctx.shadowBlur = 0;
        } else if (this.type === 'trieuvan_attack') {
            ctx.rotate(this.angle);
            ctx.fillStyle = '#00ffff';
            ctx.strokeStyle = '#bdc3c7';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#0984e3';
            ctx.beginPath();
            ctx.moveTo(this.radius, 0);
            ctx.lineTo(-this.radius, this.radius * 0.5);
            ctx.lineTo(-this.radius * 0.5, 0);
            ctx.lineTo(-this.radius, -this.radius * 0.5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;
        } else if (this.type === 'lubu_attack') {
            ctx.rotate(this.angle);
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.moveTo(this.radius, 0);
            ctx.lineTo(-this.radius, this.radius);
            ctx.lineTo(-this.radius * 0.5, 0);
            ctx.lineTo(-this.radius, -this.radius);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'lubu_q') {
            let imgQ = window.imgLuboQ;
            if (imgQ && imgQ.complete && imgQ.naturalWidth > 0) {
                ctx.save();

                // Spritesheet có 6 ô nằm ngang
                let soCot = 6;
                let soHang = 1;
                let tongSoFrame = soCot * soHang;
                let frameHienTai = Math.floor(this.distTraveled / 10) % tongSoFrame;
                let wCua1O = imgQ.naturalWidth / soCot;
                let hCua1O = imgQ.naturalHeight / soHang;
                let cotHienTai = frameHienTai % soCot;
                let hangHienTai = Math.floor(frameHienTai / soCot);

                ctx.rotate(this.angle + Math.PI / 2);
                ctx.globalCompositeOperation = 'lighter';

                // --- CHỈNH ĐỘ DÀI TẠI ĐÂY ---
                let beRong = 100;
                // Chiều ngang của cây kích
                let chieuDai = 180;
                // Sếp tăng số 180 này lên (ví dụ 220, 250) để nó dài ra nhé!

                ctx.drawImage(imgQ, cotHienTai * wCua1O, hangHienTai * hCua1O, wCua1O, hCua1O, -beRong / 2, -chieuDai / 2, beRong, chieuDai);

                ctx.restore();
            } else {
                // Giữ lại fallback cũ nếu ảnh lỗi
                ctx.rotate(this.angle);
                ctx.fillStyle = '#00e5ff';
                ctx.fillRect(-this.radius * 6, -3, this.radius * 4, 6);
            }
        } else if (this.type === 'lubu_e') {
            let imgE = window.imgLuboQ;

            if (imgE && imgE.complete && imgE.naturalWidth > 0) {
                ctx.save();

                let wCua1O = imgE.naturalWidth / 6;
                let hCua1O = imgE.naturalHeight;

                ctx.rotate(this.angle + Math.PI / 2);
                ctx.globalCompositeOperation = 'lighter';

                let beRong = 120;
                // Chỉnh độ to ngang
                let chieuDai = 150;
                // Chỉnh độ dài 

                ctx.drawImage(imgE, 0, 0, wCua1O, hCua1O, -beRong / 2, -chieuDai / 2, beRong, chieuDai);

                ctx.restore();
            }
        } else if (this.type === 'ichigo_knife') {// ctx.save();
        // ctx.rotate(this.angle + Math.PI / 2);

        // // Bơm bề rộng lên siêu to khổng lồ (từ 120 lên 180)
        // let beRong = 180;

        // // Đẩy mũi kiếm tiến xa hơn về phía trước viên đạn (180 pixel)
        // let muiKiem = -180;

        // // Tăng chiều dài trùm qua vị trí của Ichigo (+250 thay vì +100)
        // // Việc này đảm bảo đuôi kiếm luôn dính chặt vào xe tăng dù đạn bay nhanh
        // let doDai = this.distTraveled + 250;

        // // (Tùy chọn) Thêm dòng này nếu bạn muốn thanh kiếm phát sáng chói lóa hơn
        // // ctx.globalCompositeOperation = 'lighter'; 

        // ctx.drawImage(imgIchigoE, -beRong / 2, muiKiem, beRong, doDai);

        // ctx.restore();
        } else if (this.type === 'ichigo_q') {
            let imgQ = window.imgIchigoQSprite || (typeof imgIchigoQSprite !== 'undefined' ? imgIchigoQSprite : null);

            if (imgQ && imgQ.complete && imgQ.naturalWidth > 0) {
                ctx.save();

                // Giữ nguyên các thông số spritesheet
                let soCot = 7;
                let soHang = 1;
                let tongSoFrame = soCot * soHang;
                let frameHienTai = Math.floor(this.distTraveled / 12) % tongSoFrame;
                let wCua1O = imgQ.naturalWidth / soCot;
                let hCua1O = imgQ.naturalHeight / soHang;
                let cotHienTai = frameHienTai % soCot;
                let hangHienTai = Math.floor(frameHienTai / soCot);

                ctx.rotate(this.angle + Math.PI / 2);
                ctx.globalCompositeOperation = 'lighter';

                // --- ĐÃ BÓP KÍCH THƯỚC: Từ 240x240 xuống còn 180x180 ---
                // dWidth=180, dHeight=180. dx=-90, dy=-90
                ctx.drawImage(imgQ, cotHienTai * wCua1O, hangHienTai * hCua1O, wCua1O, hCua1O, // Cắt
                -90, -90, 180, 180 // Kích thước mới trong game
                );

                ctx.restore();
            }
        } else if (this.type === 'ichigo_attack' || this.type === 'ichigo_attack_bankai') {
            let imgA = window.imgIchigoAttack || (typeof imgIchigoAttack !== 'undefined' ? imgIchigoAttack : null);

            if (imgA && imgA.complete && imgA.naturalWidth > 0) {
                ctx.save();

                // Đã chốt sổ: Ảnh có 7 cột, 1 hàng
                let soCot = 7;
                let soHang = 1;
                let tongSoFrame = soCot * soHang;

                // Tốc độ lật ảnh (chia cho 8 để hoạt ảnh nhấp nháy liên tục cho đẹp)
                let frameHienTai = Math.floor(this.distTraveled / 8) % tongSoFrame;

                let wCua1O = imgA.naturalWidth / soCot;
                let hCua1O = imgA.naturalHeight / soHang;

                let cotHienTai = frameHienTai % soCot;
                let hangHienTai = Math.floor(frameHienTai / soCot);

                // Thêm Math.PI / 2 để bẻ lái cái mũi đạn chúi về phía trước
                ctx.rotate(this.angle + Math.PI / 2);
                ctx.globalCompositeOperation = 'lighter';

                // Kích thước đạn 100x100 (Bảo có thể sửa 100 thành số khác nếu muốn to/nhỏ hơn)
                ctx.drawImage(imgA, cotHienTai * wCua1O, hangHienTai * hCua1O, wCua1O, hCua1O, // Cắt ảnh
                -50, -50, 100, 100 // In ra game
                );

                ctx.restore();
            }
        } else if (this.type.includes('thachsanh_')) {
            let isGiant = this.type === 'thachsanh_giant_arrow';
            ctx.rotate(this.angle);
            if (isGiant) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#f1c40f';
            }
            ctx.fillStyle = isGiant ? '#f1c40f' : '#8e44ad';
            ctx.fillRect(-this.radius, -this.radius / 4, this.radius * 2, this.radius / 2);
            ctx.fillStyle = '#ecf0f1';
            ctx.beginPath();
            ctx.moveTo(this.radius, -this.radius / 2);
            ctx.lineTo(this.radius + this.radius / 1.5, 0);
            ctx.lineTo(this.radius, this.radius / 2);
            ctx.fill();
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.moveTo(-this.radius, -this.radius / 4);
            ctx.lineTo(-this.radius - 5, -this.radius / 1.5);
            ctx.lineTo(-this.radius + 5, -this.radius / 4);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-this.radius, this.radius / 4);
            ctx.lineTo(-this.radius - 5, this.radius / 1.5);
            ctx.lineTo(-this.radius + 5, this.radius / 4);
            ctx.fill();
        } else if (this.type === 'pika_e' || this.type === 'pika_ball') {
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ffff';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 3;
            ctx.stroke();
        } else if (this.type === 'shuriken_r') {
            ctx.rotate(Date.now() * 0.05);
            ctx.fillStyle = '#f1c40f';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#e67e22';
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(10, 25);
                ctx.lineTo(0, 50);
                ctx.lineTo(-10, 25);
                ctx.fill();
                ctx.rotate(Math.PI / 2);
            }
        } else if (this.type === 'quancong_r') {
            ctx.rotate(this.angle);
            ctx.fillStyle = '#27ae60';
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#2ecc71';
            ctx.beginPath();
            ctx.moveTo(this.radius, 0);
            ctx.quadraticCurveTo(0, this.radius * 1.5, -this.radius, this.radius * 1.5);
            ctx.lineTo(-this.radius * 0.5, 0);
            ctx.lineTo(-this.radius, -this.radius * 1.5);
            ctx.quadraticCurveTo(0, -this.radius * 1.5, this.radius, 0);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else if (this.type === 'quancong_bullet') {
            ctx.save();
            ctx.rotate(this.angle);
            ctx.rotate(Math.PI);
            if (imgDanQC.complete && imgDanQC.naturalWidth > 0) {
                let w = 100;
                let h = 100;
                ctx.drawImage(imgDanQC, -w, -h / 2, w, h);
            } else {
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(0, 0, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        } else if (this.type.includes('clone')) {
            ctx.rotate(this.angle);
            let colorMain = this.type === 'clone_knockup' ? '#e74c3c' : '#f1c40f';
            for (let i = 0; i < this.trail.length; i += 2) {
                ctx.save();
                ctx.translate(this.trail[i].x - this.x, this.trail[i].y - this.y);
                ctx.globalAlpha = (i / this.trail.length) * 0.4;
                ctx.fillStyle = colorMain;
                ctx.fillRect(-this.radius * 0.6, -this.radius * 0.8, this.radius * 0.4, this.radius * 1.6);
                ctx.fillRect(this.radius * 0.2, -this.radius * 0.8, this.radius * 0.4, this.radius * 1.6);
                ctx.beginPath();
                ctx.roundRect(-this.radius * 0.8, -this.radius * 0.6, this.radius * 1.6, this.radius * 1.2, 5);
                ctx.fill();
                ctx.restore();
            }
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = colorMain;
            ctx.fillRect(-this.radius * 0.6, -this.radius * 0.8, this.radius * 0.4, this.radius * 1.6);
            ctx.fillRect(this.radius * 0.2, -this.radius * 0.8, this.radius * 0.4, this.radius * 1.6);
            ctx.beginPath();
            ctx.roundRect(-this.radius * 0.8, -this.radius * 0.6, this.radius * 1.6, this.radius * 1.2, 5);
            ctx.fill();
            ctx.fillRect(0, -this.radius * 0.2, this.radius * 1.4, this.radius * 0.4);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'spider_web') {
            ctx.fillStyle = '#ecf0f1';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#bdc3c7';
            ctx.stroke();
        } else if (this.type === 'cannon_ball' || this.type === 'boss_rocket') {
            ctx.fillStyle = '#2c3e50';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 3;
            ctx.stroke();
            if (this.type === 'boss_rocket') {
                ctx.fillStyle = '#f1c40f';
                ctx.beginPath();
                ctx.arc(-this.radius, 0, this.radius * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.type === 'snake_poison') {
            ctx.fillStyle = '#2ecc71';
            ctx.beginPath();
            ctx.moveTo(0, -this.radius);
            ctx.lineTo(this.radius, this.radius);
            ctx.lineTo(-this.radius, this.radius);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'wall_maker') {
            ctx.fillStyle = '#7f8c8d';
            ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        } else {
            ctx.rotate(this.angle);
            ctx.fillStyle = this.type === 'enemy_stun' ? '#9b59b6' : (this.type === 'sniper' ? '#2ecc71' : (this.type.includes('enemy') ? '#e74c3c' : '#3498db'));
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

class Item {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        const types = [{
            id: 'heal',
            color: '#2ecc71',
            text: 'HỒI MÁU'
        }, {
            id: 'invis',
            color: '#9b59b6',
            text: 'TÀNG HÌNH'
        }, {
            id: 'spread',
            color: '#e67e22',
            text: 'ĐẠN CHÙM'
        }, {
            id: 'shield',
            color: '#3498db',
            text: 'KHIÊN CHẮN'
        }, {
            id: 'rapid',
            color: '#e74c3c',
            text: 'LIÊN THANH'
        }, {
            id: 'speed',
            color: '#f1c40f',
            text: 'TĂNG TỐC'
        }];
        this.data = types[Math.floor(Math.random() * types.length)];
        this.active = true;
        this.bob = 0;
    }
    update() {
        this.bob += 0.1;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y + Math.sin(this.bob) * 5);
        ctx.fillStyle = this.data.color;
        ctx.fillRect(-45, -15, 90, 30);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-45, -15, 90, 30);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.data.text, 0, 0);
        ctx.restore();
    }
}
class FloatText {
    constructor(x, y, text, color, size=20) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.life = 60;
        this.size = size;
    }
    update() {
        this.y -= 1;
        this.life--;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 60;
        ctx.font = 'bold ' + this.size + 'px Arial';
        ctx.textAlign = 'center';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1.0;
    }
}

// --- HIỆU ỨNG VÒNG NỔ CỦA PHƯỢNG HOÀNG (CHIÊU R) ---
class PhoenixNovaVFX {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.life = 25;
        this.maxLife = 25;
    }
    update() {
        this.life--;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        // Tính toán độ nở của vòng tròn (từ 0 phình to ra)
        let pct = 1 - (this.life / this.maxLife);
        let currentRadius = this.radius * Math.pow(pct, 0.5);

        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#e74c3c';

        // Vẽ mảng sáng bên trong
        ctx.fillStyle = 'rgba(231, 76, 60, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Vẽ viền rực lửa bên ngoài
        ctx.lineWidth = 15 * (this.life / this.maxLife);
        ctx.strokeStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

// --- LỚP HIỆU ỨNG NHÁT CHÉM CHỮ X CẢI TIẾN (FIX LỖI MÀN HÌNH TRẮNG VÀ CHUẨN SIZE) ---
class ImageSlashVFX {
    constructor(x, y, angle, scale, life, img) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.scale = scale;
        this.maxLife = life;
        this.life = life;
        this.img = img || window.imgIchigoSpace || (typeof imgIchigoSpace !== 'undefined' ? imgIchigoSpace : null);
    }

    update() {
        this.life--;
    }

    draw(ctxParam) {
        let context = ctxParam || ctx;
        if (!this.img || !this.img.complete)
            return;

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);

        context.globalCompositeOperation = 'lighter';
        let opacity = Math.max(0, this.life / this.maxLife);
        context.globalAlpha = opacity;

        let progress = 1 - opacity;
        let scaleProgress = Math.min(1.0, progress * 4);
        let currentScale = scaleProgress * this.scale;

        // --- ĐÃ BÓP KÍCH THƯỚC: Vừa vặn, chỉ to hơn tank một chút ---
        let w = 40 * currentScale;
        // Bề ngang rất hẹp
        let h = 140 * currentScale;
        // Chiều dài vừa đủ bao trùm xe tăng

        // Nhát 1
        context.save();
        context.rotate(-Math.PI / 6);
        context.drawImage(this.img, -w / 2, -h / 2, w, h);
        context.restore();

        // Nhát 2
        context.save();
        context.rotate(Math.PI / 6);
        context.scale(-1, 1);
        context.drawImage(this.img, -w / 2, -h / 2, w, h);
        context.restore();

        context.globalAlpha = 1;
        // --- ĐÃ THÊM DẤU NHÁY ĐƠN ĐỂ CHỐNG LỖI SẬP ĐỒ HỌA TRẮNG BÓC ---
        context.globalCompositeOperation = 'source-over';
        context.restore();
    }
}
