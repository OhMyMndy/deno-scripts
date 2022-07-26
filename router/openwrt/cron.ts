import { LuciRpc } from "./lib.ts";

const hostname = Deno.args[0];
const username = Deno.args[1];
const password = Deno.args[2];

const api = new LuciRpc(hostname, username, password, null);

const loggedIn = await api.login();

if (!loggedIn) {
  console.error("not logged in!");
  Deno.exit(3);
}

const response = await api.readFile("/etc/crontabs/root");

console.log(response);
