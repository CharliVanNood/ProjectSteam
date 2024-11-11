const canvas = document.getElementById("gameWindow")
const ctx = canvas.getContext("2d")
const socket = new WebSocket("ws://localhost:8765");

const resizeFactor = 5
const useHex = true

const gameResolution = [1920 / resizeFactor, 1080 / resizeFactor]

canvas.width = window.innerWidth
canvas.height = window.innerHeight

startTime = Date.now()
frames = 0

function requestFrames() {
    socket.send(JSON.stringify({"type": "getFrame"}));
}

socket.onopen = function() {
    console.log("Connected to WebSocket server");

    socket.send(JSON.stringify({"type": "connect", "game": 2}));
    
    //socket.send(JSON.stringify({"type": "getFrame"}));
    setInterval(requestFrames, 50)
};

socket.onmessage = function(event) {
    data = JSON.parse(event.data)
    if (data["type"] == "frame") {
        drawFrameDecompres(data["data"], data["time"])
        //socket.send(JSON.stringify({"type": "getFrame"}));
    }
};

socket.onclose = function() {
    console.log("WebSocket connection closed");
};

socket.onerror = function(error) {
    console.error("WebSocket Error:", error);
};

function drawFrame(imageData) {
    data = JSON.parse(imageData.replace(/[x]/g, ", "))
    x = 0
    y = 0

    pixelWidthX = canvas.width / gameResolution[0]
    pixelWidthY = canvas.height / gameResolution[1]

    for (let i = 0; i < data.length; i++) {
        ctx.fillStyle = "rgb(" + data[i][2] + ", " + data[i][1] + ", " + data[i][0] + ")"
        ctx.fillRect(x * pixelWidthX, y * pixelWidthY, pixelWidthX + 1, pixelWidthY + 1)
        x += 1
        if (x >= gameResolution[0]) {
            y += 1
            x = 0
        }
    }
}


function drawFrameDecompres(imageData, time) {
    data = imageData.split("#")
    if (useHex) colors = data[0].replace("@", "").split("@")
    else colors = data[0].split("@")
    pixels = data[1].split("_")
    x = 0
    y = 0

    pixelWidthX = canvas.width / gameResolution[0]
    pixelWidthY = canvas.height / gameResolution[1]

    for (let i = 0; i < pixels.length; i++) {
        if (pixels[i] == "") continue
        pixelData = pixels[i].split("x")
        if (pixelData[0] == "-1") continue
        if (!useHex) {
            color = colors[Number(pixelData[0])].split("x")
        } else {
            color = colors[Number(pixelData[0])]
        }
        for (j = 0; j < Number(pixelData[1]); j++) {
            if (!useHex) ctx.fillStyle = "rgb(" + color[2] + ", " + color[1] + ", " + color[0] + ")"
            else ctx.fillStyle = "#" + color
            ctx.fillRect(x * pixelWidthX, y * pixelWidthY, pixelWidthX + 1, pixelWidthY + 1)
            x += 1
            if (x >= gameResolution[0]) {
                y += 1
                x = 0
            }
        }
    }

    frames += 1
    if (Date.now() - startTime > 1000) {
        document.getElementById("fpsBar").innerHTML = "FPS: " + frames
        document.getElementById("pingBar").innerHTML = "Ping: " + (Date.now() - time) + "ms"
        document.getElementById("dataBar").innerHTML = "Data: " + imageData.length
        frames = 0
        startTime = Date.now()
    }
}
