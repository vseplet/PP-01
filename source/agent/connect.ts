export const connect = (url: string, tunnelName = "test") => {
  const ws = new WebSocket(url);

  ws.onopen = function (e) {
    console.log("[open] Connection established");
    console.log("Sending to server");
    ws.send(JSON.stringify({
      isPortal: true,
      open: tunnelName,
    }));
  };

  ws.onmessage = function (event) {
    try {
      console.log(`[message] Data received from server: ${event.data}`);
      const msg = JSON.parse(event.data); // превратить в Request!!!
      ws.send(JSON.stringify({
        id: msg.id,
        tunnelName,
        body: "Test",
      }));
    } catch (e) {}
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

    setTimeout(function () {
      connect(url, tunnelName);
    }, 1000);
  };

  ws.onerror = function (error) {
    console.log(`[error]`);
  };
};
