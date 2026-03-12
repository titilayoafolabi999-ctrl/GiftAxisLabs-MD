const config = require("../../config");
const axios = require("axios");
const fs = require("fs-extra");
const econPath = require("path").join(__dirname, "../../data/economy.json");
async function getDB() { await fs.ensureFile(econPath); return fs.readJson(econPath).catch(()=>({})); }
async function saveDB(db) { await fs.writeJson(econPath, db); }
function getUser(db,id) { if(!db[id]) db[id]={balance:0,xp:0}; return db[id]; }
const triviaGames = new Map();
function decode(s) { return s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#039;/g,"'"); }
module.exports = {
  name: "trivia", alias: ["tq","facttrivia"],
  description: "Answer real trivia questions and earn money",
  category: "games",
  async execute(sock, m, args, reply) {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const key = from + ":" + sender;
    const g = triviaGames.get(key);
    if (g && args.length) {
      const ans = args.join(" ").trim().toLowerCase();
      triviaGames.delete(key);
      clearTimeout(g.timer);
      const isCorrect = ans === g.answer.toLowerCase() || ans === g.answerLetter;
      const db = await getDB(); const user = getUser(db, sender);
      if (isCorrect) {
        const reward = g.difficulty === "hard" ? 500 : g.difficulty === "medium" ? 300 : 150;
        user.balance = (user.balance||0) + reward;
        user.xp = (user.xp||0) + 10;
        await saveDB(db);
        return reply("✅ *CORRECT!*\n🎯 Answer: " + g.answer + "\n💰 +$" + reward + " | ⭐ +10 XP\n💳 Balance: $" + user.balance + config.footer);
      }
      return reply("❌ *WRONG!*\n🎯 Correct answer: " + g.answer + "\nBetter luck next time!" + config.footer);
    }
    const cats = { science: 17, history: 23, sports: 21, music: 12, geography: 22, movies: 11 };
    const catId = cats[args[0]] || "";
    const url = "https://opentdb.com/api.php?amount=1&type=multiple" + (catId ? "&category=" + catId : "");
    try {
      const res = await axios.get(url, { timeout: 10000 });
      if (!res.data.results?.length) return reply("❌ No trivia available. Try again.");
      const q = res.data.results[0];
      const all = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random()-0.5);
      const letters = ["A","B","C","D"];
      const correctLetter = letters[all.indexOf(q.correct_answer)];
      const opts = all.map((a,i) => "├◆ " + letters[i] + ". " + decode(a)).join("\n");
      triviaGames.set(key, {
        answer: decode(q.correct_answer),
        answerLetter: correctLetter.toLowerCase(),
        difficulty: q.difficulty,
        timer: setTimeout(() => triviaGames.delete(key), 30000)
      });
      reply("┌ ❏ ◆ ⌜🧠 𝗧𝗥𝗜𝗩𝗜𝗔⌟ ◆\n│\n" +
        "├◆ 📚 " + decode(q.category) + " | ⚡ " + q.difficulty + "\n│\n" +
        "├◆ ❓ " + decode(q.question) + "\n│\n" +
        opts + "\n│\n" +
        "├◆ .trivia <A/B/C/D>\n├◆ ⏰ 30 seconds!\n└ ❏" + config.footer);
    } catch(e) {
      reply("❌ Trivia fetch failed. Try: .trivia science | history | sports | music | geography | movies");
    }
  }
};
