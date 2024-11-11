import mss
import numpy as np
import asyncio
import websockets
import json

async def send_periodic_messages(websocket):
    while True:
        message = json.dumps({"type": "frame", "data": "0x0x0"})
        try:
            await websocket.send(message)
        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected")
            break
        await asyncio.sleep(0.0166)

async def handle_client(websocket, path):
    print(f"Client connected from {path}")
    asyncio.create_task(send_periodic_messages(websocket))
    
    try:
        async for message in websocket:
            print(message)
            data = json.loads(message)
            print(data)
            if data["type"] == "connect":
                print(f"connecting to game: {data['game']}")
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

async def start_server():
    server = await websockets.serve(handle_client, "localhost", 8765)
    print("WebSocket server is running on ws://localhost:8765")
    await server.wait_closed()

def screenshot_to_array():
    with mss.mss() as sct:
        screenshot = sct.grab(sct.monitors[0])
        img_array = np.array(screenshot)
        print(f"Screenshot shape: {img_array.shape}")
        return img_array

img_array = screenshot_to_array()

pixel_color = img_array[100, 100]
print(f"Pixel color at (100, 100): {pixel_color}")

asyncio.run(start_server())