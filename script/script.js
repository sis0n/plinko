/**
 * RollyRoyal Plinko - Premium 2.5D Edition
 *
 * Features:
 * ✓ Auto-play with speed control
 * ✓ Ball trails & particle effects
 * ✓ Confetti for big wins
 * ✓ Win streak bonuses
 * ✓ Hot slots tracking
 * ✓ Bet presets
 * ✓ Statistics tracking
 * ✓ Keyboard shortcuts
 * ✓ Sound effects (music + SFX)
 * ✓ Performance optimized
 * ✓ Reactive RGB Border Lights (Idle, Auto-Play Circulate, Win, Lose, Jackpot)
 * ✓ Fixed Modal/Tutorial Event Bug
 * ✓ 2.5D Isometric Pet Stage with Reflections
 * ✓ FIXED: Uninterruptible & Smoother Jumping Celebration
 */

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
    MIN_BET: 1.00,
    INITIAL_STARS: 100,
    MAX_HISTORY: 20,
    GRAVITY: 0.2,
    FRICTION: 0.99,
    BOUNCE: 0.5,
    TRAIL_LENGTH: 8,
    CONFETTI_COUNT: 50,
    CONFETTI_THRESHOLD: 10,
    PET_SIZE: 80,
    AUTOPLAY_SPEEDS: { slow: 1500, normal: 800, fast: 400, turbo: 150 },
    STREAK_BONUS_START: 3,
    STREAK_BONUS_RATE: 0.1,
    PRESETS: [5, 10, 25, 50, 100],
    BORDER_LIGHT_COUNT: 24, // Dami ng bumbilya sa bawat gilid

    // Gamification
    DAILY_REWARD: 150,
    XP_PER_GAME: 10,
    XP_PER_WIN: 25,
    XP_PER_LEVEL: 1000,
    PRESTIGE_LEVEL: 20,
    JACKPOT_METER_MAX: 100,
    SLOWMO_THRESHOLD: 25,
    SLOWMO_FRAMES: 90
};

const PET_NAMES = ['alwyn', 'Asher', 'beto', 'Colmo', 'gab', 'kyle', 'Renz'];
const PET_CONFIGS = {
    'alwyn': { walk: 8, celebrate: 5 },
    'Asher': { walk: 8, celebrate: 6 },
    'beto': { walk: 8, celebrate: 5 },
    'Colmo': { walk: 8, celebrate: 5 },
    'gab': { walk: 8, celebrate: 6 },
    'kyle': { walk: 8, celebrate: 6 },
    'Renz': { walk: 8, celebrate: 5 }
};
const PET_ASSETS = {
    alwyn: { displayName: 'Alwyn', default: 'Alwyn.png', pink: 'Alwyn_pink.png' },
    Asher: { displayName: 'Asher', default: 'Asher.png', pink: 'Asher_pink.png' },
    beto:  { displayName: 'Beto',  default: 'Beto.png',  pink: 'Beto_pink.webp' },
    Colmo: { displayName: 'Colmo', default: 'Colmo.png', pink: 'Colmo_pink.webp' },
    gab:   { displayName: 'Gab',   default: 'Gab.png',   pink: 'Gab_pink.webp' },
    kyle:  { displayName: 'Kyle',  default: 'kyle.png',  pink: 'Kyle_pink.webp' },
    Renz:  { displayName: 'Renz',  default: 'Renz.png',  pink: 'Renz_pink.webp' }
};
const PET_SKINS = PET_NAMES
    .filter(name => PET_ASSETS[name]?.pink)
    .map((name, index) => ({
        id: `${name}_pink`,
        petName: name,
        variant: 'pink',
        name: `${PET_ASSETS[name].displayName} Pink`,
        description: `Pink variant for ${PET_ASSETS[name].displayName}`,
        cost: 900 + (index * 100)
    }));

// ============================================================================
// GAMIFICATION DATA
// ============================================================================
const BALL_SKINS = [
    { id: 'default',     name: '⚪ Default',     description: 'Bet-based color',              cost: 0    },
    { id: 'flame',       name: '🔥 Flame',       description: 'Orange fire glow + hot trail', cost: 800  },
    { id: 'rainbow',     name: '🌈 Rainbow',     description: 'Hue cycles every frame',       cost: 1200 },
    { id: 'ghost',       name: '👻 Ghost',       description: 'Translucent white phantom',    cost: 600  },
    { id: 'ice',         name: '❄️ Ice',         description: 'Frozen cyan crystal',          cost: 700  },
    { id: 'dark_matter', name: '⚫ Dark Matter', description: 'Black hole with purple aura',  cost: 1500 },
];

const SPIN_PRIZES = [
    { label: '5 ⭐',      type: 'stars',   value: 5,             color: '#374151' },
    { label: '10 ⭐',     type: 'stars',   value: 10,            color: '#1e3a5f' },
    { label: '20 ⭐',     type: 'stars',   value: 20,            color: '#7c2d12' },
    { label: '🍀 Charm',  type: 'powerup', value: 'lucky_charm', color: '#14532d' },
    { label: '35 ⭐',     type: 'stars',   value: 35,            color: '#4c1d95' },
    { label: '50 ⭐',     type: 'stars',   value: 50,            color: '#7f1d1d' },
    { label: '🛡️ Shield', type: 'powerup', value: 'shield',      color: '#1e3a5f' },
    { label: '100 ⭐',    type: 'stars',   value: 100,           color: '#713f12' },
];

const PET_DIALOGUES = {
    greet: [
        ['Hey!',        'Sup!'],
        ['Yo!',         'Wassup'],
        ['Hiii~',       'Hello!!'],
        ['Oi!',         'Bro!!'],
        ['Howdy',       'Hey hey'],
        ['Miss me?',    'Not really'],
        ['Long time!',  'Yeah...'],
        ['Looking good','You too!'],
        ['Wanna bet?',  'Always.'],
        ['Nice win!',   'Thanks!!'],
        ['Let\'s go!',  'Let\'s GO!'],
        ['Poggers',     'Based'],
    ],
    chase:  ['Wait up!', 'Catch me!', 'Hey!!', 'Come here!', 'Got ya!'],
    chased: ['Ahh!!', 'Noooo!', 'Run!!', 'Oh no!'],
    jackpot:['WOOO!!', 'LET\'S GO!', 'YESSS!', 'JACKPOT!!', 'NO WAY!!', 'SLAY!!!', '🎉🎉🎉', 'LESGOOO'],
    win:    ['Nice!', 'Profit!', 'GG!', 'EZ money', 'Yooo!', 'Cha-ching!'],
    sad:    ['Oof...', 'Bruh.', 'Rip.', 'L + ratio', 'Not again', 'Unlucky', '*cries*', 'Pain.'],
    idle:   ['...', 'hmm', '*yawn*', 'la la la', 'boring...', '*stretches*', 'ok.', 'heh', '*hums*', 'anyone?'],
};

const SHOP_ITEMS = {
    powerups: [
        { id: 'lucky_charm', name: '🍀 Lucky Charm', description: '+10% to all multipliers (10 plays)', cost: 250, duration: 10 },
        { id: 'golden_ball', name: '⚜️ Golden Ball', description: '2x win amount (5 plays)', cost: 500, duration: 5 },
        { id: 'shield', name: '🛡️ Loss Shield', description: 'Refund 50% of losses (5 plays)', cost: 300, duration: 5 },
        { id: 'streak_saver', name: '🔥 Streak Saver', description: 'Keep streak on next loss', cost: 400, duration: 1 },
        { id: 'jackpot_boost', name: '💎 Jackpot Boost', description: '+50% to edge multipliers (3 plays)', cost: 600, duration: 3 }
    ],
    pets: [
        { id: 'leo', name: '🦁 Leo', description: 'Majestic lion with rare animations', cost: 2000, unlocked: false },
        { id: 'dragon', name: '🐉 Dragon', description: 'Epic dragon with fire effects', cost: 5000, unlocked: false },
        { id: 'unicorn', name: '🦄 Unicorn', description: 'Magical unicorn with rainbow trail', cost: 3500, unlocked: false }
    ],
    themes: [
        { id: 'neon', name: '🌃 Neon Nights', description: 'Cyberpunk neon theme', cost: 1500, unlocked: false },
        { id: 'gold_rush', name: '💰 Gold Rush', description: 'Luxurious golden theme', cost: 2500, unlocked: false },
        { id: 'galaxy', name: '🌌 Galaxy', description: 'Deep space with shooting stars', cost: 3000, unlocked: false },
        { id: 'deep_sea', name: '🌊 Deep Sea', description: 'Bioluminescent ocean depths', cost: 2000, unlocked: false },
        { id: 'inferno', name: '🔥 Inferno', description: 'Lava cracks and rising embers', cost: 2500, unlocked: false },
        { id: 'cherry_blossom', name: '🌸 Cherry Blossom', description: 'Falling petals in the night', cost: 1800, unlocked: false },
        { id: 'retro_arcade', name: '👾 Retro Arcade', description: 'CRT scanlines and pixel grid', cost: 2200, unlocked: false }
    ]
};

const ACHIEVEMENTS = [
    { id: 'first_win', name: 'First Blood', description: 'Win your first game', reward: 100, icon: '🎯', condition: () => state.stats.gamesPlayed > 0 && state.stats.totalWon > 0 },
    { id: 'big_spender', name: 'High Roller', description: 'Bet ⭐100 in a single play', reward: 200, icon: '💸', condition: () => state.biggestBet >= 100 },
    { id: 'streak_5', name: 'On Fire!', description: 'Win 5 games in a row', reward: 300, icon: '🔥', condition: () => state.winStreak >= 5 },
    { id: 'streak_10', name: 'Unstoppable', description: 'Win 10 games in a row', reward: 1000, icon: '⚡', condition: () => state.stats.longestStreak >= 10 },
    { id: 'millionaire', name: 'Millionaire', description: 'Reach ⭐10,000', reward: 500, icon: '💎', condition: () => state.stars >= 10000 },
    { id: 'games_100', name: 'Century Club', description: 'Play 100 games', reward: 250, icon: '💯', condition: () => state.stats.gamesPlayed >= 100 },
    { id: 'jackpot', name: 'Jackpot Master', description: 'Hit the highest multiplier', reward: 750, icon: '🎰', condition: () => state.jackpotHit },
    { id: 'comeback', name: 'Phoenix Rising', description: 'Win after reaching ⭐0', reward: 500, icon: '🔄', condition: () => state.comebackAchieved }
];

const DAILY_CHALLENGES = [
    { id: 'daily_wins', name: 'Win 10 games', reward: 150, target: 10, icon: '🎲' },
    { id: 'daily_streak', name: 'Get a 3-win streak', reward: 200, target: 3, icon: '🔥' },
    { id: 'daily_wagered', name: 'Wager ⭐500 total', reward: 100, target: 500, icon: '💰' }
];

const TUTORIAL_STEPS = [
    { title: "Welcome to RollyRoyal Plinko!", content: "Step into your personal arcade-like experience. Here, physics and luck combine for big wins. Let's take a quick tour!", target: ".game-pane" },
    { title: "Recent History", content: "Track your performance on the left. View your Bet, Multiplier, and Profit (Green for wins, Red for losses). Keep an eye on your winning streak!", target: ".history-pane" },
    { title: "Your Balance", content: "This displays your current funds. If you ever run out, simply click Reset Balance to start fresh with 1,000.00.", target: ".balance-section" },
    { title: "Controls & Settings", content: "Top controls: Click the Help icon to replay this guide, the Music icon to toggle background tracks, and the Sound icon for sound effects.", target: ".hud-controls" },
    { title: "Bet Amount", content: "Input your stake or use quick presets! Use the MIN/MAX buttons for extremes. Watch the Max Win display to see your potential payout!", target: ".bet-input-wrapper" },
    { title: "Risk Level", content: "Choose your strategy:<br>• <b>Low</b>: Frequent but smaller wins.<br>• <b>Normal</b>: Balanced risk and reward.<br>• <b>High</b>: High volatility with massive multipliers!", target: "#riskLevel" },
    { title: "Lines (Pegs)", content: "Adjust the number of peg rows (8 to 16 lines). More lines mean more multiplier slots and higher jackpot potential!", target: ".hud-group:has(#linesCount)" },
    { title: "Lucky Pets", content: "Meet your team! Select which pets you want to see. They will celebrate with you whenever you hit those big multipliers!", target: ".collapsible" },
    { title: "Auto-Play Mode", content: "Want to sit back and watch? Use Auto Play to automatically drop balls at your chosen speed. Build win streaks for bonus multipliers!", target: "#autoPlayBtn" },
    { title: "Digital Receipt", content: "Want to flex your win? Click Save Receipt! It downloads an image of your game board to share with friends or on social media.", target: "#receiptBtn" },
    { title: "Pets Playground", content: "At the bottom, your selected pets walk and play. Watch them celebrate your victories in real-time!", target: ".pets-section" },
    { title: "Ready, Set, PLAY!", content: "Everything is set! Click PLAY to drop a ball, or spam it for rapid-fire action! Build win streaks for bonus multipliers. Good luck!", target: "#playBtn" }
];

// ============================================================================
// UTILITIES
// ============================================================================
const Storage = {
    get(key, def = null) {
        try { return JSON.parse(localStorage.getItem(key)) ?? def; }
        catch { return def; }
    },
    set(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); return true; }
        catch { return false; }
    }
};

// ============================================================================
// CUSTOM MODAL SYSTEM
// ============================================================================
let activeModalResolve = null;

function showCustomModal(title, content, isConfirm, confirmText, cancelText) {
    return new Promise((resolve) => {
        activeModalResolve = resolve;

        const overlay = document.getElementById('tutorialOverlay');
        const box = document.getElementById('tutorialBox');
        const contentEl = document.getElementById('tutorialContent');
        const nextBtn = document.getElementById('nextStep');
        const skipBtn = document.getElementById('skipTutorial');
        const dots = document.getElementById('stepDots');

        contentEl.innerHTML = `<h3 style="color: var(--gold); margin-bottom: 10px;">${title}</h3><p style="text-align: center; margin: 20px 0;">${content}</p>`;

        if (dots) dots.style.display = 'none';

        if (nextBtn) {
            nextBtn.onclick = () => {
                closeCustomModal();
                if (activeModalResolve) activeModalResolve(true);
            };
        }

        if (isConfirm && skipBtn) {
            skipBtn.textContent = cancelText;
            skipBtn.style.display = 'inline-block';
            skipBtn.onclick = () => {
                closeCustomModal();
                if (activeModalResolve) activeModalResolve(false);
            };
        } else if (skipBtn) {
            skipBtn.style.display = 'none';
        }

        if (overlay) overlay.classList.remove('hidden');
        if (box) box.classList.remove('hidden');
    });
}

function closeCustomModal() {
    const overlay = document.getElementById('tutorialOverlay');
    const box = document.getElementById('tutorialBox');
    if (overlay) overlay.classList.add('hidden');
    if (box) box.classList.add('hidden');

    const nextBtn = document.getElementById('nextStep');
    const skipBtn = document.getElementById('skipTutorial');

    if (nextBtn) nextBtn.onclick = nextTutorialStep;
    if (skipBtn) {
        skipBtn.onclick = endTutorial;
        skipBtn.textContent = 'Skip';
        skipBtn.style.display = 'inline-block';
    }

    const dots = document.getElementById('stepDots');
    if (dots) dots.style.display = 'flex';
}

function showAlert(message) {
    return showCustomModal('Warning', message, false, 'Okay 👌', '');
}

