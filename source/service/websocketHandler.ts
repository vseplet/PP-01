import { tunnels } from "./tunnels.ts";

export const websocketHandler = async (
  url: URL,
  req: Request,
  subdomain: string,
) => {
  const protocol = req.headers.get("Sec-WebSocket-Protocol");

  const { socket, response } = Deno.upgradeWebSocket(req, {
    protocol: protocol || undefined,
  });

  socket.addEventListener("open", () => {
    console.log(`open websocket for "${subdomain}" on protocol "${protocol}"`);
  });

  socket.addEventListener("message", (event) => {
    console.log(event);
  });

  socket.addEventListener("close", (event) => {
    console.log(`close websocket for "${subdomain}" on protocol "${protocol}"`);
  });

  socket.addEventListener("error", (event) => {
    console.log("error");
  });

  return response;
};
