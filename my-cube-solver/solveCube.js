const fs = require('fs');
const Cube = require('cubejs');

// Initialize the solver
Cube.initSolver();

// Function to map RGB values to cube face labels
function rgbToFace(rgb) {
    const [r, g, b] = rgb;
    if (r > 200 && g > 200 && b > 200) return 'U';  // Assume white is Up
    if (r < 50 && g < 50 && b > 200) return 'R';    // Assume blue is Right
    if (r > 200 && g > 100 && g < 180 && b < 50) return 'L'; // Assume orange is Left
    if (r < 50 && g > 200 && b < 50) return 'F';    // Assume green is Front
    if (r > 200 && g < 50 && b < 50) return 'B';    // Assume red is Back
    if (r > 200 && g > 200 && b < 50) return 'D';   // Assume yellow is Down
    return 'X';  // Unknown or invalid color
}

// Read the JSON file and convert it to the cube configuration
function convertToJsonConfig(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    let cubeConfig = '';

    // Assuming data is structured as an object of faces, each containing a 3x3 array of RGB values
    for (const face of Object.values(data)) {
        for (const row of face) {
            for (const color of row) {
                cubeConfig += rgbToFace(color);
            }
        }
    }
    return cubeConfig;
}

// Filepath to your JSON file
const filePath = 'cube_colors.json'; // Change this to your actual file path
const cubeConfig = convertToJsonConfig(filePath);

// Check if configuration is valid (54 characters and each face is correctly counted)
if (cubeConfig.length === 54 && /^([URFDLB])*$/.test(cubeConfig)) {
    const cube = Cube.fromString(cubeConfig);
    const solution = cube.solve();
    console.log("Solution:", solution);
} else {
    console.log("Invalid cube configuration:", cubeConfig);
}
