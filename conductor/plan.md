# RollyRoyal Plinko - Implementation Plan

## 1. Objective
Develop a 2D physics-based Plinko game using HTML5 Canvas with an "arcade-like experience" aesthetic. 
Incorporate a gamification twist involving animated "pet" sprites that react to the gameplay.

## 2. Layout & UI Structure (HTML/CSS)
*   **Main Container**: Flexbox/Grid layout matching the provided reference.
*   **Left Pane (Plinko Game)**: The primary `<canvas>` element where the physics and game rendering occur.
*   **Right Pane (HUD)**: Built with standard HTML/CSS.
    *   **User Balance**: Display current balance and a "Reset Balance" button.
    *   **Bet Controls**: Bet amount (+, -, Min, Max).
    *   **Game Settings**: Risk Level (Low, Normal, High), Lines (8 to 16).
    *   **Pet Controls**: Toggles to spawn/despawn specific pets.
    *   **Actions**: "Play" button, "Auto/Manual" bet toggle.
    *   **Digital Receipt**: A button to capture the canvas via `toDataURL()` and download as PNG.
*   **Bottom Pane (Sprite Pets)**: A secondary `<canvas>` (or integrated into the main canvas) at the bottom where pets wander.

## 3. Core Mechanics & Physics (JavaScript)
*   **Physics Loop**: Implement `requestAnimationFrame` for a smooth 60FPS loop.
*   **Ball Dynamics**: Gravity, velocity, and bounce (restitution) upon hitting pegs.
*   **Peg Generation**: Dynamic pyramid generation based on the "Lines" setting (8-16).
*   **Multipliers**: Standard Plinko distribution arrays based on "Lines" and "Risk Level".
*   **Collision Detection**: Circle-circle collision logic for balls hitting pegs.

## 4. Canvas API Requirements
*   `translate`: Used to center the board and adjust coordinates.
*   `rotate`: Used for Jackpot/Big Win visual effects (spinning text or starbursts).
*   `scale`: Used for pulsing slot multipliers when a ball lands.
*   `transform`: Used for advanced coordinate mapping or skewed UI/shadow effects.
*   `toDataURL`: Used for generating the "Digital Receipt".
*   `createLinearGradient` / `createRadialGradient`: Used for the board background to give an arcade-like experience.

## 5. Gamification Twist: Sprite Pets
*   **Assets**: Parse the sprite sheets in `@Sprites/pets/`.
*   **State Machine**: 
    *   *Idle/Wander*: Pets move left and right across the bottom area.
    *   *Small Win Celebration*: Triggered when the ball lands in a >1x slot. One random active pet enters the "jump/celebrate" animation state.
    *   *Big Win Celebration*: Triggered when the ball lands in a high multiplier slot (e.g., outer edges). ALL active pets celebrate simultaneously.
*   **Animation**: Track frames and timers to update the sprite crops drawn to the canvas.

## 6. Implementation Steps
1.  **Step 1: Scaffolding & Layout** - Build the HTML grid structure, place the Canvas and HUD elements.
2.  **Step 2: HUD Logic** - Wire up the HTML inputs to JavaScript state variables (Bet, Lines, Risk, Pet toggles).
3.  **Step 3: Canvas Rendering** - Draw the gradients, the pegs based on "Lines", and the multiplier slots.
4.  **Step 4: Physics Engine** - Implement the ball dropping, gravity, peg collisions, and landing detection.
5.  **Step 5: Multiplier & Payout** - Calculate winnings, update balance, and trigger the pulsing slot animation using `scale`.
6.  **Step 6: Sprite Integration** - Load pet images, implement the walking loop at the bottom, and link the Win states to the celebration animations.
7.  **Step 7: Visual Polish & Receipt** - Add `rotate` and `transform` effects for big wins, and finalize the `toDataURL` download feature.
