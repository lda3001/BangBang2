let player, enemies = [], allies = [], bullets = [], items = [], floatTexts = [], walls = [], bushes = [], zones = [], rProjs = []; 
let particles = []
  , expOrbs = []
  , warnings = []
  , telegraphs = []
  , pets = []
  , slashes = []
  , blockWalls = []
  , barrels = [];
let gameState = 'START'
  , currentLevel = 1
  , selectedTankID = 'trieuvan'
  , playerName = 'Player'
  , screenShake = 0;
let mouseX = 0
  , mouseY = 0
  , worldMouseX = 0
  , worldMouseY = 0
  , isShooting = false
  , gameMode = 'story'
  , wave = 1;
let WORLD_W = 12000;
let WORLD_H = 2500;
let playerLives = 3;

let highScoreWave = parseInt(localStorage.getItem('bangbang_highestWave')) || 0;

let aimingSkill = null;
let pendingCast = null;
let cancelAim = false;

const SKILL_AIM = {
    kyuubi: {
        q: {
            type: 'dash',
            range: 400,
            width: 60
        },
        e: {
            type: 'self',
            range: 100
        },
        r: {
            type: 'skillshot',
            range: 800,
            width: 60
        },
        space: {
            type: 'skillshot',
            range: 1000,
            width: 80
        }
    },
    pikachu: {
        q: {
            type: 'self',
            range: 100
        },
        e: {
            type: 'target',
            range: 800
        },
        r: {
            type: 'self',
            range: 250
        },
        space: {
            type: 'aoe',
            range: 600,
            radius: 150
        }
    },
    trieuvan: {
        q: {
            type: 'cone',
            range: 200,
            angle: Math.PI / 2
        },
        e: {
            type: 'dash',
            range: 450,
            width: 80
        },
        r: {
            type: 'self',
            range: 240
        },
        space: {
            type: 'skillshot',
            range: 800,
            width: 80
        }
    },
    lubu: {
        q: {
            type: 'skillshot',
            range: 600,
            width: 50
        },
        e: {
            type: 'cone',
            range: 250,
            angle: Math.PI
        },
        r: {
            type: 'self',
            range: 100
        },
        space: {
            type: 'aoe',
            range: 700,
            radius: 180
        }
    },
    ichigo: {
        q: {
            type: 'skillshot',
            range: 600,
            width: 80
        },
        e: {
            type: 'target',
            range: 600
        },
        r: {
            type: 'self',
            range: 100
        },
        space: {
            type: 'target',
            range: 1500
        }
    },
    thachsanh: {
        q: {
            type: 'dash',
            range: 350,
            width: 50
        },
        e: {
            type: 'cone',
            range: 600,
            angle: 0.8
        },
        r: {
            type: 'aoe',
            range: 800,
            radius: 200
        },
        space: {
            type: 'self',
            range: 100
        }
    },
    quancong: {
        q: {
            type: 'self',
            range: 200
        },
        e: {
            type: 'dash',
            range: 400,
            width: 60
        },
        r: {
            type: 'skillshot',
            range: 700,
            width: 100
        },
        space: {
            type: 'target',
            range: 600
        }
    },
    phuonghoang: {
        q: {
            type: 'self',
            range: 250
        },
        // Hỏa vực (vòng tròn quanh bản thân)
        e: {
            type: 'dash',
            range: 500,
            width: 80
        },
        // Lướt đi (tốc độ 24 * 15 frame = 360)
        r: {
            type: 'self',
            range: 300
        },
        // Vòng nổ lửa
        space: {
            type: 'self',
            range: 350
        }// Hóa trứng thiêu đốt xung quanh
    },
};

function updateLivesUI() {
    let livesStr = "";
    for (let i = 0; i < playerLives; i++)
        livesStr += "❤️";
    let el = document.getElementById('ui-lives');
    if (el)
        el.innerText = livesStr;
}
function setMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + mode).classList.add('active');
    let recordEl = document.getElementById('lobby-record');
    if (mode === 'survival') {
        recordEl.style.display = 'block';
        recordEl.innerText = `🏆 KỶ LỤC SINH TỒN: WAVE ${highScoreWave}`;
    } else {
        recordEl.style.display = 'none';
    }
}