function showToast(html) {
    const existing = document.querySelectorAll('.achievement-toast');
    const offset = existing.length * 80;
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.style.top = `${20 + offset}px`;
    toast.innerHTML = html;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

function showConfirm(message) {
    return showCustomModal('Confirmation', message, true, 'Yes ✅', 'No ❌');
}

// ============================================================================
// STATE & SOUNDS
// ============================================================================
const SOUNDS = {
    winNormal: new Audio('mp3/kaching-sound-fx.mp3'),
    winHigh: new Audio('mp3/lets-go-gambling-win.mp3'),
    winJackpot: new Audio('mp3/paldo-nanaman.mp3'),
    lossLow: new Audio('mp3/malupiton-aray-ko.mp3'),
    lossHigh: new Audio('mp3/fahhhhh.mp3'),
    play1: new Audio('mp3/gunshotjbudden.mp3'),
    play2: new Audio('mp3/pistol-sound-effect_zejYI9w.mp3')
};

Object.values(SOUNDS).forEach(audio => audio.volume = 0.4);

function playSound(audio) {
    if (!audio || state.isSfxMuted) return;
    const now = Date.now();
    if (audio.lastPlayed && (now - audio.lastPlayed) < 150) return;
    if (audio.volume === 1) audio.volume = 0.4;
    audio.lastPlayed = now;
    audio.currentTime = 0;
    audio.play().catch(() => { });
}

// Migrate old balance+coins to unified stars on first load
const _oldBalance = Storage.get('balance', null);
const _oldCoins   = Storage.get('coins', null);
const _migratedStars = (_oldBalance !== null || _oldCoins !== null)
    ? ((_oldBalance || 0) + (_oldCoins || 0))
    : null;

let state = {
    stars: Storage.get('stars', _migratedStars ?? CONFIG.INITIAL_STARS),
    bet: 10.00,
    lines: 8,
    risk: 'normal',
    activePets: new Set(PET_NAMES),
    isMusicMuted: Storage.get('musicMuted', false),
    isSfxMuted: Storage.get('sfxMuted', false),
    tutorialStep: 0,
    isTutorialActive: false,
    autoPlay: false,
    autoPlaySpeed: 'normal',
    autoPlayInterval: null,
    winStreak: 0,
    stats: Storage.get('stats', {
        gamesPlayed: 0, totalWagered: 0, totalWon: 0,
        biggestWin: 0, biggestMultiplier: 0, longestStreak: 0
    }),
    history: [],
    isGameOver: false,
    borderEffect: { mode: 'idle', timer: 0 },

    // Gamification
    level: Storage.get('level', 1),
    xp: Storage.get('xp', 0),
    activePowerups: Storage.get('activePowerups', []),
    unlockedItems: Storage.get('unlockedItems', []),
    achievements: Storage.get('achievements', []),
    lastLogin: Storage.get('lastLogin', null),
    dailyProgress: Storage.get('dailyProgress', { wins: 0, streak: 0, wagered: 0 }),
    biggestBet: Storage.get('biggestBet', 0),
    jackpotHit: Storage.get('jackpotHit', false),
    comebackAchieved: Storage.get('comebackAchieved', false),
    ownedPets: Storage.get('ownedPets', []),
    unlockedPetSkins: Storage.get('unlockedPetSkins', []),
    activePetSkins: Storage.get('activePetSkins', {}),
    currentTheme: Storage.get('currentTheme', 'default'),
    lastSpin: Storage.get('lastSpin', null),
    prestige: Storage.get('prestige', 0),
    jackpotMeter: Storage.get('jackpotMeter', 0),
    activeSkin: Storage.get('activeSkin', 'default'),
    betStrategy: 'flat',
    baseBet: 10,
    slowMo: 0,
    balanceHistory: []
};

function saveState() {
    Storage.set('stars', state.stars);
    Storage.set('stats', state.stats);
    Storage.set('musicMuted', state.isMusicMuted);
    Storage.set('sfxMuted', state.isSfxMuted);
    Storage.set('level', state.level);
    Storage.set('xp', state.xp);
    Storage.set('activePowerups', state.activePowerups);
    Storage.set('unlockedItems', state.unlockedItems);
    Storage.set('achievements', state.achievements);
    Storage.set('lastLogin', state.lastLogin);
    Storage.set('dailyProgress', state.dailyProgress);
    Storage.set('biggestBet', state.biggestBet);
    Storage.set('jackpotHit', state.jackpotHit);
    Storage.set('comebackAchieved', state.comebackAchieved);
    Storage.set('ownedPets', state.ownedPets);
    Storage.set('unlockedPetSkins', state.unlockedPetSkins);
    Storage.set('activePetSkins', state.activePetSkins);
    Storage.set('currentTheme', state.currentTheme);
    Storage.set('lastSpin', state.lastSpin);
    Storage.set('prestige', state.prestige);
    Storage.set('jackpotMeter', state.jackpotMeter);
    Storage.set('activeSkin', state.activeSkin);
}

function getPetSpriteFile(name, variant = 'default') {
    const pet = PET_ASSETS[name];
    if (!pet) return '';
    return pet[variant] || pet.default;
}

// ============================================================================
// GAME DATA
// ============================================================================
let balls = [];
let pegs = [];
let slots = [];
let pets = [];
let winEffects = [];
let confetti = [];
let fireParticles = [];
let pegRipples = [];
let slotHeat = [];
let slotPulses = [];
let cachedBgGradient = null;

const MULTIPLIERS = {
    8: { low: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6], normal: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13], high: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29] },
    9: { low: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6], normal: [18, 5, 2, 0.6, 0.5, 0.5, 0.6, 2, 5, 18], high: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43] },
    10: { low: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9], normal: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22], high: [76, 10, 3, 1.4, 0.3, 0.2, 0.3, 1.4, 3, 10, 76] },
    11: { low: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4], normal: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24], high: [120, 14, 5.2, 2, 0.5, 0.2, 0.2, 0.5, 2, 5.2, 14, 120] },
    12: { low: [10, 4.5, 2.1, 1.6, 1, 0.8, 0.5, 0.8, 1, 1.6, 2.1, 4.5, 10], normal: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33], high: [170, 24, 8.1, 2.5, 0.7, 0.3, 0.2, 0.3, 0.7, 2.5, 8.1, 24, 170] },
    13: { low: [10, 5, 2.5, 1.8, 1.2, 0.9, 0.5, 0.5, 0.9, 1.2, 1.8, 2.5, 5, 10], normal: [43, 13, 6, 3, 1.3, 0.7, 0.3, 0.3, 0.7, 1.3, 3, 6, 13, 43], high: [260, 37, 11, 4, 1, 0.5, 0.2, 0.2, 0.5, 1, 4, 11, 37, 260] },
    14: { low: [11, 5, 3, 2, 1.4, 1, 0.5, 0.3, 0.5, 1, 1.4, 2, 3, 5, 11], normal: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58], high: [420, 56, 18, 5, 2, 1, 0.5, 0.2, 0.5, 1, 2, 5, 18, 56, 420] },
    15: { low: [12, 7, 4, 2.4, 1.6, 1.1, 0.7, 0.5, 0.5, 0.7, 1.1, 1.6, 2.4, 4, 7, 12], normal: [88, 18, 10, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 10, 18, 88], high: [620, 83, 27, 8, 3, 1, 0.5, 0.2, 0.2, 0.5, 1, 3, 8, 27, 83, 620] },
    16: { low: [16, 9, 4, 2.4, 1.5, 1.1, 1, 0.5, 0.3, 0.5, 1, 1.1, 1.5, 2.4, 4, 9, 16], normal: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110], high: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000] }
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================
const plinkoCanvas = document.getElementById('plinkoCanvas');
const plinkoCtx = plinkoCanvas.getContext('2d');
const petsCanvas = document.getElementById('petsCanvas');
const petsCtx = petsCanvas.getContext('2d');
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
const balanceEl = document.getElementById('userBalance');
const betInput = document.getElementById('betAmount');
const playBtn = document.getElementById('playBtn');
const musicToggle = document.getElementById('musicToggle');
const sfxToggle = document.getElementById('sfxToggle');
const bgMusic = document.getElementById('bgMusic');
const collectSound = document.getElementById('collectSound');
const paldoSound = document.getElementById('paldoSound');
const pegSound = document.getElementById('pegSound');
const playBtnSound = document.getElementById('playBtnSound');
const maxBetSound = document.getElementById('maxBetSound');
const minBetSound = document.getElementById('minBetSound');
const lossSound = document.getElementById('lossSound');

// ============================================================================
// TUTORIAL & HIGHLIGHTING
// ============================================================================
function startTutorial() {
    state.tutorialStep = 0;
    state.isTutorialActive = true;

    const nextBtn = document.getElementById('nextStep');
    const skipBtn = document.getElementById('skipTutorial');
    if (nextBtn) nextBtn.onclick = nextTutorialStep;
    if (skipBtn) skipBtn.onclick = endTutorial;

    const overlay = document.getElementById('tutorialOverlay');
    const box = document.getElementById('tutorialBox');
    if (overlay) overlay.classList.remove('hidden');
    if (box) box.classList.remove('hidden');
    updateTutorialStep();
}

function updateTutorialStep() {
    if (!state.isTutorialActive) return;

    const step = TUTORIAL_STEPS[state.tutorialStep];

    document.querySelectorAll('.highlight-element').forEach(el => el.classList.remove('highlight-element'));
    document.querySelectorAll('.elevated-pane').forEach(el => {
        el.classList.remove('elevated-pane');
        el.style.zIndex = '';
        el.style.position = '';
    });

    const contentEl = document.getElementById('tutorialContent');
    if (contentEl) {
        contentEl.innerHTML = `
            <h3 style="color: var(--gold); margin-bottom: 10px;">${step.title}</h3>
            <p>${step.content}</p>
        `;
    }

    const nextBtn = document.getElementById('nextStep');
    if (nextBtn) nextBtn.textContent = state.tutorialStep === TUTORIAL_STEPS.length - 1 ? 'FINISH' : 'NEXT';

    const dotsEl = document.getElementById('stepDots');
    if (dotsEl) {
        dotsEl.innerHTML = TUTORIAL_STEPS.map((_, i) =>
            `<div class="dot ${i === state.tutorialStep ? 'active' : ''}"></div>`
        ).join('');
    }

    const targetEl = document.querySelector(step.target);
    const box = document.getElementById('tutorialBox');

    if (targetEl && box) {
        targetEl.classList.add('highlight-element');

        const parentPane = targetEl.closest('.hud-pane, .history-pane, .game-pane, .pets-section');
        if (parentPane) {
            parentPane.classList.add('elevated-pane');
            parentPane.style.position = 'relative';
            parentPane.style.zIndex = '9999';
        }

        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        let trackingFrames = 0;
        const positionBox = () => {
            if (!state.isTutorialActive) return;

            const rect = targetEl.getBoundingClientRect();
            const boxWidth = box.offsetWidth;
            const boxHeight = box.offsetHeight;
            const padding = 15;

            box.style.transform = 'none';
            box.style.bottom = 'auto';
            box.style.right = 'auto';

            if (window.innerWidth <= 768) {
                box.style.top = 'auto';
                box.style.bottom = `${padding}px`;
                box.style.left = '50%';
                box.style.transform = 'translateX(-50%)';
            }
            else {
                let topPos = rect.top + (rect.height / 2) - (boxHeight / 2);
                let leftPos = rect.left - boxWidth - padding;

                if (leftPos < padding) {
                    leftPos = rect.right + padding;
                    if (leftPos + boxWidth > window.innerWidth - padding) {
                        leftPos = (window.innerWidth / 2) - (boxWidth / 2);
                        topPos = rect.bottom + padding;
                        if (topPos + boxHeight > window.innerHeight - padding) {
                            topPos = rect.top - boxHeight - padding;
                        }
                    }
                }

                if (topPos < padding) topPos = padding;
                if (topPos + boxHeight > window.innerHeight - padding) topPos = window.innerHeight - boxHeight - padding;
                if (leftPos < padding) leftPos = padding;
                if (leftPos + boxWidth > window.innerWidth - padding) leftPos = window.innerWidth - boxWidth - padding;

                box.style.top = `${topPos}px`;
                box.style.left = `${leftPos}px`;
            }

            trackingFrames++;
            if (trackingFrames < 35) requestAnimationFrame(positionBox);
        };

        requestAnimationFrame(positionBox);
    } else if (box) {
        box.style.top = '50%';
        box.style.left = '50%';
        box.style.bottom = 'auto';
        box.style.transform = 'translate(-50%, -50%)';
    }
}

function nextTutorialStep() {
    if (!state.isTutorialActive) return;
    if (state.tutorialStep < TUTORIAL_STEPS.length - 1) {
        state.tutorialStep++;
        updateTutorialStep();
    } else {
        endTutorial();
    }
}

function endTutorial() {
    state.isTutorialActive = false;
    const overlay = document.getElementById('tutorialOverlay');
    const box = document.getElementById('tutorialBox');

    if (overlay) overlay.classList.add('hidden');
    if (box) {
        box.classList.add('hidden');
        box.style.top = '50%';
        box.style.left = '50%';
        box.style.right = 'auto';
        box.style.transform = 'translate(-50%, -50%)';
    }

    document.querySelectorAll('.highlight-element').forEach(el => el.classList.remove('highlight-element'));
    Storage.set('tutorialDone', true);
}

// ============================================================================
// 2.5D PET CLASS WITH REFLECTIONS & FIXED JUMP ANIMATION
// ============================================================================
class Pet {
    constructor(name) {
        this.name = name;
        this.config = PET_CONFIGS[name] || { walk: 10, celebrate: 10 };
        this.image = new Image();
        this.currentVariant = null;
        this.refreshSprite();
        this.size = CONFIG.PET_SIZE * 1.5;
        this.x = Math.random() * (petsCanvas.width - this.size);
        this.y = petsCanvas.height - this.size - 30;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.frame = 0;
        this.state = 'happy';
        this.timer = 0;
        this.direction = 1;
        this.lastFrameUpdate = Date.now();
        // Liveliness additions
        this.bobPhase = Math.random() * Math.PI * 2;
        this.hopTimer = 0;
        this.hopPhase = 0;
        this.personalityTimer = Math.floor(Math.random() * 180);
        this.baseSpeed = 0.7 + Math.random() * 1.6;
        this.squashY = 1;
        this.tilt = 0;
        // Interaction additions
        this.greetTimer = 0;
        this.greetCooldown = Math.floor(Math.random() * 80);
        this.chaseTarget = null;
        this.chaseTimer = 0;
        // Speech bubble
        this.bubble = null;        // { text, opacity, timer }
        this.pendingBubble = null; // { text, countdown, duration }
    }

    refreshSprite() {
        const desiredVariant = state.activePetSkins[this.name] || 'default';
        if (desiredVariant === this.currentVariant) return;
        this.currentVariant = desiredVariant;
        const fileName = getPetSpriteFile(this.name, desiredVariant);
        if (fileName) this.image.src = `Sprites/LABOBO/${fileName}`;
    }

