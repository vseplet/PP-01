import { ulid } from "jsr:@std/ulid";
import { delay } from "https://deno.land/x/delay@v0.2.0/mod.ts";

let clientSocket: WebSocket | null = null;
const incomingMessageBuffer: any = {};

async function handler(req: Request): Promise<Response> {
  const upgrade = req.headers.get("upgrade");

  if (upgrade == null) {
    const id = ulid();
    const url = req.url;
    const headers = req.headers;
    const body = await req.bytes();

    if (clientSocket) {
      console.log(`req  ${id}`);
      clientSocket.send(JSON.stringify({
        id,
        url,
        headers,
        body,
      }));
    }

    let waitingTime = 2000;

    // console.log(Object.keys(incomingMessageBuffer).length);

    while (waitingTime) {
      waitingTime--;
      if (incomingMessageBuffer[id] !== undefined) {
        delete incomingMessageBuffer[id];
        console.log(`resp ${id}`);
        return new Response("OK");
      }

      await delay(1);
    }

    console.log(`timeout ${id}`);
    return new Response("timeout");
  } else {
    if (req.headers.get("upgrade") != "websocket") {
      return new Response(null, { status: 501 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.addEventListener("open", () => {
      console.log("a client connected!");
      clientSocket = socket;
    });

    socket.addEventListener("message", (event) => {
      if (event.data === "ping") {
        console.log("ping");
        socket.send("pong");
      } else {
        const msg = JSON.parse(event.data);
        incomingMessageBuffer[msg.id] = msg;
      }
    });

    socket.addEventListener("close", (event) => {});

    socket.addEventListener("error", (event) => {});

    return response;
  }
}

Deno.serve({
  port: Number(Deno.env.get("PORT")) || 8000,
}, handler);
