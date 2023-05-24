import { event } from "../utils";
const process = require("node:process");
export default event("ready", ({ log }, client) => {
  process.send = process.send || function () {};

  process.send("ready");
  log(`Logged in as ${client.user.tag}`);
});