const AUGMENTS = [{
    id: 'titan',
    icon: '🛡️',
    name: 'Quyền Năng Titan',
    desc: '+50% Máu tối đa và Hồi đầy máu ngay lập tức.'
}, {
    id: 'assassin',
    icon: '⚔️',
    name: 'Đao Phủ',
    desc: '+40% Sát thương cho tất cả kỹ năng và đạn.'
}, {
    id: 'vampire',
    icon: '🩸',
    name: 'Huyết Kiếm',
    desc: 'Hút máu 15% trên MỌI sát thương gây ra.'
}, {
    id: 'swift',
    icon: '👟',
    name: 'Cuồng Phong',
    desc: '+50% Tốc độ chạy vĩnh viễn.'
}, {
    id: 'mage',
    icon: '✨',
    name: 'Trí Tuệ Siêu Phàm',
    desc: 'Giảm 30% thời gian hồi chiêu của TẤT CẢ kỹ năng.'
}, {
    id: 'giant',
    icon: '🗻',
    name: 'Khổng Lồ',
    desc: 'Kích thước +50%, Máu +100%, Tốc chạy giảm 20%.'
}];

const keys = {};
window.autoShoot = localStorage.getItem('bb_autoShoot') === 'true';
let keybinds = JSON.parse(localStorage.getItem('bb_keybinds')) || {
    q: 'KeyQ',
    e: 'KeyE',
    r: 'KeyR',
    space: 'Space'
};
let keybindDisplay = JSON.parse(localStorage.getItem('bb_keybindDisplay')) || {
    q: 'Q',
    e: 'E',
    r: 'R',
    space: 'SP'
};
let bindingKey = null;
window.showMobaSurface = true;
window.showMobaLaneFrames = true;

function toggleAutoShoot() {
    window.autoShoot = document.getElementById('auto-shoot-cb').checked;
    localStorage.setItem('bb_autoShoot', window.autoShoot);
}
function openSettings() {
    document.getElementById('auto-shoot-cb').checked = window.autoShoot;
    ['q', 'e', 'r', 'space'].forEach(k => document.getElementById('btn-bind-' + k).innerText = keybindDisplay[k]);
    document.getElementById('settings-modal').style.display = 'flex';
}
function closeSettings() {
    document.getElementById('settings-modal').style.display = 'none';
    bindingKey = null;
}
function startBind(skill) {
    bindingKey = skill;
    document.getElementById('btn-bind-' + skill).innerText = '...';
}

function canAimSkill(skillId) {
    if (!player)
        return false;
    if (player.heroClass === 'lubu' && skillId === 'space' && player.lubuRStage === 3)
        return true;
    if (player.heroClass === 'quancong' && skillId === 'e' && player.qcEStage === 2)
        return true;
    return player.skills[skillId].isReady(player.mp);
}

