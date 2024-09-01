import { Command } from "../../deps.ts";
import { connect } from "../connect.ts";
import { WEBSOCKET_URL } from "../constants.ts";

export const start = new Command()
  .description("start subcommand description")
  .arguments("<tunnel_name:string>")
  .action(async (options, ...args) => {
    const [tunnelName] = args;
    connect(WEBSOCKET_URL, tunnelName);
  });
