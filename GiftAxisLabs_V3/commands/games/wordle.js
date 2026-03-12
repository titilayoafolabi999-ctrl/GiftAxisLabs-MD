const config = require("../../config");
const fs = require("fs-extra");
const econPath = require("path").join(__dirname, "../../data/economy.json");
async function getDB() { await fs.ensureFile(econPath); return fs.readJson(econPath).catch(()=>({})); }
async function saveDB(db) { await fs.writeJson(econPath, db); }
const wordleGames = new Map();
const WORDS = ["brave","clean","crane","flute","globe","grace","haste","ideal","knife","label","magic","noble","ocean","plant","quest","river","stone","tiger","ultra","valid","watch","alarm","blaze","cloud","dance","eager","flame","giant","heart","jazzy","karma","light","march","night","onset","power","quiet","raise","scale","table","vapor","width","youth","speed","debug","array","async","await","class","const","input","local","logic","merge","modal","param","regex","scope","state","token","types","value"];
function evaluate(guess, answer) {
  const res = Array(5).fill("⬛");
  const ac = [...answer]; const gc = [...guess];
  for(let i=0;i<5;i++){if(gc[i]===ac[i]){res[i]="🟩";ac[i]=null;gc[i]=null;}}
  for(let i=0;i<5;i++){if(gc[i]){const idx=ac.indexOf(gc[i]);if(idx!==-1){res[i]="🟨";ac[idx]=null;}}}
  return res.join("");
}
module.exports = {
  name: "wordle", alias: ["wg","wordgame"],
  description: "Play Wordle — guess the 5-letter word in 6 tries",
  category: "games",
  async execute(sock, m, args, reply) {
    const sender = m.key.participant || m.key.remoteJid;
    const g = wordleGames.get(sender);
    const guess = (args[0]||"").toLowerCase();
    if (guess && g) {
      if (guess.length!==5||!/^[a-z]+$/.test(guess)) return reply("Must be a 5-letter word.");
      const row = evaluate(guess, g.word) + "  " + guess.toUpperCase();
      g.history.push(row);
      const board = g.history.join("\n");
      if (guess===g.word) {
        wordleGames.delete(sender);
        const db=await getDB(); if(!db[sender]) db[sender]={balance:0};
        const reward = Math.max(50,(7-g.history.length)*100);
        db[sender].balance=(db[sender].balance||0)+reward; await saveDB(db);
        return reply(board+"\n\n🎉 Correct in "+g.history.length+" tries! +$"+reward+config.footer);
      }
      if (g.history.length>=6) {
        wordleGames.delete(sender);
        return reply(board+"\n\n💀 Out of tries! Word: *"+g.word.toUpperCase()+"*");
      }
      return reply(board+"\n\nTry "+g.history.length+"/6: .wordle <5-letter-word>\n🟩=right spot  🟨=wrong spot  ⬛=not in word");
    }
    const word = WORDS[Math.floor(Math.random()*WORDS.length)];
    wordleGames.set(sender,{word,history:[]});
    reply("┌ ❏ ◆ ⌜🟩 𝗪𝗢𝗥𝗗𝗟𝗘⌟ ◆\n│\n├◆ Guess the 5-letter word!\n├◆ 🟩 Correct letter & spot\n├◆ 🟨 Correct letter, wrong spot\n├◆ ⬛ Letter not in word\n├◆ 6 tries to guess it\n│\n├◆ .wordle <word>\n└ ❏"+config.footer);
  }
};