window.addEventListener('keydown', e => {
    if (e.code === 'F2') {
        e.preventDefault();
        window.showMobaSurface = !window.showMobaSurface;
        return;
    }
    if (e.code === 'F3') {
        e.preventDefault();
        window.showMobaLaneFrames = !window.showMobaLaneFrames;
        return;
    }
    if (bindingKey) {
        if (e.code === 'Escape') {
            document.getElementById('btn-bind-' + bindingKey).innerText = keybindDisplay[bindingKey];
            bindingKey = null;
            return;
        }
        keybinds[bindingKey] = e.code;
        let displayChar = e.code === 'Space' ? 'SP' : e.key.toUpperCase();
        keybindDisplay[bindingKey] = displayChar;
        document.getElementById('btn-bind-' + bindingKey).innerText = displayChar;
        let hudEl = document.querySelector('#ui-' + bindingKey + ' .skill-key');
        if (hudEl)
            hudEl.innerText = displayChar;
        localStorage.setItem('bb_keybinds', JSON.stringify(keybinds));
        localStorage.setItem('bb_keybindDisplay', JSON.stringify(keybindDisplay));
        bindingKey = null;
    } else {
        if (e.code === keybinds.q) {
            keys['KeyQ'] = true;
            if (!aimingSkill && canAimSkill('q'))
                aimingSkill = 'q';
        } else if (e.code === keybinds.e) {
            keys['KeyE'] = true;
            if (!aimingSkill && canAimSkill('e'))
                aimingSkill = 'e';
        } else if (e.code === keybinds.r) {
            keys['KeyR'] = true;
            if (!aimingSkill && canAimSkill('r'))
                aimingSkill = 'r';
        } else if (e.code === keybinds.space) {
            keys['Space'] = true;
            if (!aimingSkill && canAimSkill('space'))
                aimingSkill = 'space';
        } else if (e.code !== 'KeyQ' && e.code !== 'KeyE' && e.code !== 'KeyR' && e.code !== 'Space')
            keys[e.code] = true;
    }
}
);

window.addEventListener('keyup', e => {
    if (e.code === keybinds.q) {
        keys['KeyQ'] = false;
        if (aimingSkill === 'q') {
            if (!cancelAim)
                pendingCast = 'q';
            aimingSkill = null;
            cancelAim = false;
        }
    } else if (e.code === keybinds.e) {
        keys['KeyE'] = false;
        if (aimingSkill === 'e') {
            if (!cancelAim)
                pendingCast = 'e';
            aimingSkill = null;
            cancelAim = false;
        }
    } else if (e.code === keybinds.r) {
        keys['KeyR'] = false;
        if (aimingSkill === 'r') {
            if (!cancelAim)
                pendingCast = 'r';
            aimingSkill = null;
            cancelAim = false;
        }
    } else if (e.code === keybinds.space) {
        keys['Space'] = false;
        if (aimingSkill === 'space') {
            if (!cancelAim)
                pendingCast = 'space';
            aimingSkill = null;
            cancelAim = false;
        }
    } else if (e.code !== 'KeyQ' && e.code !== 'KeyE' && e.code !== 'KeyR' && e.code !== 'Space')
        keys[e.code] = false;
}
);

window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    worldMouseX = mouseX / camera.zoom + camera.x;
    worldMouseY = mouseY / camera.zoom + camera.y;
}
);

window.addEventListener('mousedown', e => {
    if (e.button === 2 && aimingSkill) {
        cancelAim = true;
        aimingSkill = null;
    } else if (e.button === 0) {
        if (aimingSkill) {
            pendingCast = aimingSkill;
            aimingSkill = null;
            cancelAim = false;
        } else {
            isShooting = true;
        }
    }
}
);
window.addEventListener('mouseup', e => {
    if (e.button === 0)
        isShooting = false;
}
);
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    syncCameraViewport();
}
);

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const miniCanvas = document.getElementById('minimap');
const miniCtx = miniCanvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let camera = {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
    zoom: 1
};

function syncCameraViewport() {
    camera.w = canvas.width / camera.zoom;
    camera.h = canvas.height / camera.zoom;
}

syncCameraViewport();

document.getElementById('player-name-input').addEventListener('input', (e) => {
    document.getElementById('start-btn').disabled = e.target.value.trim().length === 0;
}
);

const bgmLobby = new Audio('music/nhacsanhcho.mp3');
bgmLobby.loop = true;
bgmLobby.volume = 0.6;
const bgmGame = new Audio('music/nhactrongtran.mp3');
bgmGame.loop = true;
bgmGame.volume = 0.4;
const sfxChemE = new Audio('music/chem_e.mp3');
sfxChemE.volume = 1.0;
const sfxThachSanhShoot = new Audio('music/space ts.mp3');
sfxThachSanhShoot.volume = 0.8;
const sfxChemE2QC = new Audio('music/Chem_E2_QC.mp3');
sfxChemE2QC.volume = 1.0;
const sfxSpaceQC = new Audio('music/space_qc.mp3');
sfxSpaceQC.volume = 1.0;
const mobaMapImage = new Image();
mobaMapImage.src = '/mobamap.png';

