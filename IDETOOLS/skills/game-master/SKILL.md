---
name: game-master
description: >
  Comprehensive game development guide covering design, art pipelines,
  audio, gameplay mechanics, and development workflows.
  Consolidates 5 game development skills.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task, AskUserQuestion
context: fork
---

# ©2026 Brad Scheller

# Game Master Skill

Comprehensive game development guide covering design principles, architecture patterns, art pipelines, audio implementation, engine selection, and shipping workflows.

## When to Use

Invoke this skill when:
- User says "build a game", "game development", "create a game"
- Designing gameplay mechanics, core loops, or progression systems
- Implementing game architecture (ECS, state machines, event systems)
- Setting up game art pipelines (sprites, animations, tilesets)
- Integrating audio (sound effects, music, spatial audio)
- Choosing between game engines (Unity, Godot, Phaser, Pygame)
- Developing web-based games (Canvas, WebGL, React game patterns)
- Prototyping, playtesting, or shipping a game

## Game Design Fundamentals

### Core Loop

The **core loop** is the primary cycle of actions players repeat:
```
Action → Feedback → Reward → Action
```

Examples:
- **Platformer:** Jump → Land → Collect coin → Jump again
- **Shooter:** Aim → Shoot → Enemy defeated → Aim at next target
- **Puzzle:** Observe → Solve → Progress → Next puzzle

Design checklist:
- Loop duration: 3-30 seconds (short loops = addictive, long loops = strategic)
- Clear feedback for every action (visual, audio, haptic)
- Escalating challenge (introduce new mechanics every 5-10 minutes)
- Meaningful rewards (progression, unlocks, cosmetics, story beats)

### Player Motivation

**Bartle's Taxonomy:**
- **Achievers** — completion, mastery, leaderboards
- **Explorers** — discovery, secrets, lore
- **Socializers** — cooperation, guilds, chat
- **Killers** — competition, PvP, dominance

Design for 1-2 primary motivations, support others secondarily.

**Flow State:**
```
Challenge
   ↑
   |    FLOW ZONE
   |   (engagement)
   |
   +----------→ Skill
```

- Too easy + high skill = boredom
- Too hard + low skill = anxiety
- Match challenge to skill = flow

### Difficulty Curves

**Good curve:**
```
Difficulty
   ↑     ___/¯¯
   |    /
   |   /
   +--------→ Time
   Tutorial   Ramp   Plateau
```

**Bad curve (difficulty spike):**
```
Difficulty
   ↑        /|
   |       / |
   |  ____/  |
   +----------→ Time
```

