import localDenoJson from "../../deno.json" with { type: "json" };
import { fetchJSON } from "./helpers.ts";

const remoteDenoJson = await fetchJSON(
  `https://raw.githubusercontent.com/vseplet/PP-01/main/deno.json`,
) as unknown as typeof localDenoJson;

const permissionEnv = Deno.permissions.querySync({ name: "env" }).state;

export const IS_DEVELOP = permissionEnv == "granted"
  ? Deno.env.get("DEV") || false
  : false;

console.log(IS_DEVELOP);

export const VERSION = localDenoJson["version"];
export const REMOTE_VERSION = remoteDenoJson["version"] || VERSION;

export const ENTRYPOINT_SOURCE_URL =
  `https://raw.githubusercontent.com/vseplet/PP-01/${REMOTE_VERSION}/source/client/main.ts`;

export const SERVICE_DOMAIN = IS_DEVELOP
  ? "localhost:3000"
  : "portal-vqhj.onrender.com";

export const WEBSOCKET_URL = `${
  IS_DEVELOP ? "ws" : "wss"
}://${SERVICE_DOMAIN}/wss`;