function playVoice(audioObj) {
    if (typeof audioObj !== 'undefined') {
        let sound = audioObj.cloneNode();
        sound.volume = audioObj.volume;
        sound.play().catch(e => {}
        );
    }
}

const SFX = {
    ctx: null,
    init() {
        if (!this.ctx)
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended')
            this.ctx.resume();
    },
    play(type) {
        if (!this.ctx || this.ctx.state !== 'running')
            return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        const t = this.ctx.currentTime;
        if (type === 'shoot') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
            gain.gain.setValueAtTime(0.04, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (type === 'zap') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);
            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            osc.start(t);
            osc.stop(t + 0.15);
        } else if (type === 'dash') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.linearRampToValueAtTime(1800, t + 0.2);
            gain.gain.setValueAtTime(0.08, t);
            gain.gain.linearRampToValueAtTime(0.001, t + 0.2);
            osc.start(t);
            osc.stop(t + 0.2);
        } else if (type === 'rasengan_cast') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(50, t);
            osc.frequency.exponentialRampToValueAtTime(300, t + 0.6);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.3, t + 0.3);
            gain.gain.linearRampToValueAtTime(0, t + 0.6);
            osc.start(t);
            osc.stop(t + 0.6);
        } else if (type === 'rasengan_boom') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, t);
            osc.frequency.exponentialRampToValueAtTime(20, t + 1.5);
            gain.gain.setValueAtTime(0.4, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
            osc.start(t);
            osc.stop(t + 1.5);
        } else if (type === 'explosion') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, t);
            osc.frequency.exponentialRampToValueAtTime(10, t + 0.5);
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
            osc.start(t);
            osc.stop(t + 0.5);
        } else if (type === 'levelup') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.setValueAtTime(600, t + 0.1);
            osc.frequency.setValueAtTime(800, t + 0.2);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
            gain.gain.linearRampToValueAtTime(0, t + 0.6);
            osc.start(t);
            osc.stop(t + 0.6);
        } else if (type === 'coin') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
        }
    }
};

