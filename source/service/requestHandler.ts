import { ulid } from "../deps.ts";
import { tunnels } from "./tunnels.ts";
import { delay } from "https://deno.land/x/delay@v0.2.0/mod.ts";

export const requestHandler = async (url: URL, req: Request) => {
  const pattern1 = new URLPattern({ pathname: "/:prefix/*" });
  const pattern2 = new URLPattern({ pathname: "/:prefix" });
  const matchResult = pattern1.exec(url) || pattern2.exec(url);

  if (matchResult == undefined) return new Response(null, { status: 404 });

  // по префиксу выбирается клиент
  const tunnelName = matchResult.pathname.groups
    .prefix as string;

  if (tunnels[tunnelName] == undefined) {
    return new Response(null, { status: 404 });
  }

  const path = matchResult.pathname.groups["0"];
  const search = matchResult.search.input;
  const localPartOfURL = `${path || ""}${
    search.length > 0 ? "?" + search : ""
  }`;

  const id = ulid();
  const headers: { [key: string]: string } = {};
  req.headers.forEach((value, key) => headers[key] = value);
  const body = await req.text();
  const method = req.method;

  const outgoingMessage = {
    localPartOfURL,
    id,
    method,
    search,
    path,
    headers,
    body,
  };

  if (tunnels[tunnelName].ws.readyState === 1) {
    tunnels[tunnelName].ws.send(JSON.stringify(outgoingMessage));
    console.log(`send msg ${id} to tunnel "${tunnelName}"`);
  } else {
    tunnels[tunnelName].ws.close();
    delete tunnels[tunnelName];
    console.log(`close tunnel "${tunnelName}"`);
    return new Response("OK");
  }

  let waitingTime = 2000;
  while (waitingTime) {
    waitingTime--;
    if (tunnels[tunnelName].incomingMessageBuffer[id] !== undefined) {
      const incomingMsg = tunnels[tunnelName].incomingMessageBuffer[id];
      delete tunnels[tunnelName].incomingMessageBuffer[id];
      console.log(`receive msg ${id} from tunnel "${tunnelName}"`);
      return new Response(incomingMsg.body, {
        headers: incomingMsg.headers,
      });
    }

    await delay(100);
  }

  console.log(`timeout ${id} ${tunnelName}`);
  return new Response("timeout");
};
