const config = require("../../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");
async function ai(prompt) {
  const genAI = new GoogleGenerativeAI(config.geminiKey);
  const model = genAI.getGenerativeModel({ model: config.geminiModel || "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
const SIGNS = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
module.exports = {
  name: "horoscope", alias: ["zodiac","stars","astro"],
  description: "Get your daily AI horoscope",
  category: "productivity",
  async execute(sock, m, args, reply) {
    const sign = (args[0]||"").toLowerCase();
    if (!SIGNS.includes(sign)) return reply("Usage: .horoscope <sign>\n\nSigns: " + SIGNS.join(", ") + "\n\nExample: .horoscope leo");
    reply(config.msg.wait);
    try {
      const today = new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
      const text = await ai("Write a short, uplifting daily horoscope for " + sign + " for " + today + ". Include sections for: Love, Career, and Wellness. Keep each section to 1-2 sentences. Add a lucky number and lucky color at the end. Be positive and motivating.");
      reply("⭐ *Daily Horoscope: " + sign.charAt(0).toUpperCase()+sign.slice(1) + "*\n_" + today + "_\n\n" + text + config.footer);
    } catch(e) { reply("❌ " + e.message); }
  }
};
