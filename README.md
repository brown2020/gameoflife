# Conway's Game of Life

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.en.html)

A high-performance, interactive implementation of Conway's Game of Life built with **Next.js 16.1**, **React 19.2**, and **TypeScript**. Features canvas-based rendering, multiple drawing tools, and a curated collection of classic patterns.

![Game of Life Demo](https://via.placeholder.com/800x400?text=Game+of+Life+Screenshot)

## ✨ Features

- **🎨 Multiple Drawing Tools** — Pointer (toggle), Draw (paint alive), and Eraser modes
- **⚡ High-Performance Canvas Rendering** — Batched rendering with `requestAnimationFrame` for smooth 60fps animation
- **📚 Classic Pattern Library** — Curated collection of spaceships, oscillators, guns, and methuselahs
- **🎮 Keyboard Shortcuts** — Full keyboard control for power users
- **📖 Educational Content** — Built-in tutorial and rules explanation
- **🔍 Zoom Controls** — Adjust cell size from 5px to 30px
- **📱 Responsive Design** — Adapts to any screen size
- **🚀 Optimized Simulation** — Boundary detection and lazy updates for efficient computation

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20.9 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gameoflife

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start development server with Turbopack |
| `npm run build` | Build for production                    |
| `npm run start` | Start production server                 |
| `npm run lint`  | Run ESLint                              |

## 🎮 Usage

### Mouse Controls

| Tool        | Action                              |
| ----------- | ----------------------------------- |
| **Pointer** | Click to toggle individual cells    |
| **Draw**    | Click and drag to paint alive cells |
| **Eraser**  | Click and drag to erase cells       |

### Keyboard Shortcuts

| Key       | Action                            |
| --------- | --------------------------------- |
| `Space`   | Start/Stop simulation             |
| `C`       | Clear grid                        |
| `R`       | Generate random pattern           |
| `S`       | Step one generation (when paused) |
| `+` / `=` | Zoom in                           |
| `-` / `_` | Zoom out                          |
| `Esc`     | Close modal                       |

### Controls

- **Pattern Selector** — Choose from predefined patterns
- **Speed Slider** — Adjust simulation speed (10ms–500ms per generation)
- **Zoom Buttons** — Change cell size for detail or overview
- **Generation Counter** — Track simulation progress with reset option

## 🧬 Patterns

### Spaceships

Patterns that translate across the grid while maintaining their shape.

| Pattern    | Description                                                                     |
| ---------- | ------------------------------------------------------------------------------- |
| **Glider** | The smallest spaceship, moves diagonally. Discovered by Richard K. Guy in 1970. |
| **LWSS**   | Lightweight Spaceship, moves horizontally. Discovered by John Conway in 1970.   |

### Oscillators

Patterns that return to their initial state after a fixed number of generations.

| Pattern            | Period | Description                                                    |
| ------------------ | ------ | -------------------------------------------------------------- |
| **Pulsar**         | 3      | One of the most common naturally occurring oscillators         |
| **Pentadecathlon** | 15     | One of the most natural oscillators, discovered by John Conway |
| **Toad**           | 2      | Simple oscillator alternating between two states               |
| **Beacon**         | 2      | Resembles a lighthouse blinking                                |

### Guns

Patterns that periodically emit spaceships.

| Pattern               | Description                                                                       |
| --------------------- | --------------------------------------------------------------------------------- |
| **Gosper Glider Gun** | First known finite pattern with unbounded growth. Created by Bill Gosper in 1970. |

### Methuselahs

Small patterns that evolve for many generations before stabilizing.

| Pattern         | Lifespan | Description                                                  |
| --------------- | -------- | ------------------------------------------------------------ |
| **Diehard**     | 130      | Completely disappears after 130 generations                  |
| **R-pentomino** | 1103     | One of the most active small patterns, produces many gliders |

## 🏗️ Project Structure

```
gameoflife/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── Controls.tsx    # Header with simulation controls
│   │   ├── GameComponent.tsx   # Main game container
│   │   ├── GridCanvas.tsx  # Canvas-based grid renderer
│   │   ├── InfoPanel.tsx   # Pattern information display
│   │   ├── RulesModal.tsx  # Game rules modal
│   │   ├── TutorialModal.tsx   # Interactive tutorial
│   │   └── ui/
│   │       ├── Button.tsx  # Reusable button component
│   │       ├── ListItems.tsx   # List renderer
│   │       └── Modal.tsx   # Modal wrapper component
│   ├── constants/
│   │   └── game.ts         # Game configuration constants
│   ├── hooks/
│   │   ├── useGameOfLife.ts    # Core game logic hook
│   │   └── useKeyboardShortcuts.ts # Keyboard handling
│   ├── types/
│   │   └── game.ts         # TypeScript type definitions
│   └── utils/
│       ├── grid.ts         # Grid manipulation utilities
│       └── patterns.ts     # Pattern definitions
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── README.md
```

## ⚡ Performance Optimizations

This implementation includes several optimizations for smooth performance:

| Optimization              | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| **Canvas Rendering**      | Batched draw calls for alive cells and grid lines         |
| **requestAnimationFrame** | Smooth animation loop synchronized with display refresh   |
| **Boundary Detection**    | Only processes active regions of the grid                 |
| **Lazy Row Copying**      | Immutable updates only copy modified rows                 |
| **Memoization**           | React.memo and useCallback prevent unnecessary re-renders |
| **Early Termination**     | Stops simulation when grid stabilizes or empties          |

## 🛠️ Tech Stack

| Technology                                    | Version | Purpose                         |
| --------------------------------------------- | ------- | ------------------------------- |
| [Next.js](https://nextjs.org/)                | 16.1.1  | React framework with App Router |
| [React](https://react.dev/)                   | 19.2.3  | UI library                      |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.3   | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)      | 4.1.18  | Utility-first styling           |
| [ESLint](https://eslint.org/)                 | 9.39.2  | Code linting                    |
| [PostCSS](https://postcss.org/)               | 8.5.6   | CSS processing                  |

## 📜 Conway's Game of Life Rules

The Game of Life is a zero-player cellular automaton devised by mathematician John Horton Conway in 1970. Each cell follows four simple rules:

1. **Underpopulation** — Any live cell with fewer than 2 live neighbors dies
2. **Survival** — Any live cell with 2 or 3 live neighbors lives on
3. **Overpopulation** — Any live cell with more than 3 live neighbors dies
4. **Reproduction** — Any dead cell with exactly 3 live neighbors becomes alive

Despite these simple rules, the Game of Life is Turing complete and can simulate any computational algorithm.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Use TypeScript strict mode
- Add appropriate comments for complex logic
- Test your changes across different screen sizes
- Ensure `npm run build` passes before submitting

### Ideas for Contributions

- [ ] Add more classic patterns (Acorn, Infinite Growth, etc.)
- [ ] Implement pattern import/export (RLE format)
- [ ] Add touch support for mobile devices
- [ ] Create a pattern editor mode
- [ ] Add statistics tracking (population, growth rate)
- [ ] Implement different rule variations (HighLife, Day & Night)

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 — see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [John Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) (1937–2020) — Creator of the Game of Life
- [Bill Gosper](https://en.wikipedia.org/wiki/Bill_Gosper) — Discoverer of the Glider Gun
- [LifeWiki](https://conwaylife.com/wiki/) — Comprehensive Game of Life encyclopedia
- [Next.js Team](https://nextjs.org/) — For the amazing framework

---

<p align="center">
  Made with ❤️ and <code>requestAnimationFrame</code>
</p>
