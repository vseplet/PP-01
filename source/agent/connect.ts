import { base64 } from "../deps.ts";
import { SERVICE_DOMAIN } from "./constants.ts";
import { kv } from "./kv.ts";

export const connect = async (
  url: string,
  alias = "test",
  attempts = 100,
) => {
  const data = (await kv.get(["tunnels", alias])).value as any;
  const tunnelName = data.name;
  const port = data.port;
  const ws = new WebSocket(`${url}/${tunnelName}`);

  ws.onopen = function (e) {
    console.log(
      `Tunnel opened through https://${tunnelName}.${SERVICE_DOMAIN}`,
    );
  };

  ws.onmessage = async (event) => {
    try {
      const msg = JSON.parse(event.data);

      // console.log(event.data);

      console.log(
        `request ${msg.id} from tunnel "${tunnelName}" to "${`http://localhost:${port}/${msg.localPartOfURL}`}"`,
      );

      // console.log(JSON.stringify(msg, null, 2));
      const init: any = {
        method: msg.method,
        headers: msg.headers,
      };

      if (msg.body.length > 0) {
        init["body"] = base64.decodeBase64(msg.body);
      }

      const response = await fetch(
        new Request(
          `http://localhost:${port}/${msg.localPartOfURL}`,
          init,
        ),
      );

      console.log(
        `response ${msg.id} from "${`http://localhost:${port}/${msg.localPartOfURL}`}" to tunnel "${tunnelName}": ${response.status}`,
      );

      // console.log(response.headers);
      const body = base64.encodeBase64(
        await (await response.blob()).arrayBuffer(),
      );
      // console.log(body);
      // console.log(response.status);
      // console.log(response.statusText);
      // console.log(body.length);

      const headers: { [key: string]: string } = {};
      response.headers.forEach((value, key) => headers[key] = value);

      ws.send(JSON.stringify({
        id: msg.id,
        tunnelName,
        headers,
        body,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  ws.onclose = function (event) {
    if (event.wasClean) {
      console.log(
        `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
      );
    } else {
      // console.log(event);
      console.log(`[close] Connection died, reason=${event.reason}`);
    }

    // setTimeout(function () {
    //   if (attempts) {
    //     console.log(`try to reconnect...`);
    //     connect(url, alias, attempts - 1);
    //   } else {
    //     Deno.exit(-1);
    //   }
    // }, 1000);
  };

  ws.onerror = function (error) {
    console.log(error);
    console.log(`[error] ${error}`);

    setTimeout(function () {
      // console.log(`try to reconnect...`);
      // connect(url, alias, attempts);
    }, 1000);
  };
};

// TODO: ломается на  "if-none-match": "W/\"3e1-qIbHSACSDE3MWk8XsBJnCcIv8O8\"",
// TODO: не переподключается после засыпания хостинга
