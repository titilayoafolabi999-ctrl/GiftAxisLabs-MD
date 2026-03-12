const config = require("../../config");
const database = require("../../lib/database");
const msgCount = new Map();
module.exports = {
  name: "antiflood", alias: ["floodcontrol","flood"],
  description: "Anti-flood — warn/mute spammers automatically",
  category: "group", adminOnly: true, groupOnly: true,
  async execute(sock, m, args, reply) {
    const from = m.key.remoteJid;
    if (args[0]==="off") {
      database.setGroupSetting(from, "antiFlood", false);
      return reply("✅ Anti-flood disabled." + config.footer);
    }
    const limit = parseInt(args[0]) || 5;
    database.setGroupSetting(from, "antiFlood", true);
    database.setGroupSetting(from, "antiFloodLimit", limit);
    reply("🌊 *Anti-Flood enabled!*\nLimit: " + limit + " messages per 10 seconds\nViolators get muted for 60 seconds." + config.footer);
  },
  _msgCount: msgCount
};
