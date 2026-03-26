# RollyRoyal Plinko – 2d arcade theme game

## Project Overview
RollyRoyal Plinko is a physics-based digital Plinko game developed using the HTML5 Canvas API. The system simulates a ball dropping through a grid of pegs, where its trajectory is dynamically calculated using real-time gravity and collision physics. It serves as a technical showcase of 2D coordinate transformations, featuring a arcade-like experience aesthetic built with procedural gradients and interactive animations. A key feature is the "Digital Receipt" system, which uses `toDataURL` to allow users to export their winning moments as image files.

### Core Technologies
- **HTML5:** `index.html` structure with `<canvas>` implementation.
- **CSS3:** Styling for layout and "arcade-like experience" aesthetic (`style/style.css`).
- **JavaScript:** Game logic, physics engine, and Canvas rendering (`script/script.js`).

## Technical Requirements
The project must implement the following specific features and API calls:
- **HTML Canvas:** Primary rendering surface.
- **Canvas Transformations:**
    - `scale`: Used for pulsing animations or UI scaling.
    - `transform`: Used for skewed UI elements or advanced coordinate mapping.
    - `translate`: Used for centering the game board or moving assets.
    - `rotate`: Used for spinning icons or "Jackpot" effects.
- **Visuals:**
    - **Gradient Background:** Must use `createRadialGradient` or `createLinearGradient` for the board and UI.
    - **Animation Loop:** Must use `requestAnimationFrame` for smooth 60FPS rendering.
- **Functionality:**
    - **Game Physics:** Custom engine handling gravity, velocity, and bounce (restitution) for ball-peg collisions.
    - **Data Export:** Must use `toDataURL` to save the game state as an image ("Digital Receipt").

## Directory Structure
- `index.html`: Main entry point.
- `assets/`: Game assets (images, audio).
- `docs/`: Project documentation.
    - `RollyRoyalPlinko.docx` / `.md`: Detailed project scope and objectives.
    - `needed_to_apply.md`: Checklist of technical requirements.
- `script/`: Contains `script.js` (Game Logic).
- `style/`: Contains `style.css` (Styling).

## Development Conventions
- **Physics:** Implement a custom physics loop; do not rely on external physics libraries unless specified.
- **Canvas API:** Directly use the 2D context for drawing; ensure all required transformation methods are utilized at least once.
- **Code Style:** Keep logic in `script.js` and styling in `style.css`.
- **Validation:** Ensure the game runs at 60FPS and the export feature works across modern browsers.

## Team
- 20230335-S Alwyn S. Adriano
- 20230114-S Joshua Paul Colmo
- 20231211-S Renz Geronimo
- 20231193-S Kyle Vincent Madriaga
- 20231193-S John Asher Manit
- 20231193-S Rafael Dominic Leonardo
- 20231193-S John Gabriel Ofiangga

## Approver
- **Ms. Taraya** (Professor, Software Engineering 1)
