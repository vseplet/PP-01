function handler(_req: Request): Response {
  return new Response("Hello, World!");
}

Deno.serve({
  port: Number(Deno.env.get("PORT")) || 8000,
}, handler);
