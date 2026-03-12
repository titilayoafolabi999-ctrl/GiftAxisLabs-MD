const config = require("../../config");
const axios = require("axios");
module.exports = {
  name: "npm", alias: ["package","npmsearch"],
  description: "Look up an NPM package",
  category: "dev",
  async execute(sock, m, args, reply) {
    const pkg = args.join(" ").trim();
    if (!pkg) return reply("Usage: .npm <package-name>\nExample: .npm express");
    try {
      const res = await axios.get("https://registry.npmjs.org/" + encodeURIComponent(pkg), { timeout: 10000 });
      const d = res.data;
      const latest = d["dist-tags"]?.latest;
      const v = d.versions?.[latest];
      const weekly = await axios.get("https://api.npmjs.org/downloads/point/last-week/" + pkg, { timeout: 5000 }).catch(()=>null);
      const dls = weekly?.data?.downloads?.toLocaleString() || "N/A";
      reply("┌ ❏ ◆ ⌜📦 𝗡𝗣𝗠 𝗣𝗔𝗖𝗞𝗔𝗚𝗘⌟ ◆\n│\n" +
        "├◆ 📦 " + d.name + "@" + latest + "\n" +
        "├◆ 📝 " + (d.description||"No description").slice(0,80) + "\n" +
        "├◆ 👤 " + (v?.author?.name || d.author?.name || "unknown") + "\n" +
        "├◆ 📅 Updated: " + new Date(d.time?.modified||0).toLocaleDateString() + "\n" +
        "├◆ ⬇️ Downloads/week: " + dls + "\n" +
        "├◆ 📜 License: " + (v?.license || "N/A") + "\n" +
        "├◆ 🔗 npmjs.com/package/" + pkg + "\n└ ❏" + config.footer);
    } catch(e) { reply("❌ Package \"" + pkg + "\" not found on NPM."); }
  }
};
