import json
import kociemba

def rgb_to_color(rgb):
    r, g, b = rgb
    if r > 200 and g > 200 and b > 200:
        return 'W'  # White
    elif r < 50 and g < 50 and b > 200:
        return 'B'  # Blue
    elif r > 200 and g > 100 and g < 180 and b < 50:
        return 'O'  # Orange
    elif r < 50 and g > 200 and b < 50:
        return 'G'  # Green
    elif r > 200 and g < 50 and b < 50:
        return 'R'  # Red
    elif r > 200 and g > 200 and b < 50:
        return 'Y'  # Yellow
    else:
        return 'X'  # Error or unknown

def convert_file_to_colors(filename):
    with open(filename, 'r') as file:
        data = json.load(file)
        color_string = ''
        for face in data.values():
            for row in face:
                for color in row:
                    color_string += rgb_to_color(color)
        print(color_string)
        return color_string

def color_to_face_string(color_string):
    # Define a mapping from color codes to face letters (assuming a standard cube orientation)
    mapping = {'W': 'U', 'B': 'R', 'O': 'L', 'G': 'F', 'R': 'B', 'Y': 'D'}
    face_string = ''.join(mapping[c] for c in color_string if c in mapping)
    if len(face_string) != 54 or any(face_string.count(f) != 9 for f in 'URFDLB'):
        print("Invalid color string for a Rubik's cube. Please check the RGB to color mapping and the input data.")
        return None
    return face_string

filename = 'cube_colors.json'
color_string = convert_file_to_colors(filename)
face_string = color_to_face_string(color_string)
if face_string:
    print("Face string for Kociemba:", face_string)
    try:
        solution = kociemba.solve(face_string)
        print("Solution:", solution)
    except ValueError as e:
        print("Error:", e)
