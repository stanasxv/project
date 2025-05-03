from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import io
import base64
import cv2

app = Flask(__name__)
CORS(app)

def remove_background(image_data):
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    image_np = np.array(image)
    gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
    _, mask = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    result = cv2.bitwise_and(image_np, image_np, mask=mask)
    b, g, r = cv2.split(result)
    alpha = mask
    rgba = cv2.merge((b, g, r, alpha))
    _, buffer = cv2.imencode(".png", rgba)
    return base64.b64encode(buffer).decode('utf-8')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'error': 'Resim bulunamadı'}), 400
    file = request.files['image']
    data = file.read()
    processed = remove_background(data)
    return jsonify({'result': processed})

if __name__ == '__main__':
    app.run(debug=True)