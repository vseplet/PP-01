import { tunnels } from "./tunnels.ts";

export const websocketHandler = async (url: URL, req: Request) => {
  const wsPattern = new URLPattern({ pathname: "/wss/:tunnelName" });
  const matchResult = wsPattern.exec(url);
  const upgrade = req.headers.get("upgrade");

  if (upgrade === null || upgrade != "websocket") {
    return new Response(null, { status: 501 });
  }

  const tunnelName = matchResult?.pathname.groups["tunnelName"] as string;

  if (tunnels[tunnelName] !== undefined) {
    console.log("This tunnel already exists!");
    return new Response("This tunnel already exists!", {
      status: 501,
      statusText: "This tunnel already exists!",
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    tunnels[tunnelName] = {
      ws: socket,
      incomingMessageBuffer: [],
      timestamp: new Date().getTime(),
    };

    console.log(`open tunnel "${tunnelName}"`);
  });

  socket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    tunnels[msg.tunnelName].incomingMessageBuffer[msg.id] = msg;
  });

  socket.addEventListener("close", (event) => {
    console.log(`close tunnel "${tunnelName}"`);
    delete tunnels[tunnelName];
  });

  socket.addEventListener("error", (event) => {});

  return response;
};
