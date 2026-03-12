const config = require("../../config");
const afkUsers = new Map();
module.exports = {
  name: "afk", alias: ["away","brb"],
  description: "Set AFK status — bot auto-replies when you're tagged",
  category: "group",
  async execute(sock, m, args, reply) {
    const sender = m.key.participant || m.key.remoteJid;
    const reason = args.join(" ") || "AFK";
    if (afkUsers.has(sender)) {
      const afk = afkUsers.get(sender);
      afkUsers.delete(sender);
      const dur = Math.floor((Date.now()-afk.since)/60000);
      return reply("👋 Welcome back! You were AFK for " + dur + " min.");
    }
    afkUsers.set(sender, { reason, since: Date.now() });
    reply("💤 AFK mode ON\nReason: " + reason + "\n\nWhen someone tags you, I'll let them know.\nType .afk again to turn it off." + config.footer);
  },
  _afkUsers: afkUsers
};