Techniques:
- **Tutorial:** 0-5 minutes, introduce one mechanic at a time
- **Ramp:** Gradual increase, checkpoint every 5-10 minutes
- **Plateau:** Breathing room after boss/challenge
- **Dynamic difficulty:** Adjust based on player performance (e.g., Left 4 Dead's AI Director)

### Game Feel

**"Juice"** — exaggerated feedback that makes actions satisfying:
- **Camera shake** on impact
- **Particle effects** (sparks, explosions, dust)
- **Screen flash** for critical hits
- **Slow-motion** on special moves
- **Sound effects** layered (whoosh + impact + echo)
- **Animation squash/stretch** on landing

Implementation:
```javascript
// Example: Camera shake on hit
function cameraShake(intensity, duration) {
  const originalPos = camera.position.clone();
  const shakeInterval = setInterval(() => {
    camera.position.x = originalPos.x + Math.random() * intensity - intensity/2;
    camera.position.y = originalPos.y + Math.random() * intensity - intensity/2;
  }, 16); // ~60fps

  setTimeout(() => {
    clearInterval(shakeInterval);
    camera.position.copy(originalPos);
  }, duration);
}
```

**Feel checklist:**
- Input lag < 100ms (< 50ms ideal)
- Animations telegraph actions (windup before attack)
- Feedback precedes consequence (muzzle flash before bullet spawn)
- Audio-visual synchronization (hit sound plays on impact frame)

## Game Architecture

### Entity Component System (ECS)

**Pattern:** Decouple data (components) from logic (systems).

```javascript
// Component (pure data)
class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Velocity {
  constructor(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }
}

// Entity (ID + component bag)
class Entity {
  constructor(id) {
    this.id = id;
    this.components = new Map();
  }

  addComponent(component) {
    this.components.set(component.constructor.name, component);
  }

  getComponent(type) {
    return this.components.get(type.name);
  }
}

// System (operates on entities with specific components)
class MovementSystem {
  update(entities, deltaTime) {
    for (const entity of entities) {
      const pos = entity.getComponent(Position);
      const vel = entity.getComponent(Velocity);

      if (pos && vel) {
        pos.x += vel.dx * deltaTime;
        pos.y += vel.dy * deltaTime;
      }
    }
  }
}
```

**Benefits:**
- Add/remove behaviors at runtime (add Health component → entity becomes damageable)
- Systems run in parallel (rendering system separate from physics)
- Data-oriented design (cache-friendly iteration)

### Game Loop

**Fixed timestep with interpolation:**
```javascript
const FIXED_TIMESTEP = 1000 / 60; // 60 updates/sec
let accumulator = 0;
let lastTime = performance.now();

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  // Physics updates at fixed rate
  while (accumulator >= FIXED_TIMESTEP) {
    updatePhysics(FIXED_TIMESTEP);
    accumulator -= FIXED_TIMESTEP;
  }

  // Rendering interpolates between frames
  const alpha = accumulator / FIXED_TIMESTEP;
  render(alpha);

  requestAnimationFrame(gameLoop);
}
```

**Why fixed timestep:**
- Physics deterministic (same input → same output)
- No jitter on variable frame rates
- Networked games stay synchronized

### State Machines

**Finite State Machine for enemy AI:**
```javascript
class EnemyAI {
  constructor() {
    this.state = 'patrol';
    this.states = {
      patrol: {
        enter: () => this.setRoute(this.patrolPath),
        update: () => {
          if (this.playerInRange(10)) this.changeState('chase');
        },
        exit: () => this.stopMoving()
      },
      chase: {
        enter: () => this.playSound('alert'),
        update: () => {
          this.moveTowards(player.position);
          if (!this.playerInRange(15)) this.changeState('patrol');
          if (this.playerInRange(2)) this.changeState('attack');
        }
      },
      attack: {
        enter: () => this.startAttackAnimation(),
        update: () => {
          if (this.attackFinished()) this.changeState('chase');
        }
      }
    };
  }

  changeState(newState) {
    this.states[this.state].exit?.();
    this.state = newState;
    this.states[this.state].enter?.();
  }

  update() {
    this.states[this.state].update();
  }
}
```

### Event Systems

**Decoupled event bus:**
```javascript
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }
}

// Usage
const events = new EventBus();
events.on('player:death', (data) => {
  showGameOverScreen();
  saveHighScore(data.score);
});

events.emit('player:death', { score: 12500 });
```

## Game Art Pipeline

### Sprite Management

**Asset organization:**
```
assets/
├── sprites/
│   ├── characters/
│   │   ├── player-idle.png (32×32)
│   │   ├── player-walk-sheet.png (256×32, 8 frames)
│   │   └── player-attack-sheet.png (160×32, 5 frames)
│   ├── enemies/
│   └── items/
├── tilesets/
│   ├── dungeon-tiles.png (256×256, 16×16 tiles)
│   └── tilemap.json (Tiled editor export)
└── ui/
    ├── hud-hearts.png
    └── buttons-atlas.png
```

**Sprite sheet format:**
- Fixed frame size (e.g., 32×32 per frame)
- Power-of-two dimensions for GPU (32, 64, 128, 256, 512, 1024)
- Transparent background (PNG with alpha)
- Consistent padding between frames (1-2px)

### Animation

**Frame-based animation:**
```javascript
class SpriteAnimation {
  constructor(spriteSheet, frameWidth, frameHeight, frameCount, fps) {
    this.sheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameCount = frameCount;
    this.frameDuration = 1000 / fps;
    this.currentFrame = 0;
    this.elapsed = 0;
  }

  update(deltaTime) {
    this.elapsed += deltaTime;
    if (this.elapsed >= this.frameDuration) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.elapsed = 0;
    }
  }

  draw(ctx, x, y) {
    const sx = this.currentFrame * this.frameWidth;
    ctx.drawImage(this.sheet, sx, 0, this.frameWidth, this.frameHeight, x, y, this.frameWidth, this.frameHeight);
  }
}
```

**Animation principles:**
- **Squash and stretch** — compress on landing, stretch on jump
- **Anticipation** — windup before action
- **Follow-through** — hair/cape continues moving after body stops
- **Easing** — slow in/out (not linear)

### Tilesets & Tilemaps

**Tileset rules:**
- 16×16 or 32×32 base tile size
- Include corner pieces, edges, and interiors
- Design for seamless tiling (edges match)
- Use autotiling rules (Tiled, Godot TileMap)

**Tilemap workflow:**
1. Design tileset in Aseprite/Photoshop
2. Export as sprite sheet
3. Import to Tiled (https://www.mapeditor.org)
4. Paint map, add collision layers
5. Export as JSON
6. Load JSON in game engine

### Asset Optimization

**File size reduction:**
- Use indexed color (PNG-8) for pixel art (256 colors max)
- Compress with TinyPNG or pngquant
- Sprite atlasing (pack multiple sprites into one texture)
- Lazy load assets (don't load entire game on startup)

**Texture atlasing:**
```javascript
// TexturePacker or ShoeBox output
{
  "frames": {
    "player-idle.png": { "x": 0, "y": 0, "w": 32, "h": 32 },
    "player-walk-0.png": { "x": 32, "y": 0, "w": 32, "h": 32 }
  },
  "meta": { "image": "atlas.png" }
}
```

### Pixel Art Basics

**Constraints:**
- Limited palette (8-64 colors)
- No anti-aliasing (or manual AA with dithering)
- Pixel-perfect positioning (avoid subpixel coords)

**Techniques:**
- **Dithering** — checkerboard pattern for gradients
- **Hue shifting** — shadows shift towards blue/purple, highlights towards yellow
- **Outlines** — 1px black outline for clarity (optional)

**Canvas scaling:**
```css
/* Crisp pixel art rendering */
canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

## Audio

### Sound Effects

**Categories:**
- **UI** — button click, menu open, notification
- **Player** — footsteps, jump, attack, hurt
- **Enemies** — alert, attack, death
- **Environment** — doors, pickups, ambient

**Format recommendations:**
- **Web:** MP3 (broad support) or OGG (better quality)
- **Mobile:** AAC or OGG
- **Desktop:** WAV (uncompressed) or OGG

**Implementation:**
```javascript
class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.volume = 1.0;
  }

  load(name, url) {
    const audio = new Audio(url);
    audio.volume = this.volume;
    this.sounds.set(name, audio);
  }

  play(name, loop = false) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.loop = loop;
      sound.currentTime = 0;
      sound.play();
    }
  }

  stop(name) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }
}

