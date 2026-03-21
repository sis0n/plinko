// Constants & Configuration
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

// Tutorial Steps Configuration
const TUTORIAL_STEPS = [
    {
        title: "Welcome to RollyRoyal Plinko!",
        content: "Step into your personal luxury casino experience. Here, physics and luck combine for big wins. Let's take a quick tour!",
        target: ".game-pane"
    },
    {
        title: "Recent History",
        content: "Track your performance on the left. View your **Bet**, **Multiplier**, and **Profit** (Green for wins, Red for losses). Keep an eye on your winning streak!",
        target: ".history-pane"
    },
    {
        title: "Your Balance",
        content: "This displays your current funds. If you ever run out, simply click **Reset Balance** to start fresh with ₱1,000.00.",
        target: ".balance-section"
    },
    {
        title: "Controls & Settings",
        content: "Top controls: Click **❓** to replay this guide and **🔊** to toggle the background music. Enjoy the vibe while you play!",
        target: ".hud-controls"
    },
    {
        title: "Bet Amount",
        content: "Input your stake here. Use **MIN** for a quick ₱1.00 bet or **MAX** to go all-in with your entire balance. Play responsibly!",
        target: ".bet-input-wrapper"
    },
    {
        title: "Risk Level",
        content: "Choose your strategy:<br>• <b>Low</b>: Frequent but smaller wins.<br>• <b>Normal</b>: Balanced risk and reward.<br>• <b>High</b>: High volatility with massive multipliers!",
        target: "#riskLevel"
    },
    {
        title: "Lines (Pegs)",
        content: "Adjust the number of peg rows (8 to 16 lines). More lines mean more multiplier slots and higher jackpot potential!",
        target: ".hud-group:has(#linesCount)"
    },
    {
        title: "Lucky Pets",
        content: "Meet your team! Select which pets you want to see. They will celebrate with you whenever you hit those big multipliers!",
        target: ".collapsible"
    },
    {
        title: "Digital Receipt",
        content: "Want to flex your win? Click <b>Save Receipt</b>! It downloads an image of your game board to share with friends or on social media.",
        target: "#receiptBtn"
    },
    {
        title: "Pets Playground",
        content: "At the bottom, your selected pets walk and play. Watch them celebrate your victories in real-time!",
        target: ".pets-section"
    },
    {
        title: "Ready, Set, PLAY!",
        content: "Everything is set! Click <b>PLAY</b> to drop the ball and test your luck. Good luck, Kyle! Have fun!",
        target: "#playBtn"
    }
];

// State
let state = {
    balance: 1000.00,
    bet: 10.00,
    lines: 8,
    risk: 'normal',
    activePets: new Set(PET_NAMES),
    isMuted: localStorage.getItem('plinkoMuted') === 'true',
    tutorialStep: 0,
    isTutorialActive: false
};

// DOM Elements
const balanceEl = document.getElementById('userBalance');
const betInput = document.getElementById('betAmount');
const minBetBtn = document.getElementById('minBet');
const maxBetBtn = document.getElementById('maxBet');
const riskSelect = document.getElementById('riskLevel');
const linesInput = document.getElementById('linesCount');
const lineValueEl = document.getElementById('lineValue');
const petTogglesEl = document.getElementById('petToggles');
const playBtn = document.getElementById('playBtn');
const soundToggle = document.getElementById('soundToggle');
const bgMusic = document.getElementById('bgMusic');

// Tutorial DOM Elements
const tutorialOverlay = document.getElementById('tutorialOverlay');
const tutorialBox = document.getElementById('tutorialBox');
const tutorialContent = document.getElementById('tutorialContent');
const tutorialNextBtn = document.getElementById('nextStep');
const skipTutorialBtn = document.getElementById('skipTutorial');
const tutorialBtn = document.getElementById('tutorialBtn');
const stepDots = document.getElementById('stepDots');

function startTutorial() {
    state.tutorialStep = 0;
    state.isTutorialActive = true;
    tutorialOverlay.classList.remove('hidden');
    tutorialBox.classList.remove('hidden');
    updateTutorialStep();
}

