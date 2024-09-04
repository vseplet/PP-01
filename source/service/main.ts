import { requestHandler } from "./requestHandler.ts";
import { tunnelOpenHandler } from "./tunnelOpenHandler.ts";
import { websocketHandler } from "./websocketHandler.ts";

console.log("start!");

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const subdomain = url.hostname.split(".")[0];

  return subdomain == "wss"
    ? await tunnelOpenHandler(url, req, subdomain)
    : req.headers.get("upgrade")
    ? await websocketHandler(url, req, subdomain)
    : await requestHandler(url, req, subdomain);
}

Deno.serve({
  port: Number(Deno.env.get("PORT")) || 4000,
}, handler);
