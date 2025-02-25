# Game of Life

A full-screen, interactive implementation of Conway's Game of Life built with **Next.js 15** and TypeScript. This project allows users to explore different patterns and observe how they evolve according to the rules of Conway's Game of Life.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Patterns](#patterns)
7. [Performance Optimizations](#performance-optimizations)
8. [Educational Features](#educational-features)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)
12. [Acknowledgments](#acknowledgments)

---

## Introduction

Conway's Game of Life is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game that simulates cellular evolution on a grid based on simple rules. The game consists of an infinite, two-dimensional grid of square cells, each of which is in one of two possible states: alive or dead. Cells evolve over time according to a set of rules based on the states of their neighbors.

This implementation provides a user-friendly interface to experiment with different patterns and see how they evolve, built with modern web technologies such as **Next.js 15** and TypeScript.

## Features

- **Built with Next.js 15**: Uses the latest features and capabilities of Next.js for optimized performance and a great developer experience.
- **React 19**: Leverages the latest React version for improved performance and new features.
- **Interactive Interface**: Click on cells to toggle their state between alive and dead.
- **Canvas-Based Rendering**: High-performance rendering using HTML5 Canvas for smooth animations even with complex patterns.
- **Extensive Pattern Library**: Choose from a wide variety of classic and interesting patterns:
  - Spaceships (Glider, LWSS)
  - Oscillators (Pulsar, Pentadecathlon, Toad, Beacon, Clock)
  - Guns (Gosper Glider Gun, Glider Gun 2)
  - Methuselahs (Diehard, Acorn, R-pentomino)
  - Growth patterns (Infinite Growth, Spacefiller)
  - Theoretical patterns (Garden of Eden)
- **Educational Tools**: Learn about Conway's Game of Life with built-in tutorials, pattern information, and rule explanations.
- **Generation Counter**: Track how many generations have passed in the simulation.
- **Start/Stop Simulation**: Control the evolution of the grid with start and stop buttons.
- **Responsive Design**: Full-screen layout adapts to different screen sizes.
- **TypeScript 5.6**: Ensures type safety and robust code with the latest TypeScript features.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- [npm](https://www.npmjs.com/) (Node Package Manager) or [yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/game-of-life.git
   cd game-of-life
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   or, if you are using Yarn:

   ```bash
   yarn install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   or, with Yarn:

   ```bash
   yarn dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

- **Click on cells** to toggle them between alive and dead states
- **Select a pattern** from the predefined patterns to see interesting behaviors
- **Click Start** to begin the simulation
- **Click Stop** to pause the simulation
- **Click Clear** to reset the grid
- **Click Tutorial** to learn how to use the application
- **Click Show Rules** to understand Conway's Game of Life rules

## Patterns

The application includes a variety of patterns that demonstrate different behaviors in Conway's Game of Life:

### Spaceships

- **Glider**: A small pattern that moves diagonally across the grid
- **LWSS (Lightweight Spaceship)**: Moves horizontally across the grid

### Oscillators

- **Pulsar**: A period-3 oscillator that creates a symmetric pattern
- **Pentadecathlon**: A period-15 oscillator with a complex evolution
- **Toad**: A simple period-2 oscillator
- **Beacon**: A period-2 oscillator that resembles a lighthouse
- **Clock**: A period-2 oscillator that resembles clock hands

### Guns

- **Gosper Glider Gun**: Produces a continuous stream of gliders
- **Glider Gun 2**: An alternative glider gun design

### Methuselahs

- **Diehard**: Disappears after 130 generations
- **Acorn**: Evolves for 5206 generations before stabilizing
- **R-pentomino**: Evolves for 1103 generations with complex behavior

### Growth Patterns

- **Infinite Growth**: Demonstrates unbounded growth across the grid
- **Spacefiller**: Rapidly expands to fill available space

### Theoretical Patterns

- **Garden of Eden**: A pattern that cannot be created through normal evolution

## Performance Optimizations

This implementation includes several optimizations for smooth performance:

- **Canvas-based rendering** instead of DOM elements for efficient updates
- **Boundary detection** to only process active areas of the grid
- **Memoization** of expensive calculations
- **Early termination** of grid comparison when differences are found
- **Optimized neighbor counting** algorithm

## Educational Features

The application includes several educational features to help users understand Conway's Game of Life:

- **Interactive Tutorial**: A step-by-step guide for new users
- **Rules Explanation**: A detailed explanation of Conway's Game of Life rules
- **Pattern Information**: Descriptions and historical context for each pattern
- **Generation Counter**: Track the evolution of patterns over time

## Technologies Used

This project is built with the following technologies:

- **Next.js 15.0.0**: For server-side rendering and optimized performance
- **React 19.0.0**: For building the user interface with the latest React features
- **TypeScript 5.6.2**: For type safety and improved developer experience
- **Tailwind CSS 4.0.8**: For responsive and customizable styling
- **ESLint 9.15.0**: For code quality and consistency
- **HTML5 Canvas**: For high-performance rendering

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/game-of-life](https://github.com/yourusername/game-of-life)

## Acknowledgments

- [John Conway](https://en.wikipedia.org/wiki/John_Horton_Conway) for creating the Game of Life
- [LifeWiki](https://conwaylife.com/wiki/) for pattern information and history
- [Next.js](https://nextjs.org/) for the amazing framework