    update(otherPets = []) {
        this.refreshSprite();
        const maxFrames = 5;
        const now = Date.now();
        const fps = this.state === 'jackpot' ? 200 : 150;
        if (now - this.lastFrameUpdate > fps) {
            this.frame = (this.frame + 1) % maxFrames;
            this.lastFrameUpdate = now;
        }

        this.tickBubble();
        this.bobPhase += 0.07;
        let jumpOffset = 0;

        if (this.state === 'jackpot') {
            this.timer--;
            jumpOffset = -Math.abs(Math.sin(this.timer * 0.15)) * 25;
            if (this.timer <= 0) {
                this.state = 'happy';
                this.vx = (Math.random() < 0.5 ? 1 : -1) * this.baseSpeed;
            }

        } else if (this.state === 'greeting') {
            this.greetTimer--;
            // Excited faster bob + head wobble while chatting
            jumpOffset = Math.sin(this.bobPhase * 2.2) * 4;
            this.tilt = Math.sin(this.bobPhase * 2.2) * 0.045;
            if (this.greetTimer <= 0) {
                this.state = 'happy';
                this.vx = -this.direction * this.baseSpeed; // walk away
                this.greetCooldown = 220 + Math.floor(Math.random() * 120);
                this.tilt = 0;
            }

        } else if (this.state === 'chasing') {
            this.chaseTimer--;
            const target = this.chaseTarget;
            if (target && state.activePets.has(target.name)) {
                const dx = target.x - this.x;
                if (Math.abs(dx) < this.size * 0.85) {
                    // Caught — trigger greeting on both
                    const greetDur = 90 + Math.floor(Math.random() * 60);
                    const pair = PET_DIALOGUES.greet[Math.floor(Math.random() * PET_DIALOGUES.greet.length)];
                    this.state = 'greeting';
                    this.greetTimer = greetDur;
                    this.greetCooldown = 220;
                    this.direction = dx >= 0 ? 1 : -1;
                    this.vx = 0;
                    this.scheduleBubble(pair[0], 6, 72);
                    if (target.state === 'happy' || target.state === 'sad' || target.state === 'chasing') {
                        target.state = 'greeting';
                        target.greetTimer = greetDur;
                        target.greetCooldown = 220;
                        target.direction = -this.direction;
                        target.vx = 0;
                        target.scheduleBubble(pair[1], 52, 72);
                    }
                } else {
                    this.vx = (dx > 0 ? 1 : -1) * this.baseSpeed * 2.2;
                    this.direction = dx > 0 ? 1 : -1;
                    this.x += this.vx;
                    if (this.x < 0) { this.x = 0; }
                    else if (this.x > petsCanvas.width - this.size) { this.x = petsCanvas.width - this.size; }
                }
            } else {
                this.state = 'happy';
                this.chaseTarget = null;
            }
            if (this.chaseTimer <= 0) {
                this.state = 'happy';
                this.chaseTarget = null;
                this.vx = (Math.random() < 0.5 ? 1 : -1) * this.baseSpeed;
            }
            jumpOffset = Math.sin(this.bobPhase) * 1.5;
            this.tilt = this.vx * 0.03;

        } else {
            // happy / sad — normal walk with personality
            if (this.greetCooldown > 0) this.greetCooldown--;

            this.personalityTimer--;
            if (this.personalityTimer <= 0) {
                this.personalityTimer = 90 + Math.floor(Math.random() * 240);
                const roll = Math.random();
                if (roll < 0.2) {
                    if (this.hopTimer <= 0) { this.hopTimer = 30; this.hopPhase = 0; }
                } else if (roll < 0.38) {
                    this.vx = (this.vx >= 0 ? 1 : -1) * (this.baseSpeed * (1.5 + Math.random()));
                } else if (roll < 0.52) {
                    this.vx = 0;
                    this.personalityTimer = 30 + Math.floor(Math.random() * 40);
                } else if (roll < 0.62 && otherPets.length > 0 && this.greetCooldown <= 0) {
                    // Chase a random other pet
                    const candidates = otherPets.filter(p => p.state === 'happy' || p.state === 'sad');
                    if (candidates.length > 0) {
                        this.state = 'chasing';
                        this.chaseTarget = candidates[Math.floor(Math.random() * candidates.length)];
                        this.chaseTimer = 220;
                        const cl = PET_DIALOGUES.chase;
                        this.scheduleBubble(cl[Math.floor(Math.random() * cl.length)], 4, 55);
                        const tl = PET_DIALOGUES.chased;
                        this.chaseTarget.scheduleBubble(tl[Math.floor(Math.random() * tl.length)], 18, 55);
                    }
                } else if (roll < 0.72 && !this.bubble && !this.pendingBubble) {
                    // Idle mumble
                    const il = PET_DIALOGUES.idle;
                    this.scheduleBubble(il[Math.floor(Math.random() * il.length)], 0, 70);
                } else {
                    this.vx = this.vx === 0
                        ? (Math.random() < 0.5 ? 1 : -1) * this.baseSpeed
                        : (this.vx > 0 ? 1 : -1) * this.baseSpeed;
                }
            }

            // Proximity greeting — only this pet triggers, sets both
            if (this.greetCooldown <= 0) {
                for (const other of otherPets) {
                    if ((other.state === 'happy' || other.state === 'sad') && other.greetCooldown <= 0) {
                        const dx = other.x - this.x;
                        if (Math.abs(dx) < this.size * 1.05) {
                            const greetDur = 80 + Math.floor(Math.random() * 70);
                            const pair = PET_DIALOGUES.greet[Math.floor(Math.random() * PET_DIALOGUES.greet.length)];
                            this.state = 'greeting';
                            this.greetTimer = greetDur;
                            this.greetCooldown = 220 + Math.floor(Math.random() * 100);
                            this.direction = dx >= 0 ? 1 : -1;
                            this.vx = 0;
                            this.scheduleBubble(pair[0], 6, 72);
                            other.state = 'greeting';
                            other.greetTimer = greetDur;
                            other.greetCooldown = this.greetCooldown;
                            other.direction = -this.direction;
                            other.vx = 0;
                            other.scheduleBubble(pair[1], 52, 72);
                            break;
                        }
                    }
                }
            }

            const bobAmt = Math.abs(this.vx) < 0.3 ? 3 : 1.2;
            jumpOffset = Math.sin(this.bobPhase) * bobAmt;

            if (this.hopTimer > 0) {
                this.hopPhase += Math.PI / 30;
                jumpOffset -= Math.sin(this.hopPhase) * 20;
                this.hopTimer--;
                if (this.hopTimer === 0) { this.squashY = 0.65; }
            }

            if (this.squashY < 1) this.squashY = Math.min(1, this.squashY + 0.06);
            else if (this.squashY > 1) this.squashY = Math.max(1, this.squashY - 0.06);

            this.x += this.vx;
            if (this.x < 0) { this.x = 0; this.vx = Math.abs(this.vx) || this.baseSpeed; }
            else if (this.x > petsCanvas.width - this.size) { this.x = petsCanvas.width - this.size; this.vx = -(Math.abs(this.vx) || this.baseSpeed); }
            this.direction = this.vx >= 0 ? 1 : -1;
            this.tilt = this.vx * 0.025;
        }

        this.y = petsCanvas.height - this.size - 30 + jumpOffset;
    }

    draw(ctx) {
        const row = this.state === 'jackpot' ? 2 : (this.state === 'sad' ? 1 : 0);
        const s = this.size;

        ctx.save();
        ctx.translate(this.x + s / 2, this.y + s / 2);
        if (this.direction === -1) ctx.scale(-1, 1);
        ctx.rotate(this.tilt * this.direction);

        try {
            if (this.image.complete && this.image.naturalWidth > 0) {
                const sw = this.image.naturalWidth / 5;
                const sh = this.image.naturalHeight / 3;
                const aspect = sw / sh;
                const drawH = s;
                const drawW = s * aspect;

                // Squash/stretch: scale Y, compensate X to keep volume
                ctx.scale(1 / this.squashY, this.squashY);

                // 2.5D Reflection
                ctx.save();
                ctx.translate(0, drawH / 2 * this.squashY);
                ctx.scale(1, -0.3);
                ctx.globalAlpha = 0.2;
                ctx.drawImage(this.image, this.frame * sw, row * sh, sw, sh, -drawW / 2, 0, drawW, drawH);
                ctx.restore();

                // Draw actual character
                ctx.drawImage(this.image, this.frame * sw, row * sh, sw, sh, -drawW / 2, -drawH / 2, drawW, drawH);
            } else {
                ctx.fillStyle = '#d4af37';
                ctx.beginPath(); ctx.arc(0, 0, s / 3, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#000'; ctx.font = `bold ${s / 4}px sans-serif`;
                ctx.textAlign = 'center'; ctx.fillText(this.name[0].toUpperCase(), 0, s / 10);
            }
        } catch (e) { }
        ctx.restore();
        this.drawBubble(ctx);
    }

    scheduleBubble(text, delay, duration = 80) {
        this.pendingBubble = { text, countdown: delay, duration };
    }

    showBubble(text, duration = 80) {
        this.bubble = { text, opacity: 0, timer: duration };
    }

    tickBubble() {
        if (this.pendingBubble) {
            this.pendingBubble.countdown--;
            if (this.pendingBubble.countdown <= 0) {
                this.showBubble(this.pendingBubble.text, this.pendingBubble.duration);
                this.pendingBubble = null;
            }
        }
        if (this.bubble) {
            if (this.bubble.opacity < 1) this.bubble.opacity = Math.min(1, this.bubble.opacity + 0.15);
            this.bubble.timer--;
            if (this.bubble.timer < 18) this.bubble.opacity = Math.max(0, this.bubble.timer / 18);
            if (this.bubble.timer <= 0) this.bubble = null;
        }
    }

    drawBubble(ctx) {
        if (!this.bubble || this.bubble.opacity <= 0) return;
        const text = this.bubble.text;
        const cx = this.x + this.size / 2;
        const cy = this.y;
        const fontSize = Math.max(11, this.size * 0.17);
        ctx.save();
        ctx.globalAlpha = this.bubble.opacity;
        ctx.font = `bold ${fontSize}px 'Segoe UI', Arial, sans-serif`;
        const tw = ctx.measureText(text).width;
        const pad = 7;
        const bw = tw + pad * 2;
        const bh = fontSize + pad * 2;
        let bx = cx - bw / 2;
        const by = cy - bh - 14;
        // Clamp horizontally inside canvas
        bx = Math.max(4, Math.min(petsCanvas.width - bw - 4, bx));
        // Bubble body
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const r = 6;
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + bw - r, by);
        ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
        ctx.lineTo(bx + bw, by + bh - r);
        ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
        ctx.lineTo(bx + bw / 2 + 5, by + bh);
        ctx.lineTo(cx, by + bh + 10); // tail tip
        ctx.lineTo(bx + bw / 2 - 5, by + bh);
        ctx.lineTo(bx + r, by + bh);
        ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
        ctx.lineTo(bx, by + r);
        ctx.quadraticCurveTo(bx, by, bx + r, by);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Text
        ctx.fillStyle = '#1a1a2e';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, bx + pad, by + bh / 2);
        ctx.restore();
    }

    celebrate(actualMulti) {
        // EXCEPTION: Lock the state kung tumatalon pa (nasa jackpot state at hindi pa ubos ang timer)
        if (this.state === 'jackpot' && this.timer > 0) {
            // Kung jackpot ulit ang nahulog habang tumatalon, i-reset natin ang timer para tuloy lang ang talon
            if (actualMulti >= 10) {
                this.timer = Math.max(this.timer, 180);
            }
            return; // Balewalain ang ibang states (sad/happy) habang tumatalon
        }

        if (actualMulti >= 10) {
            this.state = 'jackpot';
            this.timer = 180;
            this.vx = 0;
            this.frame = 0;
            const lines = PET_DIALOGUES.jackpot;
            this.scheduleBubble(lines[Math.floor(Math.random() * lines.length)], 10, 90);
        } else if (actualMulti >= 1) {
            this.state = 'happy';
            if (this.vx === 0) this.vx = (Math.random() - 0.5) * 1.5;
            if (Math.random() < 0.5) {
                const lines = PET_DIALOGUES.win;
                this.scheduleBubble(lines[Math.floor(Math.random() * lines.length)], 5, 65);
            }
        } else {
            this.state = 'sad';
            if (this.vx === 0) this.vx = (Math.random() - 0.5) * 1.5;
            if (Math.random() < 0.6) {
                const lines = PET_DIALOGUES.sad;
                this.scheduleBubble(lines[Math.floor(Math.random() * lines.length)], 5, 65);
            }
        }
    }
}

// ============================================================================
// ANIMATED BACKGROUND SYSTEM
// ============================================================================
let bgParticles = [];
let bgStars = [];
let bgShootingStars = [];
let bgLastShot = 0;

function initBgParticles() {
    bgParticles = [];
    bgStars = [];
    bgShootingStars = [];
    const w = bgCanvas.width;
    const h = bgCanvas.height;

    switch (state.currentTheme) {
        case 'galaxy':
            for (let i = 0; i < 220; i++) {
                bgStars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: Math.random() * 1.8 + 0.3,
                    speed: Math.random() * 0.04 + 0.008,
                    phase: Math.random() * Math.PI * 2,
                    brightness: Math.random() * 0.5 + 0.5
                });
            }
            break;
        case 'deep_sea':
            for (let i = 0; i < 35; i++) bgParticles.push(_mkBubble(w, h, true));
            break;
        case 'inferno':
            for (let i = 0; i < 55; i++) bgParticles.push(_mkEmber(w, h, true));
            break;
        case 'cherry_blossom':
            for (let i = 0; i < 45; i++) bgParticles.push(_mkPetal(w, h, true));
            break;
        case 'neon':
            for (let i = 0; i < 18; i++) {
                bgParticles.push({
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 3 + 1,
                    color: ['#00e5ff', '#cc44ff', '#ff00ff'][Math.floor(Math.random() * 3)],
                    phase: Math.random() * Math.PI * 2
                });
            }
            break;
        case 'gold_rush':
            for (let i = 0; i < 35; i++) bgParticles.push(_mkSparkle(w, h, true));
            break;
        case 'retro_arcade':
            // No particles needed — scanlines are drawn procedurally
            break;
    }
}

function _mkBubble(w, h, rand = false) {
    return {
        x: Math.random() * w,
        y: rand ? Math.random() * h : h + 20,
        r: Math.random() * 9 + 3,
        vy: -(Math.random() * 0.5 + 0.2),
        vx: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.35 + 0.1,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01
    };
}

function _mkEmber(w, h, rand = false) {
    return {
        x: Math.random() * w,
        y: rand ? Math.random() * h : h + 5,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 1.8 + 0.6),
        size: Math.random() * 3 + 1,
        life: rand ? Math.random() : 1,
        decay: Math.random() * 0.004 + 0.002,
        color: ['#ff4400', '#ff6600', '#ffaa00', '#ff2200'][Math.floor(Math.random() * 4)]
    };
}

function _mkPetal(w, h, rand = false) {
    return {
        x: Math.random() * w,
        y: rand ? Math.random() * h : -20,
        vy: Math.random() * 0.7 + 0.25,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        size: Math.random() * 9 + 5,
        opacity: Math.random() * 0.55 + 0.25,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.018 + 0.008
    };
}

function _mkSparkle(w, h, rand = false) {
    return {
        x: Math.random() * w,
        y: rand ? Math.random() * h : -10,
        vy: Math.random() * 1.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3 + 1,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2
    };
}

function drawBackground() {
    const w = bgCanvas.width;
    const h = bgCanvas.height;
    const t = Date.now();

    bgCtx.clearRect(0, 0, w, h);

    switch (state.currentTheme) {
        case 'galaxy':        _drawGalaxy(w, h, t);       break;
        case 'deep_sea':      _drawDeepSea(w, h, t);      break;
        case 'inferno':       _drawInferno(w, h, t);      break;
        case 'cherry_blossom':_drawCherryBlossom(w, h, t);break;
        case 'neon':          _drawNeon(w, h, t);         break;
        case 'gold_rush':     _drawGoldRush(w, h, t);     break;
        case 'retro_arcade':  _drawRetroArcade(w, h, t);  break;
    }
}

function _drawGalaxy(w, h, t) {
    const grad = bgCtx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#000008');
    grad.addColorStop(1, '#07000f');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, w, h);

    bgStars.forEach(s => {
        const alpha = s.brightness * (0.4 + 0.6 * Math.sin(t * s.speed + s.phase));
        bgCtx.beginPath();
        bgCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(255,255,255,${alpha})`;
        bgCtx.fill();
    });

    // Shooting stars
    if (t - bgLastShot > 3500 + Math.random() * 3000) {
        bgLastShot = t;
        bgShootingStars.push({
            x: Math.random() * w * 0.6,
            y: Math.random() * h * 0.4,
            vx: 9 + Math.random() * 7,
            vy: 3 + Math.random() * 5,
            life: 1, decay: 0.025
        });
    }
    for (let i = bgShootingStars.length - 1; i >= 0; i--) {
        const s = bgShootingStars[i];
        const tailLen = 80;
        const grad = bgCtx.createLinearGradient(s.x, s.y, s.x - s.vx * 5, s.y - s.vy * 5);
        grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        bgCtx.beginPath();
        bgCtx.moveTo(s.x, s.y);
        bgCtx.lineTo(s.x - s.vx * (tailLen / 14), s.y - s.vy * (tailLen / 14));
        bgCtx.strokeStyle = grad;
        bgCtx.lineWidth = 2;
        bgCtx.stroke();
        s.x += s.vx; s.y += s.vy; s.life -= s.decay;
        if (s.life <= 0) bgShootingStars.splice(i, 1);
    }
}

function _drawDeepSea(w, h, t) {
    const grad = bgCtx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#000d1a');
    grad.addColorStop(1, '#001a2e');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, w, h);

    // Light rays
    for (let i = 0; i < 5; i++) {
        const rx = (w / 5) * i + w / 10 + Math.sin(t * 0.0004 + i) * 25;
        const alpha = 0.015 + Math.sin(t * 0.0008 + i * 1.3) * 0.008;
        const rg = bgCtx.createLinearGradient(rx, 0, rx + 50, h);
        rg.addColorStop(0, `rgba(0,200,255,${alpha})`);
        rg.addColorStop(1, 'rgba(0,200,255,0)');
        bgCtx.beginPath();
        bgCtx.moveTo(rx, 0); bgCtx.lineTo(rx + 70, h);
        bgCtx.lineTo(rx + 110, h); bgCtx.lineTo(rx + 40, 0);
        bgCtx.fillStyle = rg; bgCtx.fill();
    }

    for (let i = bgParticles.length - 1; i >= 0; i--) {
        const b = bgParticles[i];
        b.x += b.vx + Math.sin(t * b.wobbleSpeed + b.wobblePhase) * 0.3;
        b.y += b.vy;
        if (b.y < -b.r * 2) { bgParticles[i] = _mkBubble(w, h); continue; }
        bgCtx.beginPath();
        bgCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        bgCtx.strokeStyle = `rgba(100,220,255,${b.opacity})`;
        bgCtx.lineWidth = 1;
        bgCtx.stroke();
        bgCtx.beginPath();
        bgCtx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.28, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(210,245,255,${b.opacity * 0.7})`;
        bgCtx.fill();
    }
}

