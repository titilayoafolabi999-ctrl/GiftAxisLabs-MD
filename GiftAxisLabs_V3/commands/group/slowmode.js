const config = require("../../config");
const database = require("../../lib/database");
const lastMsg = new Map();
module.exports = {
  name: "slowmode", alias: ["slow","ratelimit"],
  description: "Enable slow mode — limits how often each member can send messages",
  category: "group", adminOnly: true, groupOnly: true,
  async execute(sock, m, args, reply) {
    const from = m.key.remoteJid;
    const seconds = parseInt(args[0]);
    if (args[0]==="off"||args[0]==="disable") {
      database.setGroupSetting(from, "slowMode", 0);
      return reply("✅ Slow mode disabled." + config.footer);
    }
    if (!seconds || seconds < 5 || seconds > 3600) return reply("Usage: .slowmode <seconds>\nMin: 5s  Max: 3600s (1hr)\nDisable: .slowmode off\n\nExample: .slowmode 30");
    database.setGroupSetting(from, "slowMode", seconds * 1000);
    reply("⏱️ *Slow mode enabled!*\nMembers must wait *" + seconds + " seconds* between messages." + config.footer);
  },
  _lastMsg: lastMsg
};
