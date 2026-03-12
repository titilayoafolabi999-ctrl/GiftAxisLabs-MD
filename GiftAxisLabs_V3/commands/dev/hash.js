const config = require("../../config");
const crypto = require("crypto");
module.exports = {
  name: "hash", alias: ["md5","sha256","encrypt2"],
  description: "Hash text with MD5, SHA1, SHA256, SHA512",
  category: "dev",
  async execute(sock, m, args, reply) {
    const algo = ["md5","sha1","sha256","sha512"].includes((args[0]||"").toLowerCase()) ? args[0].toLowerCase() : null;
    const text = algo ? args.slice(1).join(" ") : args.join(" ");
    if (!text) return reply("Usage: .hash [algo] <text>\nAlgos: md5, sha1, sha256, sha512 (default: all)\nExample: .hash sha256 hello world");
    if (algo) {
      const h = crypto.createHash(algo).update(text).digest("hex");
      return reply("🔐 *" + algo.toUpperCase() + " Hash*\n\nInput: " + text + "\nHash: `" + h + "`" + config.footer);
    }
    const results = ["md5","sha1","sha256","sha512"].map(a =>
      "├◆ " + a.toUpperCase() + ": `" + crypto.createHash(a).update(text).digest("hex") + "`"
    ).join("\n");
    reply("┌ ❏ ◆ ⌜🔐 𝗛𝗔𝗦𝗛 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥⌟ ◆\n│\n├◆ Input: " + text + "\n│\n" + results + "\n└ ❏" + config.footer);
  }
};
