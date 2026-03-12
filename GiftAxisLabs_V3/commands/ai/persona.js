const config = require("../../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function ai(prompt) {
  const genAI = new GoogleGenerativeAI(config.geminiKey);
  const model = genAI.getGenerativeModel({ model: config.geminiModel || "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
const PERSONAS = {
  einstein: "Albert Einstein, physicist. Speak with wonder about the universe, use physics metaphors, occasional German phrases.",
  elon: "Elon Musk, tech entrepreneur. Ambitious, blunt, focused on Mars, AI, and EVs. Use memes occasionally.",
  shakespeare: "William Shakespeare. Respond in poetic Elizabethan English with thee/thou/wherefore. Dramatic.",
  socrates: "Socrates, Greek philosopher. Answer questions with questions. Challenge assumptions. Seek truth through dialogue.",
  yoda: "Master Yoda from Star Wars. Inverted sentence structure. Wise. Short sentences. 'Hmm, yes.'",
  gordon: "Gordon Ramsay, chef. Brutally honest about food. Passionate. Occasionally frustrated. Very direct.",
  tony: "Tony Stark / Iron Man. Genius, billionaire, sarcastic, confident. Tech references. Witty comebacks.",
  morgan: "Morgan Freeman narrating life. Calm, wise, profound. Make mundane things sound epic.",
};
module.exports = {
  name: "persona", alias: ["character","talkto","impersonate"],
  description: "Chat with an AI persona (Einstein, Elon, Yoda, Shakespeare, etc.)",
  category: "ai",
  async execute(sock, m, args, reply) {
    const name = (args[0]||"").toLowerCase();
    const question = args.slice(1).join(" ");
    if (!name || !PERSONAS[name]) {
      const list = Object.keys(PERSONAS).join(", ");
      return reply("Usage: .persona <name> <your message>\n\nAvailable: " + list + "\n\nExample: .persona yoda What is the meaning of life?" + config.footer);
    }
    if (!question) return reply("Ask something! .persona " + name + " <your question>");
    reply(config.msg.wait);
    try {
      const text = await ai("You are " + PERSONAS[name] + "\n\nRespond to this in character (2-4 sentences, stay in character throughout):\n\"" + question + "\"");
      reply("🎭 *" + name.charAt(0).toUpperCase()+name.slice(1) + ":*\n\n" + text + config.footer);
    } catch(e) { reply("❌ " + e.message); }
  }
};
