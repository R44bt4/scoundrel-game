# Scoundrel - Browser Card Game Design Spec

## Overview

A browser-based implementation of *Scoundrel*, a single-player roguelike card game by Zach Gage and Kurt Bieg. Single self-contained HTML file with pixel art aesthetic and drag-and-drop interaction.

## Tech Stack

- **Single `index.html`** — all HTML, CSS, and JS in one file
- **No dependencies** — vanilla JS, CSS pixel art, pointer events for drag-and-drop
- **No audio** — silent gameplay
- **No tutorial** — jump straight into the game

## Deck Setup

Standard 52-card deck with removals:
- Remove: Jokers, red face cards (Hearts/Diamonds J/Q/K), red Aces (Hearts/Diamonds A)
- Remaining 44 cards: 26 black suit cards (monsters) + 9 Diamonds 2-10 (weapons) + 9 Hearts 2-10 (potions)
- Shuffle and place as the Dungeon

## Card Types

| Suit | Type | Values | Mechanic |
|------|------|--------|----------|
| Clubs, Spades | Monster | 2-10, J=11, Q=12, K=13, A=14 | Subtract damage from health |
| Diamonds | Weapon | 2-10 | Equip to reduce monster damage |
| Hearts | Potion | 2-10 | Heal (cap at 20, max 1 per turn) |

## Game State

```js
state = {
  health: 20,
  dungeon: [],            // shuffled card objects { suit, value, type }
  room: [],               // 0-4 cards currently in the room
  discard: [],            // discarded cards
  weapon: null,           // { suit, value } or null
  weaponLastSlain: null,  // value of last monster killed by equipped weapon (null if unused)
  lastRoomAvoided: false, // prevents two consecutive avoids
  potionUsedThisTurn: false,
  cardsPickedThisTurn: 0, // track 3-of-4 picks per turn
  gameOver: false,
  score: null
}
```

## Visual Design

### Style
- Pixel art aesthetic using CSS (no sprite sheets)
- Google Font `Press Start 2P` for all text
- `image-rendering: pixelated` throughout
- Dark dungeon color palette:
  - Background: #1a1a2e (deep navy)
  - Card backs: #16213e
  - Monsters: dark reds/blacks
  - Weapons: steel blues
  - Potions: pinks/magentas
  - Text: #eee on dark, pixel font

### Screen Layout

```
┌─────────────────────────────────────┐
│  HP 20/20    SCOUNDREL    Deck: 44  │  HUD bar (fixed top)
├─────────────────────────────────────┤
│                                     │
│      [card] [card] [card] [card]    │  The Room (4 cards)
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────┐   ┌──────────────────┐ │
│  │ WEAPON  │   │   DROP ZONES     │ │
│  │  ♦ 5    │   │                  │ │
│  │ slain:  │   │  [fight bare]    │ │
│  │  ♣3 ♠2  │   │  [use weapon]    │ │
│  └─────────┘   │  [equip]         │ │
│                 │  [drink]         │ │
│                 └──────────────────┘ │
├─────────────────────────────────────┤
│  [AVOID ROOM]              Score: 0 │  Action bar (fixed bottom)
└─────────────────────────────────────┘
```

### Card Rendering
- Cards are CSS-styled divs (~80x120px) with pixelated borders
- Suit symbols rendered as simple CSS pixel icons or Unicode (♠♣♦♥)
- Card backs have a pixel pattern for the dungeon deck
- Face-up cards show: value (top-left, bottom-right), large suit symbol (center), card type label

### Weapon Display
- Equipped weapon card shown in a dedicated zone
- Slain monsters stacked on it, staggered vertically so weapon value remains visible
- Shows "Last slain: X" text to indicate the weapon constraint threshold

## Drag & Drop

