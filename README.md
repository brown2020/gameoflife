## Game of Life

A full-screen, interactive implementation of Conway's Game of Life built with **Next.js 14** and TypeScript. This project allows users to explore different patterns and observe how they evolve according to the rules of Conway's Game of Life.

![Screenshot](screenshot.png)

### Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Patterns](#patterns)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)
10. [Acknowledgments](#acknowledgments)

---

### Introduction

Conway's Game of Life is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game that simulates cellular evolution on a grid based on simple rules. The game consists of an infinite, two-dimensional grid of square cells, each of which is in one of two possible states: alive or dead. Cells evolve over time according to a set of rules based on the states of their neighbors.

This implementation provides a user-friendly interface to experiment with different patterns and see how they evolve, built with modern web technologies such as **Next.js 14** and TypeScript.

### Features

- **Built with Next.js 14**: Uses the latest features and capabilities of Next.js for optimized performance and a great developer experience.
- **Interactive Interface**: Click on cells to toggle their state between alive and dead.
- **Predefined Patterns**: Choose from several classic starting patterns, such as the Glider, LWSS, Pulsar, Gosper Glider Gun, Diehard, Pentadecathlon, Toad, and Beacon.
- **Start/Stop Simulation**: Control the evolution of the grid with start and stop buttons.
- **Responsive Design**: Full-screen layout adapts to different screen sizes.
- **TypeScript**: Ensures type safety and robust code.

### Getting Started

To get a local copy up and running, follow these simple steps.

#### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/brown2020/gameoflife.git
   cd gameoflife
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   or, if you are using Yarn:

   ```bash
   yarn install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   or, with Yarn:

   ```bash
   yarn dev
   ```

4. **Open your browser:**

   Visit `http://localhost:3000` to see the application in action.

### Usage

- **Toggle Cell State**: Click on any cell in the grid to toggle its state between alive (green) and dead (black).
- **Start/Stop Simulation**: Use the "Start" button to begin the simulation and "Stop" to pause it.
- **Select Patterns**: Choose from a list of predefined patterns to see how different starting configurations evolve.
- **Reset Grid**: Clear the grid to its initial state using the "Clear" button.

### Patterns

The following patterns are available to explore:

- **Glider**: A small spaceship that moves diagonally across the grid.
- **LWSS (Lightweight Spaceship)**: A slightly larger spaceship that moves horizontally or vertically.
- **Pulsar**: A period-3 oscillator that creates a symmetric pattern.
- **Gosper Glider Gun**: The first known pattern that exhibits unbounded growth, producing a continuous stream of gliders.
- **Diehard**: A pattern that eventually dies after 130 generations.
- **Pentadecathlon**: A period-15 oscillator resembling a stack of ten cells.
- **Toad**: A period-2 oscillator that alternates between two phases.
- **Beacon**: A period-2 oscillator that switches between two phases, resembling a lighthouse.

### Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

Please make sure your code adheres to the project's coding standards and includes appropriate tests.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Contact

For more information, please contact us at [info@ignitechannel](mailto:info@ignitechannel).

### Acknowledgments

- John Horton Conway for creating the Game of Life.
- The React, Next.js, and TypeScript communities for providing excellent tools and resources.
- [Mathematica](https://www.wolfram.com/mathematica/) for references and visualizations of various patterns.
