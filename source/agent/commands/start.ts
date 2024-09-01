import { Command } from "../../deps.ts";
import { connect } from "../connect.ts";
import { WEBSOCKET_URL } from "../constants.ts";
import { kv } from "../kv.ts";

export const start = new Command()
  .description("start subcommand description")
  .arguments("<alias:string>")
  .action(async (options, ...args) => {
    const data = (await kv.get(["tunnels", args[0]])).value as any;

    connect(WEBSOCKET_URL, data.name);
  });
