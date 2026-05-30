# Neon Drift

Neon Drift is an original cyberpunk arcade game inspired by one-button obstacle dodging. Pilot a glowing cyber-drone through unstable neon energy gates, build a high score, and unlock persistent achievements.

The project is built from scratch with **TypeScript**, **Phaser 3**, and **Vite**. All visuals and sounds are generated in code with Phaser graphics, particles, tweens, and Web Audio oscillators—no external image or audio assets are required.

## Install

```bash
npm install
```

## Run in development

```bash
npm run dev
```

Open the local URL shown by Vite in your browser.

## Build for production

```bash
npm run build
```

## Preview the production build

```bash
npm run preview
```

## Type-check only

```bash
npm run typecheck
```

## Controls

- **Space**, **left mouse click**, or **touch tap**: boost upward
- **P** or **Esc**: pause / resume
- Menu buttons support mouse and touch

## Features

- Complete Phaser scene flow: boot, preload, main menu, gameplay, pause, game over, achievements, and settings
- Cyberpunk presentation with neon gates, a futuristic city backdrop, parallax layers, scanlines, synthwave grid, particles, screen shake, flashes, and animated UI
- Responsive scaling for desktop and mobile browsers
- Gradual difficulty scaling with faster gates, smaller gaps, and tighter spawn rhythm
- Persistent best score saved with `localStorage`
- Achievement system saved with `localStorage`
- Generated sound effects for UI, boost, scoring, death, achievements, pause, and resume
- Web Audio synth-style ambient pulse that starts only after user interaction to respect browser autoplay rules
- Mute and volume controls saved across sessions

## Achievements

- **First Flight**: play the first run
- **Neon Rookie**: reach score 5
- **Gate Runner**: reach score 15
- **Cyber Ace**: reach score 30
- **Untouchable**: pass 10 gates in one run without collision
- **Persistent**: play 10 runs
- **Comeback**: restart after death 5 times
