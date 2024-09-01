import { Command } from "../../deps.ts";
import { kv } from "../kv.ts";

export const setup = new Command()
  .description("setup subcommand description")
  .arguments("<tunnel_name:string> <port:number>")
  // .example("setup tunnel", "pp setup sevapp 8000")
  .action(async (_options, ...args) => {
    const [name, port] = args;
    const res = await kv.set(["tunnels", name], port);

    if (res.ok) {
      Deno.exit(0);
    } else {
      Deno.exit(-1);
    }
  });
