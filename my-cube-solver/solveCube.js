const fs = require('fs');
const Cube = require('cubejs');

// ✅ Initialize the solver
Cube.initSolver();

// ✅ Function to map RGB values to cube face labels
function rgbToFace(rgb) {
    const [r, g, b] = rgb;
    if (r > 200 && g > 200 && b > 200) return 'U';  // White (Up)
    if (r > 200 && g < 50 && b < 50) return 'R';    // Red (Right)
    if (r < 50 && g > 200 && b < 50) return 'F';    // Green (Front)
    if (r > 200 && g > 200 && b < 50) return 'D';   // Yellow (Down)
    if (r > 200 && g > 100 && g < 180 && b < 50) return 'L'; // Orange (Left)
    if (r < 50 && g < 50 && b > 200) return 'B';    // Blue (Back)
    return 'X';  // Unknown or invalid color
}

// ✅ Function to convert JSON cube colors to cube.js format
function convertToJsonConfig(filename) {
    try {
        const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));

        let cubeConfig = '';
        const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B']; // Standard Rubik's order
        const faceConfig = { U: [], R: [], F: [], D: [], L: [], B: [] };

        // ✅ Check if JSON structure is correct
        if (!Array.isArray(data) || data.length !== 6) {
            console.error("❌ Error: JSON must contain 6 faces (arrays).");
            return null;
        }

        // ✅ Loop through each face (0-5) and assign to face labels (U, R, F, etc.)
        for (let i = 0; i < 6; i++) {
            const faceKey = faceOrder[i];

            if (!Array.isArray(data[i]) || data[i].length !== 3) {
                console.error(`❌ Error: Face ${faceKey} is missing or invalid.`);
                return null;
            }

            for (let row = 0; row < 3; row++) {
                if (!Array.isArray(data[i][row]) || data[i][row].length !== 3) {
                    console.error(`❌ Error: Face ${faceKey}, row ${row} is invalid.`);
                    return null;
                }

                for (let col = 0; col < 3; col++) {
                    const rgb = data[i][row][col];

                    if (!Array.isArray(rgb) || rgb.length !== 3) {
                        console.error(`❌ Error: Face ${faceKey}, row ${row}, col ${col} has invalid RGB.`);
                        return null;
                    }

                    faceConfig[faceKey].push(rgbToFace(rgb));  // ✅ Convert RGB to cube notation
                }
            }
        }

        // ✅ Concatenate faces in the correct order
        for (const face of faceOrder) {
            cubeConfig += faceConfig[face].join('');
        }

        return cubeConfig;
    } catch (error) {
        console.error("❌ Error reading JSON file:", error);
        return null;
    }
}


// ✅ Read JSON and convert to cube notation
const filePath = 'cube_colors.json'; // Make sure the file exists
const cubeConfig = convertToJsonConfig(filePath);
console.log("🔹 Cube String for Solver:", cubeConfig); // ✅ Debugging Output


if (!cubeConfig) {
    console.error("❌ Error: Failed to generate a valid cube configuration.");
    process.exit(1);
}

// ✅ Validate cube format (54 characters, valid faces)
if (cubeConfig.length === 54 && /^([URFDLB])*$/.test(cubeConfig)) {
    try {
        const cube = Cube.fromString(cubeConfig);
        const solution = cube.solve();
        console.log("✅ Solution:", solution);
// ✅ Write solution to a text file
        fs.writeFileSync('cube_solution.txt', solution, 'utf-8');
        console.log("✅ Solution saved to cube_solution.txt");

    } catch (error) {
        console.error("❌ Error solving the cube:", error);
    }
} else {
    console.error("❌ Invalid cube configuration:", cubeConfig);
}
