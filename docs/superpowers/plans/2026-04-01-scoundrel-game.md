# Scoundrel Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully playable browser-based Scoundrel card game as a single HTML file with pixel art visuals and drag-and-drop interaction.

**Architecture:** Single `index.html` containing all HTML structure, CSS styling, and JavaScript game logic. Game state is a plain JS object. Pointer events drive drag-and-drop. CSS handles pixel art rendering with `Press Start 2P` font and dark dungeon palette.

**Tech Stack:** Vanilla HTML/CSS/JS, Google Fonts (Press Start 2P), pointer events API

**Spec:** `docs/superpowers/specs/2026-04-01-scoundrel-game-design.md`

---

## File Structure

- Create: `index.html` — the entire game (HTML + CSS + JS)

That's it. One file.

---

### Task 1: HTML Skeleton + CSS Pixel Art Theme

**Files:**
- Create: `index.html`

Build the static page structure with the full pixel art CSS theme. No game logic yet — just the visual shell.

- [ ] **Step 1: Create index.html with HTML structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scoundrel</title>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    /* CSS goes here — added in next step */
  </style>
</head>
<body>
  <!-- HUD -->
  <div id="hud">
    <span id="health-display">HP 20/20</span>
    <span id="title">SCOUNDREL</span>
    <span id="deck-display">Deck: 44</span>
  </div>

  <!-- Room -->
  <div id="room-label">THE ROOM</div>
  <div id="room">
    <!-- room cards rendered here by JS -->
  </div>

  <!-- Middle area: weapon + drop zones -->
  <div id="middle">
    <div id="weapon-area">
      <div id="weapon-label">NO WEAPON</div>
      <div id="weapon-slot">
        <!-- equipped weapon + slain pile rendered here -->
      </div>
    </div>
    <div id="drop-zones">
      <!-- drop zone targets rendered here by JS based on dragged card -->
    </div>
  </div>

  <!-- Action bar -->
  <div id="action-bar">
    <button id="avoid-btn" disabled>AVOID ROOM</button>
    <span id="turn-info"></span>
  </div>

  <!-- Game over overlay -->
  <div id="game-over" class="hidden">
    <div id="game-over-content">
      <div id="game-over-title"></div>
      <div id="game-over-art"></div>
      <div id="game-over-score"></div>
      <button id="play-again-btn">PLAY AGAIN</button>
    </div>
  </div>

  <script>
    // JS goes here — added in later tasks
  </script>
