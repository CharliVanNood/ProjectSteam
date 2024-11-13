from flask import Flask, request, jsonify, render_template_string

from ConnectToPI import receive_data_rpi

app = Flask(__name__)

@app.route('/', methods=['POST'])
def receive_data():
    receive_data_rpi()

@app.route('/getGameData')
def getGameData():
    game_id = request.args.get('id')
    print(game_id)
    return jsonify({"success": 200})

app.run(host='0.0.0.0', port=8080)