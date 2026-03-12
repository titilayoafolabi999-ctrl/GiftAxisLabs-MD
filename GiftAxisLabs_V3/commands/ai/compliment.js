const config = require("../../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function ai(prompt) {
  const genAI = new GoogleGenerativeAI(config.geminiKey);
  const model = genAI.getGenerativeModel({ model: config.geminiModel || "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
module.exports = {
  name: "compliment", alias: ["praise","hype","clap"],
  description: "Generate a unique, genuine AI compliment",
  category: "ai",
  async execute(sock, m, args, reply) {
    const target = args.join(" ") || (m.pushName || "you");
    const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    reply(config.msg.wait);
    try {
      const text = await ai("Write one unique, genuine, heartfelt compliment for someone named \"" + target + "\". Make it specific and meaningful, not generic. 2-3 sentences max.");
      if (mentions.length) {
        await sock.sendMessage(m.key.remoteJid, { text: "🌟 *For @" + mentions[0].split("@")[0] + ":*\n\n" + text + config.footer, mentions }, { quoted: m });
      } else {
        reply("🌟 *For " + target + ":*\n\n" + text + config.footer);
      }
    } catch(e) { reply("❌ " + e.message); }
  }
};