// Usage
const audio = new AudioManager();
audio.load('jump', '/sounds/jump.mp3');
audio.load('bgm', '/music/level1.mp3');

player.on('jump', () => audio.play('jump'));
audio.play('bgm', true); // loop background music
```

### Music

**Layered adaptive music:**
```javascript
class MusicSystem {
  constructor() {
    this.layers = {
      base: new Audio('/music/base.mp3'),
      drums: new Audio('/music/drums.mp3'),
      melody: new Audio('/music/melody.mp3')
    };

    Object.values(this.layers).forEach(track => {
      track.loop = true;
      track.volume = 0;
    });
  }

  start() {
    Object.values(this.layers).forEach(track => track.play());
    this.fadeIn('base', 1.0);
  }

  intensify() {
    this.fadeIn('drums', 0.7);
    this.fadeIn('melody', 0.8);
  }

  fadeIn(layer, targetVolume, duration = 2000) {
    const track = this.layers[layer];
    const step = targetVolume / (duration / 16);
    const interval = setInterval(() => {
      track.volume = Math.min(track.volume + step, targetVolume);
      if (track.volume >= targetVolume) clearInterval(interval);
    }, 16);
  }
}
```

### Spatial Audio

**Web Audio API 3D positioning:**
```javascript
const audioCtx = new AudioContext();
const listener = audioCtx.listener;

function playPositionalSound(url, x, y, z) {
  const source = audioCtx.createBufferSource();
  const panner = audioCtx.createPanner();

  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 1;
  panner.maxDistance = 10000;
  panner.rolloffFactor = 1;

  panner.setPosition(x, y, z);
  listener.setPosition(player.x, player.y, player.z);

  source.connect(panner);
  panner.connect(audioCtx.destination);

  // Load and play buffer
  fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(audioBuffer => {
      source.buffer = audioBuffer;
      source.start(0);
    });
}
```

## Engines & Frameworks

### Godot

**When to use:**
- 2D or 3D games
- Need visual editor + scripting (GDScript or C#)
- Open-source, no royalties
- Good 2D tooling (tilemaps, animation, particle systems)

**Project structure:**
```
project/
├── scenes/
│   ├── Player.tscn
│   ├── Enemy.tscn
│   └── Level1.tscn
├── scripts/
│   ├── player.gd
│   └── enemy_ai.gd
├── assets/
└── project.godot
```

**Quick start:**
```gdscript
extends CharacterBody2D

var speed = 200

func _physics_process(delta):
    var input = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
    velocity = input * speed
    move_and_slide()
```

### Unity

**When to use:**
- 3D games (best tooling)
- Mobile + console deployment
- Asset Store ecosystem
- C# programming

**Gotchas:**
- Licensing fees for revenue > $100k/year
- Larger build sizes
- Steeper learning curve

### Phaser (Web)

**When to use:**
- Browser games (Canvas/WebGL)
- Simple 2D platformers, arcade games
- JavaScript/TypeScript codebase
- No installation required (players use browser)

**Quick start:**
```javascript
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: 'arcade' },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', '/sprites/player.png');
}

