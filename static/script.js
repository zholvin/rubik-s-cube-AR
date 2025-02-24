document.addEventListener("DOMContentLoaded", function () {
    const captureButton = document.getElementById("captureButton");
    const saveButton = document.getElementById("saveButton");
    let isEdited = false;

    captureButton.addEventListener("click", async function () {
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

            updateColorGrid(data);
            alert("Scan the next face of the Rubik's Cube and make any necessary changes.");

            // ✅ Show "Save & Next" button after capturing colors
            saveButton.style.display = "inline-block";
            isEdited = false;  // Reset edit tracking

        } catch (error) {
            console.error("Error fetching cube colors:", error);
            alert("Failed to capture colors. Check console for details.");
        }
    });

    saveButton.addEventListener("click", async function () {
        if (!isEdited) {
            alert("No changes made. Proceeding to next face.");
        }

        try {
            const editedColors = getEditedCubeColors();
            await fetch("/save_edited_colors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ colors: editedColors })
            });

            console.log("✅ Edited colors saved successfully.");
            alert("Face saved! Now scan the next face.");

            // ✅ Hide save button until next detection
            saveButton.style.display = "none";

        } catch (error) {
            console.error("Error saving edited colors:", error);
            alert("Failed to save colors. Check console for details.");
        }
    });

    function updateColorGrid(colors) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const color = colors[row][col];
                if (color && color.length === 3) {
                    const box = document.getElementById(`box-${row}-${col}`);
                    box.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                    box.setAttribute("data-color", JSON.stringify(color));
                } else {
                    console.error("Invalid color data at", row, col, color);
                }
            }
        }
    }

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

    // ✅ Allow user to manually edit colors
    const colorOptions = {
        "W": [255, 255, 255],  // White
        "Y": [255, 255, 0],    // Yellow
        "G": [0, 255, 0],      // Green
        "B": [0, 0, 255],      // Blue
        "O": [255, 165, 0],    // Orange
        "R": [255, 0, 0]       // Red
    };

    document.querySelectorAll(".color-box").forEach(box => {
        box.addEventListener("click", function () {
            let currentColor = JSON.parse(this.getAttribute("data-color"));
            let colorKeys = Object.keys(colorOptions);
            let currentIndex = colorKeys.findIndex(key => JSON.stringify(colorOptions[key]) === JSON.stringify(currentColor));

            // Cycle to the next color
            let nextIndex = (currentIndex + 1) % colorKeys.length;
            let nextColor = colorOptions[colorKeys[nextIndex]];

            // Update UI and store color data
            this.style.backgroundColor = `rgb(${nextColor[0]}, ${nextColor[1]}, ${nextColor[2]})`;
            this.setAttribute("data-color", JSON.stringify(nextColor));

            // ✅ Mark as edited
            isEdited = true;
        });
    });
});