function _drawInferno(w, h, t) {
    const grad = bgCtx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a0000');
    grad.addColorStop(0.65, '#1c0400');
    grad.addColorStop(1, '#2e0800');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, w, h);

    // Lava cracks (redrawn each frame from seed — cheap)
    bgCtx.save();
    bgCtx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
        const pulse = 0.06 + Math.sin(t * 0.002 + i) * 0.04;
        bgCtx.strokeStyle = `rgba(255,80,0,${pulse})`;
        bgCtx.beginPath();
        let cx = (w / 7) * i + 20, cy = h;
        bgCtx.moveTo(cx, cy);
        while (cy > h * 0.55) {
            cx += Math.sin(i * 13.7 + cy * 0.03) * 25;
            cy -= 35 + Math.sin(i * 7.3 + cx * 0.02) * 15;
            bgCtx.lineTo(cx, cy);
        }
        bgCtx.stroke();
    }
    bgCtx.restore();

    for (let i = bgParticles.length - 1; i >= 0; i--) {
        const e = bgParticles[i];
        e.x += e.vx; e.y += e.vy; e.life -= e.decay;
        if (e.life <= 0 || e.y < -10) { bgParticles[i] = _mkEmber(w, h); continue; }
        bgCtx.beginPath();
        bgCtx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
        bgCtx.fillStyle = e.color;
        bgCtx.globalAlpha = e.life * 0.75;
        bgCtx.fill();
        bgCtx.globalAlpha = 1;
    }
    if (bgParticles.length < 60 && Math.random() < 0.35) bgParticles.push(_mkEmber(w, h));
}

function _drawCherryBlossom(w, h, t) {
    const grad = bgCtx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1a0d10');
    grad.addColorStop(1, '#0d0508');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, w, h);

    for (let i = bgParticles.length - 1; i >= 0; i--) {
        const p = bgParticles[i];
        p.x += Math.sin(t * p.swaySpeed + p.swayPhase) * 0.6;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (p.y > h + 20) { bgParticles[i] = _mkPetal(w, h); continue; }
        bgCtx.save();
        bgCtx.translate(p.x, p.y);
        bgCtx.rotate(p.rotation);
        bgCtx.globalAlpha = p.opacity;
        bgCtx.beginPath();
        bgCtx.ellipse(0, 0, p.size * 0.38, p.size, 0, 0, Math.PI * 2);
        bgCtx.fillStyle = '#ffb7c5';
        bgCtx.fill();
        bgCtx.restore();
        bgCtx.globalAlpha = 1;
    }
    if (bgParticles.length < 45 && Math.random() < 0.04) bgParticles.push(_mkPetal(w, h));
}

function _drawNeon(w, h, t) {
    bgCtx.fillStyle = '#02010c';
    bgCtx.fillRect(0, 0, w, h);

    // Grid
    bgCtx.strokeStyle = 'rgba(0,229,255,0.035)';
    bgCtx.lineWidth = 1;
    const gs = 65;
    for (let x = 0; x < w; x += gs) { bgCtx.beginPath(); bgCtx.moveTo(x, 0); bgCtx.lineTo(x, h); bgCtx.stroke(); }
    for (let y = 0; y < h; y += gs) { bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(w, y); bgCtx.stroke(); }

    // Floating orbs
    bgParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const alpha = 0.25 + 0.25 * Math.sin(t * 0.002 + p.phase);
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.shadowBlur = 18;
        bgCtx.shadowColor = p.color;
        bgCtx.globalAlpha = alpha;
        bgCtx.fillStyle = p.color;
        bgCtx.fill();
        bgCtx.shadowBlur = 0;
        bgCtx.globalAlpha = 1;
    });
}

function _drawGoldRush(w, h, t) {
    const grad = bgCtx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a0700');
    grad.addColorStop(1, '#1a1100');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, w, h);

    for (let i = bgParticles.length - 1; i >= 0; i--) {
        const s = bgParticles[i];
        s.x += s.vx; s.y += s.vy;
        s.rotation += s.rotSpeed;
        s.phase += 0.05;
        if (s.y > h + 10) { bgParticles[i] = _mkSparkle(w, h); continue; }
        const alpha = (0.55 + 0.45 * Math.sin(s.phase)) * 0.8;
        bgCtx.save();
        bgCtx.translate(s.x, s.y);
        bgCtx.rotate(s.rotation);
        bgCtx.globalAlpha = alpha;
        bgCtx.beginPath();
        for (let j = 0; j < 4; j++) {
            const a = (j / 4) * Math.PI * 2;
            bgCtx.lineTo(Math.cos(a) * s.size, Math.sin(a) * s.size);
            bgCtx.lineTo(Math.cos(a + Math.PI / 4) * (s.size * 0.4), Math.sin(a + Math.PI / 4) * (s.size * 0.4));
        }
        bgCtx.closePath();
        bgCtx.fillStyle = '#ffd700';
        bgCtx.fill();
        bgCtx.restore();
        bgCtx.globalAlpha = 1;
    }
    if (bgParticles.length < 35 && Math.random() < 0.1) bgParticles.push(_mkSparkle(w, h));
}

function _drawRetroArcade(w, h, t) {
    bgCtx.fillStyle = '#000000';
    bgCtx.fillRect(0, 0, w, h);

    // Pixel grid dots
    bgCtx.fillStyle = 'rgba(0,80,0,0.18)';
    for (let x = 0; x < w; x += 12) {
        for (let y = 0; y < h; y += 12) {
            bgCtx.fillRect(x, y, 1, 1);
        }
    }

    // CRT scanlines
    for (let y = 0; y < h; y += 3) {
        bgCtx.fillStyle = 'rgba(0,0,0,0.2)';
        bgCtx.fillRect(0, y, w, 1);
    }

    // Slow horizontal scan glow
    const scanY = ((t * 0.03) % h);
    const scanGrad = bgCtx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    scanGrad.addColorStop(0, 'rgba(0,255,80,0)');
    scanGrad.addColorStop(0.5, 'rgba(0,255,80,0.03)');
    scanGrad.addColorStop(1, 'rgba(0,255,80,0)');
    bgCtx.fillStyle = scanGrad;
    bgCtx.fillRect(0, scanY - 40, w, 80);
}

function applyTheme(id) {
    document.body.classList.remove(
        'theme-neon', 'theme-gold-rush', 'theme-galaxy',
        'theme-deep-sea', 'theme-inferno', 'theme-cherry-blossom', 'theme-retro-arcade'
    );
    if (id !== 'default') document.body.classList.add(`theme-${id.replace(/_/g, '-')}`);
    state.currentTheme = id;
    initBgParticles();
}

// ============================================================================
// GAME FUNCTIONS & RGB LIGHTS
// ============================================================================
function triggerRGBEffect(mode) {
    state.borderEffect.mode = mode;
    state.borderEffect.timer = 60; // 1 second animation duration (60 fps)
}

function getFirePalette(streak) {
    if (streak >= 15) return { colors: ['#ff1493', '#ff0066', '#ff44bb', '#ee00aa'], glow: '#ff1493' };
    if (streak >= 10) return { colors: ['#00aaff', '#0055ff', '#44ddff', '#00ccff'], glow: '#00aaff' };
    return { colors: ['#ff6b00', '#ff4400', '#ffaa00', '#ff8800'], glow: '#ff6600' };
}

function drawLightbulbs(ctx, w, h) {
    const effect = state.borderEffect;

    const spacingX = w / CONFIG.BORDER_LIGHT_COUNT;
    const spacingY = h / CONFIG.BORDER_LIGHT_COUNT;
    const bulbSize = 5;
    const margin = 14;

    const time = Date.now();

    const bulbs = [];

    // Top (Left to Right, skip corners)
    for (let i = 1; i < CONFIG.BORDER_LIGHT_COUNT; i++) {
        bulbs.push({ x: i * spacingX, y: margin });
    }
    // Right (Top to Bottom, skip corners)
    for (let i = 1; i < CONFIG.BORDER_LIGHT_COUNT; i++) {
        bulbs.push({ x: w - margin, y: i * spacingY });
    }
    // Bottom (Right to Left, skip corners)
    for (let i = CONFIG.BORDER_LIGHT_COUNT - 1; i > 0; i--) {
        bulbs.push({ x: i * spacingX, y: h - margin });
    }
    // Left (Bottom to Top, skip corners)
    for (let i = CONFIG.BORDER_LIGHT_COUNT - 1; i > 0; i--) {
        bulbs.push({ x: margin, y: i * spacingY });
    }

    let globalColor = null;
    let globalGlow = 0;

    if (effect.timer > 0) {
        effect.timer--;
        if (effect.mode === 'win') {
            globalColor = (Math.floor(effect.timer / 5) % 2 === 0) ? '#39ff14' : '#f9d71c';
            globalGlow = 25;
        } else if (effect.mode === 'jackpot') {
            globalColor = `hsl(${(time * 2) % 360}, 100%, 50%)`;
            globalGlow = 35;
        } else if (effect.mode === 'lose') {
            globalColor = (Math.floor(effect.timer / 5) % 2 === 0) ? '#ff1744' : '#4a0404';
            globalGlow = 15;
        }
    } else {
        state.borderEffect.mode = 'idle';
    }

    const totalBulbs = bulbs.length;
    const speed = 25;
    const headIndex = Math.floor(time / speed) % totalBulbs;

    bulbs.forEach((bulb, index) => {
        let color = globalColor;
        let glow = globalGlow;

        ctx.save();

        if (!color) {
            if (state.winStreak >= 5) {
                // Fire border — flicker based on time + bulb index
                const palette = getFirePalette(state.winStreak);
                const flicker = Math.floor((time / 60 + index * 0.7)) % palette.colors.length;
                color = palette.colors[flicker];
                glow = 20 + Math.sin(time / 80 + index * 0.3) * 10;
            } else if (state.autoPlay) {
                // AutoPlay Marquee
                let dist = (headIndex - index + totalBulbs) % totalBulbs;
                let tailLength = 15;

                if (dist < tailLength) {
                    let hue = 180 + (dist * 2);
                    let lightness = 60 - (dist * 3);
                    color = `hsl(${hue}, 100%, ${lightness}%)`;
                    glow = 20 - dist;
                } else {
                    color = 'rgba(0, 229, 255, 0.05)';
                    glow = 0;
                }
            } else {
                // Idle Pattern
                color = `hsl(${(time / 15 + index * 2) % 360}, 100%, 60%)`;
                glow = 10 + Math.sin(time / 200) * 5;
            }
        }

        ctx.shadowBlur = glow;
        ctx.shadowColor = color;
        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(bulb.x, bulb.y, bulbSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function dropBall() {
    const randomPlaySound = Math.random() > 0.5 ? SOUNDS.play1 : SOUNDS.play2;
    playSound(randomPlaySound);
    const spacing = Math.min(plinkoCanvas.width / (state.lines + 2), plinkoCanvas.height / (state.lines + 3));
    const ballX = plinkoCanvas.width / 2 + (Math.random() - 0.5) * 10;

    let color = '#ffc107';
    if (state.bet >= 100) color = '#ff00ff';
    else if (state.bet >= 50) color = '#ff0000';
    else if (state.bet >= 25) color = '#ff6b00';
    else if (state.bet >= 10) color = '#ffc107';
    else color = '#4caf50';

    balls.push({
        x: ballX, y: 30, // Dropped lower to avoid clipping top lights
        vx: (Math.random() - 0.5) * 2, vy: 0,
        radius: Math.max(2, spacing * 0.15),
        color: color,
        trail: [],
        bet: state.bet
    });
}

function createConfetti(x, y) {
    for (let i = 0; i < CONFIG.CONFETTI_COUNT; i++) {
        confetti.push({
            x, y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 - 3,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            size: Math.random() * 4 + 2,
            life: 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.3
        });
    }
}

// ============================================================================
// GAMIFICATION LOGIC
// ============================================================================
function checkDailyLogin() {
    const today = new Date().toDateString();
    if (state.lastLogin !== today) {
        state.lastLogin = today;
        state.dailyProgress = { wins: 0, streak: 0, wagered: 0 };
        saveState();
    }
    if (state.lastSpin !== today) {
        openLuckySpin();
    }
}

function addXP(amount) {
    floatXP(amount);
    state.xp += amount;
    const xpNeeded = state.level * CONFIG.XP_PER_LEVEL;

    if (state.xp >= xpNeeded) {
        state.xp -= xpNeeded;
        state.level++;
        const starReward = state.level * 100;
        state.stars += starReward;
        showToast(`🎉 <strong>Level Up!</strong><br>You are now <strong style="color:var(--gold)">Level ${state.level}</strong><br><span>+${starReward} ⭐ Stars</span>`);
        createLevelUpBurst();
        playSound(new Audio('mp3/paldo-nanaman.mp3'));
    }
    updateLevelDisplay();
    saveState();
}

function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (!state.achievements.includes(ach.id) && ach.condition()) {
            state.achievements.push(ach.id);
            state.stars += ach.reward;
            showToast(`🏆 <strong>Achievement Unlocked!</strong><br>${ach.icon} ${ach.name}<br><span>+${ach.reward} ⭐</span>`);
            playSound(new Audio('mp3/paldo-nanaman.mp3'));
            saveState();
        }
    });
}

function activatePowerup(powerupId) {
    const powerup = SHOP_ITEMS.powerups.find(p => p.id === powerupId);
    if (!powerup) return;

    if (state.stars < powerup.cost) {
        showAlert('Not enough stars! ⭐');
        return;
    }

    state.stars -= powerup.cost;
    state.activePowerups.push({
        id: powerup.id,
        name: powerup.name,
        remaining: powerup.duration
    });

    showAlert(`${powerup.name} activated!<br>${powerup.duration} plays remaining`);
    updatePowerupDisplay();
    saveState();
}

function consumePowerup(powerupId) {
    const powerup = state.activePowerups.find(p => p.id === powerupId);
    if (!powerup) return;

    powerup.remaining--;
    if (powerup.remaining <= 0) {
        state.activePowerups = state.activePowerups.filter(p => p.id !== powerupId);
        showAlert(`${powerup.name} expired! 💨`);
    }

    updatePowerupDisplay();
    saveState();
}

function applyPowerups(multiplier, winAmount) {
    let boostedMulti = multiplier;
    let boostedWin = winAmount;

    state.activePowerups.forEach(powerup => {
        switch(powerup.id) {
            case 'lucky_charm':
                boostedMulti *= 1.1;
                break;
            case 'golden_ball':
                boostedWin *= 2;
                break;
            case 'jackpot_boost':
                if (multiplier >= 10) boostedMulti *= 1.5;
                break;
        }
    });

    return { multiplier: boostedMulti, winAmount: boostedWin };
}

function handleLoss(betAmount) {
    let refund = 0;

    // Shield powerup
    const shield = state.activePowerups.find(p => p.id === 'shield');
    if (shield) {
        refund = betAmount * 0.5;
        state.stars += refund;
        consumePowerup('shield');
    }

    return refund;
}

function handleStreakLoss() {
    // Streak saver powerup
    const streakSaver = state.activePowerups.find(p => p.id === 'streak_saver');
    if (streakSaver && state.winStreak > 0) {
        // Don't reset streak
        consumePowerup('streak_saver');
        showAlert('🛡️ Streak Saved!');
        return true; // Streak was saved
    }
    return false; // Streak not saved
}

function updatePhysics() {
    const gravMult  = state.slowMo > 0 ? 0.25 : 1;
    const fricMult  = state.slowMo > 0 ? 0.992 : CONFIG.FRICTION;
    if (state.slowMo > 0) state.slowMo--;

    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > CONFIG.TRAIL_LENGTH) ball.trail.shift();

        // Emit fire particles when on a streak
        if (state.winStreak >= 5 && Math.random() < 0.5) {
            const palette = getFirePalette(state.winStreak);
            fireParticles.push({
                x: ball.x + (Math.random() - 0.5) * ball.radius * 1.5,
                y: ball.y + (Math.random() - 0.5) * ball.radius * 0.5,
                vx: (Math.random() - 0.5) * 1.2,
                vy: -(Math.random() * 2 + 1),
                color: palette.colors[Math.floor(Math.random() * palette.colors.length)],
                size: Math.random() * 3 + 1.5,
                life: 1
            });
        }

        ball.vy += CONFIG.GRAVITY * gravMult;
        ball.vx *= fricMult;
        ball.x += ball.vx;
        ball.y += ball.vy;

        pegs.forEach(peg => {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < ball.radius + peg.radius) {
                playSound(pegSound);
                pegRipples.push({ x: peg.x, y: peg.y, r: peg.radius + 1, life: 1 });
                const nx = dx / dist;
                const ny = dy / dist;
                const dot = ball.vx * nx + ball.vy * ny;
                ball.vx = (ball.vx - 2 * dot * nx) * CONFIG.BOUNCE;
                ball.vy = (ball.vy - 2 * dot * ny) * CONFIG.BOUNCE;
                const overlap = (ball.radius + peg.radius) - dist;
                ball.x += nx * overlap;
                ball.y += ny * overlap;
                ball.vx += (Math.random() - 0.5) * 0.5;
            }
        });

        slots.forEach((slot, idx) => {
            if (ball.y > slot.y && ball.x > slot.x && ball.x < slot.x + slot.width) {
                handleWin(slot.multiplier, idx, slot, ball.bet);
                balls.splice(i, 1);
            }
        });

        if (ball.y > plinkoCanvas.height + 50 || ball.x < -50 || ball.x > plinkoCanvas.width + 50) {
            playSound(SOUNDS.lossHigh);
            balls.splice(i, 1);
        }
    }

    for (let i = slotPulses.length - 1; i >= 0; i--) {
        slotPulses[i].life--;
        if (slotPulses[i].life <= 0) slotPulses.splice(i, 1);
    }

    slotHeat.forEach((h, i) => { slotHeat[i] = h * 0.95; });

    for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.vx *= 0.99;
        p.life -= 0.02;
        p.rotation += p.rotationSpeed;
        if (p.life <= 0 || p.y > plinkoCanvas.height) confetti.splice(i, 1);
    }

    for (let i = fireParticles.length - 1; i >= 0; i--) {
        const p = fireParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.life -= 0.06;
        p.size *= 0.97;
        if (p.life <= 0) fireParticles.splice(i, 1);
    }

    if (balls.length === 0 && state.stars < CONFIG.MIN_BET) {
        if (!state.isGameOver) {
            showGameOver();
        }
    } else if (balls.length === 0 && state.stars >= CONFIG.MIN_BET) {
        state.isGameOver = false;
    }
}

