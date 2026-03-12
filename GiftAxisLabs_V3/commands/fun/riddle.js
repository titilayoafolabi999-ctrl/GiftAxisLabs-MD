const config = require("../../config");
const activeRiddles = new Map();
const RIDDLES = [
  {q:"I speak without a mouth and hear without ears. I have no body but I come alive with the wind. What am I?",a:["echo","an echo"]},
  {q:"The more you take, the more you leave behind. What am I?",a:["footstep","footsteps","steps"]},
  {q:"I have cities but no houses. I have mountains but no trees. I have water but no fish. What am I?",a:["map","a map"]},
  {q:"What has keys but no locks, space but no room, and you can enter but can't go inside?",a:["keyboard","a keyboard"]},
  {q:"I am always hungry, I must always be fed. The finger I touch will soon turn red. What am I?",a:["fire","flame"]},
  {q:"What can you break, even if you never pick it up or touch it?",a:["silence","a promise","promise"]},
  {q:"I have hands but I can't clap. What am I?",a:["clock","a clock","watch"]},
  {q:"The more you have of it, the less you see. What is it?",a:["darkness","dark"]},
  {q:"What goes up but never comes down?",a:["age","your age"]},
  {q:"I'm light as a feather, yet the strongest man can't hold me for more than 5 minutes. What am I?",a:["breath","your breath"]},
  {q:"What has a head and a tail but no body?",a:["coin","a coin"]},
  {q:"I can fly without wings. I can be caught but not thrown. What am I?",a:["cold","a cold"]},
  {q:"What gets wetter as it dries?",a:["towel","a towel"]},
  {q:"I have teeth but I can't bite. What am I?",a:["comb","a comb"]},
  {q:"Forward I am heavy, backward I am not. What am I?",a:["ton","a ton"]},
];
module.exports = {
  name: "riddle", alias: ["puzzle","brainteaser"],
  description: "Get a riddle and try to solve it",
  category: "fun",
  async execute(sock, m, args, reply) {
    const from = m.key.remoteJid; const sender = m.key.participant||m.key.remoteJid;
    const key = from+":"+sender;
    const guess = args.join(" ").toLowerCase().trim();
    const active = activeRiddles.get(key);
    if (guess && active) {
      if (active.answers.some(a=>guess.includes(a)||a.includes(guess))) {
        activeRiddles.delete(key);
        return reply("🎉 *CORRECT!* 🧠\n\nAnswer: " + active.answers[0] + "\n\nUse .riddle for another!" + config.footer);
      }
      return reply("❌ Not quite... try again or use .riddle hint\n\n❓ " + active.q);
    }
    if (guess==="hint"&&active) {
      const ans = active.answers[0]; const hint = ans.split("").map((c,i)=>i===0?c:"_").join("");
      return reply("💡 Hint: starts with *" + ans[0].toUpperCase() + "* and has " + ans.length + " letters (" + hint + ")");
    }
    if (guess==="answer"&&active) { activeRiddles.delete(key); return reply("🔍 Answer: *" + active.answers[0] + "*"); }
    const riddle = RIDDLES[Math.floor(Math.random()*RIDDLES.length)];
    activeRiddles.set(key, riddle);
    reply("┌ ❏ ◆ ⌜🧩 𝗥𝗜𝗗𝗗𝗟𝗘⌟ ◆\n│\n├◆ ❓ " + riddle.q + "\n│\n├◆ .riddle <your answer>\n├◆ .riddle hint\n├◆ .riddle answer\n└ ❏" + config.footer);
  }
};
