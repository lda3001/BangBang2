// ==========================================
// NHAN_VAT_HIEN_THI.JS - CHỈ CHỨA HÀM RENDER (VẼ) CHO TANK
// ==========================================

Tank.prototype.draw = function() {
    // Tàng hình khi dùng chiêu (Bao gồm Ichigo Ulti), trừ Phượng Hoàng đang hóa trứng
    if (this.states.untargetable && this.phEgg <= 0)
        return;

    ctx.save();
    let zOffset = 0;
    if (this.states.knockup > 0) {
        let progress = this.states.knockup / 90;
        zOffset = Math.sin(progress * Math.PI) * 50;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (1 - zOffset / 100), 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.translate(this.x, this.y - zOffset);

    if (this.states.knockup > 0) {
        this.angle += 0.2;
        this.bodyAngle += 0.2;
    }
    if (isInBush(this.x, this.y))
        ctx.globalAlpha = 0.5;
    if (this.buffs.invis > 0)
        ctx.globalAlpha = 0.3;
    if (this.isGhost)
        ctx.globalAlpha = 0.7;

    if (this.states.slowed > 0) {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
        ctx.fill();
    }
    if (this.states.stunned > 0) {
        ctx.fillStyle = '#f1c40f';
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("STUNNED", 0, -this.radius - 20);
    } else if (this.states.silenced > 0) {
        ctx.fillStyle = '#9b59b6';
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SILENCE", 0, -this.radius - 20);
    }
    if (this.states.bleeding > 0) {
        ctx.fillStyle = 'rgba(231, 76, 60, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 10, 0, Math.PI * 2);
        ctx.fill();
    }
    if (this.buffs.shield > 0) {
        ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    if (this.isCasting) {
        ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    if (this.type === 'player' && this.heroClass === 'trieuvan') {
        if (this.buffs.trieuvanQ > 0) {
            ctx.save();
            ctx.rotate(this.angle);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, 200, -Math.PI / 3, Math.PI / 3);
            ctx.closePath();
            ctx.fill();
            let thrust = Math.sin((this.buffs.trieuvanQ % 6) / 6 * Math.PI) * 60;
            for (let ang = -Math.PI / 3; ang <= Math.PI / 3; ang += Math.PI / 6) {
                ctx.save();
                ctx.rotate(ang);
                ctx.fillStyle = '#bdc3c7';
                ctx.fillRect(this.radius, -3, thrust + 80, 6);
                ctx.fillStyle = '#00ffff';
                ctx.beginPath();
                ctx.moveTo(this.radius + thrust + 80, -8);
                ctx.lineTo(this.radius + thrust + 120, 0);
                ctx.lineTo(this.radius + thrust + 80, 8);
                ctx.fill();
                ctx.restore();
            }
            ctx.restore();
        }
        if (this.buffs.trieuvanR > 0) {
            let progress = this.buffs.trieuvanR / 15;
            let currentAngle = -Math.PI / 2.5 + (1 - progress) * (Math.PI / 1.25);
            ctx.save();
            ctx.rotate(this.angle);
            ctx.fillStyle = `rgba(9, 132, 227, ${progress * 0.5})`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, 240, -Math.PI / 2.5, currentAngle);
            ctx.closePath();
            ctx.fill();
            ctx.rotate(currentAngle);
            ctx.fillStyle = '#bdc3c7';
            ctx.fillRect(this.radius, -5, 180, 10);
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.moveTo(this.radius + 180, -10);
            ctx.lineTo(this.radius + 240, 0);
            ctx.lineTo(this.radius + 180, 10);
            ctx.fill();
            ctx.restore();
        }
    }
    if (this.type === 'player' && this.heroClass === 'pikachu' && this.buffs.pikaR > 0) {
        ctx.save();
        ctx.rotate(Date.now() * -0.05);
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 5;
        ctx.setLineDash([20, 15]);
        ctx.beginPath();
        ctx.arc(0, 0, 250, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.fill();
        for (let i = 0; i < 3; i++) {
            let a = Math.random() * Math.PI * 2;
            let lx = Math.cos(a) * (Math.random() * 250);
            let ly = Math.sin(a) * (Math.random() * 250);
            drawLightning(ctx, 0, 0, lx, ly, '#00ffff');
        }
        ctx.restore();
    }

    if (this.isStunned && !this.isImageBased)
        return;

    if (this.heroClass === 'phuonghoang') {
        if (this.phEgg > 0) {
            ctx.save();

            // --- THÊM VÒNG HIỂN THỊ TẦM THIÊU ĐỐT CỦA TRỨNG (Space) ---
            ctx.save();
            ctx.rotate(Date.now() * 0.002);
            ctx.strokeStyle = 'rgba(241, 196, 15, 0.6)';
            ctx.lineWidth = 4;
            ctx.setLineDash([15, 10]);
            ctx.beginPath();
            ctx.arc(0, 0, 350, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(231, 76, 60, 0.1)';
            ctx.beginPath();
            ctx.arc(0, 0, 350, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Vẽ quả trứng lơ lửng
            ctx.fillStyle = '#e67e22';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#f1c40f';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.radius * 1.3, this.radius * 1.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.fillStyle = `rgba(241, 196, 15, ${0.4 + Math.sin(Date.now() * 0.01) * 0.4})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.radius * 0.9, this.radius * 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            ctx.restore();
            return;
        }
        if (this.phAura > 0) {
            ctx.save();
            // VÒNG 1: Xoay thuận chiều
            ctx.rotate(Date.now() * 0.005);
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
            ctx.lineWidth = 6;
            ctx.setLineDash([20, 10]);
            ctx.beginPath();
            ctx.arc(0, 0, 250, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(231, 76, 60, 0.15)';
            ctx.beginPath();
            ctx.arc(0, 0, 250, 0, Math.PI * 2);
            ctx.fill();

            // --- THÊM VÒNG 2: Xoay ngược chiều (Q) ---
            ctx.rotate(Date.now() * -0.01);
            ctx.strokeStyle = 'rgba(241, 196, 15, 0.6)';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 15]);
            ctx.beginPath();
            ctx.arc(0, 0, 260, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    if (this.isImageBased && this.heroImage && this.heroImage.complete) {
        ctx.save();
        if (this.heroClass === 'ichigo' && this.buffs.bankai > 0) {
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#e74c3c';
        }
        ctx.rotate(this.bodyAngle);
        if (this.imageAngleOffset)
            ctx.rotate(this.imageAngleOffset);
        let drawSize = this.radius * 4.5;
        if (this.heroClass === 'phuonghoang') {
            drawSize = this.radius * 6.5;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#e67e22';
        }
        ctx.drawImage(this.heroImage, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
    } else if (this.type === 'player') {
        if (this.heroClass === 'kyuubi') {
            if (this.buffs.nineTails > 0) {
                ctx.save();
                ctx.rotate(this.bodyAngle + Math.PI);
                for (let i = 0; i < 9; i++) {
                    ctx.save();
                    let tailAngle = (i - 4) * 0.25 + Math.sin(Date.now() * 0.005 + i) * 0.15;
                    ctx.rotate(tailAngle);
                    let tailLen = 60 + Math.sin(Date.now() * 0.01 + i) * 10;
                    let tailWid = 20;
                    ctx.fillStyle = 'rgba(255, 120, 0, 0.6)';
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(tailLen * 0.3, tailWid, tailLen * 0.8, tailWid * 0.8, tailLen, 0);
                    ctx.bezierCurveTo(tailLen * 0.8, -tailWid * 0.8, tailLen * 0.3, -tailWid, 0, 0);
                    ctx.fill();
                    ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(tailLen * 0.3, tailWid * 0.5, tailLen * 0.8, tailWid * 0.4, tailLen * 0.9, 0);
                    ctx.bezierCurveTo(tailLen * 0.8, -tailWid * 0.4, tailLen * 0.3, -tailWid * 0.5, 0, 0);
                    ctx.fill();
                    ctx.restore();
                }
                ctx.restore();
            }
            drawTankNormal(ctx, this.radius, this.hitFlash > 0 ? '#fff' : this.color, true, this.trackOffset, this.bodyAngle, this.angle);
        } else if (this.heroClass === 'pikachu')
            drawTankHover(ctx, this.radius, this.bodyAngle, this.angle);
        else if (this.heroClass === 'trieuvan')
            drawTankTrieuVan(ctx, this.radius, this.bodyAngle, this.angle);
        else if (this.heroClass === 'lubu')
            drawTankLuBu(ctx, this.radius, this.bodyAngle, this.angle, this.buffs.chienThan > 0, this.passiveCrit);
        else if (this.heroClass === 'ichigo')
            drawTankIchigo(ctx, this.radius, this.bodyAngle, this.angle, this.buffs.bankai > 0);
        else if (this.heroClass === 'thachsanh')
            drawTankThachSanh(ctx, this.radius, this.color, this.buffs.xuyenTamTien > 0, this.bodyAngle, this.angle);
    } else {
        if (this.type === 'boss') {
            drawBossGeneric(ctx, this.radius, this.bossType, this.bodyAngle);
        } else if (this.heroClass === 'shield') {
            ctx.save();
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 5, -Math.PI / 3, Math.PI / 3);
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#bdc3c7';
            ctx.stroke();
            ctx.restore();
            drawTankNormal(ctx, this.radius, this.hitFlash > 0 ? '#fff' : this.color, false, this.trackOffset, this.bodyAngle, this.angle);
        } else if (this.heroClass === 'melee' || this.heroClass === 'dog' || this.heroClass === 'charger') {
            ctx.save();
            ctx.rotate(this.angle);
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.moveTo(this.radius, -15);
            ctx.lineTo(this.radius + (this.heroClass === 'charger' ? 25 : 15), 0);
            ctx.lineTo(this.radius, 15);
            ctx.fill();
            ctx.restore();
            drawTankNormal(ctx, this.radius, this.hitFlash > 0 ? '#fff' : this.color, false, this.trackOffset, this.bodyAngle, this.angle);
        } else if (this.heroClass === 'spider' || this.heroClass === 'ghost' || this.heroClass === 'saw' || this.heroClass === 'venom') {
            ctx.save();
            ctx.rotate(this.angle);
            ctx.strokeStyle = this.heroClass === 'saw' ? '#bdc3c7' : (this.heroClass === 'ghost' ? '#fff' : (this.heroClass === 'venom' ? '#2ecc71' : '#8e44ad'));
            ctx.lineWidth = 4;
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                let ang = (i * Math.PI / 4) + (this.heroClass === 'spider' ? Math.sin(Date.now() * 0.01) * 0.2 : 0);
                ctx.lineTo(Math.cos(ang) * this.radius * 1.5, Math.sin(ang) * this.radius * 1.5);
                ctx.stroke();
            }
            ctx.restore();
            ctx.fillStyle = this.hitFlash > 0 ? '#fff' : this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (this.heroClass === 'snake') {
            ctx.save();
            ctx.rotate(this.bodyAngle);
            ctx.fillStyle = this.hitFlash > 0 ? '#fff' : this.color;
            for (let i = 1; i <= 4; i++) {
                ctx.beginPath();
                ctx.arc(-i * 15, Math.sin(Date.now() * 0.01 - i) * 10, this.radius - i * 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        } else if (this.heroClass === 'cannon' || this.heroClass === 'rock' || this.heroClass === 'icer') {
            ctx.save();
            ctx.rotate(this.angle);
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(10, -20, this.radius + 10, 40);
            ctx.restore();
            drawTankNormal(ctx, this.radius, this.hitFlash > 0 ? '#fff' : this.color, false, this.trackOffset, this.bodyAngle, this.angle);
        } else if (this.heroClass === 'waller' || this.heroClass === 'trapper') {
            ctx.fillStyle = this.hitFlash > 0 ? '#fff' : this.color;
            ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
            ctx.strokeRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        } else if (this.heroClass === 'dummy') {
            ctx.save();
            ctx.rotate(this.angle);
            ctx.fillStyle = this.hitFlash > 0 ? '#fff' : '#e67e22';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000';
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        } else
            drawTankNormal(ctx, this.radius, this.hitFlash > 0 ? '#fff' : this.color, false, this.trackOffset, this.bodyAngle, this.angle);
    }
    ctx.restore();

    if (this.type === 'player' && this.dashTrail.length > 0) {
        this.dashTrail.forEach( (tr, idx) => {
            ctx.save();
            ctx.translate(tr.x, tr.y);
            let currentOpacity = (idx / this.dashTrail.length) * 0.4;
            ctx.globalAlpha = currentOpacity;

            if (this.isImageBased && this.heroImage && this.heroImage.complete) {
                ctx.rotate(tr.ba);
                if (this.heroClass === 'ichigo')
                    ctx.rotate(Math.PI / 2);
                let drawSize = this.radius * 3.5;
                if (this.heroClass === 'phuonghoang')
                    drawSize = this.radius * 5.0;
                ctx.drawImage(this.heroImage, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
            } else {
                if (this.heroClass === 'kyuubi')
                    drawTankNormal(ctx, this.radius, '#f39c12', true, 0, tr.ba, tr.ta);
                else if (this.heroClass === 'pikachu')
                    drawTankHover(ctx, this.radius, tr.ba, tr.ta);
                else if (this.heroClass === 'trieuvan')
                    drawTankTrieuVan(ctx, this.radius, tr.ba, tr.ta);
                else if (this.heroClass === 'lubu')
                    drawTankLuBu(ctx, this.radius, tr.ba, tr.ta, this.buffs.chienThan > 0, false);
                else if (this.heroClass === 'ichigo')
                    drawTankIchigo(ctx, this.radius, tr.ba, tr.ta, this.buffs.bankai > 0);
                else if (this.heroClass === 'thachsanh')
                    drawTankThachSanh(ctx, this.radius, this.color, this.buffs.xuyenTamTien > 0, tr.ba, tr.ta, currentOpacity);
            }
            ctx.restore();
        }
        );
    }

    if (this.hp > 0 && this.states.knockup <= 0 && this.heroClass !== 'dummy') {
        let barW = this.radius * 1.5;
        let barY = -this.radius - 15;
        if (this.isImageBased)
            barY = -this.radius * 2.0;

        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - barW / 2, this.y + barY, barW, 6);
        const hpBarColor = this.type === 'player'
            ? '#2ecc71'
            : (this.team === 'ally' ? '#4aa3ff' : 'red');
        ctx.fillStyle = hpBarColor;
        ctx.fillRect(this.x - barW / 2, this.y + barY, barW * (this.hp / this.maxHp), 6);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - barW / 2, this.y + barY, barW, 6);

        if (this.type === 'player') {
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x - barW / 2, this.y + barY + 8, barW, 4);
            ctx.fillStyle = '#3498db';
            ctx.fillRect(this.x - barW / 2, this.y + barY + 8, barW * (this.mp / this.maxMp), 4);
        }
    }
}
;
