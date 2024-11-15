const WebSocket = require('ws');
const robot = require('robotjs');
const sharp = require('sharp');
const fs = require('fs');
const screenshot = require("screenshot-desktop");

keysDown = {}

resizeFactor = 5
useHex = true
compressionLevel = 19

screenWidth = 1920//robot.getScreenSize().width
screenHeight = 1080//robot.getScreenSize().height

console.log(screenWidth)
console.log(screenHeight)

busy = false

const clamp = (value) => Math.max(0, Math.min(255, value));
const toHex = (value) => clamp(value).toString(16).padStart(2, '0');

previousFrame = []
for (let i = 0; i < screenWidth * screenHeight * 4; i++) {
    previousFrame.push(-1)
}

async function compress(image, full) {
    const colors = {};
    let pixels = [];
    let previousColor = -1;
    let colorSequenceLength = 0;
    let currentColor = -1;

    const imageFlattened = image.image;

    screenX = 0
    screenY = 0
    rowsSkipping = false

    let x = 0
    while (x < imageFlattened.length) {
        if (screenX >= screenWidth * 4) {
            if (previousColor !== -1) {
                pixels.push(`${previousColor}x${colorSequenceLength}_`);
                colorSequenceLength = 0;
                rowsSkipping = true
            }
            x += screenWidth * (4 * (resizeFactor - 1))
            screenY += 1
            screenX = 0
            continue
        }

        let pixelColor = ""
        if (!useHex) {
            pixelColor = `${Math.round(imageFlattened[x + 0] / compressionLevel) * compressionLevel}x${Math.round(imageFlattened[x + 1] / compressionLevel) * compressionLevel}x${Math.round(imageFlattened[x + 2] / compressionLevel) * compressionLevel}`;
        } else {
            b = Math.round(imageFlattened[x + 0] / compressionLevel) * compressionLevel
            g = Math.round(imageFlattened[x + 1] / compressionLevel) * compressionLevel
            r = Math.round(imageFlattened[x + 2] / compressionLevel) * compressionLevel
            pixelColor = `@${toHex(r)}${toHex(g)}${toHex(b)}`
        }
        //const pixelColor = `${imageFlattened[x + 0]}x${imageFlattened[x + 1]}x${imageFlattened[x + 2]}`;
        const doesColorExist = colorExists(colors, pixelColor);

        if (doesColorExist === false) {
            colors[pixelColor] = Object.keys(colors).length;
            currentColor = Object.keys(colors).length - 1;
        } else {
            currentColor = doesColorExist;
        }

        if ((currentColor == previousFrame[x] || (compressionLevel > 20 && Math.random() * 6 > compressionLevel - 20)) && !full) {
            currentColor = -2
        }

        if (currentColor != -2) previousFrame[x] = currentColor
        
        if (previousColor !== currentColor || rowsSkipping) {
            if (previousColor !== -1) {
                pixels.push(`${previousColor}x${colorSequenceLength}_`);
            }
            previousColor = currentColor;
            colorSequenceLength = 1;
            if (rowsSkipping) rowsSkipping = false
        } else {
            colorSequenceLength += 1;
        }

        screenX += 4 * resizeFactor
        x += 4 * resizeFactor
    }

    if (previousColor !== -1) {
        pixels.push(`${previousColor}x${colorSequenceLength}_`);
    }

    let colors_;
    if (useHex) colors_ = Object.keys(colors).join('');
    else colors_ = Object.keys(colors).join('@');
    const pixels_ = pixels.join('');

    return `${colors_}#${pixels_}`;
}

function colorExists(colors, color) {
    return colors[color] !== undefined ? colors[color] : false;
}

async function screenshotToArray() {
    const img = robot.screen.capture(0, 0, screenWidth, screenHeight);
    return img
}

async function sendFrame(ws, full) {
    busy = true
    const startTime = Date.now();
    
    const imgArray = await screenshotToArray();
    console.log(`Finished screenshot in ${(Date.now() - startTime)}ms`);
    busy = false

    const compressedImage = await compress(imgArray, full);
    console.log(`Finished image compression in ${(Date.now() - startTime)}ms`);

    const message = JSON.stringify({ type: 'frame', data: compressedImage, time: Date.now() });
    ws.send(message);
}

async function handleClient(ws, req) {
    console.log(`Client connected from ${req.socket.remoteAddress}`);

    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.type === 'connect') {
            console.log(`Connecting to game: ${data.game}`);
        } else if (data.type === 'getFrame') {
            if (!busy) await sendFrame(ws, false);
        } else if (data.type === 'getFrameFull') {
            if (!busy) await sendFrame(ws, true);
        } else if (data.type === 'setCompressionQuality') {
            compressionLevel = data.data
        } else if (data.type === 'setResizeFactor') {
            resizeFactor = data.data
        } else if (data.type === 'keyDown') {
            keysDown[data.key] = true
        } else if (data.type === 'keyUp') {
            keysDown[data.key] = false
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
}

function startServer() {
    const wss = new WebSocket.Server({ port: 8765 });

    wss.on('connection', handleClient);

    console.log('WebSocket server is running on ws://localhost:8765');
}

startServer();