function create() {
  this.player = this.physics.add.sprite(100, 100, 'player');
  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(160);
  } else {
    this.player.setVelocityX(0);
  }
}
```

### Pygame

**When to use:**
- Python developers
- Prototyping (fast iteration)
- Educational games
- Desktop-only (no web export)

**Setup:**
```bash
pip install pygame
```

```python
import pygame

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

player_pos = [100, 100]
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_pos[0] -= 5
    if keys[pygame.K_RIGHT]:
        player_pos[0] += 5

    screen.fill((0, 0, 0))
    pygame.draw.circle(screen, (255, 0, 0), player_pos, 20)
    pygame.display.flip()
    clock.tick(60)
```

## Web Game Development

### Canvas API

**Basic rendering loop:**
```javascript
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw sprite
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, 32, 32);

  requestAnimationFrame(draw);
}

draw();
```

**Collision detection (AABB):**
```javascript
function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
```

### React Game Patterns

**Game state in React:**
```jsx
import { useEffect, useRef, useState } from 'react';

function Game() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const gameState = useRef({ player: { x: 100, y: 100 } });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    function gameLoop() {
      // Update game state (don't trigger re-renders)
      gameState.current.player.x += 1;

      // Render
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(gameState.current.player.x, gameState.current.player.y, 32, 32);

      animationId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div>
      <div>Score: {score}</div>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}
```

**Key principle:** Keep game loop outside React render cycle (use refs, not state for high-frequency updates).

## Game Dev Workflow

### Prototyping

**Gray-box prototyping:**
1. No art assets — use colored rectangles
2. Focus on core mechanics only
3. Implement one mechanic at a time
4. Playtest every 30 minutes

**Questions to answer:**
- Is the core loop fun after 5 minutes?
- Does the player understand what to do without instructions?
- Is there a clear goal?

**Prototype checklist:**
- [ ] Player movement feels responsive
- [ ] Core mechanic works (shooting, jumping, puzzle-solving)
- [ ] Progression is evident (score, levels, unlocks)
- [ ] Failure state exists (death, time limit, lose condition)

### Playtesting

**Internal testing (solo dev):**
- Record yourself playing (screen capture + webcam)
- Note moments of confusion or frustration
- Track time to first "aha!" moment

**External testing (friends/strangers):**
- Don't explain anything — watch them play
- Ask open-ended questions: "What were you trying to do?"
- Note where they get stuck (UI, mechanics, unclear goals)

**Metrics to track:**
- Session length (how long before quitting?)
- Completion rate (% who finish tutorial/level 1)
- Death heatmap (where do players die most?)

### Iteration

**Post-playtest priorities:**
1. Fix showstoppers (crashes, soft-locks, game-breaking bugs)
2. Improve clarity (tutorials, UI feedback)
3. Balance difficulty (if 80%+ die at same spot, too hard)
4. Polish (juice, animations, sound)

**Feature cuts:**
- If a mechanic isn't used in 50%+ of gameplay, cut it
- "Nice to have" features go on backlog
- Ship core experience first, add content later

### Polish

**Polish pass checklist:**
- [ ] All UI buttons have hover/click states
- [ ] Sound effects for all player actions
- [ ] Particle effects on important events
- [ ] Smooth camera transitions
- [ ] Consistent art style (no mismatched sprites)
- [ ] Loading screens (hide asset loading time)
- [ ] Settings menu (volume, controls, graphics quality)

**The last 10% takes 50% of the time** — plan accordingly.

### Shipping

**Pre-launch checklist:**
- [ ] Tested on target platforms (Windows/Mac/Linux, iOS/Android, browsers)
- [ ] Performance profiling (maintain 60fps on min spec hardware)
- [ ] Save/load system works
- [ ] Credits screen complete
- [ ] Privacy policy (if collecting any data)
- [ ] EULA/terms of service (if multiplayer or in-app purchases)

**Web game deployment:**
```bash
# Build optimized bundle
npm run build

# Deploy to Netlify/Vercel
netlify deploy --prod

# Or itch.io (supports HTML5 games)
# Zip build folder and upload to itch.io
```

**Post-launch:**
- Monitor crash reports (Sentry, BugSnag)
- Track analytics (player retention, session length)
- Respond to feedback within 48 hours
- Plan patch schedule (weekly for first month, then monthly)

## Additional Resources

**Art:**
- OpenGameArt.org (free sprites, tilesets, music)
- itch.io/game-assets (free and paid)
- Aseprite (pixel art editor)

**Audio:**
- Freesound.org (CC-licensed sound effects)
- Incompetech.com (royalty-free music by Kevin MacLeod)
- Bosca Ceoil (simple music creation tool)

**Learning:**
- Game Programming Patterns (book by Robert Nystrom)
- Gamasutra / Game Developer (articles and postmortems)
- GMTK (YouTube channel on game design)
