Deno.serve({
  port: Number(Deno.env.get("PORT")) || 8000,
}, async (req: Request) => {
  const text = await req.text();
  console.log(`request! ${text}`);
  return new Response(text, {
    headers: {
      "content-type": req.headers.get("content-type") as string,
    },
  });
});