</body>
</html>
```

- [ ] **Step 2: Add the full CSS theme inside the `<style>` tag**

Replace the `/* CSS goes here */` comment with:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Press Start 2P', monospace;
  background: #1a1a2e;
  color: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  image-rendering: pixelated;
}

/* HUD */
#hud {
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #16213e;
  border-bottom: 4px solid #0f3460;
  font-size: 10px;
}

#health-display {
  color: #e94560;
}

#title {
  color: #eee;
  font-size: 14px;
  letter-spacing: 2px;
}

#deck-display {
  color: #a8a8a8;
}

/* Room */
#room-label {
  max-width: 700px;
  width: 100%;
  text-align: center;
  font-size: 8px;
  color: #555;
  margin-top: 16px;
  letter-spacing: 2px;
}

#room {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  min-height: 160px;
  align-items: center;
}

/* Cards */
.card {
  width: 80px;
  height: 120px;
  border: 3px solid #333;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: grab;
  position: relative;
  transition: transform 0.1s;
  flex-shrink: 0;
}

.card:hover {
  transform: translateY(-4px);
  border-color: #888;
}

.card.dragging {
  opacity: 0.7;
  cursor: grabbing;
  z-index: 1000;
  position: fixed;
  pointer-events: none;
  transform: rotate(5deg) scale(1.05);
}

.card.monster {
  background: #2d1b1b;
  border-color: #5c2a2a;
}

.card.weapon {
  background: #1b2d3d;
  border-color: #2a4a5c;
}

.card.potion {
  background: #2d1b2d;
  border-color: #5c2a5c;
}

.card .card-value {
  font-size: 14px;
  font-weight: bold;
}

.card .card-suit {
  font-size: 24px;
  margin: 4px 0;
}

.card .card-type {
  font-size: 6px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-back {
  width: 80px;
  height: 120px;
  background: #16213e;
  border: 3px solid #0f3460;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-back::after {
  content: '?';
  font-size: 24px;
  color: #0f3460;
}

/* Card flip animation */
@keyframes card-flip {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}

.card.flipping {
  animation: card-flip 0.3s ease-out;
}

/* Middle area */
#middle {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 8px 16px;
  max-width: 700px;
  width: 100%;
  min-height: 180px;
}

#weapon-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

#weapon-label {
  font-size: 7px;
  color: #555;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

#weapon-slot {
  position: relative;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weapon-card {
  width: 80px;
  height: 120px;
  border: 3px solid #2a4a5c;
  border-radius: 4px;
  background: #1b2d3d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  position: relative;
  z-index: 1;
}

.weapon-card .card-value {
  font-size: 14px;
  font-weight: bold;
}

.weapon-card .card-suit {
  font-size: 24px;
  margin: 4px 0;
}

.slain-monster {
  width: 76px;
  height: 24px;
  border: 2px solid #5c2a2a;
  border-radius: 2px;
  background: #2d1b1b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  margin-top: -4px;
  position: relative;
}

#weapon-constraint {
  font-size: 6px;
  color: #666;
  margin-top: 6px;
  text-align: center;
}

/* Drop zones */
#drop-zones {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  min-width: 180px;
}

.drop-zone {
  padding: 14px 16px;
  border: 3px dashed #333;
  border-radius: 4px;
  text-align: center;
  font-size: 8px;
  color: #555;
  transition: all 0.15s;
  letter-spacing: 1px;
}

.drop-zone.valid {
  border-color: #2a5c2a;
  color: #4a8;
}

.drop-zone.valid.hover {
  border-color: #4a8;
  background: rgba(68, 170, 136, 0.15);
  color: #6fc;
  box-shadow: 0 0 12px rgba(68, 170, 136, 0.3);
}

.drop-zone.invalid {
  border-color: #5c2a2a;
  color: #633;
}

.drop-zone.hidden {
  display: none;
}

/* Action bar */
#action-bar {
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #16213e;
  border-top: 4px solid #0f3460;
  position: fixed;
  bottom: 0;
}

#avoid-btn {
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  padding: 8px 16px;
  background: #0f3460;
  color: #eee;
  border: 3px solid #1a5276;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 1px;
}

#avoid-btn:hover:not(:disabled) {
  background: #1a5276;
  border-color: #2980b9;
}

#avoid-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

#turn-info {
  font-size: 8px;
  color: #888;
}

/* Floating damage/heal numbers */
.float-text {
  position: fixed;
  font-size: 16px;
  font-family: 'Press Start 2P', monospace;
  pointer-events: none;
  z-index: 2000;
  animation: float-up 1s ease-out forwards;
}

.float-text.damage {
  color: #e94560;
}

.float-text.heal {
  color: #4ae945;
}

@keyframes float-up {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-60px); }
}

/* Game over overlay */
#game-over {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
}

#game-over.hidden {
  display: none;
}

#game-over-content {
  text-align: center;
}

#game-over-title {
  font-size: 24px;
  margin-bottom: 24px;
}

#game-over-art {
  font-size: 48px;
  margin-bottom: 24px;
}

#game-over-score {
  font-size: 12px;
  margin-bottom: 32px;
  color: #a8a8a8;
}

#play-again-btn {
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  padding: 12px 24px;
  background: #0f3460;
  color: #eee;
  border: 3px solid #1a5276;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 1px;
}

#play-again-btn:hover {
  background: #1a5276;
  border-color: #2980b9;
}
```

- [ ] **Step 3: Verify the shell renders correctly**

Open `index.html` in a browser. You should see:
- Dark navy background
- HUD bar at top with "HP 20/20 | SCOUNDREL | Deck: 44"
- Empty room area
- "NO WEAPON" label with empty weapon slot
- Empty drop zones area
- Action bar at bottom with grayed-out "AVOID ROOM" button
- All text in pixel font

- [ ] **Step 4: Commit**

```bash
git init
git add index.html
git commit -m "feat: add HTML skeleton with pixel art CSS theme"
```

---

### Task 2: Game State + Deck Building + Card Rendering

**Files:**
- Modify: `index.html` (JS section)

Implement core game state, deck construction, shuffling, and the function that renders a card as a DOM element.

- [ ] **Step 1: Add game state and deck building inside the `<script>` tag**

Replace the `// JS goes here` comment with:

