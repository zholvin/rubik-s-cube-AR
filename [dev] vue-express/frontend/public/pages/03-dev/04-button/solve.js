const Cube = require("cubejs"); // Import Cube.js library

Cube.initSolver(); // Initialize the solver

// Example scramble
const scramble = "U R2 F B R B2 R U2 L B2 R U L2 F2 R2 U B2 D2 L2 F2";

// Create a new Cube instance
const cube = new Cube();
cube.move(scramble); // Apply the scramble

console.log("Scrambled state:", cube.asString());

// Solve the cube
const solution = cube.solve();
console.log("Solution:", solution);