function handleWin(multiplier, slotIdx, slot, bet) {
    let actualMulti = multiplier;

    // Check for comeback achievement
    if (state.stars <= 0 && multiplier >= 1) {
        state.comebackAchieved = true;
    }

    if (multiplier >= 1) {
        state.winStreak++;
        state.dailyProgress.wins++;
        if (state.winStreak > state.dailyProgress.streak) {
            state.dailyProgress.streak = state.winStreak;
        }

        if (state.winStreak > CONFIG.STREAK_BONUS_START) {
            const bonus = Math.floor((state.winStreak - CONFIG.STREAK_BONUS_START) * CONFIG.STREAK_BONUS_RATE * 10) / 10;
            actualMulti = multiplier + bonus;
            winEffects.push({
                text: `🔥 x${state.winStreak} COMBO!`,
                x: plinkoCanvas.width / 2,
                y: plinkoCanvas.height / 3,
                opacity: 1,
                rotation: 0,
                combo: true
            });
        }
        if (state.winStreak > state.stats.longestStreak) {
            state.stats.longestStreak = state.winStreak;
        }

        // Check for jackpot achievement
        if (multiplier >= 100) {
            state.jackpotHit = true;
        }

        if (actualMulti >= 10) {
            playSound(new Audio('mp3/paldo-nanaman.mp3'));
            triggerRGBEffect('jackpot');
        } else if (actualMulti >= 3) {
            playSound(new Audio('mp3/lets-go-gambling-win.mp3'));
            triggerRGBEffect('win');
        } else {
            playSound(new Audio('mp3/kaching-sound-fx.mp3'));
            triggerRGBEffect('win');
        }

        // Add XP for winning
        addXP(CONFIG.XP_PER_WIN);

        // Consume powerups
        state.activePowerups.forEach(p => consumePowerup(p.id));
    } else {
        // Handle loss
        const refund = handleLoss(bet);

        // Check streak saver
        if (!handleStreakLoss()) {
            state.winStreak = 0; // Reset streak if not saved
        }

        if (refund === 0) {
            playSound(lossSound);
            triggerRGBEffect('lose');
        }

        // Add small XP even for losses
        addXP(CONFIG.XP_PER_GAME);
    }

    let winAmount = bet * actualMulti;

    // Apply powerups
    const boosted = applyPowerups(actualMulti, winAmount);
    actualMulti = boosted.multiplier;
    winAmount = boosted.winAmount;

    // Apply prestige bonus
    if (state.prestige > 0) winAmount *= (1 + state.prestige * 0.05);

    state.stars += winAmount;

    // Slow-mo on big wins
    if (actualMulti >= CONFIG.SLOWMO_THRESHOLD) state.slowMo = CONFIG.SLOWMO_FRAMES;

    // Jackpot meter
    if (multiplier < 1) {
        state.jackpotMeter = Math.min(CONFIG.JACKPOT_METER_MAX, state.jackpotMeter + 8);
    } else if (multiplier <= 2) {
        state.jackpotMeter = Math.min(CONFIG.JACKPOT_METER_MAX, state.jackpotMeter + 2);
    } else {
        state.jackpotMeter = Math.max(0, state.jackpotMeter - 5);
    }
    if (state.jackpotMeter >= CONFIG.JACKPOT_METER_MAX) {
        state.jackpotMeter = 0;
        state.activePowerups.push({ id: 'jackpot_boost', name: '💎 Jackpot Boost', remaining: 3 });
        showToast('🎰 <strong>Jackpot Meter FULL!</strong><br><span>💎 Jackpot Boost activated for 3 plays!</span>');
        updatePowerupDisplay();
    }
    updateJackpotMeter();

    // Bet strategy adjustment
    if (state.betStrategy === 'martingale') {
        state.bet = multiplier < 1
            ? Math.min(state.stars, state.bet * 2)
            : state.baseBet;
    } else if (state.betStrategy === 'anti_martingale') {
        state.bet = multiplier >= 2
            ? Math.min(state.stars, state.bet * 2)
            : state.baseBet;
    }

    if (!slotHeat[slotIdx]) slotHeat[slotIdx] = 0;
    slotHeat[slotIdx] = Math.min(slotHeat[slotIdx] + 1, 5);

    slotPulses.push({ slotIndex: slotIdx, life: 30 });

    state.stats.gamesPlayed++;
    state.stats.totalWagered += bet;
    state.dailyProgress.wagered += bet;
    state.stats.totalWon += winAmount;
    if (winAmount > state.stats.biggestWin) state.stats.biggestWin = winAmount;
    if (actualMulti > state.stats.biggestMultiplier) state.stats.biggestMultiplier = actualMulti;

    // Track balance history for sparkline
    state.balanceHistory.push(state.stars);
    if (state.balanceHistory.length > 20) state.balanceHistory.shift();

    // Check achievements
    checkAchievements();

    saveState();
    updateDisplay();
    updateStatsDisplay();
    addHistoryEntry(bet, actualMulti);

    if (actualMulti >= CONFIG.CONFETTI_THRESHOLD && slot) {
        createConfetti(slot.x + slot.width / 2, slot.y);
    }

    if (actualMulti >= 2) {
        let text = `${actualMulti}x WIN!`;
        if (state.winStreak > CONFIG.STREAK_BONUS_START) text += ` 🔥${state.winStreak}`;
        winEffects.push({ text, x: plinkoCanvas.width / 2, y: plinkoCanvas.height / 2, opacity: 1, rotation: 0 });
    }

    pets.forEach(p => {
        if (state.activePets.has(p.name)) p.celebrate(actualMulti);
    });
}

function showGameOver() {
    if (state.isGameOver && !document.getElementById('gameOverOverlay').classList.contains('hidden')) return;
    state.isGameOver = true;
    if (state.autoPlay) {
        const autoBtn = document.getElementById('autoPlayBtn');
        if (autoBtn) autoBtn.click();
    }
    const overlay = document.getElementById('gameOverOverlay');
    const box = document.getElementById('gameOverBox');
    if (overlay) overlay.classList.remove('hidden');
    if (box) box.classList.remove('hidden');

    const catLaugh = document.getElementById('catLaughSound');
    const tuco = document.getElementById('tucoSound');

    if (!state.isSfxMuted) {
        if (catLaugh) {
            catLaugh.currentTime = 0;
            catLaugh.play().catch(() => { });

            catLaugh.onended = () => {
                if (!state.isSfxMuted && state.isGameOver && tuco) {
                    tuco.currentTime = 0;
                    tuco.play().catch(() => { });
                }
            };
        }
    }
}

function hideGameOver() {
    const overlay = document.getElementById('gameOverOverlay');
    const box = document.getElementById('gameOverBox');
    if (overlay) overlay.classList.add('hidden');
    if (box) box.classList.add('hidden');

    const catLaugh = document.getElementById('catLaughSound');
    const tuco = document.getElementById('tucoSound');
    if (catLaugh) catLaugh.pause();
    if (tuco) tuco.pause();
}

function refreshPresetButtons() {
    const presetsEl = document.getElementById('betPresets');
    if (!presetsEl) return;
    presetsEl.querySelectorAll('.preset-btn').forEach((btn, i) => {
        btn.disabled = CONFIG.PRESETS[i] > state.stars;
    });
}

function renderDailyChallenges() {
    const el = document.getElementById('challengesDisplay');
    if (!el) return;
    const progress = state.dailyProgress;
    const progressMap = {
        daily_wins:    progress.wins,
        daily_streak:  progress.streak,
        daily_wagered: progress.wagered
    };
    el.innerHTML = DAILY_CHALLENGES.map(c => {
        const current = Math.min(progressMap[c.id] || 0, c.target);
        const pct = Math.floor((current / c.target) * 100);
        const done = current >= c.target;
        return `
            <div class="challenge-item ${done ? 'challenge-done' : ''}">
                <div class="challenge-header">
                    <span>${c.icon} ${c.name}</span>
                    <span class="challenge-reward">+${c.reward}⭐</span>
                </div>
                <div class="challenge-bar-wrap">
                    <div class="challenge-bar" style="width:${pct}%"></div>
                </div>
                <div class="challenge-progress">${current} / ${c.target}${done ? ' ✓' : ''}</div>
            </div>`;
    }).join('');
}

function updateDisplay() {
    if (balanceEl) balanceEl.textContent = `⭐${state.stars.toFixed(2)}`;

    const streakEl = document.getElementById('streakDisplay');
    if (streakEl) {
        if (state.winStreak > 0) {
            streakEl.textContent = `🔥 ${state.winStreak} Win Streak`;
            streakEl.style.display = 'block';
        } else {
            streakEl.style.display = 'none';
        }
    }

    const maxWinEl = document.getElementById('maxWinDisplay');
    if (maxWinEl) {
        const maxMulti = Math.max(...(MULTIPLIERS[state.lines]?.[state.risk] || [1]));
        const maxWin = state.bet * maxMulti;
        maxWinEl.textContent = `Max: ⭐${maxWin.toFixed(2)} (${maxMulti}x)`;
    }

    updateLevelDisplay();
    updatePowerupDisplay();
    refreshPresetButtons();
    renderDailyChallenges();
}

