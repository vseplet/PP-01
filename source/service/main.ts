import { ulid } from "jsr:@std/ulid";
import { delay } from "https://deno.land/x/delay@v0.2.0/mod.ts";

const kv = Deno.openKv();

const tunnels: {
  [name: string]: {
    ws: WebSocket;
    incomingMessageBuffer: any;
    timestamp: number;
  };
} = {};

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname == "/wss") {
    const upgrade = req.headers.get("upgrade");
    if (upgrade === null || upgrade != "websocket") {
      return new Response(null, { status: 501 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.addEventListener("open", () => {
      console.log("a client connected!");
    });

    socket.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.isPortal) {
        tunnels[msg.open] = {
          ws: socket,
          incomingMessageBuffer: [],
          timestamp: new Date().getTime(),
        };
      } else {
        tunnels[msg.tunnelName].incomingMessageBuffer[msg.id] = msg;
      }
    });
    socket.addEventListener("close", (event) => {});
    socket.addEventListener("error", (event) => {});

    return response;
  } else {
    const pattern1 = new URLPattern({ pathname: "/:prefix/*" });
    const pattern2 = new URLPattern({ pathname: "/:prefix" });
    const matchResult = pattern1.exec(url) || pattern2.exec(url);

    if (matchResult == undefined) return new Response();

    // по префиксу выбирается клиент
    const tunnelName = matchResult.pathname.groups
      .prefix as string;

    if (tunnels[tunnelName] == undefined) return new Response();

    const path = matchResult.pathname.groups["0"];
    const search = matchResult.search.input;
    const localPartOfURL = `${path || ""}${
      search.length > 0 ? "?" + search : ""
    }`;

    const id = ulid();
    const headers: { [key: string]: string } = {};
    req.headers.forEach((value, key) => headers[key] = value);
    const body = await req.bytes();

    const outgoingMessage = {
      localPartOfURL,
      id,
      headers,
      // body,
    };

    if (tunnels[tunnelName].ws.readyState === 1) {
      tunnels[tunnelName].ws.send(JSON.stringify(outgoingMessage));
      console.log(`out ${id} ${tunnelName}`);
    } else {
      tunnels[tunnelName].ws.close();
      delete tunnels[tunnelName];
      console.log(`close tunnel ${tunnelName}`);
      return new Response("OK");
    }

    let waitingTime = 2000;
    while (waitingTime) {
      waitingTime--;
      if (tunnels[tunnelName].incomingMessageBuffer[id] !== undefined) {
        const incomingMsg = tunnels[tunnelName].incomingMessageBuffer[id]; // надо превратить в Response!
        delete tunnels[tunnelName].incomingMessageBuffer[id];
        console.log(`in  ${id} ${tunnelName}`);
        return new Response("OK");
      }

      await delay(1);
    }

    console.log(`timeout ${id} ${tunnelName}`);
    return new Response("timeout");
  }
}

Deno.serve({
  port: Number(Deno.env.get("PORT")) || 3000,
}, handler);
