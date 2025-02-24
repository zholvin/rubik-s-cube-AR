from flask import *
import cv2
import numpy as np
import json
import os
# -*- coding: utf-8 -*-

app = Flask(__name__)

# File to save cube colors
COLOR_FILE = "cube_colors.json"

cap = cv2.VideoCapture(0, cv2.CAP_AVFOUNDATION)  # macOS backend

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

def adjust_brightness(img, alpha=1.3, beta=30):  
    """Reduce overexposure while keeping details visible"""
    return cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

def get_color_from_hsv(h, s, v):
    """Maps HSV to Rubik's Cube standard colors"""
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

def rgb_detection():
    """Detects colors without closing the camera feed."""
    if not cap.isOpened():
        print("ERROR: Camera not detected. Check if it's in use by another app.")
        return None

    success, img = cap.read()
    if not success:
        print("ERROR: Failed to capture image from camera.")
        return None

    print("✅ Camera successfully accessed.")

    positions = [
        (-60, -60), (0, -60), (60, -60),
        (-60, 0), (0, 0), (60, 0),
        (-60, 60), (0, 60), (60, 60)
    ]

    detected_colors = [[None for _ in range(3)] for _ in range(3)]

    success, img = cap.read()
    if not success:
        print("Error: Cannot access camera")
        return None

    img = adjust_brightness(img, alpha=1.3, beta=30)
    hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    height, width, _ = img.shape
    cx, cy = width // 2, height // 2

    all_detected = True

    for idx, (dx, dy) in enumerate(positions):
        px, py = cx + dx, cy + dy
        if py < 0 or py >= height or px < 0 or px >= width:
            continue

        pixel_center_hsv = hsv_img[py, px]
        h, s, v = int(pixel_center_hsv[0]), int(pixel_center_hsv[1]), int(pixel_center_hsv[2])

        r, g, b = get_color_from_hsv(h, s, v)

        row, col = divmod(idx, 3)
        detected_colors[row][col] = (r, g, b)

        cv2.circle(img, (px, py), 5, (255, 255, 255), 2)

        if detected_colors[row][col] is None:
            all_detected = False

    return detected_colors if all_detected else None

@app.route('/video_feed')
def video_feed():
    def video_stream():
        while True:
            success, img = cap.read()
            if not success:
                break

            img = adjust_brightness(img, alpha=1.3, beta=30)

            height, width, _ = img.shape
            cx, cy = width // 2, height // 2
            positions = [
                (-60, -60), (0, -60), (60, -60),
                (-60, 0), (0, 0), (60, 0),
                (-60, 60), (0, 60), (60, 60)
            ]
            for (dx, dy) in positions:
                cv2.circle(img, (cx + dx, cy + dy), 5, (0, 255, 0), 2)

            _, buffer = cv2.imencode('.jpg', img)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

    return Response(video_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_cube_colors', methods=['POST'])
def get_cube_colors():
    try:
        detected_colors = rgb_detection()
        
        if detected_colors is None:
            print("ERROR: No colors detected.")
            return jsonify({"error": "Failed to detect all colors"}), 500

        print(f"✅ Detected Colors: {detected_colors}")
        save_cube_colors(detected_colors)
        return jsonify(detected_colors)
    
    except Exception as e:
        print(f"🔥 SERVER ERROR: {e}")  
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


def save_cube_colors(colors):
    """Saves detected colors to a file"""
    if os.path.exists(COLOR_FILE):
        with open(COLOR_FILE, "r") as file:
            data = json.load(file)
    else:
        data = {}

    face_count = len(data) + 1
    data[f"face_{face_count}"] = colors

    with open(COLOR_FILE, "w") as file:
        json.dump(data, file, indent=4)

    print(f"Saved face_{face_count} to {COLOR_FILE}")

@app.route('/reset_colors', methods=['POST'])
def reset_colors():
    if os.path.exists(COLOR_FILE):
        os.remove(COLOR_FILE)
    print("✅ Color file reset successfully.")
    return jsonify({"message": "Color file reset successfully"})


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