### Implementation
- Pointer events (`pointerdown`, `pointermove`, `pointerup`) — works on both mouse and touch
- On `pointerdown` on a room card: card follows cursor with slight offset, original position saved
- Drop zones highlight contextually based on the card type being dragged
- On `pointerup` over valid zone: execute action, animate result
- On `pointerup` over nothing: card snaps back to room position

### Drop Zone Rules

| Dragged Card | "Fight Barehanded" | "Use Weapon" | "Equip" | "Drink" |
|---|---|---|---|---|
| Monster | Always valid | Valid if weapon equipped AND (weaponLastSlain is null OR monster value ≤ weaponLastSlain) | Hidden | Hidden |
| Weapon | Hidden | Hidden | Always valid | Hidden |
| Potion | Hidden | Hidden | Hidden | Valid if potionUsedThisTurn is false |

### Visual Feedback
- Valid drop zones: pulse/glow green border when compatible card hovers
- Invalid zones: stay dark or show red X
- Damage taken: red "-6" floats up from health bar
- Healing: green "+4" floats up from health bar
- Card flip: simple 2-frame CSS animation when revealing room cards

## Game Flow

### Turn Sequence

1. **Fill room** — Draw from dungeon with flip animation until room has 4 cards. If a leftover card exists from last turn, draw only 3.
2. **Avoid or Enter decision:**
   - "Avoid Room" button enabled unless `lastRoomAvoided` is true
   - Avoiding: all 4 cards placed at bottom of dungeon, `lastRoomAvoided = true`, go to step 1
   - Entering: `lastRoomAvoided = false`, proceed to step 3
3. **Resolve 3 cards** — Player drags cards one at a time. Progress counter shows "1/3", "2/3", "3/3".
4. **4th card stays** — Remaining card stays face-up, becomes part of next room.
5. **Reset turn state** — `potionUsedThisTurn = false`, `cardsPickedThisTurn = 0`, go to step 1.

### Combat Resolution

**Barehanded:** `health -= monster.value`. Monster goes to discard.

**With weapon:**
- Damage to player: `max(0, monster.value - weapon.value)`
- `health -= damage`
- Monster placed on weapon pile
- `weaponLastSlain = monster.value`
- Weapon can now only slay monsters with value ≤ `weaponLastSlain`

**Weapon constraint:** If weapon has been used (weaponLastSlain is not null) and the new monster's value > weaponLastSlain, the "Use Weapon" drop zone is invalid. Player must fight barehanded or use another card first.

### Equipping Weapons
- New weapon replaces old weapon
- Old weapon + all its slain monsters go to discard
- `weaponLastSlain` resets to null

### Potion Rules
- `health = min(20, health + potion.value)`
- `potionUsedThisTurn = true`
- If a second potion is dragged this turn, the "Drink" zone is hidden and a "Discard" zone appears instead
- Dragging to "Discard" removes the potion with no healing effect
- This still counts as one of the 3 card picks for the turn

### Game End

**Death (health ≤ 0):**
- Game ends immediately when health drops to 0 or below (even mid-room)
- "YOU DIED" screen with pixel art tombstone
- Score = current health (which is 0 or negative from the killing blow) − sum of all remaining monster values in dungeon and unresolved room cards
- Display final negative score

**Victory (dungeon empty, room fully resolved):**
- "VICTORY" screen with pixel art treasure chest
- Score = remaining health
- Bonus: if health == 20 and last card resolved was a potion, score = 20 + potion value
- Display final positive score

**End screen:** Shows score + "Play Again" button.

## Edge Cases

- **Second potion in a turn:** Must be discarded (no healing). Show a "Discard" drop zone instead of "Drink".
- **Dungeon runs out mid-room:** If fewer than needed cards remain to fill a room, draw what's available. If 0 cards remain and no leftover card, game is won.
- **Weapon with no monsters slain:** Can be used on any monster (no constraint yet).
- **Health exactly 0:** Game over — treat as death.
- **Avoid with leftover card:** The leftover card from the previous turn goes with the room to the bottom of the dungeon (all 4 cards are scooped).
