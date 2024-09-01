import { Command } from "../../deps.ts";
import { kv } from "../kv.ts";

export const remove = new Command()
  .description("remove subcommand description")
  .arguments("<tunnel_name:string>")
  .action(async (_options, ...args) => {
    const [name] = args;
    await kv.delete(["tunnels", name]);
    console.log(`  Tunnel ${name} has been removed!`);
    Deno.exit(0);
  });