function updateTutorialStep() {
    const step = TUTORIAL_STEPS[state.tutorialStep];
    
    // Clear previous highlight
    document.querySelectorAll('.highlight-element').forEach(el => el.classList.remove('highlight-element'));
    
    // Update content
    tutorialContent.innerHTML = `
        <h3 style="color: var(--gold); margin-bottom: 10px;">${step.title}</h3>
        <p>${step.content}</p>
    `;

    // Highlight target
    const targetEl = document.querySelector(step.target);
    if (targetEl) targetEl.classList.add('highlight-element');

    // Update button text
    tutorialNextBtn.textContent = state.tutorialStep === TUTORIAL_STEPS.length - 1 ? 'FINISH' : 'NEXT';

    // Update dots
    stepDots.innerHTML = TUTORIAL_STEPS.map((_, i) => 
        `<div class="dot ${i === state.tutorialStep ? 'active' : ''}"></div>`
    ).join('');
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
    tutorialOverlay.classList.add('hidden');
    tutorialBox.classList.add('hidden');
    document.querySelectorAll('.highlight-element').forEach(el => el.classList.remove('highlight-element'));
    localStorage.setItem('plinkoTutorialDone', 'true');
}

// Initialize HUD
function initHUD() {
    // Collapsible Pets Logic
    const petsToggleHeader = document.getElementById('petsToggleHeader');
    const petToggles = document.getElementById('petToggles');
    petsToggleHeader.addEventListener('click', () => {
        petsToggleHeader.classList.toggle('active');
        petToggles.classList.toggle('collapsed');
    });

    // Tutorial Events
    tutorialBtn.addEventListener('click', startTutorial);
    tutorialNextBtn.addEventListener('click', nextTutorialStep);
    skipTutorialBtn.addEventListener('click', endTutorial);

    // Auto-start tutorial immediately on load
    setTimeout(startTutorial, 500);

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

    betInput.addEventListener('change', (e) => {
        state.bet = Math.max(1, parseFloat(e.target.value) || 1);
        betInput.value = state.bet.toFixed(2);
    });

    minBetBtn.addEventListener('click', () => {
        state.bet = 1.00;
        betInput.value = state.bet.toFixed(2);
    });

    maxBetBtn.addEventListener('click', () => {
        state.bet = state.balance;
        betInput.value = state.bet.toFixed(2);
    });

    riskSelect.addEventListener('change', (e) => {
        state.risk = e.target.value;
        generateBoard();
    });

    linesInput.addEventListener('input', (e) => {
        state.lines = parseInt(e.target.value);
        lineValueEl.textContent = state.lines;
        generateBoard();
    });

    document.getElementById('resetBalance').addEventListener('click', () => {
        state.balance = 1000.00;
        updateDisplay();
    });

    // Sound Logic
    bgMusic.volume = 0.5;
    bgMusic.muted = state.isMuted;
    soundToggle.textContent = state.isMuted ? '🔇' : '🔊';

    const toggleSound = () => {
        state.isMuted = !state.isMuted;
        bgMusic.muted = state.isMuted;
        soundToggle.textContent = state.isMuted ? '🔇' : '🔊';
        localStorage.setItem('plinkoMuted', state.isMuted);
    };

    soundToggle.addEventListener('click', toggleSound);

    // Ensure music starts on first interaction
    const startMusic = () => {
        bgMusic.play().catch(() => {
            // Autoplay might still be blocked if no user interaction occurred
            console.log('Autoplay blocked - waiting for interaction');
        });
        document.removeEventListener('click', startMusic);
    };
    document.addEventListener('click', startMusic);

    playBtn.addEventListener('click', () => {
        if (state.balance >= state.bet) {
            state.balance -= state.bet;
            updateDisplay();
            dropBall();
        } else {
            alert('Insufficient balance!');
        }
    });

    document.getElementById('receiptBtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `RollyRoyal-Receipt-${Date.now()}.png`;
        link.href = plinkoCanvas.toDataURL();
        link.click();
    });
}

function dropBall() {
    const spacing = Math.min(plinkoCanvas.width / (state.lines + 2), plinkoCanvas.height / (state.lines + 3));
    const ballX = plinkoCanvas.width / 2 + (Math.random() - 0.5) * 10;

    balls.push({
        x: ballX,
        y: 20,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        radius: Math.max(2, spacing * 0.15),
        color: '#ffc107'
    });
}

const GRAVITY = 0.2;
const FRICTION = 0.99;
const BOUNCE = 0.5;

function updatePhysics() {
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        ball.vy += GRAVITY;
        ball.vx *= FRICTION;
        ball.x += ball.vx;
        ball.y += ball.vy;

        pegs.forEach(peg => {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < ball.radius + peg.radius) {
                const nx = dx / dist;
                const ny = dy / dist;
                const dot = ball.vx * nx + ball.vy * ny;
                ball.vx = (ball.vx - 2 * dot * nx) * BOUNCE;
                ball.vy = (ball.vy - 2 * dot * ny) * BOUNCE;
                const overlap = (ball.radius + peg.radius) - dist;
                ball.x += nx * overlap;
                ball.y += ny * overlap;
                ball.vx += (Math.random() - 0.5) * 0.5;
            }
        });

        slots.forEach(slot => {
            if (ball.y > slot.y && ball.x > slot.x && ball.x < slot.x + slot.width) {
                handleWin(slot.multiplier);
                balls.splice(i, 1);
            }
        });

        if (ball.y > plinkoCanvas.height + 50 || ball.x < -50 || ball.x > plinkoCanvas.width + 50) {
            balls.splice(i, 1);
        }
    }
}