```js
// ============================================
// GAME STATE
// ============================================

const SUITS = {
  CLUBS: '♣', SPADES: '♠', DIAMONDS: '♦', HEARTS: '♥'
};

const FACE_VALUES = { J: 11, Q: 12, K: 13, A: 14 };

function cardValue(card) {
  return typeof card.rank === 'number' ? card.rank : FACE_VALUES[card.rank];
}

function cardLabel(card) {
  return typeof card.rank === 'number' ? String(card.rank) : card.rank;
}

function cardType(card) {
  if (card.suit === SUITS.DIAMONDS) return 'weapon';
  if (card.suit === SUITS.HEARTS) return 'potion';
  return 'monster';
}

function buildDungeon() {
  const cards = [];
  // Black suits: all ranks 2-10, J, Q, K, A
  const blackSuits = [SUITS.CLUBS, SUITS.SPADES];
  const allRanks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
  for (const suit of blackSuits) {
    for (const rank of allRanks) {
      cards.push({ suit, rank });
    }
  }
  // Red suits: only 2-10 (face cards and aces removed)
  const redSuits = [SUITS.DIAMONDS, SUITS.HEARTS];
  const redRanks = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (const suit of redSuits) {
    for (const rank of redRanks) {
      cards.push({ suit, rank });
    }
  }
  return cards;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let state = {};

function initState() {
  state = {
    health: 20,
    dungeon: shuffle(buildDungeon()),
    room: [],
    discard: [],
    weapon: null,
    weaponSlain: [],       // monsters slain by current weapon
    weaponLastSlain: null,  // value of last monster slain by weapon
    lastRoomAvoided: false,
    potionUsedThisTurn: false,
    cardsPickedThisTurn: 0,
    gameOver: false,
    score: null,
    lastCardWasPotion: false,
    lastPotionValue: 0
  };
}
```

- [ ] **Step 2: Add card DOM rendering function**

Append after `initState()`:

```js
// ============================================
// RENDERING
// ============================================

function createCardElement(card) {
  const el = document.createElement('div');
  const type = cardType(card);
  el.className = `card ${type}`;
  el.innerHTML = `
    <div class="card-value">${cardLabel(card)}</div>
    <div class="card-suit">${card.suit}</div>
    <div class="card-type">${type}</div>
  `;
  el.dataset.suit = card.suit;
  el.dataset.rank = card.rank;
  el.dataset.type = type;
  return el;
}

function render() {
  // HUD
  document.getElementById('health-display').textContent = `HP ${state.health}/20`;
  document.getElementById('deck-display').textContent = `Deck: ${state.dungeon.length}`;

  // Room
  const roomEl = document.getElementById('room');
  roomEl.innerHTML = '';
  for (const card of state.room) {
    const el = createCardElement(card);
    roomEl.appendChild(el);
  }

  // Weapon area
  const weaponSlot = document.getElementById('weapon-slot');
  const weaponLabel = document.getElementById('weapon-label');
  weaponSlot.innerHTML = '';
  if (state.weapon) {
    weaponLabel.textContent = 'WEAPON';
    const wEl = document.createElement('div');
    wEl.className = 'weapon-card';
    wEl.innerHTML = `
      <div class="card-value">${cardLabel(state.weapon)}</div>
      <div class="card-suit">${state.weapon.suit}</div>
    `;
    weaponSlot.appendChild(wEl);
    for (const slain of state.weaponSlain) {
      const sEl = document.createElement('div');
      sEl.className = 'slain-monster';
      sEl.textContent = `${slain.suit}${cardLabel(slain)}`;
      weaponSlot.appendChild(sEl);
    }
    if (state.weaponLastSlain !== null) {
      const cEl = document.createElement('div');
      cEl.id = 'weapon-constraint';
      cEl.textContent = `MAX: ${state.weaponLastSlain}`;
      weaponSlot.appendChild(cEl);
    }
  } else {
    weaponLabel.textContent = 'NO WEAPON';
  }

  // Turn info
  const turnInfo = document.getElementById('turn-info');
  if (state.room.length > 0 && state.cardsPickedThisTurn < 3) {
    turnInfo.textContent = `${state.cardsPickedThisTurn}/3`;
  } else {
    turnInfo.textContent = '';
  }

  // Avoid button
  const avoidBtn = document.getElementById('avoid-btn');
  avoidBtn.disabled = state.lastRoomAvoided || state.cardsPickedThisTurn > 0 || state.room.length === 0 || state.gameOver;
}
```

- [ ] **Step 3: Add init call and verify**

Append after the `render()` function:

```js
// ============================================
// INIT
// ============================================

function startGame() {
  initState();
  document.getElementById('game-over').classList.add('hidden');
  render();
}

startGame();
```

