console.log("starting renderer")

const socket = new WebSocket("ws://localhost:8765");

socket.onopen = function() {
    console.log("Connected to WebSocket server");

    socket.send(JSON.stringify({"type": "connect", "game": 2}));
};

socket.onmessage = function(event) {
    console.log(event.data)
};

socket.onclose = function() {
    console.log("WebSocket connection closed");
};

socket.onerror = function(error) {
    console.error("WebSocket Error:", error);
};
