const WebSocket = require('ws');
const robot = require('robotjs');
const sharp = require('sharp');
const fs = require('fs');
const screenshot = require("screenshot-desktop");

resizeFactor = 5

screenWidth = robot.getScreenSize().width
screenHeight = robot.getScreenSize().height

busy = false

async function compress(image) {
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

        const pixelColor = `${Math.round(imageFlattened[x + 0] / 20) * 20}x${Math.round(imageFlattened[x + 1] / 20) * 20}x${Math.round(imageFlattened[x + 2] / 20) * 20}`;
        //const pixelColor = `${imageFlattened[x + 0]}x${imageFlattened[x + 1]}x${imageFlattened[x + 2]}`;
        const doesColorExist = colorExists(colors, pixelColor);

        if (doesColorExist === false) {
            colors[pixelColor] = Object.keys(colors).length;
            currentColor = Object.keys(colors).length - 1;
        } else {
            currentColor = doesColorExist;
        }

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

    const colors_ = Object.keys(colors).join('_');
    const pixels_ = pixels.join('');

    return `${colors_}#${pixels_}`;
}

function colorExists(colors, color) {
    return colors[color] !== undefined ? colors[color] : false;
}

async function screenshotToArray() {
    /*const imgBuffer = await screenshot({ format: 'png' });
    const img = await sharp(imgBuffer).resize(400, 200, { kernel: sharp.kernel.nearest }).raw().toBuffer({ resolveWithObject: true });*/
    const img = robot.screen.capture(0, 0, screenWidth, screenHeight);

    /*// Convert the raw pixel data to a buffer
    const imgBuffer = Buffer.from(screen.image);

    // Resize the image to 800x400 using sharp
    const resizedImg = await sharp(imgBuffer)
        .resize(800, 400, { kernel: sharp.kernel.nearest }).raw()  // Resize to 800x400
        .toBuffer({ resolveWithObject: true });  // Get the resized image buffer*/
    return img
}

async function sendFrame(ws) {
    busy = true
    const startTime = Date.now();
    
    const imgArray = await screenshotToArray();
    console.log(`Finished screenshot in ${(Date.now() - startTime)}ms`);
    busy = false

    const compressedImage = await compress(imgArray);
    console.log(`Finished image compression in ${(Date.now() - startTime)}ms`);

    const message = JSON.stringify({ type: 'frame', data: compressedImage, time: Date.now() });
    ws.send(message);
}

async function handleClient(ws, req) {
    console.log(`Client connected from ${req.socket.remoteAddress}`);

    ws.on('message', async (message) => {
        console.log(message);
        const data = JSON.parse(message);

        if (data.type === 'connect') {
            console.log(`Connecting to game: ${data.game}`);
        } else if (data.type === 'getFrame') {
            if (!busy) await sendFrame(ws);
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