Open in browser. You should see the HUD with "HP 20/20" and "Deck: 44", empty room, no weapon. The game state is initialized but no cards are dealt yet.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add game state, deck building, and card rendering"
```

---

### Task 3: Room Dealing + Card Flip Animation

**Files:**
- Modify: `index.html` (JS section)

Deal 4 cards from the dungeon into the room with a flip animation, and start the first turn automatically.

- [ ] **Step 1: Add the dealRoom function**

Add before `startGame()`:

```js
// ============================================
// GAME FLOW
// ============================================

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealRoom() {
  const needed = 4 - state.room.length;
  for (let i = 0; i < needed; i++) {
    if (state.dungeon.length === 0) break;
    const card = state.dungeon.pop();
    state.room.push(card);
    render();
    // Animate the last added card
    const roomEl = document.getElementById('room');
    const lastCard = roomEl.lastElementChild;
    lastCard.classList.add('flipping');
    await delay(200);
  }
  render();
  updateDropZones(null);
}
```

- [ ] **Step 2: Add placeholder updateDropZones function**

Add after `dealRoom()`:

```js
function updateDropZones(draggedCard) {
  const dropZones = document.getElementById('drop-zones');
  dropZones.innerHTML = '';
  if (!draggedCard) {
    // Show empty state
    const placeholder = document.createElement('div');
    placeholder.className = 'drop-zone';
    placeholder.textContent = 'DRAG A CARD';
    dropZones.appendChild(placeholder);
    return;
  }
  // Populated in Task 5
}
```

- [ ] **Step 3: Call dealRoom from startGame**

Update `startGame()`:

```js
function startGame() {
  initState();
  document.getElementById('game-over').classList.add('hidden');
  render();
  dealRoom();
}
```

- [ ] **Step 4: Verify**

Open in browser. Four cards should appear in the room with a quick flip animation, each appearing one after another. Cards show their value, suit symbol, and type label (monster/weapon/potion) with appropriate background colors.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add room dealing with card flip animation"
```

---

### Task 4: Drag and Drop System

**Files:**
- Modify: `index.html` (JS section)

Implement pointer-event-based drag and drop. Cards can be picked up from the room and dragged around. Drop zones appear based on card type.

- [ ] **Step 1: Add drag state and pointer event handlers**

Add after `updateDropZones()`:

```js
// ============================================
// DRAG AND DROP
// ============================================

let dragState = null; // { card, cardIndex, element, offsetX, offsetY, originalRect }

function onPointerDown(e) {
  if (state.gameOver) return;
  const cardEl = e.target.closest('.card');
  if (!cardEl || !cardEl.parentElement || cardEl.parentElement.id !== 'room') return;

  const cardIndex = Array.from(cardEl.parentElement.children).indexOf(cardEl);
  const card = state.room[cardIndex];
  const rect = cardEl.getBoundingClientRect();

  // Create a floating copy
  const clone = cardEl.cloneNode(true);
  clone.classList.add('dragging');
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.style.left = rect.left + 'px';
  clone.style.top = rect.top + 'px';
  document.body.appendChild(clone);

  // Hide original
  cardEl.style.visibility = 'hidden';

  dragState = {
    card,
    cardIndex,
    originalEl: cardEl,
    element: clone,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top
  };

  updateDropZones(card);
  e.preventDefault();
}

function onPointerMove(e) {
  if (!dragState) return;
  dragState.element.style.left = (e.clientX - dragState.offsetX) + 'px';
  dragState.element.style.top = (e.clientY - dragState.offsetY) + 'px';

  // Check hover over drop zones
  const zones = document.querySelectorAll('.drop-zone.valid');
  for (const zone of zones) {
    const rect = zone.getBoundingClientRect();
    const over = e.clientX >= rect.left && e.clientX <= rect.right &&
                 e.clientY >= rect.top && e.clientY <= rect.bottom;
    zone.classList.toggle('hover', over);
  }
  e.preventDefault();
}

function onPointerUp(e) {
  if (!dragState) return;

  // Check if dropped on a valid zone
  const zones = document.querySelectorAll('.drop-zone.valid');
  let dropped = false;
  for (const zone of zones) {
    const rect = zone.getBoundingClientRect();
    const over = e.clientX >= rect.left && e.clientX <= rect.right &&
                 e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (over) {
      handleDrop(dragState.card, dragState.cardIndex, zone.dataset.action);
      dropped = true;
      break;
    }
  }

  // Clean up
  dragState.element.remove();
  if (!dropped) {
    dragState.originalEl.style.visibility = 'visible';
  }
  dragState = null;
  updateDropZones(null);
  e.preventDefault();
}

document.addEventListener('pointerdown', onPointerDown);
document.addEventListener('pointermove', onPointerMove);
document.addEventListener('pointerup', onPointerUp);
```

- [ ] **Step 2: Add the handleDrop placeholder**

Add after the event listeners:

```js
function handleDrop(card, cardIndex, action) {
  // Implemented in Task 5
  console.log('Drop:', cardLabel(card), card.suit, '->', action);
}
```

- [ ] **Step 3: Verify**

