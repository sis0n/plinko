// Constants & Configuration
const PET_NAMES = ['alwyn', 'Asher', 'beto', 'Colmo', 'gab', 'kyle', 'Renz'];

// State
let state = {
    balance: 1000.00,
    bet: 10.00,
    lines: 8,
    risk: 'normal',
    activePets: new Set(PET_NAMES)
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

// Initialize HUD
function initHUD() {
    // Generate Pet Toggles
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

    // Bet Inputs
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

    // Risk Level
    riskSelect.addEventListener('change', (e) => {
        state.risk = e.target.value;
        generateBoard();
    });

    // Line slider
    linesInput.addEventListener('input', (e) => {
        state.lines = parseInt(e.target.value);
        lineValueEl.textContent = state.lines;
        generateBoard();
    });

    // Balance Reset
    document.getElementById('resetBalance').addEventListener('click', () => {
        state.balance = 1000.00;
        updateDisplay();
    });

    // Play Button
    playBtn.addEventListener('click', () => {
        if (state.balance >= state.bet) {
            state.balance -= state.bet;
            updateDisplay();
            dropBall();
        } else {
            alert('Insufficient balance!');
        }
    });

    // Digital Receipt
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

        // Apply Gravity
        ball.vy += GRAVITY;
        ball.vx *= FRICTION;

        // Update Position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Collision with Pegs
        pegs.forEach(peg => {
            const dx = ball.x - peg.x;
            const dy = ball.y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < ball.radius + peg.radius) {
                // Normal vector
                const nx = dx / dist;
                const ny = dy / dist;

                // Reflect velocity
                const dot = ball.vx * nx + ball.vy * ny;
                ball.vx = (ball.vx - 2 * dot * nx) * BOUNCE;
                ball.vy = (ball.vy - 2 * dot * ny) * BOUNCE;

                // Move ball out of peg
                const overlap = (ball.radius + peg.radius) - dist;
                ball.x += nx * overlap;
                ball.y += ny * overlap;

                // Add small random horizontal push to avoid dead centers
                ball.vx += (Math.random() - 0.5) * 0.5;
            }
        });

        // Collision with Slots
        slots.forEach(slot => {
            if (ball.y > slot.y && ball.x > slot.x && ball.x < slot.x + slot.width) {
                handleWin(slot.multiplier);
                balls.splice(i, 1);
            }
        });

        // OOB cleanup
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

    // Trigger celebrations
    if (multiplier > 2) {
        pets.forEach(p => {
            if (state.activePets.has(p.name)) p.celebrate();
        });
    } else if (multiplier >= 1) {
        const active = pets.filter(p => state.activePets.has(p.name));
        if (active.length > 0) {
            active[Math.floor(Math.random() * active.length)].celebrate();
        }
    }
}

function updateDisplay() {
    balanceEl.textContent = `$${state.balance.toFixed(2)}`;
}