function floatXP(amount) {
    const levelEl = document.getElementById('levelDisplay');
    if (!levelEl) return;
    const rect = levelEl.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'xp-float';
    el.textContent = `+${amount} XP`;
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top = `${rect.top}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function createLevelUpBurst() {
    const cx = plinkoCanvas.width / 2;
    const cy = plinkoCanvas.height / 2;
    for (let i = 0; i < 60; i++) {
        const angle = (Math.PI * 2 * i) / 60;
        const speed = Math.random() * 6 + 2;
        confetti.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3,
            color: ['#f9d71c', '#d4af37', '#ffaa00', '#fff'][Math.floor(Math.random() * 4)],
            size: Math.random() * 5 + 3,
            life: 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }
}

function updateJackpotMeter() {
    const el = document.getElementById('jackpotMeter');
    const fill = document.getElementById('jackpotMeterFill');
    if (!el || !fill) return;
    const pct = (state.jackpotMeter / CONFIG.JACKPOT_METER_MAX) * 100;
    fill.style.width = `${pct}%`;
    el.title = `Jackpot Meter: ${Math.floor(pct)}%`;
    fill.className = 'jackpot-fill' + (pct >= 100 ? ' jackpot-full' : pct >= 70 ? ' jackpot-hot' : '');
}

function updateLevelDisplay() {
    const levelEl = document.getElementById('levelDisplay');
    if (!levelEl) return;
    const xpNeeded = state.level * CONFIG.XP_PER_LEVEL;
    const progress = Math.floor((state.xp / xpNeeded) * 100);
    const prestigeBadge = state.prestige > 0 ? `<span class="prestige-badge">⚡${state.prestige}</span>` : '';
    const prestigeBtn = state.level >= CONFIG.PRESTIGE_LEVEL
        ? `<button id="prestigeBtn" class="prestige-btn">✨ PRESTIGE</button>`
        : '';
    levelEl.innerHTML = `
        <div class="level-badge">
            ${prestigeBadge}<span class="level-number">Lv.${state.level}</span>
        </div>
        <div class="xp-bar-container">
            <div class="xp-bar" style="width: ${progress}%"></div>
            <span class="xp-text">${state.xp} / ${xpNeeded} XP</span>
        </div>
        ${prestigeBtn}
    `;
    if (state.level >= CONFIG.PRESTIGE_LEVEL) {
        const btn = document.getElementById('prestigeBtn');
        if (btn) btn.addEventListener('click', doPrestige);
    }
}

function updatePowerupDisplay() {
    const powerupEl = document.getElementById('activePowerupsDisplay');
    if (powerupEl && state.activePowerups.length > 0) {
        powerupEl.innerHTML = state.activePowerups.map(p => `
            <div class="active-powerup">
                ${p.name} (${p.remaining})
            </div>
        `).join('');
        powerupEl.style.display = 'block';
    } else if (powerupEl) {
        powerupEl.style.display = 'none';
    }
}

async function doPrestige() {
    if (state.level < CONFIG.PRESTIGE_LEVEL) return;
    const bonus = (state.prestige + 1) * 5;
    if (!await showConfirm(`Prestige! Reset to Lv.1 and gain a permanent +${bonus}% multiplier bonus?`)) return;
    state.prestige++;
    state.level = 1;
    state.xp = 0;
    showToast(`⚡ <strong>Prestige ${state.prestige}!</strong><br><span>+${state.prestige * 5}% permanent multiplier bonus</span>`);
    saveState();
    updateLevelDisplay();
    updateDisplay();
}

function updateStatsDisplay() {
    const statsEl = document.getElementById('statsDisplay');
    if (!statsEl) return;

    const { gamesPlayed, totalWagered, totalWon, biggestWin, biggestMultiplier, longestStreak } = state.stats;
    const netProfit = totalWon - totalWagered;
    const winRate = gamesPlayed > 0 ? ((totalWon / totalWagered) * 100).toFixed(1) : '0.0';
    const prestigeLine = state.prestige > 0 ? `<div class="stat-row"><span>Prestige:</span><span class="gold">⚡${state.prestige} (+${state.prestige * 5}%)</span></div>` : '';

    statsEl.innerHTML = `
        <div class="stat-row"><span>Games:</span><span>${gamesPlayed}</span></div>
        <div class="stat-row"><span>Net:</span><span class="${netProfit >= 0 ? 'win' : 'loss'}">⭐${netProfit.toFixed(2)}</span></div>
        <div class="stat-row"><span>Best Win:</span><span class="win">⭐${biggestWin.toFixed(2)}</span></div>
        <div class="stat-row"><span>Best Multi:</span><span class="gold">${biggestMultiplier}x</span></div>
        <div class="stat-row"><span>Longest Streak:</span><span class="gold">🔥${longestStreak}</span></div>
        <div class="stat-row"><span>ROI:</span><span class="${netProfit >= 0 ? 'win' : 'loss'}">${winRate}%</span></div>
        ${prestigeLine}
        <canvas id="sparkline" class="sparkline" width="200" height="40"></canvas>
    `;
    drawSparkline();
}

function drawSparkline() {
    const canvas = document.getElementById('sparkline');
    if (!canvas || state.balanceHistory.length < 2) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const vals = state.balanceHistory;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const toX = i => (i / (vals.length - 1)) * w;
    const toY = v => h - ((v - min) / range) * (h - 4) - 2;

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(vals[0]));
    for (let i = 1; i < vals.length; i++) ctx.lineTo(toX(i), toY(vals[i]));
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Fill under line
    ctx.lineTo(toX(vals.length - 1), h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(212,175,55,0.12)';
    ctx.fill();
}

function addHistoryEntry(bet, multi) {
    const profit = bet * multi;
    state.history.unshift({ bet, multi, profit });
    if (state.history.length > CONFIG.MAX_HISTORY) state.history.pop();

    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    const entry = document.createElement('div');
    entry.className = 'history-entry';
    entry.innerHTML = `
        <span class="hist-bet">⭐${bet.toFixed(2)}</span>
        <span class="hist-multi">${parseFloat(multi.toFixed(2))}x</span>
        <span class="hist-profit ${multi >= 1 ? 'win' : 'loss'}">⭐${profit.toFixed(2)}</span>
    `;
    historyList.prepend(entry);
    if (historyList.children.length > CONFIG.MAX_HISTORY) {
        historyList.removeChild(historyList.lastChild);
    }
}

function generateBoard() {
    pegs = []; slots = []; slotHeat = [];
    const rows = state.lines;
    const startY = 55;
    const slotHeight = 30;

    const padding = 60;
    const availableHeight = plinkoCanvas.height - startY - slotHeight - 40;
    const maxSpacingH = availableHeight / (rows + 0.8);
    const maxSpacingW = (plinkoCanvas.width - padding) / (rows + 2);
    const spacing = Math.min(maxSpacingW, maxSpacingH);

    for (let r = 1; r <= rows; r++) {
        const rowPegs = r + 1;
        const rowWidth = rowPegs * spacing;
        const startX = (plinkoCanvas.width - rowWidth) / 2 + spacing / 2;
        for (let c = 0; c < rowPegs; c++) {
            pegs.push({ x: startX + c * spacing, y: startY + r * spacing, radius: Math.max(1, spacing * 0.08) });
        }
    }

    const lastRowY = startY + rows * spacing;
    const slotRowPegs = rows + 1;
    const rowWidth = slotRowPegs * spacing;
    const startX = (plinkoCanvas.width - rowWidth) / 2;
    const multipliers = (MULTIPLIERS[rows] || MULTIPLIERS[8])[state.risk] || MULTIPLIERS[8].normal;

    for (let i = 0; i < slotRowPegs; i++) {
        slots.push({ x: startX + i * spacing, y: lastRowY + spacing * 0.8, width: spacing - 4, height: slotHeight, multiplier: multipliers[i] || 1 });
    }
}

function resizeCanvases() {
    const gamePane = plinkoCanvas.parentElement;
    if (!gamePane) return;

    plinkoCanvas.width = gamePane.offsetWidth;
    plinkoCanvas.height = gamePane.offsetHeight;

    const petsPane = petsCanvas.parentElement;
    if (petsPane) {
        petsCanvas.width = petsPane.offsetWidth;
        petsCanvas.height = petsPane.offsetHeight;
    }

    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    initBgParticles();

    cachedBgGradient = null;
    generateBoard();
}

function updateControlsState() {
    const isBusy = balls.length > 0;
    const riskEl = document.getElementById('riskLevel');
    const linesEl = document.getElementById('linesCount');
    if (riskEl) riskEl.disabled = isBusy;
    if (linesEl) linesEl.disabled = isBusy;

    [riskEl, linesEl].forEach(el => {
        if (el) {
            el.style.opacity = isBusy ? '0.5' : '1';
            el.style.cursor = isBusy ? 'not-allowed' : 'pointer';
        }
    });
}

// ============================================================================
// 2.5D ARCADE STAGE DRAWING
// ============================================================================
function drawPetStage() {
    petsCtx.clearRect(0, 0, petsCanvas.width, petsCanvas.height);
    const w = petsCanvas.width;
    const h = petsCanvas.height;

    // 1. Background Wall
    petsCtx.fillStyle = '#05060a';
    petsCtx.fillRect(0, 0, w, h);

    // 2. Spotlights
    const spotGrad = petsCtx.createRadialGradient(w / 2, 0, 20, w / 2, h / 2, h);
    spotGrad.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
    spotGrad.addColorStop(1, 'transparent');
    petsCtx.fillStyle = spotGrad;
    petsCtx.fillRect(0, 0, w, h);

    // 3. Isometric / Perspective Floor
    const floorTopY = h - 60;
    const floorBottomY = h - 15;

    petsCtx.beginPath();
    petsCtx.moveTo(w * 0.05, floorTopY); // Top Left 
    petsCtx.lineTo(w * 0.95, floorTopY); // Top Right
    petsCtx.lineTo(w, floorBottomY);     // Bottom Right
    petsCtx.lineTo(0, floorBottomY);     // Bottom Left
    petsCtx.closePath();

    // Floor Gradient 
    const floorGrad = petsCtx.createLinearGradient(0, floorTopY, 0, floorBottomY);
    floorGrad.addColorStop(0, '#0b0d17');
    floorGrad.addColorStop(1, '#1a1d2d');
    petsCtx.fillStyle = floorGrad;
    petsCtx.fill();

    // 4. Perspective Grid Lines
    petsCtx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
    petsCtx.lineWidth = 1;
    // Vertical receding lines
    for (let i = 1; i < 10; i++) {
        petsCtx.beginPath();
        let topX = w * 0.05 + (w * 0.9 * (i / 10));
        let bottomX = w * (i / 10);
        petsCtx.moveTo(topX, floorTopY);
        petsCtx.lineTo(bottomX, floorBottomY);
        petsCtx.stroke();
    }
    // Horizontal perspective lines
    petsCtx.beginPath(); petsCtx.moveTo(w * 0.035, floorTopY + 15); petsCtx.lineTo(w * 0.965, floorTopY + 15); petsCtx.stroke();
    petsCtx.beginPath(); petsCtx.moveTo(w * 0.015, floorTopY + 32); petsCtx.lineTo(w * 0.985, floorTopY + 32); petsCtx.stroke();

    // 5. Stage Front Lip
    petsCtx.fillStyle = '#d4af37';
    petsCtx.fillRect(0, floorBottomY, w, 3);
    petsCtx.fillStyle = '#05060a';
    petsCtx.fillRect(0, floorBottomY + 3, w, h - floorBottomY);

    // Glowing Gold Outline
    petsCtx.shadowColor = '#f9d71c';
    petsCtx.shadowBlur = 10;
    petsCtx.strokeStyle = '#d4af37';
    petsCtx.lineWidth = 2;
    petsCtx.beginPath();
    petsCtx.moveTo(0, floorBottomY);
    petsCtx.lineTo(w, floorBottomY);
    petsCtx.stroke();
    petsCtx.shadowBlur = 0;

    // Draw the pets on top of this stage
    const activePetsList = pets.filter(p => state.activePets.has(p.name));
    activePetsList.forEach(pet => {
        const others = activePetsList.filter(p => p !== pet);
        pet.update(others);
        pet.draw(petsCtx);
    });
}

// ============================================================================
// THEME STYLE HELPER
// ============================================================================
function getThemeStyle() {
    const t = Date.now();
    switch (state.currentTheme) {
        case 'neon':
            return {
                ballColor:     '#00e5ff',
                ballGlow:      28 + Math.sin(t / 200) * 10,
                ballGlowColor: '#00e5ff',
                trailColor:    '#00e5ff',
                trailOpacity:  0.55,
                pegColor:      '#cc44ff',
                pegGlow:       10,
                pegGlowColor:  '#9900ff',
                pegStroke:     '#6600cc',
                slotGlow:      6
            };
        case 'gold_rush':
            return {
                ballColor:     '#ffd700',
                ballGlow:      20 + Math.sin(t / 300) * 6,
                ballGlowColor: '#ffaa00',
                trailColor:    '#ffcc00',
                trailOpacity:  0.45,
                pegColor:      '#d4af37',
                pegGlow:       8,
                pegGlowColor:  '#ffcc00',
                pegStroke:     '#886600',
                slotGlow:      4
            };
        case 'galaxy':
            return {
                ballColor:     '#c084fc',
                ballGlow:      22 + Math.sin(t / 250) * 8,
                ballGlowColor: '#818cf8',
                trailColor:    '#a855f7',
                trailOpacity:  0.5,
                pegColor:      '#818cf8',
                pegGlow:       8,
                pegGlowColor:  '#6366f1',
                pegStroke:     '#4338ca',
                slotGlow:      5
            };
        case 'deep_sea':
            return {
                ballColor:     '#22d3ee',
                ballGlow:      20 + Math.sin(t / 400) * 8,
                ballGlowColor: '#06b6d4',
                trailColor:    '#67e8f9',
                trailOpacity:  0.5,
                pegColor:      '#06b6d4',
                pegGlow:       9,
                pegGlowColor:  '#0891b2',
                pegStroke:     '#0e7490',
                slotGlow:      5
            };
        case 'inferno':
            return {
                ballColor:     '#f97316',
                ballGlow:      25 + Math.sin(t / 150) * 10,
                ballGlowColor: '#ef4444',
                trailColor:    '#fb923c',
                trailOpacity:  0.55,
                pegColor:      '#f97316',
                pegGlow:       10,
                pegGlowColor:  '#dc2626',
                pegStroke:     '#991b1b',
                slotGlow:      6
            };
        case 'cherry_blossom':
            return {
                ballColor:     '#f9a8d4',
                ballGlow:      18 + Math.sin(t / 350) * 6,
                ballGlowColor: '#ec4899',
                trailColor:    '#fbcfe8',
                trailOpacity:  0.45,
                pegColor:      '#f472b6',
                pegGlow:       7,
                pegGlowColor:  '#ec4899',
                pegStroke:     '#be185d',
                slotGlow:      4
            };
        case 'retro_arcade':
            return {
                ballColor:     '#4ade80',
                ballGlow:      16,
                ballGlowColor: '#22c55e',
                trailColor:    '#86efac',
                trailOpacity:  0.5,
                pegColor:      '#4ade80',
                pegGlow:       8,
                pegGlowColor:  '#22c55e',
                pegStroke:     '#166534',
                slotGlow:      5
            };
        default:
            return {
                ballColor:     null,
                ballGlow:      0,
                ballGlowColor: null,
                trailColor:    null,
                trailOpacity:  0.3,
                pegColor:      '#e0e0e0',
                pegGlow:       0,
                pegGlowColor:  null,
                pegStroke:     '#555555',
                slotGlow:      0
            };
    }
}

// ============================================================================
// DRAW - FLAT 2D PLINKO BOARD
// ============================================================================
function draw() {
    const ts = getThemeStyle();
    updatePhysics();
    updateControlsState();
    drawBackground();
    plinkoCtx.clearRect(0, 0, plinkoCanvas.width, plinkoCanvas.height);

    // 1. FLAT BACKGROUND
    if (!cachedBgGradient) {
        // Gumamit ng solid o simpleng linear gradient imbes na radial para sa flat look
        cachedBgGradient = '#05060a';
    }
    plinkoCtx.fillStyle = cachedBgGradient;
    plinkoCtx.fillRect(0, 0, plinkoCanvas.width, plinkoCanvas.height);

    drawLightbulbs(plinkoCtx, plinkoCanvas.width, plinkoCanvas.height);

    const getSlotColor = (m) => {
        if (m >= 100) return '#d500f9';
        if (m >= 25) return '#ff1744';
        if (m >= 5) return '#ff6d00';
        if (m >= 2) return '#f9d71c';
        if (m >= 1) return '#ffea00';
        return '#00e676';
    };

    // 2. FLAT PEGS (Simpleng Circles)
    pegs.forEach(peg => {
        if (ts.pegGlow > 0) {
            plinkoCtx.shadowBlur = ts.pegGlow;
            plinkoCtx.shadowColor = ts.pegGlowColor;
        }
        plinkoCtx.fillStyle = ts.pegColor;
        plinkoCtx.strokeStyle = ts.pegStroke;
        plinkoCtx.lineWidth = 1;
        plinkoCtx.beginPath();
        plinkoCtx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        plinkoCtx.fill();
        plinkoCtx.stroke();
        plinkoCtx.shadowBlur = 0;
    });

    // 3 & 5. SLOTS (Merged and Flattened)
    // Pinagsama ang Pass 1 at Pass 2 para sa isang solid, flat na disenyo na may borderlines.
    slots.forEach((slot, idx) => {
        const m = slot.multiplier;
        const color = getSlotColor(m);
        const pulse = slotPulses.find(p => p.slotIndex === idx);
        const pulseScale = pulse ? 1 + (pulse.life / 30) * 0.1 : 1;

        plinkoCtx.save();
        plinkoCtx.translate(slot.x + slot.width / 2, slot.y + slot.height / 2);
        plinkoCtx.scale(pulseScale, pulseScale);
        plinkoCtx.translate(-(slot.x + slot.width / 2), -(slot.y + slot.height / 2));

        // A. TINTED FLAT BACKGROUND
        plinkoCtx.fillStyle = color;
        plinkoCtx.globalAlpha = 0.2; // Slightly higher alpha para mas kita sa flat BG
        plinkoCtx.beginPath();
        // Gumamit ng rect imbes na roundRect para sa mas matalas na flat look (optional)
        plinkoCtx.rect(slot.x, slot.y, slot.width, slot.height);
        plinkoCtx.fill();
        plinkoCtx.globalAlpha = 1.0;

        // B. FLAT BORDERLINES (Ito ang nagpapabago sa look)
        plinkoCtx.strokeStyle = color;
        plinkoCtx.lineWidth = 2; // Solid na linya sa paligid

        // Heat effect ay flat stroke glow na lang, hindi blur
        const heat = slotHeat[idx] || 0;
        if (heat > 0.5) {
            plinkoCtx.lineWidth = 2 + heat; // Kumakapal ang linya kapag mainit
        }

        if (ts.slotGlow > 0) {
            plinkoCtx.shadowBlur = ts.slotGlow;
            plinkoCtx.shadowColor = color;
        }
        plinkoCtx.strokeRect(slot.x, slot.y, slot.width, slot.height);
        plinkoCtx.shadowBlur = 0;

        // C. TEXT (Pina-simple ang shadow)
        let displayMulti = m >= 1000 ? (m / 1000) + 'k' : m;
        let textStr = `${displayMulti}x`;
        let fontSize = slot.width * 0.45;
        if (textStr.length >= 4) {
            fontSize = slot.width * 0.35;
        }

        plinkoCtx.fillStyle = color;
        plinkoCtx.font = `900 ${fontSize}px sans-serif`;
        plinkoCtx.textAlign = 'center';
        // Tinanggal ang shadow blur sa text para malinis
        plinkoCtx.fillText(textStr, slot.x + slot.width / 2, slot.y + slot.height * 0.65, slot.width - 4);

        plinkoCtx.restore();
    });

    // Peg ripples
    for (let i = pegRipples.length - 1; i >= 0; i--) {
        const rp = pegRipples[i];
        rp.r += 2.2;
        rp.life -= 0.07;
        if (rp.life <= 0) { pegRipples.splice(i, 1); continue; }
        plinkoCtx.beginPath();
        plinkoCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        plinkoCtx.strokeStyle = ts.pegGlowColor || '#ffffff';
        plinkoCtx.globalAlpha = rp.life * 0.55;
        plinkoCtx.lineWidth = 1.5;
        plinkoCtx.stroke();
        plinkoCtx.globalAlpha = 1;
    }

    // Fire particles (drawn behind balls)
    fireParticles.forEach(p => {
        plinkoCtx.save();
        plinkoCtx.globalAlpha = p.life * 0.85;
        plinkoCtx.shadowBlur = 8;
        plinkoCtx.shadowColor = p.color;
        plinkoCtx.fillStyle = p.color;
        plinkoCtx.beginPath();
        plinkoCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        plinkoCtx.fill();
        plinkoCtx.restore();
    });

    // 4. FLAT BALLS
    balls.forEach(ball => {
        // Trail (Nananatili dahil flat naman ito)
        if (ball.trail && ball.trail.length > 1) {
            for (let i = 0; i < ball.trail.length - 1; i++) {
                const alpha = (i + 1) / ball.trail.length;
                plinkoCtx.globalAlpha = alpha * ts.trailOpacity;
                plinkoCtx.fillStyle = ts.trailColor || ball.color;
                plinkoCtx.beginPath();
                plinkoCtx.arc(ball.trail[i].x, ball.trail[i].y, ball.radius * alpha, 0, Math.PI * 2);
                plinkoCtx.fill();
            }
            plinkoCtx.globalAlpha = 1;
        }

        // Theme glow (overridden by fire streak)
        if (ts.ballGlow > 0 && state.winStreak < 5) {
            plinkoCtx.shadowBlur = ts.ballGlow;
            plinkoCtx.shadowColor = ts.ballGlowColor;
        }
        // Fire streak glow overrides theme
        if (state.winStreak >= 5) {
            const palette = getFirePalette(state.winStreak);
            plinkoCtx.shadowBlur = 18;
            plinkoCtx.shadowColor = palette.glow;
        }

        if (state.currentTheme === 'gold_rush' && state.winStreak < 5 && state.activeSkin === 'default') {
            const coinSize = ball.radius * 2.2;
            plinkoCtx.font = `${coinSize}px serif`;
            plinkoCtx.textAlign = 'center';
            plinkoCtx.textBaseline = 'middle';
            plinkoCtx.fillText('🪙', ball.x, ball.y);
        } else {
            const skin = state.activeSkin;
            const t = Date.now();
            let ballColor = (state.winStreak < 5 && ts.ballColor) ? ts.ballColor : ball.color;

            if (skin === 'flame') {
                ballColor = '#ff4400';
                plinkoCtx.shadowBlur = 18; plinkoCtx.shadowColor = '#ff8800';
            } else if (skin === 'rainbow') {
                ballColor = `hsl(${(t * 0.2 + ball.x) % 360},100%,60%)`;
            } else if (skin === 'ghost') {
                plinkoCtx.globalAlpha = 0.5;
                ballColor = '#e0e8ff';
                plinkoCtx.shadowBlur = 12; plinkoCtx.shadowColor = '#aabbff';
            } else if (skin === 'ice') {
                ballColor = '#a8eeff';
                plinkoCtx.shadowBlur = 14; plinkoCtx.shadowColor = '#00ddff';
            } else if (skin === 'dark_matter') {
                ballColor = '#0d0010';
                plinkoCtx.shadowBlur = 22; plinkoCtx.shadowColor = '#9000ff';
            }

            plinkoCtx.fillStyle = ballColor;
            plinkoCtx.strokeStyle = 'rgba(255,255,255,0.5)';
            plinkoCtx.lineWidth = 1;
            plinkoCtx.beginPath();
            plinkoCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            plinkoCtx.fill();
            plinkoCtx.stroke();
            plinkoCtx.globalAlpha = 1;
        }

        plinkoCtx.shadowBlur = 0;
    });

    // 6. FX (Confetti & Text - Nananatiling flat)
    confetti.forEach(p => {
        plinkoCtx.save();
        plinkoCtx.translate(p.x, p.y);
        plinkoCtx.rotate(p.rotation);
        plinkoCtx.globalAlpha = p.life;
        plinkoCtx.fillStyle = p.color;
        plinkoCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        plinkoCtx.restore();
    });

    for (let i = winEffects.length - 1; i >= 0; i--) {
        const effect = winEffects[i];
        plinkoCtx.save(); plinkoCtx.translate(effect.x, effect.y); plinkoCtx.rotate(effect.rotation);
        plinkoCtx.globalAlpha = effect.opacity; plinkoCtx.fillStyle = '#f9d71c';

        // Flattened win text shadow
        plinkoCtx.shadowBlur = 5; // Reduced drastically
        plinkoCtx.shadowColor = '#f9d71c';

        const fontSize = effect.combo ? 52 : 40;
        plinkoCtx.font = `900 ${fontSize}px "Arial Black", Arial, sans-serif`; plinkoCtx.textAlign = 'center';
        plinkoCtx.fillText(effect.text, 0, 0); plinkoCtx.restore();
        effect.opacity -= effect.combo ? 0.015 : 0.02; effect.rotation += 0.05; effect.y -= 1;
        if (effect.opacity <= 0) winEffects.splice(i, 1);
    }

    drawPetStage();
    requestAnimationFrame(draw);
}

// ============================================================================
// INIT
// ============================================================================
// LUCKY SPIN
// ============================================================================
let _spinRotation = 0;
let _spinAnimId = null;

function drawSpinWheel(rotation) {
    const canvas = document.getElementById('spinCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 8;
    const segAngle = (Math.PI * 2) / SPIN_PRIZES.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    SPIN_PRIZES.forEach((prize, i) => {
        const startAngle = rotation + i * segAngle - Math.PI / 2;
        const endAngle = startAngle + segAngle;

        // Segment fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${prize.label.length > 6 ? 11 : 13}px sans-serif`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.fillText(prize.label, r - 10, 5);
        ctx.restore();
    });

    // Gold rim
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Center cap
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function openLuckySpin() {
    const overlay = document.getElementById('luckySpinOverlay');
    const box = document.getElementById('luckySpinBox');
    const spinBtn = document.getElementById('spinBtn');
    const resultEl = document.getElementById('spinResult');

    if (!overlay || !box) return;

    _spinRotation = 0;
    if (resultEl) { resultEl.textContent = ''; resultEl.classList.remove('pop'); }
    if (spinBtn) { spinBtn.disabled = false; spinBtn.textContent = 'SPIN!'; }

    drawSpinWheel(0);
    overlay.classList.remove('hidden');
    box.classList.remove('hidden');
}

