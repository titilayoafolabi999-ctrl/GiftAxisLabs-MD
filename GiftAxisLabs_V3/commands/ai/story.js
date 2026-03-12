const config = require("../../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function ai(prompt) {
  const genAI = new GoogleGenerativeAI(config.geminiKey);
  const model = genAI.getGenerativeModel({ model: config.geminiModel || "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
const storyGames = new Map();
module.exports = {
  name: "story", alias: ["collab","storyteller"],
  description: "Collaborative AI story — you and the AI build a story together",
  category: "ai",
  async execute(sock, m, args, reply) {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const key = from + ":" + sender;
    const sub = (args[0]||"").toLowerCase();
    if (sub==="end"||sub==="finish") {
      const s = storyGames.get(key);
      if (!s) return reply("No active story. Start with .story new <genre>");
      storyGames.delete(key);
      return reply("📖 *Story ended!*\n\n_" + s.genre + " story with " + s.turns + " turns_\n\nFull story:\n" + s.history.join("\n\n") + config.footer);
    }
    if (sub==="new"||sub==="start"||!storyGames.has(key)) {
      const genre = args.slice(1).join(" ") || "adventure";
      reply(config.msg.wait);
      const opening = await ai("Start a short, engaging " + genre + " story. Write just 3-4 sentences for the opening scene. End with a cliffhanger that invites the reader to decide what happens next. Make it exciting!").catch(e=>"❌ "+e.message);
      storyGames.set(key, { genre, history: [opening], turns: 1 });
      return reply("📖 *Collaborative Story: " + genre + "*\n\n" + opening + "\n\n_Continue with: .story <what happens next>_\n_End with: .story end_" + config.footer);
    }
    const continuation = args.join(" ");
    if (!continuation) return reply("Tell me what happens next! .story <your addition>\nOr .story end to finish.");
    const s = storyGames.get(key);
    reply(config.msg.wait);
    const next = await ai("This is a " + s.genre + " story so far:\n" + s.history.join("\n") + "\n\nThe reader says: \"" + continuation + "\"\n\nContinue the story naturally based on this input. Write 3-4 sentences. Keep it engaging and end on a moment that invites further input.").catch(e=>"❌ "+e.message);
    s.history.push("You: " + continuation);
    s.history.push(next);
    s.turns++;
    reply("📖 " + next + "\n\n_Turn " + s.turns + " — continue: .story <what happens next>  |  .story end_" + config.footer);
  }
};
