import { SERVICE_DOMAIN } from "./constants.ts";
import { kv } from "./kv.ts";

export const connect = async (
  url: string,
  alias = "test",
  attempts = 5,
) => {
  const data = (await kv.get(["tunnels", alias])).value as any;
  const tunnelName = data.name;
  const port = data.port;

  console.log(`${url}/${tunnelName}`);
  const ws = new WebSocket(`${url}/${tunnelName}`);

  ws.onopen = function (e) {
    console.log(
      `Tunnel opened through https://${SERVICE_DOMAIN}/${tunnelName}`,
    );
  };

  ws.onmessage = async (event) => {
    try {
      const msg = JSON.parse(event.data);

      console.log(
        `request ${msg.id} from tunnel "${tunnelName}" to "${msg.localPartOfURL}"`,
      );

      // console.log(JSON.stringify(msg, null, 2));
      const response = await fetch(
        new Request(
          `http://localhost:${port}/${msg.localPartOfURL}`,
          {
            method: msg.method,
            headers: msg.headers,
            body: msg.body,
          },
        ),
      );

      const headers: { [key: string]: string } = {};
      response.headers.forEach((value, key) => headers[key] = value);

      ws.send(JSON.stringify({
        id: msg.id,
        tunnelName,
        headers,
        body: await response.text(),
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
      console.log(event);
      console.log(`[close] Connection died, reason=${event.reason}`);
    }

    setTimeout(function () {
      if (attempts) {
        console.log(`try to reconnect...`);
        connect(url, tunnelName, attempts - 1);
      } else {
        Deno.exit(-1);
      }
    }, 1000);
  };

  ws.onerror = function (error) {
    console.log(`[error]`);
  };
};
