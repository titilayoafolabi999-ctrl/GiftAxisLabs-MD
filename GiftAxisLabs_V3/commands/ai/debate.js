const config = require("../../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function ai(prompt) {
  const genAI = new GoogleGenerativeAI(config.geminiKey);
  const model = genAI.getGenerativeModel({ model: config.geminiModel || "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
module.exports = {
  name: "debate", alias: ["bothsides","argue"],
  description: "AI argues both sides of any topic",
  category: "ai",
  async execute(sock, m, args, reply) {
    if (!args.length) return reply("Usage: .debate <topic>\nExample: .debate Python vs JavaScript\n.debate Should AI replace programmers?");
    const topic = args.join(" ");
    reply(config.msg.wait);
    try {
      const text = await ai("Debate the topic: \"" + topic + "\"\n\nGive 3 strong arguments FOR and 3 strong arguments AGAINST. Be concise, balanced, and insightful. Format:\n\nFOR:\n1. ...\n2. ...\n3. ...\n\nAGAINST:\n1. ...\n2. ...\n3. ...\n\nVERDICT: (1 sentence balanced conclusion)");
      reply("⚔️ *Debate: " + topic + "*\n\n" + text + config.footer);
    } catch(e) { reply("❌ " + e.message); }
  }
};
