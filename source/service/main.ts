import { requestHandler } from "./requestHandler.ts";
import { websocketHandler } from "./websocketHandler.ts";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  return url.pathname.includes("/wss/")
    ? await websocketHandler(url, req)
    : await requestHandler(url, req);
}

Deno.serve({
  port: Number(Deno.env.get("PORT")) || 3000,
}, handler);