function closeLuckySpin() {
    const overlay = document.getElementById('luckySpinOverlay');
    const box = document.getElementById('luckySpinBox');
    if (overlay) overlay.classList.add('hidden');
    if (box) box.classList.add('hidden');
    if (_spinAnimId) { cancelAnimationFrame(_spinAnimId); _spinAnimId = null; }
}

function doSpin() {
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) { spinBtn.disabled = true; spinBtn.textContent = 'Spinning...'; }

    // Start fast, decelerate naturally. Winner is read from final position.
    let speed = 0.32 + Math.random() * 0.08;
    const decel = 0.975;

    function animate() {
        _spinRotation += speed;
        speed *= decel;
        drawSpinWheel(_spinRotation);

        if (speed > 0.003) {
            _spinAnimId = requestAnimationFrame(animate);
        } else {
            // Derive winner from where the wheel stopped.
            // Segment i is centered at (i + 0.5) * segAngle in wheel frame.
            // Pointer at top maps to wheel angle = (-_spinRotation mod 2π).
            const segAngle = (Math.PI * 2) / SPIN_PRIZES.length;
            const normalizedAngle = ((-_spinRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            const winnerIdx = Math.floor(normalizedAngle / segAngle) % SPIN_PRIZES.length;
            drawSpinWheel(_spinRotation);
            revealSpinPrize(winnerIdx);
        }
    }
    _spinAnimId = requestAnimationFrame(animate);
}

function revealSpinPrize(idx) {
    const prize = SPIN_PRIZES[idx];
    const resultEl = document.getElementById('spinResult');

    if (prize.type === 'stars') {
        state.stars += prize.value;
        if (resultEl) resultEl.textContent = `You won ${prize.label}!`;
        showToast(`🎰 Lucky Spin! You won <strong>${prize.label}</strong>`);
    } else if (prize.type === 'powerup') {
        const powerupDef = SHOP_ITEMS.powerups.find(p => p.id === prize.value);
        if (powerupDef) {
            state.activePowerups.push({ id: powerupDef.id, name: powerupDef.name, remaining: powerupDef.duration });
        }
        if (resultEl) resultEl.textContent = `You got ${prize.label}!`;
        showToast(`🎰 Lucky Spin! You got <strong>${prize.label}</strong> activated!`);
    }

    state.lastSpin = new Date().toDateString();
    saveState();
    updateDisplay();
    updatePowerupDisplay();

    if (resultEl) {
        resultEl.classList.remove('pop');
        void resultEl.offsetWidth;
        resultEl.classList.add('pop');
    }

    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) { spinBtn.textContent = 'Claim & Close'; spinBtn.disabled = false; spinBtn.onclick = closeLuckySpin; }
}

// ============================================================================
// SHOP & ACHIEVEMENTS UI
// ============================================================================
function openShop() {
    const overlay = document.getElementById('shopOverlay');
    const box = document.getElementById('shopBox');
    const shopStars = document.getElementById('shopStars');

    if (shopStars) shopStars.textContent = `⭐ ${state.stars.toFixed(2)}`;

    // Render ball skins
    const skinsEl = document.getElementById('skinsShop');
    if (skinsEl) {
        skinsEl.innerHTML = BALL_SKINS.map(skin => {
            const owned = skin.cost === 0 || state.unlockedItems.includes(skin.id);
            const active = state.activeSkin === skin.id;
            return `
                <div class="shop-item ${active ? 'theme-active' : ''}">
                    <div class="shop-item-header">
                        <span class="shop-item-name">${skin.name}</span>
                        <span class="shop-item-cost">${owned ? (active ? '● Active' : '✓ Owned') : `⭐ ${skin.cost}`}</span>
                    </div>
                    <p class="shop-item-desc">${skin.description}</p>
                    ${owned
                        ? `<button class="buy-btn" data-skin="${skin.id}" ${active ? 'disabled' : ''}>${active ? 'Applied' : 'Apply'}</button>`
                        : `<button class="buy-btn" data-buy-skin="${skin.id}" ${state.stars < skin.cost ? 'disabled' : ''}>${state.stars < skin.cost ? 'Not Enough Stars' : 'Buy'}</button>`
                    }
                </div>`;
        }).join('');

        skinsEl.querySelectorAll('[data-buy-skin]').forEach(btn => {
            btn.addEventListener('click', () => {
                const skin = BALL_SKINS.find(s => s.id === btn.dataset.buySkin);
                if (!skin || state.stars < skin.cost) return;
                state.stars -= skin.cost;
                state.unlockedItems.push(skin.id);
                state.activeSkin = skin.id;
                saveState();
                btn.classList.add('purchased-flash');
                setTimeout(() => { btn.classList.remove('purchased-flash'); openShop(); }, 400);
            });
        });

        skinsEl.querySelectorAll('[data-skin]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.activeSkin = btn.dataset.skin;
                saveState();
                openShop();
            });
        });
    }

    // Render powerups
    const powerupsEl = document.getElementById('powerupsShop');
    if (powerupsEl) {
        powerupsEl.innerHTML = SHOP_ITEMS.powerups.map(item => `
            <div class="shop-item">
                <div class="shop-item-header">
                    <span class="shop-item-name">${item.name}</span>
                    <span class="shop-item-cost">⭐ ${item.cost}</span>
                </div>
                <p class="shop-item-desc">${item.description}</p>
                <button class="buy-btn" data-item="${item.id}" ${state.stars < item.cost ? 'disabled' : ''}>
                    ${state.stars < item.cost ? 'Not Enough Stars' : 'Buy'}
                </button>
            </div>
        `).join('');

        // Add click handlers
        powerupsEl.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.item;
                activatePowerup(itemId);
                btn.classList.add('purchased-flash');
                setTimeout(() => {
                    btn.classList.remove('purchased-flash');
                    openShop(); // Refresh
                }, 400);
            });
        });
    }

    // Render pet skins
    const petsEl = document.getElementById('petsShop');
    if (petsEl) {
        petsEl.classList.remove('locked');
        petsEl.innerHTML = PET_SKINS.map(item => {
            const owned = state.unlockedPetSkins.includes(item.id);
            const active = state.activePetSkins[item.petName] === item.variant;
            const displayName = PET_ASSETS[item.petName]?.displayName || item.petName;
            const actionLabel = !owned
                ? (state.stars < item.cost ? 'Not Enough Stars' : 'Buy')
                : (active ? 'Use Default' : 'Apply');

            return `
                <div class="shop-item ${active ? 'theme-active' : ''}">
                    <div class="shop-item-header">
                        <span class="shop-item-name">${item.name}</span>
                        <span class="shop-item-cost">${owned ? (active ? '● Active' : '✓ Owned') : `⭐ ${item.cost}`}</span>
                    </div>
                    <p class="shop-item-desc">${item.description}<br><span style="opacity: 0.75;">Applies to ${displayName}</span></p>
                    <button class="buy-btn" data-pet-skin="${item.id}" ${!owned && state.stars < item.cost ? 'disabled' : ''}>${actionLabel}</button>
                </div>
            `;
        }).join('');

        petsEl.querySelectorAll('[data-pet-skin]').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = PET_SKINS.find(skin => skin.id === btn.dataset.petSkin);
                if (!item) return;

                const owned = state.unlockedPetSkins.includes(item.id);
                const active = state.activePetSkins[item.petName] === item.variant;

                if (!owned) {
                    if (state.stars < item.cost) return;
                    state.stars -= item.cost;
                    state.unlockedPetSkins.push(item.id);
                }

                if (active) {
                    delete state.activePetSkins[item.petName];
                } else {
                    state.activePetSkins[item.petName] = item.variant;
                }

                saveState();
                updateDisplay();
                btn.classList.add('purchased-flash');
                setTimeout(() => {
                    btn.classList.remove('purchased-flash');
                    openShop();
                }, 400);
            });
        });
    }

    // Render themes
    const themesEl = document.getElementById('themesShop');
    if (themesEl) {
        const allThemes = [
            { id: 'default', name: '🎮 Default', description: 'The original arcade look', cost: 0 },
            ...SHOP_ITEMS.themes
        ];
        themesEl.innerHTML = allThemes.map(item => {
            const owned = item.cost === 0 || state.unlockedItems.includes(item.id);
            const active = state.currentTheme === item.id;
            return `
                <div class="shop-item ${active ? 'theme-active' : ''}">
                    <div class="shop-item-header">
                        <span class="shop-item-name">${item.name}</span>
                        <span class="shop-item-cost">${owned ? (active ? '● Active' : '✓ Owned') : `⭐ ${item.cost}`}</span>
                    </div>
                    <p class="shop-item-desc">${item.description}</p>
                    ${owned
                        ? `<button class="buy-btn" data-theme="${item.id}" ${active ? 'disabled' : ''}>${active ? 'Applied' : 'Apply'}</button>`
                        : `<button class="buy-btn" data-buy-theme="${item.id}" ${state.stars < item.cost ? 'disabled' : ''}>${state.stars < item.cost ? 'Not Enough Stars' : 'Buy'}</button>`
                    }
                </div>`;
        }).join('');

        themesEl.querySelectorAll('[data-buy-theme]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.buyTheme;
                const item = SHOP_ITEMS.themes.find(t => t.id === id);
                if (!item || state.stars < item.cost) return;
                state.stars -= item.cost;
                state.unlockedItems.push(id);
                applyTheme(id);
                saveState();
                btn.classList.add('purchased-flash');
                setTimeout(() => { btn.classList.remove('purchased-flash'); openShop(); }, 400);
            });
        });

        themesEl.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', () => {
                applyTheme(btn.dataset.theme);
                saveState();
                openShop();
            });
        });
    }

    if (overlay) overlay.classList.remove('hidden');
    if (box) box.classList.remove('hidden');
}

function closeShop() {
    const overlay = document.getElementById('shopOverlay');
    const box = document.getElementById('shopBox');
    if (overlay) overlay.classList.add('hidden');
    if (box) box.classList.add('hidden');
}

function openAchievements() {
    const overlay = document.getElementById('achievementsOverlay');
    const box = document.getElementById('achievementsBox');
    const content = document.getElementById('achievementsContent');

    if (content) {
        content.innerHTML = ACHIEVEMENTS.map(ach => {
            const unlocked = state.achievements.includes(ach.id);
            const progress = ach.condition() ? '100%' : '0%';

            return `
                <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-details">
                        <div class="achievement-name">${ach.name}</div>
                        <div class="achievement-desc">${ach.description}</div>
                        <div class="achievement-reward">Reward: ⭐${ach.reward}</div>
                    </div>
                    <div class="achievement-status">
                        ${unlocked ? '✅ Unlocked' : '🔒 Locked'}
                    </div>
                </div>
            `;
        }).join('');
    }

    if (overlay) overlay.classList.remove('hidden');
    if (box) box.classList.remove('hidden');
}

function closeAchievements() {
    const overlay = document.getElementById('achievementsOverlay');
    const box = document.getElementById('achievementsBox');
    if (overlay) overlay.classList.add('hidden');
    if (box) box.classList.add('hidden');
}