Open in browser. You should be able to:
- Click and drag room cards (they follow the cursor with a slight rotation)
- See the "DRAG A CARD" placeholder in drop zones
- Release over nothing — card snaps back to its room position
- The original card hides while dragging and reappears on snap-back

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add pointer-event drag and drop system"
```

---

### Task 5: Drop Zones + Action Logic

**Files:**
- Modify: `index.html` (JS section)

Make drop zones context-sensitive and implement all card actions: fight barehanded, fight with weapon, equip weapon, drink potion, discard potion.

- [ ] **Step 1: Implement full updateDropZones**

Replace the `updateDropZones` function:

```js
function updateDropZones(draggedCard) {
  const dropZones = document.getElementById('drop-zones');
  dropZones.innerHTML = '';

  if (!draggedCard) {
    const placeholder = document.createElement('div');
    placeholder.className = 'drop-zone';
    placeholder.textContent = 'DRAG A CARD';
    dropZones.appendChild(placeholder);
    return;
  }

  const type = cardType(draggedCard);
  const val = cardValue(draggedCard);

  if (type === 'monster') {
    // Fight barehanded — always available
    const bareZone = document.createElement('div');
    bareZone.className = 'drop-zone valid';
    bareZone.dataset.action = 'fight-bare';
    bareZone.textContent = `FIGHT BARE (-${val} HP)`;
    dropZones.appendChild(bareZone);

    // Fight with weapon — available if weapon equipped and constraint met
    if (state.weapon) {
      const canUse = state.weaponLastSlain === null || val <= state.weaponLastSlain;
      const weaponVal = cardValue(state.weapon);
      const dmg = Math.max(0, val - weaponVal);
      const wepZone = document.createElement('div');
      wepZone.dataset.action = 'fight-weapon';
      if (canUse) {
        wepZone.className = 'drop-zone valid';
        wepZone.textContent = dmg > 0 ? `USE WEAPON (-${dmg} HP)` : `USE WEAPON (NO DMG)`;
      } else {
        wepZone.className = 'drop-zone invalid';
        wepZone.textContent = `WEAPON (TOO STRONG)`;
      }
      dropZones.appendChild(wepZone);
    }
  } else if (type === 'weapon') {
    const equipZone = document.createElement('div');
    equipZone.className = 'drop-zone valid';
    equipZone.dataset.action = 'equip';
    equipZone.textContent = 'EQUIP WEAPON';
    dropZones.appendChild(equipZone);
  } else if (type === 'potion') {
    if (state.potionUsedThisTurn) {
      const discardZone = document.createElement('div');
      discardZone.className = 'drop-zone valid';
      discardZone.dataset.action = 'discard-potion';
      discardZone.textContent = 'DISCARD (ALREADY HEALED)';
      dropZones.appendChild(discardZone);
    } else {
      const heal = Math.min(val, 20 - state.health);
      const drinkZone = document.createElement('div');
      drinkZone.className = 'drop-zone valid';
      drinkZone.dataset.action = 'drink';
      drinkZone.textContent = heal > 0 ? `DRINK (+${heal} HP)` : 'DRINK (HP FULL)';
      dropZones.appendChild(drinkZone);
    }
  }
}
```

- [ ] **Step 2: Implement handleDrop with all actions**

Replace the `handleDrop` placeholder:

```js
function handleDrop(card, cardIndex, action) {
  // Remove card from room
  state.room.splice(cardIndex, 1);
  state.cardsPickedThisTurn++;
  state.lastCardWasPotion = false;

  switch (action) {
    case 'fight-bare': {
      state.health -= cardValue(card);
      state.discard.push(card);
      showFloatText(`-${cardValue(card)}`, 'damage');
      break;
    }
    case 'fight-weapon': {
      const dmg = Math.max(0, cardValue(card) - cardValue(state.weapon));
      if (dmg > 0) {
        state.health -= dmg;
        showFloatText(`-${dmg}`, 'damage');
      }
      state.weaponSlain.push(card);
      state.weaponLastSlain = cardValue(card);
      break;
    }
    case 'equip': {
      // Discard old weapon + slain pile
      if (state.weapon) {
        state.discard.push(state.weapon);
        state.discard.push(...state.weaponSlain);
      }
      state.weapon = card;
      state.weaponSlain = [];
      state.weaponLastSlain = null;
      break;
    }
    case 'drink': {
      const heal = Math.min(cardValue(card), 20 - state.health);
      state.health += heal;
      state.potionUsedThisTurn = true;
      state.discard.push(card);
      state.lastCardWasPotion = true;
      state.lastPotionValue = cardValue(card);
      if (heal > 0) showFloatText(`+${heal}`, 'heal');
      break;
    }
    case 'discard-potion': {
      state.discard.push(card);
      break;
    }
  }

  // Check death
  if (state.health <= 0) {
    endGame(false);
    return;
  }

  // Check if turn is complete (picked 3 cards, 1 remains)
  if (state.cardsPickedThisTurn >= 3) {
    endTurn();
    return;
  }

  render();
}
```

- [ ] **Step 3: Add floating text function**

Add after `handleDrop`:

```js
function showFloatText(text, type) {
  const el = document.createElement('div');
  el.className = `float-text ${type}`;
  el.textContent = text;
  // Position near health display
  const hud = document.getElementById('health-display');
  const rect = hud.getBoundingClientRect();
  el.style.left = rect.left + 'px';
  el.style.top = (rect.bottom + 8) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
```

- [ ] **Step 4: Verify**

Open in browser. You should be able to:
- Drag a monster → see "FIGHT BARE" and (if weapon equipped) "USE WEAPON" zones
- Drag a weapon → see "EQUIP WEAPON" zone
- Drag a potion → see "DRINK" zone (or "DISCARD" if already used a potion)
- Drop on valid zones → card is consumed, health/weapon updates, floating text appears
- Drop zones glow green on hover
- HUD updates after each action

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add context-sensitive drop zones and card action logic"
```

---

### Task 6: Turn Flow + Avoid Room

**Files:**
- Modify: `index.html` (JS section)

Implement end-of-turn logic (leftover card stays, deal new room), the Avoid Room button, and the check for dungeon completion.

- [ ] **Step 1: Implement endTurn and avoid room**

Add after `showFloatText`:

```js
async function endTurn() {
  // The one remaining card stays in the room for next turn
  state.potionUsedThisTurn = false;
  state.cardsPickedThisTurn = 0;

  // Check if dungeon is empty and room will be empty after this
  if (state.dungeon.length === 0 && state.room.length === 0) {
    endGame(true);
    return;
  }

  render();
  await delay(400);
  await dealRoom();

  // Check if dungeon is empty and room has cards — this is the last room
  render();
}

function avoidRoom() {
  if (state.lastRoomAvoided || state.cardsPickedThisTurn > 0) return;

  // Put all room cards at bottom of dungeon
  state.dungeon.unshift(...state.room);
  state.room = [];
  state.lastRoomAvoided = true;
  state.potionUsedThisTurn = false;
  state.cardsPickedThisTurn = 0;

  render();
  dealRoom();
}
```

- [ ] **Step 2: Wire up the avoid button and update dealRoom for lastRoomAvoided**

Add after `startGame()`:

```js
document.getElementById('avoid-btn').addEventListener('click', avoidRoom);
document.getElementById('play-again-btn').addEventListener('click', startGame);
```

Also, update `handleDrop` — add this line at the top of the function (after the opening brace, before `state.room.splice`):

Find this in `handleDrop`:
```js
function handleDrop(card, cardIndex, action) {
  // Remove card from room
  state.room.splice(cardIndex, 1);
```

Replace with:
```js
function handleDrop(card, cardIndex, action) {
  // Once a card is played, this room is entered (can't avoid)
  state.lastRoomAvoided = false;
  // Remove card from room
  state.room.splice(cardIndex, 1);
```

- [ ] **Step 3: Verify**

Open in browser. Test the full turn flow:
1. Four cards dealt → pick 3 by dragging → 4th stays → 3 new cards dealt to fill room
2. Click "AVOID ROOM" → cards go away, new 4 dealt, button becomes disabled
3. Enter next room → button re-enables for the room after that
4. Cannot avoid two rooms in a row

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add turn flow, avoid room, and end-of-turn dealing"
```

---

### Task 7: Game Over + Scoring

**Files:**
- Modify: `index.html` (JS section)

Implement game end detection, scoring, and the game-over overlay.

- [ ] **Step 1: Implement endGame**

Add after `avoidRoom()`:

```js
function endGame(victory) {
  state.gameOver = true;

  if (victory) {
    // Score = remaining health
    state.score = state.health;
    // Bonus: if health is 20 and last card was a potion
    if (state.health === 20 && state.lastCardWasPotion) {
      state.score = 20 + state.lastPotionValue;
    }
    document.getElementById('game-over-title').textContent = 'VICTORY';
    document.getElementById('game-over-title').style.color = '#4ae945';
    document.getElementById('game-over-art').textContent = '👑';
    document.getElementById('game-over-score').textContent = `SCORE: ${state.score}`;
  } else {
    // Death: score = health - remaining monsters in dungeon and room
    let remainingMonsters = 0;
    for (const card of state.dungeon) {
      if (cardType(card) === 'monster') {
        remainingMonsters += cardValue(card);
      }
    }
    for (const card of state.room) {
      if (cardType(card) === 'monster') {
        remainingMonsters += cardValue(card);
      }
    }
    state.score = state.health - remainingMonsters;
    document.getElementById('game-over-title').textContent = 'YOU DIED';
    document.getElementById('game-over-title').style.color = '#e94560';
    document.getElementById('game-over-art').textContent = '💀';
    document.getElementById('game-over-score').textContent = `SCORE: ${state.score}`;
  }

  render();
  document.getElementById('game-over').classList.remove('hidden');
}
```

- [ ] **Step 2: Update endTurn to check for victory when dungeon is empty**

Replace the `endTurn` function:

```js
async function endTurn() {
  state.potionUsedThisTurn = false;
  state.cardsPickedThisTurn = 0;

  // If dungeon is empty and no cards left in room, victory
  if (state.dungeon.length === 0 && state.room.length === 0) {
    endGame(true);
    return;
  }

  // If dungeon is empty but leftover card remains, deal what we can
  // (room will have 1-4 cards depending on what's left)
  render();
  await delay(400);
  await dealRoom();

  // If after dealing, dungeon is empty and room has cards, this is the last room
  // Player must still resolve it normally
  render();
}
```

- [ ] **Step 3: Handle the final room edge case**

When the room has fewer than 4 cards (because the dungeon ran out), the player must still pick all-but-one (or all if only 1 card). Update the card-pick check in `handleDrop`. Find:

```js
  // Check if turn is complete (picked 3 cards, 1 remains)
  if (state.cardsPickedThisTurn >= 3) {
```

Replace with:

```js
  // Turn complete when only 1 card remains (normally 3 picks, fewer if short room)
  if (state.room.length <= 1) {
    // If room has 1 card left, turn ends. If room is empty (was a short room), also ends.
    if (state.room.length === 0 && state.dungeon.length === 0) {
      endGame(true);
      return;
    }
```

Actually, this gets complex. Let me reconsider. The original rule says pick 3 of 4, leave 1. But if the room has fewer than 4 cards (end of dungeon), the player picks all but 1 — or if only 1 card remains in room, the turn is done. Replace the turn completion check in `handleDrop`:

Find in `handleDrop`:
```js
  // Check if turn is complete (picked 3 cards, 1 remains)
  if (state.cardsPickedThisTurn >= 3) {
    endTurn();
    return;
  }
```

Replace with:
```js
  // Turn complete when 1 card remains in room (or 0 if room started with 1)
  if (state.room.length <= 1) {
    if (state.room.length === 0 && state.dungeon.length === 0) {
      // No cards left anywhere — victory
      endGame(true);
    } else {
      endTurn();
    }
    return;
  }
```

- [ ] **Step 4: Verify**

Test these scenarios:
1. **Death:** Fight strong monsters barehanded until HP hits 0 → "YOU DIED" overlay with negative score
2. **Play Again:** Click "PLAY AGAIN" → fresh game starts
3. **Score display:** Negative score includes remaining dungeon monsters

Full victory is hard to test quickly, but the logic is in place.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add game over screens, scoring, and victory/death detection"
```

---

### Task 8: Polish + Final Room Handling + Edge Cases

**Files:**
- Modify: `index.html` (JS section)

Handle remaining edge cases: weapon constraint display clarity, avoid button during short rooms, and final room with fewer than 4 cards.

- [ ] **Step 1: Disable avoid for short rooms and when cards have been picked**

The avoid button logic is already in `render()`. Verify it covers:
- Disabled when `lastRoomAvoided` is true
- Disabled when `cardsPickedThisTurn > 0`
- Disabled when room is empty
- Disabled when game is over

This should already work from the existing code. No changes needed.

- [ ] **Step 2: Add touch support — prevent scrolling during drag**

Add this to the CSS inside the `<style>` tag, after the `body` styles:

```css
body {
  touch-action: none;
}
```

Update the existing `body` CSS rule to include `touch-action: none` (merge it into the existing rule rather than duplicating).

- [ ] **Step 3: Prevent dragging during deal animation**

Add a flag to prevent interaction while cards are being dealt. In `dealRoom`, set a flag:

Find in `dealRoom`:
```js
async function dealRoom() {
  const needed = 4 - state.room.length;
```

Replace with:
```js
async function dealRoom() {
  state.dealing = true;
  const needed = 4 - state.room.length;
```

Find at the end of `dealRoom`:
```js
  render();
  updateDropZones(null);
}
```

Replace with:
```js
  state.dealing = false;
  render();
  updateDropZones(null);
}
```

Add the guard at the top of `onPointerDown`:

Find:
```js
function onPointerDown(e) {
  if (state.gameOver) return;
```

Replace with:
```js
function onPointerDown(e) {
  if (state.gameOver || state.dealing) return;
```

- [ ] **Step 4: Add dealing flag to initState**

Find in `initState`:
```js
    lastPotionValue: 0
  };
```

Replace with:
```js
    lastPotionValue: 0,
    dealing: false
  };
```

- [ ] **Step 5: Verify all edge cases**

Test:
1. Can't drag cards while they're being dealt (flip animation)
2. Can't avoid room after picking a card
3. Can't avoid two rooms in a row
4. Weapon shows "MAX: X" constraint after slaying a monster
5. Weapon drop zone shows "TOO STRONG" for monsters above the constraint
6. Second potion shows "DISCARD" instead of "DRINK"
7. Touch/mobile: cards can be dragged without page scrolling

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add touch support, dealing lock, and edge case handling"
```

---

### Task 9: Visual Polish + Pixel Art End Screens

**Files:**
- Modify: `index.html` (CSS + JS sections)

Replace emoji end screen art with CSS pixel art and add final visual polish.

- [ ] **Step 1: Replace emoji with CSS pixel art for death/victory screens**

Add to the CSS:

```css
/* Pixel art tombstone */
.pixel-tombstone {
  display: inline-block;
  width: 64px;
  height: 80px;
  position: relative;
  margin: 0 auto;
}

.pixel-tombstone::before {
  content: '';
  display: block;
  width: 48px;
  height: 56px;
  background: #555;
  border-radius: 24px 24px 0 0;
  margin: 0 auto;
  box-shadow: inset 0 0 0 4px #444;
}

.pixel-tombstone::after {
  content: 'RIP';
  display: block;
  width: 48px;
  text-align: center;
  font-size: 10px;
  color: #333;
  margin: -36px auto 0;
  position: relative;
}

/* Pixel art treasure chest */
.pixel-chest {
  display: inline-block;
  width: 64px;
  height: 56px;
  position: relative;
  margin: 0 auto;
}

.pixel-chest::before {
  content: '';
  display: block;
  width: 64px;
  height: 32px;
  background: #8B4513;
  border-radius: 4px 4px 0 0;
  box-shadow: inset 0 -4px 0 #654321;
}

.pixel-chest::after {
  content: '';
  display: block;
  width: 64px;
  height: 24px;
  background: #A0522D;
  border-radius: 0 0 4px 4px;
  box-shadow: inset 0 4px 0 #654321;
}
```

- [ ] **Step 2: Update endGame to use pixel art divs**

In the `endGame` function, replace the emoji lines.

Find (in victory branch):
```js
    document.getElementById('game-over-art').textContent = '👑';
```

Replace with:
```js
    document.getElementById('game-over-art').innerHTML = '<div class="pixel-chest"></div>';
```

Find (in death branch):
```js
    document.getElementById('game-over-art').textContent = '💀';
```

Replace with:
```js
    document.getElementById('game-over-art').innerHTML = '<div class="pixel-tombstone"></div>';
```

- [ ] **Step 3: Add a subtle card glow for different types**

Add to CSS:

```css
.card.monster { box-shadow: 0 0 8px rgba(233, 69, 96, 0.2); }
.card.weapon { box-shadow: 0 0 8px rgba(42, 74, 92, 0.3); }
.card.potion { box-shadow: 0 0 8px rgba(92, 42, 92, 0.3); }
```

- [ ] **Step 4: Verify**

Open in browser:
- Death screen shows a CSS pixel tombstone with "RIP" instead of an emoji
- Victory screen shows a CSS pixel treasure chest
- Cards have subtle colored glows matching their type

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add CSS pixel art end screens and card glow effects"
```

---

### Task 10: Final Integration Test + README

**Files:**
- Modify: `index.html` (if any bugs found)

Play through the complete game to verify all mechanics work together.

- [ ] **Step 1: Full playthrough test**

Open `index.html` in browser. Play a complete game and verify:

1. **Deck:** 44 cards total (26 monsters + 9 weapons + 9 potions)
2. **Room dealing:** 4 cards appear with flip animation
3. **Card dragging:** Smooth drag with rotation, snap-back on invalid drop
4. **Monster — barehanded:** Full damage subtracted, floating red number
5. **Monster — with weapon:** Reduced damage, monster stacks on weapon pile
6. **Weapon constraint:** After slaying, weapon shows MAX value, blocks stronger monsters
7. **Weapon replacement:** Old weapon + slain pile discarded
8. **Potion healing:** Heals up to 20, shows floating green number
9. **Second potion:** Shows "DISCARD" zone, no healing
10. **Avoid room:** Works, disabled after use, re-enables after entering next room
11. **Leftover card:** 4th card stays, next room draws 3 more
12. **Death:** Game ends immediately at 0 HP, shows score with remaining monsters
13. **Victory:** Complete dungeon, shows positive score
14. **Play Again:** Resets everything, fresh game

- [ ] **Step 2: Fix any bugs found during playthrough**

Address anything broken. Common issues to watch for:
- Cards not snapping back correctly after invalid drop
- Weapon constraint not updating properly
- Score calculation off
- Avoid button state not resetting properly

- [ ] **Step 3: Final commit**

```bash
git add index.html
git commit -m "fix: address any issues found during integration testing"
```

(Skip this commit if no bugs were found.)
