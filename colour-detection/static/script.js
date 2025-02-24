document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("captureButton").addEventListener("click", async function () {
        console.log("Capture button clicked!");

        try {
            const response = await fetch("/get_cube_colors", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Detected Cube Colors:", data);

            if (data.error) {
                alert("Error detecting colors: " + data.error);
                return;
            }

            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const color = data[row][col];
                    if (color && color.length === 3) {
                        document.getElementById(`box-${row}-${col}`).style.backgroundColor =
                            `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                    } else {
                        console.error("Invalid color data at", row, col, color);
                    }
                }
            }

            processRubiksCubeColors(data);

            // ✅ Ask user to scan the next face
            alert("Scan the next face of the Rubik's Cube and press 'Capture Cube Colors' again.");
        } catch (error) {
            console.error("Error fetching cube colors:", error);
            alert("Failed to capture colors. Check console for details.");
        }
    });
});

function processRubiksCubeColors(colors) {
    console.log("Processing 3x3 Colors:", colors);
}
