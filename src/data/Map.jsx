

const mobaLanePaths = {
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

const mobaSpawners = {
    top: { lane: 'top', cooldown: 10 * 60, wave: 0 },
    mid: { lane: 'mid', cooldown: 10 * 60, wave: 0 },
    bot: { lane: 'bot', cooldown: 10 * 60, wave: 0 }
};

const mobaTowers = [
    { id: 'ally_core', team: 'ally', x:400, y: 3050, radius: 100, hp: 1000, maxHp: 1000 },
    { id: 'enemy_core', team: 'enemy', x: 3350, y: 550, radius: 100, hp: 1000, maxHp: 1000 }
];
const mobaHpZones = [
    { team: 'ally', x: 0, y: 3686-320, radius: 320 },
    { team: 'enemy', x: 3438 - 760, y: 760, radius: 320 }
];

const mobaMapImage = new Image();
mobaMapImage.src = '/mobamap.png';


export { mobaLanePaths, mobaSpawners, mobaTowers, mobaHpZones, mobaMapImage };