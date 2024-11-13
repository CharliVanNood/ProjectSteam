from flask import Flask, request, jsonify, render_template_string

app = Flask(__name__)

# Store the latest data
latest_data = {"temperature": None, "distance": None}

def receive_data_rpi():
    global latest_data
    data = request.get_json()
    if data:
        print("Received data:", data)
        # Update the latest data
        latest_data["temperature"] = data.get("temperature")
        latest_data["distance"] = data.get("distance")
        return jsonify({"status": "success", "data": data}), 200
    else:
        return jsonify({"status": "error", "message": "No data received"}), 400
