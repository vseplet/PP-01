Deno.serve({
  port: Number(Deno.env.get("PORT")) || 8000,
}, (req: Request) => {
  return new Response();
});
