document.addEventListener("DOMContentLoaded", function () {
    const captureButton = document.getElementById("captureButton");  // Detect Button
    const saveButton = document.getElementById("saveButton");        // Save & Next Button
    const resetButton = document.getElementById("resetButton");      // Reset Button
    let isEdited = false;
    let currentFaceIndex = 0; // Track current face number (0-5)

    // ✅ Detect Colors - Hide Detect, Show Save & Reset
    captureButton.addEventListener("click", async function () {
        console.log("Capture button clicked!");

        try {
            const response = await fetch("/get_cube_colors", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

            const data = await response.json();
            console.log("Received from server:", data);

            if (!data || data.error) {
                alert("Error detecting colors: " + (data.error || "No data received"));
                return;
            }

            if (!data.colors || !Array.isArray(data.colors) || data.colors.length !== 3) {
                console.error("Invalid data format received:", data);
                alert("Unexpected response format. Check console for details.");
                return;
            }

            console.log("✅ Updating Color Grid with:", data.colors);
            updateColorGrid(data.colors);  // ✅ Updates grid

            // ✅ Hide Detect Button, Show Save & Reset
            captureButton.style.display = "none";
            saveButton.style.display = "inline-block";
            resetButton.style.display = "inline-block";

            isEdited = false;
            alert(`Editing Face ${currentFaceIndex + 1}/6. Make changes if needed.`);
        } catch (error) {
            console.error("Error fetching cube colors:", error);
            alert("Capture failed. Check console.");
        }
    });

    // ✅ Save & Next - Hide Save, Show Detect
    saveButton.addEventListener("click", async function () {
        if (!isEdited) {
            alert("No changes detected. Proceeding to next face.");
        }

        try {
            const editedColors = getEditedCubeColors();
            const response = await fetch("/save_edited_colors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ colors: editedColors, faceIndex: currentFaceIndex })
            });

            if (!response.ok) throw new Error("Save failed");

            currentFaceIndex++;

            if (currentFaceIndex >= 6) {
                alert("All 6 faces saved! Reset to start over.");
                saveButton.style.display = "none";
                captureButton.style.display = "none"; // Hide Detect after all faces saved
            } else {
                alert(`Face ${currentFaceIndex}/6 saved. Detect face ${currentFaceIndex + 1}.`);

                // ✅ Hide Save, Show Detect
                saveButton.style.display = "none";
                captureButton.style.display = "inline-block";
            }

            clearColorGrid();
        } catch (error) {
            console.log("Save error:", error);
            alert("Save failed. Check console.");
        }
    });

    // ✅ Reset - Restart from Face 1
    resetButton.addEventListener("click", function () {
        currentFaceIndex = 0;
        fetch("/reset_colors", { method: "POST" })
            .then(response => {if (!response.ok) throw new Error("Reset failed");
                clearColorGrid();
                alert("Reset complete. Start from Face 1.");

                // ✅ Reset Buttons - Only Show Detect
                saveButton.style.display = "none";
                captureButton.style.display = "inline-block";
                resetButton.style.display = "inline-block";
            })
            .catch(error => {
                console.error("Reset error:", error);
                alert("Reset failed. Check console.");
            });
    });

    // Clears the color grid in the UI
    function clearColorGrid() {
        document.querySelectorAll('.color-box').forEach(box => {
            box.style.backgroundColor = 'transparent';
            box.removeAttribute('data-color');
        });
    }

    // ✅ Standard Rubik's cube colors mapping
    const colorOptions = {
        "W": [255, 255, 255],  // White
        "Y": [255, 255, 0],    // Yellow
        "G": [0, 255, 0],      // Green
        "B": [0, 0, 255],      // Blue
        "O": [255, 165, 0],    // Orange
        "R": [255, 0, 0]       // Red
    };

    // ✅ Updates the color grid while keeping cells editable
    function updateColorGrid(colors) {
        if (!colors || colors.length !== 3 || !Array.isArray(colors[0]) || colors[0].length !== 3) {
            console.error("Invalid color data structure:", colors);
            alert("Error: Received invalid color data. Check console.");
            return;
        }

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const color = colors[row][col];

                if (color && Array.isArray(color) && color.length === 3) {
                    const box = document.getElementById(`box-${row}-${col}`);
                    box.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                    box.setAttribute("data-color", JSON.stringify(color));

                    // ✅ Keep click event listener attached
                    box.onclick = function () {
                        let colorKeys = Object.keys(colorOptions);
                        let currentIndex = colorKeys.findIndex(key =>
                            JSON.stringify(colorOptions[key]) === JSON.stringify(JSON.parse(box.getAttribute("data-color")))
                        );
                        let nextIndex = (currentIndex + 1) % colorKeys.length;
                        let nextColor = colorOptions[colorKeys[nextIndex]];

                        box.style.backgroundColor = `rgb(${nextColor[0]}, ${nextColor[1]}, ${nextColor[2]})`;
                        box.setAttribute("data-color", JSON.stringify(nextColor));

                        isEdited = true; // ✅ Mark as edited
                    };
                } else {
                    console.error("Invalid color at", row, col, color);
                }
            }
        }
    }

    // Retrieves edited cube colors from the UI
    function getEditedCubeColors() {
        let editedColors = [];
        for (let row = 0; row < 3; row++) {
            let rowColors = [];
            for (let col = 0; col < 3; col++) {
                let color = JSON.parse(document.getElementById(`box-${row}-${col}`).getAttribute("data-color"));
                rowColors.push(color);
            }
            editedColors.push(rowColors);
        }
        return editedColors;
    }
});