function addHistoryEntry(bet, multiplier) {
    const historyList = document.getElementById('historyList');
    const profit = bet * multiplier;
    const entry = document.createElement('div');
    entry.className = 'history-entry';
    entry.innerHTML = `
        <span class="hist-bet">$${bet.toFixed(2)}</span>
        <span class="hist-multi">${multiplier}x</span>
        <span class="hist-profit ${multiplier >= 1 ? 'win' : 'loss'}">$${profit.toFixed(2)}</span>
    `;
    historyList.prepend(entry);
    if (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}

class Pet {
    constructor(name) {
        this.name = name;
        this.image = new Image();
        this.image.src = `Sprites/pets/${name}.png`;
        this.size = 60;
        this.x = Math.random() * (petsCanvas.width - this.size);
        this.y = (petsCanvas.height - this.size) / 2;
        this.vx = (Math.random() - 0.5) * 2;
        this.frame = 0;
        this.state = 'walk';
        this.celebrateTimer = 0;
        this.direction = 1;
    }

    update() {
        if (this.state === 'celebrate') {
            this.celebrateTimer--;
            if (this.celebrateTimer <= 0) {
                this.state = 'walk';
            }
            // Celebration animation (usually 5-7 frames, looping)
            if (Date.now() % 120 < 20) {
                this.frame = (this.frame + 1) % 5; 
            }
        } else {
            this.x += this.vx;
            if (this.x < 0) {
                this.x = 0;
                this.vx *= -1;
            } else if (this.x > petsCanvas.width - this.size) {
                this.x = petsCanvas.width - this.size;
                this.vx *= -1;
            }
            this.direction = this.vx > 0 ? 1 : -1;

            // Walking animation (8 frames)
            if (Date.now() % 100 < 20) {
                this.frame = (this.frame + 1) % 8;
            }
        }
    }

    draw(ctx) {
        const row = this.state === 'celebrate' ? 1 : 0;
        const s = this.size;

        ctx.save();
        ctx.translate(this.x + s/2, this.y + s/2);
        if (this.direction === -1) ctx.scale(-1, 1);

        try {
            if (this.image.complete && this.image.naturalWidth > 0) {
                // Determine sw and sh based on 8 columns and 2 rows
                const sw = this.image.naturalWidth / 8;
                const sh = this.image.naturalHeight / 2;
                
                const finalRow = (row + 1) * sh > this.image.naturalHeight ? 0 : row;

                ctx.drawImage(this.image, 
                    this.frame * sw, finalRow * sh, sw, sh,
                    -s/2, -s/2, s, s);
            } else {
                ctx.fillStyle = '#d4af37';
                ctx.beginPath();
                ctx.arc(0, 0, s/3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.font = `bold ${s/4}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(this.name[0].toUpperCase(), 0, s/10);
            }
        } catch (e) {
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(-s/4, -s/4, s/2, s/2);
        }
        ctx.restore();
    }
    celebrate() {
        this.state = 'celebrate';
        this.celebrateTimer = 120;
    }
}

let pets = [];

function initPets() {
    PET_NAMES.forEach(name => {
        pets.push(new Pet(name));
    });
}

// Canvas Setup
const plinkoCanvas = document.getElementById('plinkoCanvas');
const plinkoCtx = plinkoCanvas.getContext('2d');
const petsCanvas = document.getElementById('petsCanvas');
const petsCtx = petsCanvas.getContext('2d');

let balls = [];
let pegs = [];
let slots = [];

const MULTIPLIERS = {
    8: {
        low: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
        normal: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
        high: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29]
    },
    9: {
        low: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
        normal: [18, 5, 2, 0.6, 0.5, 0.5, 0.6, 2, 5, 18],
        high: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43]
    },
    10: {
        low: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
        normal: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
        high: [76, 10, 3, 1.4, 0.3, 0.2, 0.3, 1.4, 3, 10, 76]
    },
    11: {
        low: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
        normal: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
        high: [120, 14, 5.2, 2, 0.5, 0.2, 0.2, 0.5, 2, 5.2, 14, 120]
    },
    12: {
        low: [10, 4.5, 2.1, 1.6, 1, 0.8, 0.5, 0.8, 1, 1.6, 2.1, 4.5, 10],
        normal: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
        high: [170, 24, 8.1, 2.5, 0.7, 0.3, 0.2, 0.3, 0.7, 2.5, 8.1, 24, 170]
    },
    13: {
        low: [10, 5, 2.5, 1.8, 1.2, 0.9, 0.5, 0.5, 0.9, 1.2, 1.8, 2.5, 5, 10],
        normal: [43, 13, 6, 3, 1.3, 0.7, 0.3, 0.3, 0.7, 1.3, 3, 6, 13, 43],
        high: [260, 37, 11, 4, 1, 0.5, 0.2, 0.2, 0.5, 1, 4, 11, 37, 260]
    },
    14: {
        low: [11, 5, 3, 2, 1.4, 1, 0.5, 0.3, 0.5, 1, 1.4, 2, 3, 5, 11],
        normal: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
        high: [420, 56, 18, 5, 2, 1, 0.5, 0.2, 0.5, 1, 2, 5, 18, 56, 420]
    },
    15: {
        low: [12, 7, 4, 2.4, 1.6, 1.1, 0.7, 0.5, 0.5, 0.7, 1.1, 1.6, 2.4, 4, 7, 12],
        normal: [88, 18, 10, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 10, 18, 88],
        high: [620, 83, 27, 8, 3, 1, 0.5, 0.2, 0.2, 0.5, 1, 3, 8, 27, 83, 620]
    },
    16: {
        low: [16, 9, 4, 2.4, 1.5, 1.1, 1, 0.5, 0.3, 0.5, 1, 1.1, 1.5, 2.4, 4, 9, 16],
        normal: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
        high: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000]
    }
};

function resizeCanvases() {
    const gamePane = plinkoCanvas.parentElement;
    plinkoCanvas.width = gamePane.clientWidth;
    plinkoCanvas.height = gamePane.clientHeight;

    const petsPane = petsCanvas.parentElement;
    petsCanvas.width = petsPane.clientWidth;
    petsCanvas.height = petsPane.clientHeight;

    generateBoard();
}

function generateBoard() {
    pegs = [];
    slots = [];
    const rows = state.lines;
    const startY = 40; 
    const slotHeight = 30;
    
    // Calculate spacing to fit height: startY + rows*spacing + spacing*0.8 + slotHeight < height
    const availableHeight = plinkoCanvas.height - startY - slotHeight - 40;
    const maxSpacingH = availableHeight / (rows + 0.8);
    const maxSpacingW = (plinkoCanvas.width - 40) / (rows + 2);
    const spacing = Math.min(maxSpacingW, maxSpacingH);

    // Generate Pegs in a pyramid
    for (let r = 0; r <= rows; r++) {
        const rowPegs = r + 1;
        const rowWidth = rowPegs * spacing;
        const startX = (plinkoCanvas.width - rowWidth) / 2 + spacing / 2;

        for (let c = 0; c < rowPegs; c++) {
            pegs.push({
                x: startX + c * spacing,
                y: startY + r * spacing,
                radius: Math.max(1, spacing * 0.08)
            });
        }
    }

    // Generate Slots (Multipliers)
    const lastRowY = startY + rows * spacing;
    const slotRowPegs = rows + 1;
    const rowWidth = slotRowPegs * spacing;
    const startX = (plinkoCanvas.width - rowWidth) / 2;
    
    const multipliers = (MULTIPLIERS[rows] || MULTIPLIERS[8])[state.risk] || MULTIPLIERS[8].normal;

    for (let i = 0; i < slotRowPegs; i++) {
        slots.push({
            x: startX + i * spacing,
            y: lastRowY + spacing * 0.8,
            width: spacing - 4,
            height: slotHeight,
            multiplier: multipliers[i] || 1
        });
    }
}

function draw() {
    updatePhysics();
    // Clear
    plinkoCtx.clearRect(0, 0, plinkoCanvas.width, plinkoCanvas.height);

    // Background Gradient (Luxury Casino Feel)
    const gradient = plinkoCtx.createRadialGradient(
        plinkoCanvas.width / 2, plinkoCanvas.height / 2, 50,
        plinkoCanvas.width / 2, plinkoCanvas.height / 2, plinkoCanvas.width
    );
    gradient.addColorStop(0, '#1a1d2d');
    gradient.addColorStop(1, '#0b0d17');
    plinkoCtx.fillStyle = gradient;
    plinkoCtx.fillRect(0, 0, plinkoCanvas.width, plinkoCanvas.height);

    // Draw Pegs
    plinkoCtx.fillStyle = '#ffffff';
    pegs.forEach(peg => {
        plinkoCtx.beginPath();
        plinkoCtx.arc(peg.x, peg.y, peg.radius, 0, Math.PI * 2);
        plinkoCtx.fill();
    });

    // Draw Slots
    slots.forEach(slot => {
        const spacing = (plinkoCanvas.width - 40) / (state.lines + 2); // Approximation for scaling text
        plinkoCtx.fillStyle = '#ff9800';
        plinkoCtx.fillRect(slot.x + 2, slot.y, slot.width, slot.height);

        plinkoCtx.fillStyle = '#000';
        plinkoCtx.font = `bold ${Math.max(8, slot.width * 0.25)}px sans-serif`;
        plinkoCtx.textAlign = 'center';
        plinkoCtx.fillText(`${slot.multiplier}x`, slot.x + slot.width / 2, slot.y + slot.height * 0.7);
    });

    // Draw Balls
    balls.forEach(ball => {
        plinkoCtx.fillStyle = ball.color;
        plinkoCtx.beginPath();
        plinkoCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        plinkoCtx.fill();
    });

    // Draw Win Effects
    for (let i = winEffects.length - 1; i >= 0; i--) {
        const effect = winEffects[i];
        plinkoCtx.save();
        plinkoCtx.translate(effect.x, effect.y);
        plinkoCtx.rotate(effect.rotation);
        plinkoCtx.globalAlpha = effect.opacity;
        plinkoCtx.fillStyle = '#f9d71c';
        plinkoCtx.shadowBlur = 15;
        plinkoCtx.shadowColor = '#f9d71c';
        plinkoCtx.font = 'bold 40px serif';
        plinkoCtx.textAlign = 'center';
        plinkoCtx.fillText(effect.text, 0, 0);
        plinkoCtx.restore();

        effect.opacity -= 0.02;
        effect.rotation += 0.05;
        effect.y -= 1; 
        if (effect.opacity <= 0) winEffects.splice(i, 1);
    }

    // Draw Pets
    // Explicitly draw dark background for pets area
    petsCtx.fillStyle = '#0b0d17'; 
    petsCtx.fillRect(0, 0, petsCanvas.width, petsCanvas.height);

    pets.forEach(pet => {
        if (state.activePets.has(pet.name)) {
            pet.update();
            pet.draw(petsCtx);
        }
    });

    requestAnimationFrame(draw);
    }
// Start
window.onload = () => {
    initHUD();
    resizeCanvases(); // Resize first so initPets knows canvas dimensions
    initPets();
    updateDisplay();
    window.addEventListener('resize', resizeCanvases);
    draw();
    console.log('RollyRoyal Plinko Initialized');
};
