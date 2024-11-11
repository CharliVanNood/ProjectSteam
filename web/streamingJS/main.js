const canvas = document.getElementById("gameWindow")
const ctx = canvas.getContext("2d")
const socket = new WebSocket("ws://localhost:8765");

const resizeFactor = 10
const gameResolution = [1920 / resizeFactor, 1080]

canvas.width = window.innerWidth
canvas.height = window.innerHeight

function requestFrames() {
    socket.send(JSON.stringify({"type": "getFrame"}));
}

socket.onopen = function() {
    console.log("Connected to WebSocket server");

    socket.send(JSON.stringify({"type": "connect", "game": 2}));
    
    socket.send(JSON.stringify({"type": "getFrame"}));
    //setInterval(requestFrames, 150)
};

socket.onmessage = function(event) {
    data = JSON.parse(event.data)
    console.log(data)
    if (data["type"] == "frame") {
        drawFrameDecompres(data["data"])
        socket.send(JSON.stringify({"type": "getFrame"}));
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


function drawFrameDecompres(imageData) {
    data = imageData.split("#")
    colors = data[0].split("_")
    pixels = data[1].split("_")
    x = 0
    y = 0

    pixelWidthX = canvas.width / gameResolution[0]
    pixelWidthY = canvas.height / gameResolution[1]

    for (let i = 0; i < pixels.length; i++) {
        if (pixels[i] == "") continue
        pixelData = pixels[i].split("x")
        if (pixelData[0] == "-1") continue
        color = colors[Number(pixelData[0])].split("x")
        for (j = 0; j < Number(pixelData[1]); j++) {
            ctx.fillStyle = "rgb(" + color[2] + ", " + color[1] + ", " + color[0] + ")"
            ctx.fillRect(x * pixelWidthX, y * pixelWidthY, pixelWidthX + 1, pixelWidthY + 1)
            x += 1
            if (x >= gameResolution[0]) {
                y += 1
                x = 0
            }
        }
    }
}