let winEffects = [];

function handleWin(multiplier) {
    const winAmount = state.bet * multiplier;
    state.balance += winAmount;
    updateDisplay();

    // Log to history
    addHistoryEntry(state.bet, multiplier);

    // Visual Effect for wins
    if (multiplier >= 2) {
        winEffects.push({
            text: `${multiplier}x WIN!`,
            x: plinkoCanvas.width / 2,
            y: plinkoCanvas.height / 2,
            opacity: 1,
            rotation: 0
        });
    }

    if (multiplier > 2) {
        pets.forEach(p => { if (state.activePets.has(p.name)) p.celebrate(); });
    } else if (multiplier >= 1) {
        const active = pets.filter(p => state.activePets.has(p.name));
        if (active.length > 0) active[Math.floor(Math.random() * active.length)].celebrate();
    }
}

function updateDisplay() {
    balanceEl.textContent = `₱${state.balance.toFixed(2)}`;
}

function addHistoryEntry(bet, multiplier) {
    const historyList = document.getElementById('historyList');
    const profit = bet * multiplier;
    const entry = document.createElement('div');
    entry.className = 'history-entry';
    entry.innerHTML = `
        <span class="hist-bet">₱${bet.toFixed(2)}</span>
        <span class="hist-multi">${multiplier}x</span>
        <span class="hist-profit ${multiplier >= 1 ? 'win' : 'loss'}">₱${profit.toFixed(2)}</span>
    `;
    historyList.prepend(entry);
    if (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}

class Pet {
    constructor(name) {
        this.name = name;
        this.config = PET_CONFIGS[name] || { walk: 8, celebrate: 5 };
        this.image = new Image();
        this.image.src = `Sprites/pets/${name}.png`;
        this.size = 64; // Scale up for better visibility
        this.x = Math.random() * (petsCanvas.width - this.size);
        this.y = petsCanvas.height - this.size - 5; // Stand on the "ground"
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
        const fps = this.state === 'celebrate' ? 120 : 150; // Milliseconds per frame

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
        
        // Ensure they stay on the ground during resize or movement
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
                // FIXED GRID: 10 columns (256px), 2 rows (720px)
                // Using 10 columns instead of 8 to fix the "slide through" bleeding issue
                const sw = Math.floor(this.image.naturalWidth / 10);
                const sh = Math.floor(this.image.naturalHeight / 2);
                
                const aspect = sw / sh;
                const drawH = s;
                const drawW = s * aspect;

                // Added 1px inner crop (buffer) to prevent edge bleeding from adjacent frames
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
        this.celebrateTimer = 60; // Approx 2 seconds at current FPS
        this.vx = 0;
    }
}

let pets = [];
function initPets() {
    pets = [];
    PET_NAMES.forEach(name => { pets.push(new Pet(name)); });
}

const plinkoCanvas = document.getElementById('plinkoCanvas');
const plinkoCtx = plinkoCanvas.getContext('2d');
const petsCanvas = document.getElementById('petsCanvas');
const petsCtx = petsCanvas.getContext('2d');

let balls = [];
let pegs = [];
let slots = [];

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

function resizeCanvases() {
    const gamePane = plinkoCanvas.parentElement;
    if (!gamePane) return;
    
    // Use offsetWidth/Height for more reliable measurement during layout shifts
    plinkoCanvas.width = gamePane.offsetWidth;
    plinkoCanvas.height = gamePane.offsetHeight;
    
    const petsPane = petsCanvas.parentElement;
    if (petsPane) {
        petsCanvas.width = petsPane.offsetWidth;
        petsCanvas.height = petsPane.offsetHeight;
    }
    
    generateBoard();
}

function generateBoard() {
    pegs = []; slots = [];
    const rows = state.lines;
    const startY = 40; const slotHeight = 30;
    const availableHeight = plinkoCanvas.height - startY - slotHeight - 40;
    const maxSpacingH = availableHeight / (rows + 0.8);
    const maxSpacingW = (plinkoCanvas.width - 40) / (rows + 2);
    const spacing = Math.min(maxSpacingW, maxSpacingH);

    // Row loop starts at 1 to remove top peg
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

function updateControlsState() {
    const isBusy = balls.length > 0;
    
    // Disable inputs and buttons when balls are active
    betInput.disabled = isBusy;
    minBetBtn.disabled = isBusy;
    maxBetBtn.disabled = isBusy;
    riskSelect.disabled = isBusy;
    linesInput.disabled = isBusy;
    
    // Optional: Add visual feedback for disabled state
    const controlsToFade = [betInput, minBetBtn, maxBetBtn, riskSelect, linesInput];
    controlsToFade.forEach(el => {
        el.style.opacity = isBusy ? '0.5' : '1';
        el.style.cursor = isBusy ? 'not-allowed' : 'pointer';
    });
}

function draw() {
    updatePhysics();
    updateControlsState();
    plinkoCtx.clearRect(0, 0, plinkoCanvas.width, plinkoCanvas.height);
    const gradient = plinkoCtx.createRadialGradient(plinkoCanvas.width / 2, plinkoCanvas.height / 2, 50, plinkoCanvas.width / 2, plinkoCanvas.height / 2, plinkoCanvas.width);
    gradient.addColorStop(0, '#1a1d2d'); gradient.addColorStop(1, '#0b0d17');
    plinkoCtx.fillStyle = gradient; plinkoCtx.fillRect(0, 0, plinkoCanvas.width, plinkoCanvas.height);

    plinkoCtx.fillStyle = '#ffffff';
    pegs.forEach(peg => { plinkoCtx.beginPath(); plinkoCtx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2); plinkoCtx.fill(); });

    slots.forEach(slot => {
        // Dynamic "Heat" colors based on multiplier value
        let baseColor, topColor, bottomColor;
        const m = slot.multiplier;

        if (m >= 100) {
            // Ultra Hot (Purple/Magenta)
            baseColor = '#d500f9'; topColor = '#f50057'; bottomColor = '#4a148c';
        } else if (m >= 25) {
            // Very Hot (Bright Red)
            baseColor = '#ff1744'; topColor = '#ff5252'; bottomColor = '#b71c1c';
        } else if (m >= 5) {
            // Hot (Deep Orange)
            baseColor = '#ff6d00'; topColor = '#ff9100'; bottomColor = '#bf360c';
        } else if (m >= 2) {
            // Warm (Orange/Gold)
            baseColor = '#ffab00'; topColor = '#ffd740'; bottomColor = '#ff6f00';
        } else if (m >= 1) {
            // Neutral (Yellow)
            baseColor = '#ffea00'; topColor = '#ffff8d'; bottomColor = '#f57f17';
        } else {
            // Cool (Green - Loss/Small return)
            baseColor = '#00e676'; topColor = '#69f0ae'; bottomColor = '#1b5e20';
        }

        // Main gloss gradient
        const slotGradient = plinkoCtx.createLinearGradient(slot.x, slot.y, slot.x, slot.y + slot.height);
        slotGradient.addColorStop(0, topColor);
        slotGradient.addColorStop(0.4, baseColor);
        slotGradient.addColorStop(1, bottomColor);

        plinkoCtx.fillStyle = slotGradient;
        plinkoCtx.beginPath();
        plinkoCtx.roundRect(slot.x + 2, slot.y, slot.width - 4, slot.height, 6);
        plinkoCtx.fill();

        // 3D Highlight (Glossy top edge)
        plinkoCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        plinkoCtx.lineWidth = 2;
        plinkoCtx.beginPath();
        plinkoCtx.moveTo(slot.x + 6, slot.y + 2);
        plinkoCtx.lineTo(slot.x + slot.width - 6, slot.y + 2);
        plinkoCtx.stroke();

        // Shadow/Border
        plinkoCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        plinkoCtx.lineWidth = 1;
        plinkoCtx.strokeRect(slot.x + 2, slot.y, slot.width - 4, slot.height);

        plinkoCtx.fillStyle = '#000';
        plinkoCtx.font = `bold ${Math.max(8, slot.width * 0.28)}px sans-serif`;
        plinkoCtx.textAlign = 'center';
        plinkoCtx.shadowColor = 'rgba(255,255,255,0.2)';
        plinkoCtx.shadowBlur = 2;
        plinkoCtx.fillText(`${slot.multiplier}x`, slot.x + slot.width / 2, slot.y + slot.height * 0.7);
        plinkoCtx.shadowBlur = 0; // Reset shadow
    });

    balls.forEach(ball => { plinkoCtx.fillStyle = ball.color; plinkoCtx.beginPath(); plinkoCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); plinkoCtx.fill(); });

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

window.onload = () => {
    initHUD();
    // Initial resize
    resizeCanvases();
    // Re-run after a short delay to catch any layout shifts after assets load
    setTimeout(resizeCanvases, 100);
    
    initPets();
    updateDisplay();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvases, 50);
    });
    
    draw();
};
