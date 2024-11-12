from flask import Flask, request, jsonify, render_template_string

app = Flask(__name__)

# Store the latest data
latest_data = {"temperature": None, "distance": None}

@app.route('/', methods=['POST'])
def receive_data():
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

@app.route('/')
def index():
    return render_template_string('''
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>Sensor Data</title>
          </head>
          <body>
            <div class="container">
              <h1>Sensor Data</h1>
              <p>Temperature: {{ temperature }} °C</p>
              <p>Distance: {{ distance }} cm</p>
            </div>
          </body>
        </html>
    ''', temperature=latest_data["temperature"], distance=latest_data["distance"])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)