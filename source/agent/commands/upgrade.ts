import { Command, shelly } from "../../deps.ts";
import {
  ENTRYPOINT_SOURCE_URL,
  REMOTE_VERSION,
  VERSION,
} from "../constants.ts";

export const upgrade = new Command()
  .description("upgrade subcommand description")
  .action(async (options, ...args) => {
    if (REMOTE_VERSION !== VERSION) {
      await shelly([
        "deno",
        "install",
        "--allow-net",
        "-r",
        "--unstable-kv",
        "-n pp",
        ENTRYPOINT_SOURCE_URL,
      ]);
    } else {
      console.log(`  The latest version is already installed!`);
    }

    Deno.exit();
  });
