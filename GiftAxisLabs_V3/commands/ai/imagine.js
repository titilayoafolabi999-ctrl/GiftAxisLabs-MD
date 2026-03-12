const config = require("../../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function ai(prompt) {
  const genAI = new GoogleGenerativeAI(config.geminiKey);
  const model = genAI.getGenerativeModel({ model: config.geminiModel || "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
module.exports = {
  name: "imagine", alias: ["prompt","imgprompt","aiart"],
  description: "Generate a detailed AI image prompt from a simple idea",
  category: "ai",
  async execute(sock, m, args, reply) {
    if (!args.length) return reply("Usage: .imagine <your idea>\nExample: .imagine a dragon flying over Lagos at sunset\n\nThis generates a detailed prompt you can use in DALL-E, Midjourney, or Stable Diffusion.");
    const idea = args.join(" ");
    reply(config.msg.wait);
    try {
      const text = await ai("Convert this simple idea into a detailed, professional AI image generation prompt for DALL-E 3 / Midjourney:\n\nIdea: \"" + idea + "\"\n\nInclude: art style, lighting, camera angle, color palette, mood, and specific details. Make it vivid and specific. Format as ONE paragraph prompt.");
      reply("🎨 *AI Image Prompt for:* " + idea + "\n\n\"" + text + "\"\n\n_Use this in DALL-E, Midjourney, or Stable Diffusion!_" + config.footer);
    } catch(e) { reply("❌ " + e.message); }
  }
};
