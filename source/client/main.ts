const connect = () => {
  const ws = new WebSocket("wss://portal-vqhj.onrender.com");

  ws.onopen = function (e) {
    console.log("[open] Connection established");
    console.log("Sending to server");
    ws.send("ping");
  };

  ws.onmessage = function (event) {
    try {
      console.log(`[message] Data received from server: ${event.data}`);
      const msg = JSON.parse(event.data);
      ws.send(JSON.stringify({
        id: msg.id,
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
      connect();
    }, 1000);
  };

  ws.onerror = function (error) {
    console.log(`[error]`);
  };
};

connect();

// Tester
setInterval(async () => {
  try {
    await fetch("http://portal-vqhj.onrender.com/hi", {
      method: "POST",
      body: JSON.stringify({
        "data": Math.random(),
      }),
    });
  } catch (e) {}
}, 1000);
