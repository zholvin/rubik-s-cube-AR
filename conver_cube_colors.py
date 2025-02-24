import json

# Define standard Rubik's Cube colors
COLOR_MAP = {
    (255, 255, 255): 'U',  # White
    (255, 255, 0): 'D',    # Yellow
    (0, 255, 0): 'F',      # Green
    (0, 0, 255): 'B',      # Blue
    (255, 165, 0): 'L',    # Orange
    (255, 0, 0): 'R'       # Red
}

def load_cube_colors(file_path):
    """Loads cube colors from JSON and maps them to standard notation."""
    with open(file_path, 'r') as file:
        cube_data = json.load(file)

    faces = []
    for face in sorted(cube_data.keys(), key=lambda x: int(x.split('_')[1])):  # Sort face_1, face_2...
        face_colors = cube_data[face]
        
        # Ensure the face is scanned with correct orientation by checking the center piece
        center_color = COLOR_MAP.get(tuple(face_colors[1][1]), '?')
        
        print(f" Scanning {center_color} face. Ensure it is oriented correctly!")

        face_str = "".join(COLOR_MAP.get(tuple(color), '?') for row in face_colors for color in row)
        faces.append(face_str)

    return "".join(faces)

# Example usage
file_path = "cube_colors.json"  # Update with actual file path
cube_state = load_cube_colors(file_path)
print("Kociemba Input String:", cube_state)