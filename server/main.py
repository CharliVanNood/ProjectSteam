import mss
import numpy as np
import asyncio
import websockets
import json
import time
from PIL import Image

async def sendFrame(websocket):
    startTime = time.time()
    img_array = await screenshot_to_array()
    #image = str(img_array.reshape(-1, 4).tolist()).replace(", ", "x").replace("x255]", "]")
    print("finished screenshot in " + str((time.time() - startTime) * 1000) + "ms")
    image = await compress(img_array)
    print("finished image in " + str((time.time() - startTime) * 1000) + "ms")

    message = json.dumps({"type": "frame", "data": str(image)})
    await websocket.send(message)

async def handle_client(websocket, path):
    print(f"Client connected from {path}")
    try:
        async for message in websocket:
            print(message)
            data = json.loads(message)
            if data["type"] == "connect":
                print(f"connecting to game: {data['game']}")
            elif data["type"] == "getFrame":
                await sendFrame(websocket)
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

async def start_server():
    server = await websockets.serve(handle_client, "localhost", 8765)
    print("WebSocket server is running on ws://localhost:8765")
    await server.wait_closed()

async def screenshot_to_array():
    with mss.mss() as sct:
        screenshot = sct.grab(sct.monitors[1])
        img_array = np.array(screenshot)
        img = Image.fromarray(img_array)
        img_resized = img.resize((800, 400))
        img_array = np.array(img_resized)
        return img_array

def colorExists(colors, color):
    try:
        a = colors[color]
        return a
    except:
        return False

async def compress(image):
    colors = {}
    pixels = []
    previousColor = -1
    colorSequenceLength = 0
    currentColor = -1

    image = image.reshape(-1, 4).tolist()

    for pixel in image:
        pixel = f"{round(pixel[0] / 15) * 15}x{round(pixel[1] / 15) * 15}x{round(pixel[2] / 15) * 15}"
        doesColorExist = colorExists(colors, pixel)
        if doesColorExist == False:
            colors[pixel] = len(colors)
            currentColor = len(colors) - 1
        else:
            currentColor = doesColorExist
        
        if previousColor != currentColor:
            pixels.append(f"{previousColor}x{colorSequenceLength}_")
            previousColor = currentColor
            colorSequenceLength = 1
        else:
            colorSequenceLength += 1
    
    if previousColor != -1:
        pixels.append(f"{previousColor}x{colorSequenceLength}_")

    colors_ = "_".join(colors)
    pixels_ = "".join(pixels)

    return colors_ + "#" + pixels_

asyncio.run(start_server())