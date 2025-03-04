from flask import Flask, request, jsonify, render_template, Response, send_from_directory
import cv2
import json
import os
import atexit

app = Flask(__name__)
app.secret_key = 'your_strong_secret_key_here'  # Required for sessions

CURRENT_FACE_INDEX = 0
COLOR_FILE = "cube_colors.json"
cap = cv2.VideoCapture(0)  # Default camera

# Standard Rubik's cube colors mapping (HSV to BGR)
COLOR_MAP = {
    (255, 255, 255): 'W',  # White
    (255, 0, 0): 'R',      # Red
    (0, 255, 0): 'G',      # Green
    (255, 255, 0): 'Y',    # Yellow
    (255, 165, 0): 'O',    # Orange
    (0, 0, 255): 'B'       # Blue
}

KOCIEMBA_FACE_ORDER = ["U", "R", "F", "D", "L", "B"]

# Position offsets for 3x3 grid scanning
POSITIONS = [
    (-120, -120), (0, -120), (120, -120),
    (-120, 0), (0, 0), (120, 0),
    (-120, 120), (0, 120), (120, 120)
]


def adjust_brightness(img, alpha=1.3, beta=30):
    """Reduce overexposure while keeping details visible."""
    return cv2.convertScaleAbs(img, alpha=alpha, beta=beta)


def get_color_from_hsv(h, s, v):
    """Maps HSV to Rubik's Cube standard colors."""
    if s < 50 and v > 200:
        return (255, 255, 255)  # White
    elif h < 10 or h > 170:
        return (255, 0, 0)  # Red
    elif 10 <= h < 30:
        return (255, 165, 0)  # Orange
    elif 30 <= h < 90:
        return (0, 255, 0) if s > 100 else (255, 255, 0)  # Green or Yellow
    elif 90 <= h < 150:
        return (0, 0, 255)  # Blue
    return (0, 0, 0)  # Default Black (error)


def detect_cube_colors():
    """Captures cube face colors and returns a 3x3 grid of detected colors."""
    if not cap.isOpened():
        print("❌ ERROR: Camera not detected.")
        return None

    success, img = cap.read()
    if not success:
        print("❌ ERROR: Failed to capture image from camera.")
        return None

    img = adjust_brightness(img)
    hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    height, width, _ = img.shape
    cx, cy = width // 2, height // 2

    detected_colors = [[None for _ in range(3)] for _ in range(3)]

    for idx, (dx, dy) in enumerate(POSITIONS):
        px, py = cx + dx, cy + dy
        if 0 <= px < width and 0 <= py < height:
            h, s, v = hsv_img[py, px]
            detected_colors[idx // 3][idx % 3] = get_color_from_hsv(int(h), int(s), int(v))

    # ✅ Ensure all colors are valid before returning
    for row in detected_colors:
        for color in row:
            if color is None:
                print("❌ ERROR: Incomplete color detection. Retrying...")
                return None

    print("✅ Detected Colors:", detected_colors)
    return detected_colors




def load_cube_colors(file_path):
    """Loads cube colors from JSON and formats them into a Kociemba-valid string."""
    try:
        with open(file_path, 'r') as file:
            cube_data = json.load(file)

        if len(cube_data) != 6:
            raise ValueError(f"❌ Error: Expected 6 faces, found {len(cube_data)}.")

        face_mapping = {}
        detected_faces = {}

        for face, colors in cube_data.items():
            center_color = COLOR_MAP.get(tuple(colors[1][1]), '?')
            detected_faces[center_color] = face
            face_mapping[center_color] = "".join(
                COLOR_MAP.get(tuple(color), '?') for row in colors for color in row
            )

        cube_string = "".join(face_mapping.get(face, '?' * 9) for face in KOCIEMBA_FACE_ORDER)

        if '?' in cube_string:
            raise ValueError("❌ Error: Some colors were not mapped correctly.")

        return cube_string

    except Exception as e:
        print(f"🔥 Error converting cube colors: {e}")
        return None




@app.route('/')
def home():
    return render_template('colour_detection.html')


@app.route('/get_cube_colors', methods=['POST'])
def get_cube_colors():
    global CURRENT_FACE_INDEX

    try:
        if os.path.exists(COLOR_FILE):
            with open(COLOR_FILE, 'r') as file:
                data = json.load(file)
        else:
            data = []

        if len(data) >= 6:
            return jsonify({'error': 'All 6 faces already scanned. Reset to start over.'}), 400

        detected_colors = detect_cube_colors()  # Capture colors from camera
        if detected_colors is None:
            return jsonify({'error': 'Color detection failed. Try again.'}), 500

        data.append(detected_colors)

        with open(COLOR_FILE, 'w') as file:
            json.dump(data, file, indent=4)

        return jsonify({"colors": detected_colors}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/reset_colors', methods=['POST'])
def reset_colors():
    """Reset ALL faces and index."""
    global CURRENT_FACE_INDEX

    if os.path.exists(COLOR_FILE):
        os.remove(COLOR_FILE)
    return jsonify({"message": "Reset successful"}), 200

def cleanup():
    print("Cleaning up before shutdown...")
    if os.path.exists(COLOR_FILE):
        os.remove(COLOR_FILE)
        print(f"{COLOR_FILE} has been deleted.")

# Register the cleanup function to be called upon the termination of the application
atexit.register(cleanup)



@app.route('/save_edited_colors', methods=['POST'])
def save_edited_colors():
    global CURRENT_FACE_INDEX

    try:
        data = request.get_json()
        if not data or 'colors' not in data:
            return jsonify({"error": "Nothing detected. Please detect a face first before saving."}), 400

        if os.path.exists(COLOR_FILE):
            with open(COLOR_FILE, 'r') as f:
                saved_data = json.load(f)
        else:
            saved_data = [None] * 6

        saved_data[CURRENT_FACE_INDEX] = data['colors']

        with open(COLOR_FILE, 'w') as f:
            json.dump(saved_data, f, indent=4)

        CURRENT_FACE_INDEX += 1

        return jsonify({"message": "Face saved successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/video_feed')
def video_feed():
    """Streams live video with detection grid."""
    def video_stream():
        while True:
            success, img = cap.read()
            if not success:
                break

            img = adjust_brightness(img)
            height, width, _ = img.shape
            cx, cy = width // 2, height // 2

            for dx, dy in POSITIONS:
                cv2.circle(img, (cx + dx, cy + dy), 5, (0, 255, 0), 2)

            _, buffer = cv2.imencode('.jpg', img)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

    return Response(video_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)