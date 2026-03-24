/**
 * RollyRoyal Plinko - Premium Edition with Sound Effects
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
    PET_SIZE: 100,
    AUTOPLAY_SPEEDS: { slow: 1500, normal: 800, fast: 400, turbo: 150 },
    STREAK_BONUS_START: 3,
    STREAK_BONUS_RATE: 0.1,
    PRESETS: [5, 10, 25, 50, 100]
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
    { title: "Recent History", content: "Track your performance on the left. View your **Bet**, **Multiplier**, and **Profit** (Green for wins, Red for losses). Keep an eye on your winning streak!", target: ".history-pane" },
    { title: "Your Balance", content: "This displays your current funds. If you ever run out, simply click **Reset Balance** to start fresh with ₱1,000.00.", target: ".balance-section" },
    { title: "Controls & Settings", content: "Top controls: Click **❓** to replay this guide, **🎵** for music, and **🔊** for sound effects. Enjoy the vibe while you play!", target: ".hud-controls" },
    { title: "Bet Amount", content: "Input your stake or use quick presets! **MIN/MAX** buttons for extremes, or click preset amounts. Watch the **Max Win** display!", target: ".bet-input-wrapper" },
    { title: "Risk Level", content: "Choose your strategy:<br>• <b>Low</b>: Frequent but smaller wins.<br>• <b>Normal</b>: Balanced risk and reward.<br>• <b>High</b>: High volatility with massive multipliers!", target: "#riskLevel" },
    { title: "Lines (Pegs)", content: "Adjust the number of peg rows (8 to 16 lines). More lines mean more multiplier slots and higher jackpot potential!", target: ".hud-group:has(#linesCount)" },
    { title: "Lucky Pets", content: "Meet your team! Select which pets you want to see. They will celebrate with you whenever you hit those big multipliers!", target: ".collapsible" },
    { title: "Auto-Play Mode", content: "Want to sit back and watch? Use <b>AUTO PLAY</b> to automatically drop balls at your chosen speed. Build win streaks for bonus multipliers!", target: "#autoPlayBtn" },
    { title: "Digital Receipt", content: "Want to flex your win? Click <b>s</b>! It downloads an image of your game board to share with friends or on social media.", target: "#receiptBtn" },
    { title: "Pets Playground", content: "At the bottom, your selected pets walk and play. Watch them celebrate your victories in real-time!", target: ".pets-section" },
    { title: "Ready, Set, PLAY!", content: "Everything is set! Click <b>PLAY</b> to drop a ball, or spam it for rapid-fire action! Build win streaks 🔥 for bonus multipliers. Good luck!", target: "#playBtn" }
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

function playSound(audio) {
    if (!audio || state.isSfxMuted) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

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

        nextBtn.textContent = confirmText;
        nextBtn.onclick = () => {
            closeCustomModal();
            if (activeModalResolve) activeModalResolve(true);
        };

        if (isConfirm) {
            skipBtn.textContent = cancelText;
            skipBtn.style.display = 'inline-block';
            skipBtn.onclick = () => {
                closeCustomModal();
                if (activeModalResolve) activeModalResolve(false);
            };
        } else {
            skipBtn.style.display = 'none';
        }

        overlay.classList.remove('hidden');
        box.classList.remove('hidden');
    });
}

function closeCustomModal() {
    document.getElementById('tutorialOverlay').classList.add('hidden');
    document.getElementById('tutorialBox').classList.add('hidden');
    const nextBtn = document.getElementById('nextStep');
    const skipBtn = document.getElementById('skipTutorial');
    nextBtn.onclick = nextTutorialStep;
    skipBtn.onclick = endTutorial;
    skipBtn.textContent = 'Skip';
    skipBtn.style.display = 'inline-block';
    const dots = document.getElementById('stepDots');
    if (dots) dots.style.display = 'flex';
}

function showAlert(message) {
    return showCustomModal('Babala', message, false, 'Sige 👌', '');
}

function showConfirm(message) {
    return showCustomModal('Kumpirmasyon', message, true, 'Oo ✅', 'Hindi ❌');
}

// ============================================================================
// STATE
// ============================================================================
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
        gamesPlayed: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        biggestMultiplier: 0,
        longestStreak: 0
    }),
    isGameOver: false
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
// TUTORIAL
// ============================================================================
function startTutorial() {
    state.tutorialStep = 0;
    state.isTutorialActive = true;
    document.getElementById('tutorialOverlay').classList.remove('hidden');
    document.getElementById('tutorialBox').classList.remove('hidden');
    updateTutorialStep();
}

function updateTutorialStep() {
    const step = TUTORIAL_STEPS[state.tutorialStep];
    const highlightElements = document.querySelectorAll('.highlight-element');
    highlightElements.forEach(el => el.classList.remove('highlight-element'));

    const contentEl = document.getElementById('tutorialContent');
    if (contentEl) {
        contentEl.innerHTML = `
            <h3 style="color: var(--gold); margin-bottom: 10px;">${step.title}</h3>
            <p>${step.content}</p>
        `;
    }

    const targetEl = document.querySelector(step.target);
    if (targetEl) targetEl.classList.add('highlight-element');

    const nextBtn = document.getElementById('nextStep');
    if (nextBtn) nextBtn.textContent = state.tutorialStep === TUTORIAL_STEPS.length - 1 ? 'FINISH' : 'NEXT';
    
    const dotsEl = document.getElementById('stepDots');
    if (dotsEl) {
        dotsEl.innerHTML = TUTORIAL_STEPS.map((_, i) =>
            `<div class="dot ${i === state.tutorialStep ? 'active' : ''}"></div>`
        ).join('');
    }
}

function nextTutorialStep() {
    if (state.tutorialStep < TUTORIAL_STEPS.length - 1) {
        state.tutorialStep++;
        updateTutorialStep();
    } else {
        endTutorial();
    }
}

function endTutorial() {
    state.isTutorialActive = false;
    document.getElementById('tutorialOverlay').classList.add('hidden');
    document.getElementById('tutorialBox').classList.add('hidden');
    document.querySelectorAll('.highlight-element').forEach(el => el.classList.remove('highlight-element'));
    Storage.set('tutorialDone', true);
}

// ============================================================================
// PET CLASS
// ============================================================================
class Pet {
    constructor(name) {
        this.name = name;
        this.config = PET_CONFIGS[name] || { walk: 8, celebrate: 5 };
        this.image = new Image();
        this.image.src = `Sprites/pets/${name}.png`;
        this.size = CONFIG.PET_SIZE;
        this.x = Math.random() * (petsCanvas.width - this.size);
        this.y = petsCanvas.height - this.size - 5;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.frame = 0;
        this.state = 'walk';
        this.celebrateTimer = 0;
        this.direction = 1;
        this.lastFrameUpdate = Date.now();
    }

    update() {
        const maxFrames = this.state === 'celebrate' ? this.config.celebrate : this.config.walk;
        const now = Date.now();
        const fps = this.state === 'celebrate' ? 120 : 150;

        if (now - this.lastFrameUpdate > fps) {
            this.frame = (this.frame + 1) % maxFrames;
            this.lastFrameUpdate = now;
        }

        if (this.state === 'celebrate') {
            this.celebrateTimer--;
            if (this.celebrateTimer <= 0) {
                this.state = 'walk';
                this.frame = 0;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.direction = this.vx > 0 ? 1 : -1;
            }
        } else {
            this.x += this.vx;
            if (this.x < 0) { this.x = 0; this.vx *= -1; }
            else if (this.x > petsCanvas.width - this.size) { this.x = petsCanvas.width - this.size; this.vx *= -1; }
            this.direction = this.vx > 0 ? 1 : -1;
        }

        this.y = petsCanvas.height - this.size - 5;
    }

    draw(ctx) {
        const row = this.state === 'celebrate' ? 1 : 0;
        const s = this.size;

        ctx.save();
        ctx.translate(this.x + s/2, this.y + s/2);
        if (this.direction === -1) ctx.scale(-1, 1);

        try {
            if (this.image.complete && this.image.naturalWidth > 0) {
                const sw = Math.floor(this.image.naturalWidth / 10);
                const sh = Math.floor(this.image.naturalHeight / 2);
                const aspect = sw / sh;
                const drawH = s;
                const drawW = s * aspect;

                ctx.drawImage(this.image,
                    Math.floor(this.frame * sw) + 1, Math.floor(row * sh) + 1,
                    sw - 2, sh - 2,
                    -drawW/2, -drawH/2, drawW, drawH);
            } else {
                ctx.fillStyle = '#d4af37';
                ctx.beginPath(); ctx.arc(0, 0, s/3, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#000'; ctx.font = `bold ${s/4}px sans-serif`;
                ctx.textAlign = 'center'; ctx.fillText(this.name[0].toUpperCase(), 0, s/10);
            }
        } catch (e) {
            ctx.fillStyle = '#d4af37'; ctx.fillRect(-s/4, -s/4, s/2, s/2);
        }
        ctx.restore();
    }

    celebrate() {
        if (this.state === 'celebrate') return;
        this.state = 'celebrate';
        this.frame = 0;
        this.celebrateTimer = 120;
        this.vx = 0;
    }
}

// ============================================================================
// GAME FUNCTIONS
// ============================================================================
function dropBall() {
    playSound(playBtnSound);
    const spacing = Math.min(plinkoCanvas.width / (state.lines + 2), plinkoCanvas.height / (state.lines + 3));
    const ballX = plinkoCanvas.width / 2 + (Math.random() - 0.5) * 10;

    let color = '#ffc107';
    if (state.bet >= 100) color = '#ff00ff';
    else if (state.bet >= 50) color = '#ff0000';
    else if (state.bet >= 25) color = '#ff6b00';
    else if (state.bet >= 10) color = '#ffc107';
    else color = '#4caf50';

    balls.push({
        x: ballX, y: 20,
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
        playSound(collectSound);
        playSound(paldoSound);
    } else {
        state.winStreak = 0;
        playSound(lossSound);
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

    if (actualMulti > 2) {
        pets.forEach(p => { if (state.activePets.has(p.name)) p.celebrate(); });
    } else if (actualMulti >= 1) {
        const active = pets.filter(p => state.activePets.has(p.name));
        if (active.length > 0) active[Math.floor(Math.random() * active.length)].celebrate();
    }
}

function showGameOver() {
    state.isGameOver = true;
    if (state.autoPlay) {
        const autoBtn = document.getElementById('autoPlayBtn');
        if (autoBtn) autoBtn.click(); // Turn off autoplay by simulating click
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
            catLaugh.play().catch(() => {});
            
            catLaugh.onended = () => {
                if (!state.isSfxMuted && state.isGameOver && tuco) {
                    tuco.currentTime = 0;
                    tuco.play().catch(() => {});
                }
            };
        }
    }
}

function hideGameOver() {
    state.isGameOver = false;
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
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    const profit = bet * multi;
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
    const startY = 40;
    const slotHeight = 30;
    const availableHeight = plinkoCanvas.height - startY - slotHeight - 40;
    const maxSpacingH = availableHeight / (rows + 0.8);
    const maxSpacingW = (plinkoCanvas.width - 40) / (rows + 2);
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
// DRAW
// ============================================================================
function draw() {
    updatePhysics();
    updateControlsState();
    plinkoCtx.clearRect(0, 0, plinkoCanvas.width, plinkoCanvas.height);

    if (!cachedBgGradient) {
        cachedBgGradient = plinkoCtx.createRadialGradient(
            plinkoCanvas.width / 2, plinkoCanvas.height / 2, 50,
            plinkoCanvas.width / 2, plinkoCanvas.height / 2, plinkoCanvas.width
        );
        cachedBgGradient.addColorStop(0, '#1a1d2d');
        cachedBgGradient.addColorStop(1, '#0b0d17');
    }
    plinkoCtx.fillStyle = cachedBgGradient;
    plinkoCtx.fillRect(0, 0, plinkoCanvas.width, plinkoCanvas.height);

    plinkoCtx.fillStyle = '#ffffff';
    pegs.forEach(peg => { plinkoCtx.beginPath(); plinkoCtx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2); plinkoCtx.fill(); });

    slots.forEach((slot, idx) => {
        const m = slot.multiplier;
        let baseColor, topColor, bottomColor;

        if (m >= 100) { baseColor = '#d500f9'; topColor = '#f50057'; bottomColor = '#4a148c'; }
        else if (m >= 25) { baseColor = '#ff1744'; topColor = '#ff5252'; bottomColor = '#b71c1c'; }
        else if (m >= 5) { baseColor = '#ff6d00'; topColor = '#ff9100'; bottomColor = '#bf360c'; }
        else if (m >= 2) { baseColor = '#ffab00'; topColor = '#ffd740'; bottomColor = '#ff6f00'; }
        else if (m >= 1) { baseColor = '#ffea00'; topColor = '#ffff8d'; bottomColor = '#f57f17'; }
        else { baseColor = '#00e676'; topColor = '#69f0ae'; bottomColor = '#1b5e20'; }

        slot.color = baseColor;

        const pulse = slotPulses.find(p => p.slotIndex === idx);
        const pulseScale = pulse ? 1 + (pulse.life / 30) * 0.15 : 1; const heat = slotHeat[idx] || 0;

        plinkoCtx.save();
        plinkoCtx.translate(slot.x + slot.width / 2, slot.y + slot.height / 2);
        plinkoCtx.scale(pulseScale, pulseScale);
        plinkoCtx.translate(-(slot.x + slot.width / 2), -(slot.y + slot.height / 2));

        if (heat > 0.5) {
            plinkoCtx.shadowColor = baseColor;
            plinkoCtx.shadowBlur = heat * 10;
        }

        const slotGradient = plinkoCtx.createLinearGradient(slot.x, slot.y, slot.x, slot.y + slot.height);
        slotGradient.addColorStop(0, topColor);
        slotGradient.addColorStop(0.4, baseColor);
        slotGradient.addColorStop(1, bottomColor);

        plinkoCtx.fillStyle = slotGradient;
        plinkoCtx.beginPath();
        plinkoCtx.roundRect(slot.x + 2, slot.y, slot.width - 4, slot.height, 6);
        plinkoCtx.fill();

        plinkoCtx.shadowBlur = 0;

        plinkoCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        plinkoCtx.lineWidth = 2;
        plinkoCtx.beginPath();
        plinkoCtx.moveTo(slot.x + 6, slot.y + 2);
        plinkoCtx.lineTo(slot.x + slot.width - 6, slot.y + 2);
        plinkoCtx.stroke();

        plinkoCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        plinkoCtx.lineWidth = 1;
        plinkoCtx.strokeRect(slot.x + 2, slot.y, slot.width - 4, slot.height);

        if (heat > 1) {
            plinkoCtx.fillStyle = 'rgba(255, 100, 0, 0.3)';
            plinkoCtx.fillRect(slot.x + 2, slot.y, slot.width - 4, 3);
        }

        plinkoCtx.fillStyle = '#000';
        plinkoCtx.font = `bold ${Math.max(8, slot.width * 0.28)}px sans-serif`;
        plinkoCtx.textAlign = 'center';
        plinkoCtx.shadowColor = 'rgba(255,255,255,0.2)';
        plinkoCtx.shadowBlur = 2;
        plinkoCtx.fillText(`${slot.multiplier}x`, slot.x + slot.width / 2, slot.y + slot.height * 0.7);
        plinkoCtx.shadowBlur = 0;

        plinkoCtx.restore();
    });

    balls.forEach(ball => {
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

        plinkoCtx.shadowColor = ball.color;
        plinkoCtx.shadowBlur = 8;
        plinkoCtx.fillStyle = ball.color;
        plinkoCtx.beginPath();
        plinkoCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        plinkoCtx.fill();
        plinkoCtx.shadowBlur = 0;
    });

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
        plinkoCtx.shadowBlur = 15; plinkoCtx.shadowColor = '#f9d71c';
        plinkoCtx.font = 'bold 40px serif'; plinkoCtx.textAlign = 'center';
        plinkoCtx.fillText(effect.text, 0, 0); plinkoCtx.restore();
        effect.opacity -= 0.02; effect.rotation += 0.05; effect.y -= 1;
        if (effect.opacity <= 0) winEffects.splice(i, 1);
    }

    petsCtx.fillStyle = '#0b0d17'; petsCtx.fillRect(0, 0, petsCanvas.width, petsCanvas.height);
    pets.forEach(pet => { if (state.activePets.has(pet.name)) { pet.update(); pet.draw(petsCtx); } });
    requestAnimationFrame(draw);
}

// ============================================================================
// INIT
// ============================================================================
function initHUD() {
    // Collapsible sections
    ['petsToggleHeader', 'statsToggleHeader'].forEach(id => {
        const header = document.getElementById(id);
        if (!header) return;
        const target = header.nextElementSibling;
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            target.classList.toggle('collapsed');
        });
    });

    // Tutorial
    const tutorialBtn = document.getElementById('tutorialBtn');
    if (tutorialBtn) tutorialBtn.addEventListener('click', startTutorial);
    const nextStepBtn = document.getElementById('nextStep');
    if (nextStepBtn) nextStepBtn.addEventListener('click', nextTutorialStep);
    const skipTutorialBtn = document.getElementById('skipTutorial');
    if (skipTutorialBtn) skipTutorialBtn.addEventListener('click', endTutorial);
    setTimeout(startTutorial, 500);

    // Pet toggles
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

    // Bet controls
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

    // Bet presets
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

    // Game settings
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
            if (await showConfirm('I-reset ang balanse at estadistika?')) {
                state.balance = CONFIG.INITIAL_BALANCE;
                state.stats = { gamesPlayed: 0, totalWagered: 0, totalWon: 0, biggestWin: 0, biggestMultiplier: 0, longestStreak: 0 };
                state.winStreak = 0;
                saveState();
                updateDisplay();
                updateStatsDisplay();
            }
        });
    }

    const zeroBtn = document.getElementById('zeroBalance');
    if (zeroBtn) {
        zeroBtn.addEventListener('click', async () => {
            if (await showConfirm('Sigurado ka ba? Magiging ZERO ang balance mo at matalo ka agad! 😱')) {
                state.balance = 0;
                saveState();
                updateDisplay();
                showGameOver();
            }
        });
    }

    // Sound controls
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
        if (bgMusic) bgMusic.play().catch(() => {});
        document.removeEventListener('click', startMusic);
    };
    document.addEventListener('click', startMusic);

    // Play
    const handlePlay = async () => {
        if (state.balance >= state.bet) {
            state.balance -= state.bet;
            saveState();
            updateDisplay();
            dropBall();
        } else {
            await showAlert('UBOS NA!', 'Oops! Ubos na ang iyong balance. Mag-reset muna tayo sa taas para makapag-play ulit! 💸');
        }
    };

    if (playBtn) playBtn.addEventListener('click', handlePlay);

    // Game Over Actions
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

    // Auto-play
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
                await showAlert('UBOS NA!', 'Tumigil ang Auto Play dahil wala ka na palang bala. Reset na! 💸');
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

    // Receipt
    const receiptBtn = document.getElementById('receiptBtn');
    if (receiptBtn) {
        receiptBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `RollyRoyal-Receipt-${Date.now()}.png`;
            link.href = plinkoCanvas.toDataURL();
            link.click();
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        switch(e.key.toLowerCase()) {
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

    // Show keyboard hint
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
