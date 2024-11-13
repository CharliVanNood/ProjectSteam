from flask import Flask, request, jsonify, render_template_string
import json

from ConnectToPI import receive_data_rpi

with open("data/steam.json", "r") as f:
    steamData = json.loads(f.read())

print(steamData[0])

app = Flask(__name__)

@app.route('/', methods=['POST'])
def receive_data():
    receive_data_rpi()

@app.route('/getGameData')
def getGameData():
    game_id = request.args.get('id')
    if not game_id.isnumeric(): return jsonify({"success": 404, "data": "no id has been given"})
    if int(game_id) < len(steamData): return jsonify({"success": 200, "data": steamData[int(game_id)]})
    return jsonify({"success": 404, "data": "id is out of bounds"})
    
app.run(host='0.0.0.0', port=8080)