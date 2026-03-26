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
    INITIAL_BALANCE: 1000.00,
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
    BORDER_LIGHT_COUNT: 24 // Dami ng bumbilya sa bawat gilid
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

const TUTORIAL_STEPS = [
    { title: "Welcome to RollyRoyal Plinko!", content: "Step into your personal luxury casino experience. Here, physics and luck combine for big wins. Let's take a quick tour!", target: ".game-pane" },
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

let state = {
    balance: Storage.get('balance', CONFIG.INITIAL_BALANCE),
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
    borderEffect: { mode: 'idle', timer: 0 }
};

function saveState() {
    Storage.set('balance', state.balance);
    Storage.set('stats', state.stats);
    Storage.set('musicMuted', state.isMusicMuted);
    Storage.set('sfxMuted', state.isSfxMuted);
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
        const fileName = name === 'alwyn' ? 'Alwyn' :
            name === 'beto' ? 'Beto' :
                name === 'gab' ? 'Gab' :
                    name === 'kyle' ? 'kyle' :
                        name === 'Renz' ? 'Renz' :
                            name === 'Colmo' ? 'Colmo' :
                                name === 'Asher' ? 'Asher' : name;
        this.image.src = `Sprites/LABOBO/${fileName}.png`;
        this.size = CONFIG.PET_SIZE * 1.5;
        this.x = Math.random() * (petsCanvas.width - this.size);
        this.y = petsCanvas.height - this.size - 30; // Adjusted for 2.5D stage
        this.vx = (Math.random() - 0.5) * 1.5;
        this.frame = 0;
        this.state = 'happy';
        this.timer = 0;
        this.direction = 1;
        this.lastFrameUpdate = Date.now();
    }

    update() {
        const maxFrames = 5;
        const now = Date.now();
        // Pinabagal ang frames kapag jumping (mula 100 naging 200ms)
        const fps = this.state === 'jackpot' ? 200 : 150;

        if (now - this.lastFrameUpdate > fps) {
            this.frame = (this.frame + 1) % maxFrames;
            this.lastFrameUpdate = now;
        }

        let jumpOffset = 0;

        if (this.state === 'jackpot') {
            this.timer--;
            // Smooth Sine Wave Bounce pataas
            jumpOffset = -Math.abs(Math.sin(this.timer * 0.15)) * 25;

            if (this.timer <= 0) {
                this.state = 'happy';
                this.vx = (Math.random() - 0.5) * 1.5;
            }
        } else {
            this.x += this.vx;
            if (this.x < 0) { this.x = 0; this.vx *= -1; }
            else if (this.x > petsCanvas.width - this.size) { this.x = petsCanvas.width - this.size; this.vx *= -1; }
            this.direction = this.vx > 0 ? 1 : -1;
        }

        // Align pet to the 2.5D floor baseline + kasama ang jump
        this.y = petsCanvas.height - this.size - 30 + jumpOffset;
    }

    draw(ctx) {
        const row = this.state === 'jackpot' ? 2 : (this.state === 'sad' ? 1 : 0);
        const s = this.size;

        ctx.save();
        ctx.translate(this.x + s / 2, this.y + s / 2);
        if (this.direction === -1) ctx.scale(-1, 1);

        try {
            if (this.image.complete && this.image.naturalWidth > 0) {
                const sw = this.image.naturalWidth / 5;
                const sh = this.image.naturalHeight / 3;
                const aspect = sw / sh;
                const drawH = s;
                const drawW = s * aspect;

                // 2.5D Trick: Draw Reflection underneath!
                ctx.save();
                ctx.translate(0, drawH / 2);
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
        } else if (actualMulti >= 1) {
            this.state = 'happy';
            if (this.vx === 0) this.vx = (Math.random() - 0.5) * 1.5;
        } else {
            this.state = 'sad';
            if (this.vx === 0) this.vx = (Math.random() - 0.5) * 1.5;
        }
    }
}

// ============================================================================
// GAME FUNCTIONS & RGB LIGHTS
// ============================================================================
function triggerRGBEffect(mode) {
    state.borderEffect.mode = mode;
    state.borderEffect.timer = 60; // 1 second animation duration (60 fps)
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
            if (state.autoPlay) {
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
        trail: []
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

function updatePhysics() {
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > CONFIG.TRAIL_LENGTH) ball.trail.shift();

        ball.vy += CONFIG.GRAVITY;
        ball.vx *= CONFIG.FRICTION;
        ball.x += ball.vx;
        ball.y += ball.vy;

        pegs.forEach(peg => {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < ball.radius + peg.radius) {
                playSound(pegSound);
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
                handleWin(slot.multiplier, idx, slot);
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

    if (balls.length === 0 && state.balance < CONFIG.MIN_BET) {
        if (!state.isGameOver) {
            showGameOver();
        }
    } else if (balls.length === 0 && state.balance >= CONFIG.MIN_BET) {
        state.isGameOver = false;
    }
}

function handleWin(multiplier, slotIdx, slot) {
    let actualMulti = multiplier;

    if (multiplier >= 1) {
        state.winStreak++;
        if (state.winStreak > CONFIG.STREAK_BONUS_START) {
            const bonus = Math.floor((state.winStreak - CONFIG.STREAK_BONUS_START) * CONFIG.STREAK_BONUS_RATE * 10) / 10;
            actualMulti = multiplier + bonus;
        }
        if (state.winStreak > state.stats.longestStreak) {
            state.stats.longestStreak = state.winStreak;
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
    } else {
        state.winStreak = 0;
        playSound(lossSound);
        triggerRGBEffect('lose');
    }

    const winAmount = state.bet * actualMulti;
    state.balance += winAmount;

    if (!slotHeat[slotIdx]) slotHeat[slotIdx] = 0;
    slotHeat[slotIdx] = Math.min(slotHeat[slotIdx] + 1, 5);

    slotPulses.push({ slotIndex: slotIdx, life: 30 });

    state.stats.gamesPlayed++;
    state.stats.totalWagered += state.bet;
    state.stats.totalWon += winAmount;
    if (winAmount > state.stats.biggestWin) state.stats.biggestWin = winAmount;
    if (actualMulti > state.stats.biggestMultiplier) state.stats.biggestMultiplier = actualMulti;

    saveState();
    updateDisplay();
    updateStatsDisplay();
    addHistoryEntry(state.bet, actualMulti);

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

function updateDisplay() {
    if (balanceEl) balanceEl.textContent = `₱${state.balance.toFixed(2)}`;

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
        maxWinEl.textContent = `Max: ₱${maxWin.toFixed(2)} (${maxMulti}x)`;
    }
}

function updateStatsDisplay() {
    const statsEl = document.getElementById('statsDisplay');
    if (!statsEl) return;

    const { gamesPlayed, totalWagered, totalWon, biggestWin, biggestMultiplier, longestStreak } = state.stats;
    const netProfit = totalWon - totalWagered;
    const winRate = gamesPlayed > 0 ? ((totalWon / totalWagered) * 100).toFixed(1) : '0.0';

    statsEl.innerHTML = `
        <div class="stat-row"><span>Games:</span><span>${gamesPlayed}</span></div>
        <div class="stat-row"><span>Net:</span><span class="${netProfit >= 0 ? 'win' : 'loss'}">₱${netProfit.toFixed(2)}</span></div>
        <div class="stat-row"><span>Best Win:</span><span class="win">₱${biggestWin.toFixed(2)}</span></div>
        <div class="stat-row"><span>Best Multi:</span><span class="gold">${biggestMultiplier}x</span></div>
        <div class="stat-row"><span>Longest Streak:</span><span class="gold">🔥${longestStreak}</span></div>
        <div class="stat-row"><span>ROI:</span><span class="${netProfit >= 0 ? 'win' : 'loss'}">${winRate}%</span></div>
    `;
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
        <span class="hist-bet">₱${bet.toFixed(2)}</span>
        <span class="hist-multi">${multi}x</span>
        <span class="hist-profit ${multi >= 1 ? 'win' : 'loss'}">₱${profit.toFixed(2)}</span>
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
// 2.5D CASINO STAGE DRAWING
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
    pets.forEach(pet => {
        if (state.activePets.has(pet.name)) {
            pet.update();
            pet.draw(petsCtx);
        }
    });
}

// ============================================================================
// DRAW - FLAT 2D PLINKO BOARD
// ============================================================================
function draw() {
    updatePhysics();
    updateControlsState();
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
        // Tinanggal ang shadow, body layers, at specular highlight.
        // Isang simpleng flat circle na may border.
        plinkoCtx.fillStyle = '#e0e0e0';
        plinkoCtx.strokeStyle = '#555555'; // Darker gray outline
        plinkoCtx.lineWidth = 1;
        plinkoCtx.beginPath();
        plinkoCtx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        plinkoCtx.fill();
        plinkoCtx.stroke();
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

        plinkoCtx.strokeRect(slot.x, slot.y, slot.width, slot.height);

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

    // 4. FLAT BALLS
    balls.forEach(ball => {
        // Trail (Nananatili dahil flat naman ito)
        if (ball.trail && ball.trail.length > 1) {
            for (let i = 0; i < ball.trail.length - 1; i++) {
                const alpha = (i + 1) / ball.trail.length;
                plinkoCtx.globalAlpha = alpha * 0.3;
                plinkoCtx.fillStyle = ball.color;
                plinkoCtx.beginPath();
                plinkoCtx.arc(ball.trail[i].x, ball.trail[i].y, ball.radius * alpha, 0, Math.PI * 2);
                plinkoCtx.fill();
            }
            plinkoCtx.globalAlpha = 1;
        }

        // Tinanggal ang Ball Shadow sa ilalim.
        // Tinanggal ang Gradient Highlight sa ibabaw.

        // Isang solid color circle na lang na may manipis na border para di magmukhang flat icon lang
        plinkoCtx.fillStyle = ball.color;
        plinkoCtx.strokeStyle = 'rgba(255,255,255,0.5)';
        plinkoCtx.lineWidth = 1;
        plinkoCtx.beginPath();
        plinkoCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        plinkoCtx.fill();
        plinkoCtx.stroke();
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

        plinkoCtx.font = '900 40px sans-serif'; plinkoCtx.textAlign = 'center';
        plinkoCtx.fillText(effect.text, 0, 0); plinkoCtx.restore();
        effect.opacity -= 0.02; effect.rotation += 0.05; effect.y -= 1;
        if (effect.opacity <= 0) winEffects.splice(i, 1);
    }

    drawPetStage();
    requestAnimationFrame(draw);
}

// ============================================================================
// INIT
// ============================================================================
function initHUD() {
    ['petsToggleHeader', 'statsToggleHeader'].forEach(id => {
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
            state.bet = Math.max(CONFIG.MIN_BET, state.balance);
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
            btn.textContent = `₱${amount}`;
            btn.addEventListener('click', () => {
                if (amount <= state.balance) {
                    state.bet = amount;
                    if (betInput) betInput.value = state.bet.toFixed(2);
                    updateDisplay();
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
            if (await showConfirm('Reset balance and statistics?')) {
                state.balance = CONFIG.INITIAL_BALANCE;
                state.stats = { gamesPlayed: 0, totalWagered: 0, totalWon: 0, biggestWin: 0, biggestMultiplier: 0, longestStreak: 0 };
                state.winStreak = 0;
                saveState();
                updateDisplay();
                updateStatsDisplay();
                hideGameOver();
            }
        });
    }

    const zeroBtn = document.getElementById('zeroBalance');
    if (zeroBtn) {
        zeroBtn.addEventListener('click', async () => {
            if (await showConfirm('Are you sure? Your balance will be ZERO and you will lose immediately! 😱')) {
                state.balance = 0;
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
        if (state.balance >= state.bet) {
            state.balance -= state.bet;
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
            if (state.balance >= state.bet) handlePlay();
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
            rCtx.fillText(`TOTAL WAGERED:     ₱${totalWagered.toFixed(2)}`, 50, 285);
            rCtx.fillText(`TOTAL WON:         ₱${totalWon.toFixed(2)}`, 50, 310);
            rCtx.fillText(`NET PROFIT:        ₱${net.toFixed(2)}`, 50, 335);
            rCtx.fillText(`BIGGEST WIN:       ₱${biggestWin.toFixed(2)}`, 50, 360);
            rCtx.fillText(`BEST MULTIPLIER:   ${biggestMultiplier}x`, 50, 385);

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
                rCtx.fillText(`₱${entry.bet.toFixed(2)}`, hX + 25, entryY);
                
                // Multiplier (Gold)
                rCtx.textAlign = 'center';
                rCtx.fillStyle = '#d4af37';
                rCtx.font = 'bold 12px sans-serif';
                rCtx.fillText(`${entry.multi}x`, hX + hW / 2, entryY);
                
                // Profit (Green/Red)
                rCtx.textAlign = 'right';
                rCtx.fillStyle = entry.multi >= 1 ? '#4caf50' : '#f44336';
                rCtx.fillText(`₱${entry.profit.toFixed(2)}`, hX + hW - 25, entryY);
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
    resizeCanvases();
    setTimeout(resizeCanvases, 100);
    initPets();
    updateDisplay();
    updateStatsDisplay();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvases, 50);
    });

    draw();
};