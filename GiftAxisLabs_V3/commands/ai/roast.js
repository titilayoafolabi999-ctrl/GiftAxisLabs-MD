const config = require("../../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function ai(prompt) {
  const genAI = new GoogleGenerativeAI(config.geminiKey);
  const model = genAI.getGenerativeModel({ model: config.geminiModel || "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
module.exports = {
  name: "roast", alias: ["burn","rekt"],
  description: "Get an AI-generated fun roast (all in good humor)",
  category: "ai",
  async execute(sock, m, args, reply) {
    const target = args.join(" ") || "this chat";
    reply(config.msg.wait);
    try {
      const text = await ai("Write a funny, playful roast about \"" + target + "\" — keep it humorous and light-hearted, NOT mean-spirited or offensive. Max 4 lines. End with a compliment that softens the roast.");
      reply("🔥 *Roast:*\n\n" + text + "\n\n_(All in good fun! 😄)_" + config.footer);
    } catch(e) { reply("❌ " + e.message); }
  }
};
