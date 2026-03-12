const config = require("../../config");
module.exports = {
  name: "format", alias: ["jsonformat","prettify","beautify"],
  description: "Format/minify JSON, or analyze code structure",
  category: "dev",
  async execute(sock, m, args, reply) {
    const type = (args[0]||"pretty").toLowerCase();
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const raw = args.slice(1).join(" ") || quoted?.conversation || "";
    if (!raw) return reply("Usage: .format <pretty|minify|validate> <JSON>\nOr: reply to a JSON message with .format");
    try {
      const parsed = JSON.parse(raw);
      if (type==="minify") {
        const minified = JSON.stringify(parsed);
        return reply("📦 *Minified JSON:*\n```\n" + minified.slice(0,2000) + "\n```" + config.footer);
      }
      if (type==="validate") {
        const keys = Object.keys(parsed).length;
        return reply("✅ *Valid JSON*\n├◆ Keys: " + keys + "\n├◆ Size: " + raw.length + " bytes\n├◆ Type: " + (Array.isArray(parsed)?"Array":"Object") + config.footer);
      }
      const pretty = JSON.stringify(parsed, null, 2);
      reply("✨ *Formatted JSON:*\n```json\n" + pretty.slice(0,2000) + (pretty.length>2000?"\n...(truncated)":"") + "\n```" + config.footer);
    } catch(e) { reply("❌ Invalid JSON: " + e.message); }
  }
};