const skillDescriptions = {
    kyuubi: {
        q: {
            title: "Cửu Vĩ Lướt",
            cd: "5s",
            desc: "Lướt tới trước làm choáng kẻ địch. Tăng tốc đánh."
        },
        e: {
            title: "Linh Ảnh Cáo",
            cd: "8s",
            desc: "Cường hóa 4 đòn đánh tiếp theo."
        },
        r: {
            title: "Shuriken Nổ",
            cd: "8s",
            desc: "Phóng phi tiêu khổng lồ phát nổ."
        },
        space: {
            title: "RASENGAN",
            cd: "15s",
            desc: "Ném cầu năng lượng hút mục tiêu."
        }
    },
    pikachu: {
        q: {
            title: "Điện Xung",
            cd: "5s",
            desc: "Tăng 50% tốc độ chạy. Giật điện."
        },
        e: {
            title: "Bóng Pika",
            cd: "3s",
            desc: "Bắn quả bóng điện nảy bật."
        },
        r: {
            title: "Điện 10 vạn volt",
            cd: "7s",
            desc: "Tạo bão sét xung quanh bản thân."
        },
        space: {
            title: "PIKA PIKA",
            cd: "20s",
            desc: "Gọi Pet sấm sét khổng lồ."
        }
    },
    trieuvan: {
        q: {
            title: "Tấn công tức thời",
            cd: "3s",
            desc: "Đâm giáo hồi máu."
        },
        e: {
            title: "Đột kích thần tốc",
            cd: "3s",
            desc: "Lướt tới đẩy, gom địch."
        },
        r: {
            title: "Long càn",
            cd: "7s",
            desc: "Vung giáo quét vòng cung lớn hất tung."
        },
        space: {
            title: "LONG KÍCH",
            cd: "10s",
            desc: "Phóng rồng bay siêu tốc."
        }
    },
    lubu: {
        q: {
            title: "Phương Thiên Họa Kích",
            cd: "3s",
            desc: "Phóng phương thiên họa kích."
        },
        e: {
            title: "Chém Ngang",
            cd: "3s",
            desc: "Vung họa kích chém 180 độ hất tung."
        },
        r: {
            title: "Cường Hóa",
            cd: "15s",
            desc: "Hóa Chiến Thần: Nhân đôi sát thương."
        },
        space: {
            title: "CHIẾN THẦN",
            cd: "5s",
            desc: "Bay tới điểm chỉ định hất tung."
        }
    },
    ichigo: {
        q: {
            title: "Nguyệt Nha Thiên Xung",
            cd: "4s",
            desc: "Chém ra sóng năng lượng xuyên tường."
        },
        e: {
            title: "Thuấn Bộ",
            cd: "1s",
            desc: "Lướt tới hất tung, tăng tốc chạy."
        },
        r: {
            title: "Bankai (Hollow)",
            cd: "15s",
            desc: "Đeo mặt nạ Hollow: 100% chí mạng."
        },
        space: {
            title: "TRẢM SÁT",
            cd: "5s",
            desc: "Khóa mục tiêu bị hất tung, chém liên hoàn."
        }
    },
    thachsanh: {
        q: {
            title: "Lướt Sóng",
            cd: "5s",
            desc: "Lướt và LẬP TỨC làm mới E."
        },
        e: {
            title: "Ngũ Tiễn",
            cd: "6s",
            desc: "Bắn ra 5 mũi tên theo hình quạt."
        },
        r: {
            title: "Mưa Tên",
            cd: "12s",
            desc: "Trút mưa tên câm lặng."
        },
        space: {
            title: "Xuyên Tâm Tiễn",
            cd: "20s",
            desc: "Bắn đạn khổng lồ xuyên tường."
        }
    },
    quancong: {
        q: {
            title: "Thanh Long Hồn",
            cd: "5s",
            desc: "Hóa giải khống chế, chém xoay vòng."
        },
        e: {
            title: "Thanh Long Quyết",
            cd: "7s",
            desc: "GD1: Lướt tới làm choáng. Tái kích hoạt GD2: Áp sát chém 3 hit."
        },
        r: {
            title: "Thanh Long Khí",
            cd: "7s",
            desc: "Chém ra sóng kiếm khí gây câm lặng."
        },
        space: {
            title: "Thanh Long Trảm",
            cd: "20s",
            desc: "Giáng đại đao từ trên trời xuống."
        }
    },
    phuonghoang: {
        q: {
            title: "Hỏa Vực",
            cd: "8s",
            desc: "Tạo vòng lửa thiêu đốt và hút máu kẻ địch xung quanh."
        },
        e: {
            title: "Hỏa Tốc",
            cd: "3s",
            desc: "Lướt đi để lại vệt lửa. Kẻ địch dính chiêu cho phép tái kích hoạt lướt."
        },
        r: {
            title: "Phượng Vũ",
            cd: "5s",
            desc: "Tạo vụ nổ lửa cực mạnh gây câm lặng diện rộng."
        },
        space: {
            title: "Niết Bàn",
            cd: "15s",
            desc: "Hóa trứng lơ lửng, thiêu đốt địch và hồi sinh đầy máu."
        }
    }
};

