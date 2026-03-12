const config = require("../../config");
const PRESETS = {
  email: /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i,
  url: /https?:\/\/(www\.)?[\w-]+\.[\w.]+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/,
  phone: /^[+]?[\d\s\-().]{7,15}$/,
  ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
  date: /^\d{4}[-/]\d{2}[-/]\d{2}$/,
  hex: /^#?[0-9a-fA-F]{6}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};
module.exports = {
  name: "regex", alias: ["regexp","regextest","rxtest"],
  description: "Test regex patterns or validate with presets",
  category: "dev",
  async execute(sock, m, args, reply) {
    const preset = PRESETS[(args[0]||"").toLowerCase()];
    if (preset) {
      const test = args.slice(1).join(" ");
      if (!test) return reply("Usage: .regex " + args[0] + " <value to test>");
      const match = preset.test(test);
      return reply((match ? "✅ VALID" : "❌ INVALID") + "\n\nPreset: " + args[0] + "\nInput: " + test + "\nPattern: " + preset.toString().slice(0,100) + config.footer);
    }
    if (args[0]==="presets") return reply("📋 Available presets:\nemail, url, phone, ipv4, date, hex, slug, password\n\nExample: .regex email test@gmail.com" + config.footer);
    const delimPos = args.join(" ").lastIndexOf("|");
    if (delimPos===-1) return reply("Usage: .regex <pattern> | <test string>\nExample: .regex ^\\d+ | 123\n\nPresets: .regex presets\nAvailable: email, url, phone, ipv4, date, hex, slug, password");
    const full = args.join(" ");
    const pattern = full.slice(0,delimPos).trim();
    const testStr = full.slice(delimPos+1).trim();
    try {
      const rx = new RegExp(pattern,"g");
      const matches = [...testStr.matchAll(rx)];
      if (!matches.length) return reply("❌ No matches found.\n\nPattern: /" + pattern + "/\nTest: " + testStr);
      const rows = matches.slice(0,10).map((m,i)=>"├◆ Match "+( i+1)+": `"+m[0]+"`"+(m.index!==undefined?" (pos "+m.index+")":"")).join("\n");
      reply("┌ ❏ ◆ ⌜🔍 𝗥𝗘𝗚𝗘𝗫 𝗥𝗘𝗦𝗨𝗟𝗧𝗦⌟ ◆\n│\n├◆ Pattern: /" + pattern + "/\n├◆ Matches: " + matches.length + "\n│\n" + rows + "\n└ ❏" + config.footer);
    } catch(e) { reply("❌ Invalid regex: " + e.message); }
  }
};
