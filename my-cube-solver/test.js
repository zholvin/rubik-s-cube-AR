const Cube = require('cubejs');  // Import the cube.js library

Cube.initSolver();  // Initialize the cube solver

// Example usage of the cube.js
const cubeConfig = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"; // Example of a solved cube for demonstration
const cube = Cube.fromString(cubeConfig);
const solution = cube.solve();
console.log("Solution:", solution);