function showAugments() {
    gameState = 'AUGMENT';
    document.getElementById('augment-screen').style.display = 'flex';
    let container = document.getElementById('augment-container');
    container.innerHTML = '';
    let shuffled = AUGMENTS.sort( () => 0.5 - Math.random()).slice(0, 3);
    shuffled.forEach(aug => {
        let card = document.createElement('div');
        card.className = 'aug-card';
        card.innerHTML = `<div class="aug-icon">${aug.icon}</div><div class="aug-name">${aug.name}</div><div class="aug-desc">${aug.desc}</div>`;
        card.onclick = () => {
            applyAugment(aug.id);
            document.getElementById('augment-screen').style.display = 'none';
            gameState = 'PLAYING';
            SFX.play('levelup');
        }
        ;
        container.appendChild(card);
    }
    );
}
function applyAugment(id) {
    if (id === 'titan') {
        player.maxHp *= 1.5;
        player.hp = player.maxHp;
    }
    if (id === 'assassin') {
        player.baseDmgMult *= 1.4;
    }
    if (id === 'vampire') {
        player.augVampire = true;
    }
    if (id === 'swift') {
        player.baseSpeed *= 1.5;
        player.speed = player.baseSpeed;
    }
    if (id === 'mage') {
        Object.values(player.skills).forEach(sk => sk.cdMax *= 0.7);
    }
    if (id === 'giant') {
        player.radius *= 1.5;
        player.maxHp *= 2;
        player.hp *= 2;
        player.baseSpeed *= 0.8;
        player.speed = player.baseSpeed;
    }
    floatTexts.push(new FloatText(player.x,player.y - 60,"ĐÃ LẮP LÕI!","#00ffff",30));
}
function setupTooltips() {
    const tooltip = document.getElementById('skill-tooltip');
    const skills = ['q', 'e', 'r', 'space'];
    skills.forEach(key => {
        const el = document.getElementById('ui-' + key);
        el.addEventListener('mouseenter', () => {
            const data = skillDescriptions[selectedTankID][key];
            const manaCost = document.getElementById('mana-' + key).innerText;
            tooltip.innerHTML = `<div class="tooltip-title">${data.title}</div><div class="tooltip-mana">Năng lượng: ${manaCost} MP</div><div class="tooltip-cd">Hồi chiêu: ${data.cd}</div><div>${data.desc}</div>`;
            tooltip.style.display = 'block';
            const rect = el.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 15) + 'px';
        }
        );
        el.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        }
        );
    }
    );
}
function triggerShake(amount) {
    screenShake = Math.max(screenShake, amount);
}
function selectTank(id) {
    document.querySelectorAll('.tank-card').forEach(el => el.classList.remove('selected'));
    document.getElementById('card-' + id).classList.add('selected');
    selectedTankID = id;
}
function enterLobby() {
    document.getElementById('init-screen').style.display = 'none';
    document.getElementById('lobby-screen').style.display = 'flex';
    bgmLobby.play().catch(e => {}
    );
}

