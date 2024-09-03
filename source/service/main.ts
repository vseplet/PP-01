import { requestHandler } from "./requestHandler.ts";
import { websocketHandler } from "./websocketHandler.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const subdomain = url.hostname.split(".")[0];

  return subdomain == "wss"
    ? await websocketHandler(url, req, subdomain)
    : await requestHandler(url, req, subdomain);
}

Deno.serve({
  port: Number(Deno.env.get("PORT")) || 4000,
}, handler);