// ============================================================================
function initHUD() {
    ['petsToggleHeader', 'statsToggleHeader', 'challengesToggleHeader'].forEach(id => {
        const header = document.getElementById(id);
        if (!header) return;
        const target = header.nextElementSibling;
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            target.classList.toggle('collapsed');
        });
    });

    const tutorialBtn = document.getElementById('tutorialBtn');
    if (tutorialBtn) tutorialBtn.addEventListener('click', startTutorial);

    const shopBtn = document.getElementById('shopBtn');
    if (shopBtn) shopBtn.addEventListener('click', openShop);

    const closeShopBtn = document.getElementById('closeShop');
    if (closeShopBtn) closeShopBtn.addEventListener('click', closeShop);

    const closeSpinBtn = document.getElementById('closeSpinBtn');
    if (closeSpinBtn) closeSpinBtn.addEventListener('click', closeLuckySpin);

    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) spinBtn.addEventListener('click', doSpin);

    const luckySpinBtn = document.getElementById('luckySpinBtn');
    if (luckySpinBtn) {
        luckySpinBtn.addEventListener('click', () => {
            const today = new Date().toDateString();
            if (state.lastSpin === today) {
                showToast('🎰 Already spun today! Come back tomorrow.');
            } else {
                openLuckySpin();
            }
        });
    }

    const achievementsBtn = document.getElementById('achievementsBtn');
    if (achievementsBtn) achievementsBtn.addEventListener('click', openAchievements);

    const closeAchievementsBtn = document.getElementById('closeAchievements');
    if (closeAchievementsBtn) closeAchievementsBtn.addEventListener('click', closeAchievements);

    const nextStepBtn = document.getElementById('nextStep');
    if (nextStepBtn) nextStepBtn.onclick = nextTutorialStep;

    const skipTutorialBtn = document.getElementById('skipTutorial');
    if (skipTutorialBtn) skipTutorialBtn.onclick = endTutorial;

    if (!Storage.get('tutorialDone', false)) {
        setTimeout(startTutorial, 500);
    }

    const petTogglesEl = document.getElementById('petToggles');
    if (petTogglesEl) {
        PET_NAMES.forEach(name => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <input type="checkbox" id="pet-${name}" class="pet-checkbox" checked>
                <label for="pet-${name}" class="pet-label">${name}</label>
            `;
            const checkbox = wrapper.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) state.activePets.add(name);
                else state.activePets.delete(name);
            });
            petTogglesEl.appendChild(wrapper.firstElementChild);
            petTogglesEl.appendChild(wrapper.lastElementChild);
        });
    }

    if (betInput) {
        betInput.addEventListener('change', (e) => {
            state.bet = Math.max(CONFIG.MIN_BET, parseFloat(e.target.value) || CONFIG.MIN_BET);
            state.baseBet = state.bet;
            betInput.value = state.bet.toFixed(2);
            updateDisplay();
        });

        betInput.addEventListener('input', () => {
            const value = parseFloat(betInput.value);
            if (!isNaN(value) && value >= CONFIG.MIN_BET) {
                state.bet = value;
                updateDisplay();
            }
        });
    }

    const minBetBtn = document.getElementById('minBet');
    if (minBetBtn) {
        minBetBtn.addEventListener('click', () => {
            state.bet = CONFIG.MIN_BET;
            if (betInput) betInput.value = state.bet.toFixed(2);
            playSound(minBetSound);
            updateDisplay();
        });
    }

    const maxBetBtn = document.getElementById('maxBet');
    if (maxBetBtn) {
        maxBetBtn.addEventListener('click', () => {
            state.bet = Math.max(CONFIG.MIN_BET, state.stars);
            if (betInput) betInput.value = state.bet.toFixed(2);
            playSound(maxBetSound);
            updateDisplay();
        });
    }

    const presetsEl = document.getElementById('betPresets');
    if (presetsEl) {
        CONFIG.PRESETS.forEach(amount => {
            const btn = document.createElement('button');
            btn.className = 'preset-btn';
            btn.textContent = `⭐${amount}`;
            btn.addEventListener('click', () => {
                if (amount <= state.stars) {
                    state.bet = amount;
                    if (betInput) betInput.value = state.bet.toFixed(2);
                    updateDisplay();
                } else {
                    btn.classList.remove('shake');
                    void btn.offsetWidth; // force reflow to restart animation
                    btn.classList.add('shake');
                    setTimeout(() => btn.classList.remove('shake'), 300);
                }
            });
            presetsEl.appendChild(btn);
        });
    }

    const riskEl = document.getElementById('riskLevel');
    if (riskEl) {
        riskEl.addEventListener('change', (e) => {
            state.risk = e.target.value;
            generateBoard();
            updateDisplay();
        });
    }

    const betStrategyEl = document.getElementById('betStrategy');
    if (betStrategyEl) {
        betStrategyEl.addEventListener('change', (e) => {
            state.betStrategy = e.target.value;
            state.baseBet = state.bet;
        });
    }

    const linesEl = document.getElementById('linesCount');
    if (linesEl) {
        linesEl.addEventListener('input', (e) => {
            state.lines = parseInt(e.target.value);
            const lineValEl = document.getElementById('lineValue');
            if (lineValEl) lineValEl.textContent = state.lines;
            generateBoard();
            updateDisplay();
        });
    }

    const resetBtn = document.getElementById('resetBalance');
    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            const isGameOver = state.isGameOver;
            const msg = isGameOver
                ? 'You lost everything. This will wipe ALL progress — level, achievements, owned items, everything. Start fresh?'
                : 'Reset balance and statistics?';
            if (await showConfirm(msg)) {
                if (isGameOver) {
                    // Full wipe — losing has consequences
                    state.stars = CONFIG.INITIAL_STARS;
                    state.level = 1;
                    state.xp = 0;
                    state.stats = { gamesPlayed: 0, totalWagered: 0, totalWon: 0, biggestWin: 0, biggestMultiplier: 0, longestStreak: 0 };
                    state.winStreak = 0;
                    state.achievements = [];
                    state.dailyProgress = { wins: 0, streak: 0, wagered: 0 };
                    state.activePowerups = [];
                    state.unlockedItems = [];
                    state.biggestBet = 0;
                    state.jackpotHit = false;
                    state.comebackAchieved = false;
                    state.currentTheme = 'default';
                    applyTheme('default');
                } else {
                    state.stars = CONFIG.INITIAL_STARS;
                    state.stats = { gamesPlayed: 0, totalWagered: 0, totalWon: 0, biggestWin: 0, biggestMultiplier: 0, longestStreak: 0 };
                    state.winStreak = 0;
                }
                saveState();
                updateDisplay();
                updateStatsDisplay();
                updateLevelDisplay();
                hideGameOver();
            }
        });
    }

    const zeroBtn = document.getElementById('zeroBalance');
    if (zeroBtn) {
        zeroBtn.addEventListener('click', async () => {
            if (await showConfirm('Are you sure? Your balance will be ZERO and you will lose immediately! 😱')) {
                state.stars = 0;
                saveState();
                updateDisplay();
                showGameOver();
            }
        });
    }

    if (bgMusic) {
        bgMusic.volume = 0.5;
        bgMusic.muted = state.isMusicMuted;
    }
    if (musicToggle) musicToggle.textContent = state.isMusicMuted ? '🔇' : '🎵';
    if (sfxToggle) sfxToggle.textContent = state.isSfxMuted ? '🔇' : '🔊';

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            state.isMusicMuted = !state.isMusicMuted;
            if (bgMusic) bgMusic.muted = state.isMusicMuted;
            musicToggle.textContent = state.isMusicMuted ? '🔇' : '🎵';
            saveState();
        });
    }

    if (sfxToggle) {
        sfxToggle.addEventListener('click', () => {
            state.isSfxMuted = !state.isSfxMuted;
            sfxToggle.textContent = state.isSfxMuted ? '🔇' : '🔊';
            saveState();
        });
    }

    const startMusic = () => {
        if (bgMusic) bgMusic.play().catch(() => { });
        document.removeEventListener('click', startMusic);
    };
    document.addEventListener('click', startMusic);

    const handlePlay = async () => {
        if (state.stars >= state.bet) {
            state.stars -= state.bet;

            // Track biggest bet
            if (state.bet > state.biggestBet) {
                state.biggestBet = state.bet;
            }

            saveState();
            updateDisplay();
            dropBall();
        } else {
            await showAlert('Oops! You are out of balance. Reset at the top to play again! 💸');
        }
    };

    if (playBtn) playBtn.addEventListener('click', handlePlay);

    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const cancelGameOverBtn = document.getElementById('cancelGameOverBtn');
    const tryAgainHoverSound = document.getElementById('tryAgainHoverSound');
    const cancelHoverSound = document.getElementById('cancelHoverSound');

    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('mouseenter', () => { playSound(tryAgainHoverSound); });
        tryAgainBtn.addEventListener('click', () => {
            hideGameOver();
            const resetBtn = document.getElementById('resetBalance');
            if (resetBtn) resetBtn.click();
        });
    }

    if (cancelGameOverBtn) {
        cancelGameOverBtn.addEventListener('mouseenter', () => { playSound(cancelHoverSound); });
        cancelGameOverBtn.addEventListener('click', () => {
            hideGameOver();
        });
    }

    const autoPlayBtn = document.getElementById('autoPlayBtn');
    const autoPlaySpeed = document.getElementById('autoPlaySpeed');

    if (autoPlayBtn && autoPlaySpeed) {
        autoPlaySpeed.addEventListener('change', (e) => {
            state.autoPlaySpeed = e.target.value;
            if (state.autoPlay) {
                stopAutoPlay();
                startAutoPlay();
            }
        });

        autoPlayBtn.addEventListener('click', () => {
            if (state.autoPlay) stopAutoPlay();
            else startAutoPlay();
        });
    }

    function startAutoPlay() {
        state.autoPlay = true;
        if (autoPlayBtn) {
            autoPlayBtn.textContent = 'STOP AUTO';
            autoPlayBtn.classList.add('active');
        }
        const speed = CONFIG.AUTOPLAY_SPEEDS[state.autoPlaySpeed];
        state.autoPlayInterval = setInterval(async () => {
            if (state.stars >= state.bet) handlePlay();
            else {
                stopAutoPlay();
                await showAlert('Auto Play stopped because you ran out of funds. Reset now! 💸');
            }
        }, speed);
    }

    function stopAutoPlay() {
        state.autoPlay = false;
        if (state.autoPlayInterval) {
            clearInterval(state.autoPlayInterval);
            state.autoPlayInterval = null;
        }
        if (autoPlayBtn) {
            autoPlayBtn.textContent = 'AUTO PLAY';
            autoPlayBtn.classList.remove('active');
        }
    }

    const receiptBtn = document.getElementById('receiptBtn');
    if (receiptBtn) {
        receiptBtn.addEventListener('click', () => {
            // Create an off-screen canvas for the receipt
            const receiptCanvas = document.createElement('canvas');
            const rCtx = receiptCanvas.getContext('2d');
            receiptCanvas.width = 500;
            receiptCanvas.height = 750;

            // 1. Background (Paper Texture)
            rCtx.fillStyle = '#ffffff';
            rCtx.fillRect(0, 0, receiptCanvas.width, receiptCanvas.height);
            
            // Subtle paper pattern
            rCtx.strokeStyle = '#f0f0f0';
            rCtx.lineWidth = 1;
            for(let i=0; i<receiptCanvas.height; i+=20) {
                rCtx.beginPath();
                rCtx.moveTo(0, i);
                rCtx.lineTo(receiptCanvas.width, i);
                rCtx.stroke();
            }

            // 2. Header
            rCtx.fillStyle = '#000000';
            rCtx.textAlign = 'center';
            rCtx.font = 'bold 30px "Courier New", Courier, monospace';
            rCtx.fillText('ROLLY ROYAL PLINKO', receiptCanvas.width / 2, 60);
            
            rCtx.font = '16px "Courier New", Courier, monospace';
            rCtx.fillText('OFFICIAL DIGITAL RECEIPT', receiptCanvas.width / 2, 85);
            rCtx.fillText('--------------------------', receiptCanvas.width / 2, 105);
            
            const now = new Date();
            rCtx.textAlign = 'left';
            rCtx.font = '14px "Courier New", Courier, monospace';
            rCtx.fillText(`DATE: ${now.toLocaleDateString()}`, 50, 135);
            rCtx.fillText(`TIME: ${now.toLocaleTimeString()}`, 50, 155);
            rCtx.fillText(`SESSION ID: #${Math.floor(Math.random() * 1000000)}`, 50, 175);
            
            rCtx.textAlign = 'center';
            rCtx.fillText('--------------------------', receiptCanvas.width / 2, 200);

            // 3. Stats Section
            rCtx.textAlign = 'left';
            rCtx.font = 'bold 18px "Courier New", Courier, monospace';
            rCtx.fillText('SESSION SUMMARY', 50, 230);
            
            rCtx.font = '16px "Courier New", Courier, monospace';
            const { gamesPlayed, totalWagered, totalWon, biggestWin, biggestMultiplier } = state.stats;
            const net = totalWon - totalWagered;

            rCtx.fillText(`GAMES PLAYED:      ${gamesPlayed}`, 50, 260);
            rCtx.fillText(`TOTAL WAGERED:     ⭐${totalWagered.toFixed(2)}`, 50, 285);
            rCtx.fillText(`TOTAL WON:         ⭐${totalWon.toFixed(2)}`, 50, 310);
            rCtx.fillText(`NET PROFIT:        ⭐${net.toFixed(2)}`, 50, 335);
            rCtx.fillText(`BIGGEST WIN:       ⭐${biggestWin.toFixed(2)}`, 50, 360);
            rCtx.fillText(`BEST MULTIPLIER:   ${parseFloat(biggestMultiplier.toFixed(2))}x`, 50, 385);

            rCtx.textAlign = 'center';
            rCtx.fillText('--------------------------', receiptCanvas.width / 2, 415);

            // 4. Recent History "UI Snapshot"
            const hX = 50;
            const hY = 440;
            const hW = 400;
            const hH = 220;

            // Draw Dark UI Container (Mimicking the .history-pane CSS)
            rCtx.fillStyle = '#141928'; // var(--panel-bg)
            rCtx.beginPath();
            rCtx.roundRect(hX, hY, hW, hH, 12);
            rCtx.fill();
            
            // Add a subtle border/glow
            rCtx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
            rCtx.lineWidth = 1;
            rCtx.stroke();

            // Header for the "Snapshot"
            rCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            rCtx.beginPath();
            rCtx.roundRect(hX, hY, hW, 35, [12, 12, 0, 0]);
            rCtx.fill();

            rCtx.fillStyle = '#d4af37'; // --gold
            rCtx.font = 'bold 14px sans-serif';
            rCtx.textAlign = 'center';
            rCtx.fillText('RECENT HISTORY', hX + hW / 2, hY + 23);

            // History Entries
            const displayHistory = state.history.slice(0, 7); // Show last 7 entries to fit the card
            displayHistory.forEach((entry, i) => {
                const entryY = hY + 65 + (i * 22);
                
                // Draw row divider
                rCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                rCtx.beginPath();
                rCtx.moveTo(hX + 15, entryY + 5);
                rCtx.lineTo(hX + hW - 15, entryY + 5);
                rCtx.stroke();

                rCtx.font = '12px "Segoe UI", Arial, sans-serif';
                
                // Bet (Gray)
                rCtx.textAlign = 'left';
                rCtx.fillStyle = '#aaa';
                rCtx.fillText(`⭐${entry.bet.toFixed(2)}`, hX + 25, entryY);
                
                // Multiplier (Gold)
                rCtx.textAlign = 'center';
                rCtx.fillStyle = '#d4af37';
                rCtx.font = 'bold 12px sans-serif';
                rCtx.fillText(`${parseFloat(entry.multi.toFixed(2))}x`, hX + hW / 2, entryY);
                
                // Profit (Green/Red)
                rCtx.textAlign = 'right';
                rCtx.fillStyle = entry.multi >= 1 ? '#4caf50' : '#f44336';
                rCtx.fillText(`⭐${entry.profit.toFixed(2)}`, hX + hW - 25, entryY);
            });

            // 5. Footer
            rCtx.fillStyle = '#000000';
            rCtx.textAlign = 'center';
            rCtx.font = 'bold 20px "Courier New", Courier, monospace';
            rCtx.fillText('THANK YOU FOR PLAYING!', receiptCanvas.width / 2, 650);
            
            rCtx.font = '12px "Courier New", Courier, monospace';
            rCtx.fillText('Rolly Royal Plinko (2D Arcade) | No Real Value', receiptCanvas.width / 2, 675);
            
            // Barcode-like lines
            rCtx.fillStyle = '#000000';
            for(let i=0; i<40; i++) {
                const bw = Math.random() * 5 + 1;
                rCtx.fillRect(110 + (i * 7), 690, bw, 30);
            }

            // Download the generated receipt
            const link = document.createElement('a');
            link.download = `RollyRoyal-Receipt-${Date.now()}.png`;
            link.href = receiptCanvas.toDataURL('image/png');
            link.click();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        switch (e.key.toLowerCase()) {
            case ' ':
            case 'enter':
                e.preventDefault();
                handlePlay();
                break;
            case 'm':
                if (musicToggle) musicToggle.click();
                break;
            case 's':
                if (sfxToggle) sfxToggle.click();
                break;
            case 'r':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    const resetBtn = document.getElementById('resetBalance');
                    if (resetBtn) resetBtn.click();
                }
                break;
            case '?':
            case 'h':
                startTutorial();
                break;
        }
    });

    const hint = document.getElementById('keyboardHint');
    if (hint && !Storage.get('hintShown', false)) {
        setTimeout(() => {
            hint.classList.add('show');
            setTimeout(() => {
                hint.classList.remove('show');
                Storage.set('hintShown', true);
            }, 5000);
        }, 2000);
    }
}

function initPets() {
    pets = [];
    PET_NAMES.forEach(name => pets.push(new Pet(name)));
}

window.onload = () => {
    initHUD();
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    applyTheme(state.currentTheme);
    resizeCanvases();
    setTimeout(resizeCanvases, 100);
    initPets();
    checkDailyLogin(); // Check for daily rewards
    state.baseBet = state.bet;
    updateDisplay();
    updateStatsDisplay();
    updateLevelDisplay();
    updateJackpotMeter();
    checkAchievements(); // Check for initial achievements

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvases, 50);
    });

    draw();
};