function setupHUD() {
    let qM = 15
      , eM = 25
      , rM = 30
      , sM = 50;
    if (selectedTankID === 'kyuubi') {
        document.getElementById('name-q').innerHTML = 'Cửu Vĩ<br>Lướt';
        document.getElementById('name-e').innerHTML = 'Linh Ảnh<br>Cáo';
        document.getElementById('name-r').innerHTML = 'Shuriken<br>Nổ';
        document.getElementById('name-space').innerHTML = 'RASENGAN';
    } else if (selectedTankID === 'pikachu') {
        document.getElementById('name-q').innerHTML = 'Điện<br>Xung';
        document.getElementById('name-e').innerHTML = 'Bóng<br>Pika';
        document.getElementById('name-r').innerHTML = 'Điện 10 vạn Volt';
        document.getElementById('name-space').innerHTML = 'PIKA PIKA';
    } else if (selectedTankID === 'trieuvan') {
        document.getElementById('name-q').innerHTML = 'Tấn công tức thời';
        document.getElementById('name-e').innerHTML = 'Đột kích<br>thần tốc';
        document.getElementById('name-r').innerHTML = 'Long càn';
        document.getElementById('name-space').innerHTML = 'LONG KÍCH';
        qM = 10;
        eM = 15;
        rM = 20;
        sM = 30;
    } else if (selectedTankID === 'lubu') {
        document.getElementById('name-q').innerHTML = 'Họa<br>Kích';
        document.getElementById('name-e').innerHTML = 'Chém<br>Ngang';
        document.getElementById('name-r').innerHTML = 'Cường<br>Hóa';
        document.getElementById('name-space').innerHTML = 'CHIẾN<br>THẦN';
        qM = 10;
        eM = 10;
        rM = 30;
        sM = 20;
    } else if (selectedTankID === 'ichigo') {
        document.getElementById('name-q').innerHTML = 'Nguyệt<br>Nha';
        document.getElementById('name-e').innerHTML = 'Thuấn<br>Bộ';
        document.getElementById('name-r').innerHTML = 'Bankai';
        document.getElementById('name-space').innerHTML = 'Trảm<br>Sát';
        qM = 15;
        eM = 5;
        rM = 30;
        sM = 50;
    } else if (selectedTankID === 'thachsanh') {
        document.getElementById('name-q').innerHTML = 'Lướt Sóng';
        document.getElementById('name-e').innerHTML = 'Ngũ Tiễn';
        document.getElementById('name-r').innerHTML = 'Mưa tên';
        document.getElementById('name-space').innerHTML = 'Xuyên Tâm Tiễn';
        qM = 20;
        eM = 15;
        rM = 15;
        sM = 50;
    } else if (selectedTankID === 'quancong') {
        document.getElementById('name-q').innerHTML = 'Thanh Long<br>Hồn';
        document.getElementById('name-e').innerHTML = 'Thanh Long<br>Quyết';
        document.getElementById('name-r').innerHTML = 'Thanh Long<br>Khí';
        document.getElementById('name-space').innerHTML = 'Thanh Long<br>Trảm';
        qM = 5;
        eM = 10;
        rM = 15;
        sM = 30;
    }
    if (selectedTankID === 'phuonghoang') {
        document.getElementById('name-q').innerHTML = 'Hỏa<br>Vực';
        document.getElementById('name-e').innerHTML = 'Hỏa<br>Tốc';
        document.getElementById('name-r').innerHTML = 'Phượng<br>Vũ';
        document.getElementById('name-space').innerHTML = 'Niết<br>Bàn';
        qM = 15;
        eM = 15;
        rM = 20;
        sM = 40;
        // Năng lượng tiêu hao dựa theo file logic của bạn
    }
    document.getElementById('mana-q').innerText = qM;
    document.getElementById('mana-e').innerText = eM;
    document.getElementById('mana-r').innerText = rM;
    document.getElementById('mana-space').innerText = sM;
}

function shoot(x, y, angle, type, mult=1.0, isCrit=false, owner='player') {
    let b = new Bullet(x,y,angle,type,mult,owner);
    b.isCrit = isCrit;
    bullets.push(b);
}
function explode(x, y, radius, damage) {
    SFX.play('explosion');
    floatTexts.push(new FloatText(x,y,"BÙM!","#e67e22",20));
    for (let i = 0; i < 30; i++)
        particles.push(new Particle(x,y,Math.random() > 0.5 ? '#f1c40f' : '#e74c3c'));
    enemies.forEach(e => {
        if (Math.hypot(e.x - x, e.y - y) < radius + e.radius) {
            e.hp -= damage;
            e.hitFlash = 5;
            floatTexts.push(new FloatText(e.x,e.y - 30,`-${Math.floor(damage)}`,'#fff',18));
        }
    }
    );
}
function checkWall(obj, newX, newY) {
    let r = obj.radius || 0;
    for (let w of walls)
        if (newX + r > w.x && newX - r < w.x + w.w && newY + r > w.y && newY - r < w.y + w.h)
            return true;
    return false;
}
function isInBush(x, y) {
    for (let b of bushes)
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h)
            return true;
    return false;
}
