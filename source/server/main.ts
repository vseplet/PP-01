function handler(req: Request): Response {
  const upgrade = req.headers.get("upgrade");

  if (upgrade == null) {
    return new Response("Hello, World!");
  } else {
    if (req.headers.get("upgrade") != "websocket") {
      return new Response(null, { status: 501 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.addEventListener("open", () => {
      console.log("a client connected!");
    });

    socket.addEventListener("message", (event) => {
      if (event.data === "ping") {
        console.log("ping");
        socket.send("pong");
      }
    });

    return response;
  }
}

Deno.serve({
  port: Number(Deno.env.get("PORT")) || 8000,
}, handler);
