import { Command } from "../../deps.ts";
import { kv } from "../kv.ts";

export const remove = new Command()
  // .option("-b, --bar", "Bar option.")
  .arguments("<tunnel_name:string>")
  .action(async (options, ...args) => {
    const [name] = args;
    await kv.delete(["tunnels", name]);
    console.log(`  Tunnel ${name} has been removed!`);
    Deno.exit(0);
  });
