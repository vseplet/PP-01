const ws = new WebSocket("ws://localhost:8000");

ws.onopen = function (e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
  ws.send("ping");
};

ws.onmessage = function (event) {
  console.log(`[message] Data received from server: ${event.data}`);
};

ws.onclose = function (event) {
  if (event.wasClean) {
    console.log(
      `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
    );
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log("[close] Connection died");
  }
};

ws.onerror = function (error) {
  console.log(`[error]`);
};
