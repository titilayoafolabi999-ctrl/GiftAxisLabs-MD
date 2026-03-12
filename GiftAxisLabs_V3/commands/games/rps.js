const config = require("../../config");
const fs = require("fs-extra");
const econPath = require("path").join(__dirname, "../../data/economy.json");
async function getDB() { await fs.ensureFile(econPath); return fs.readJson(econPath).catch(()=>({})); }
async function saveDB(db) { await fs.writeJson(econPath, db); }
module.exports = {
  name: "rps", alias: ["rockpaperscissors"],
  description: "Rock Paper Scissors vs bot — optional bet",
  category: "games",
  async execute(sock, m, args, reply) {
    const choices = ["rock","paper","scissors"];
    const emoji = { rock:"🪨", paper:"📄", scissors:"✂️" };
    const player = (args[0]||"").toLowerCase();
    if (!choices.includes(player)) return reply("Usage: .rps <rock|paper|scissors> [bet amount]\nExample: .rps rock 200");
    const bet = parseInt(args[1]) || 0;
    const bot = choices[Math.floor(Math.random()*3)];
    let result;
    if (player===bot) result="tie";
    else if ((player==="rock"&&bot==="scissors")||(player==="paper"&&bot==="rock")||(player==="scissors"&&bot==="paper")) result="win";
    else result="lose";
    let econLine = "";
    if (bet > 0) {
      const sender = m.key.participant || m.key.remoteJid;
      const db = await getDB();
      if (!db[sender]) db[sender] = {balance:0};
      if ((db[sender].balance||0) >= bet) {
        if (result==="win") db[sender].balance += bet;
        else if (result==="lose") db[sender].balance = Math.max(0, db[sender].balance - bet);
        econLine = "\n" + (result==="win" ? "💰 +$"+bet : result==="lose" ? "💸 -$"+bet : "🤝 No change") + "\n💳 Balance: $" + db[sender].balance;
        await saveDB(db);
      }
    }
    const msgs = { win:"🎉 YOU WIN!", lose:"😢 YOU LOSE!", tie:"🤝 IT'S A TIE!" };
    reply("┌ ❏ ◆ ⌜🎮 𝗥𝗣𝗦⌟ ◆\n│\n├◆ You: "+emoji[player]+" "+player+"\n├◆ Bot: "+emoji[bot]+" "+bot+"\n│\n├◆ "+msgs[result]+econLine+"\n└ ❏"+config.footer);
  }
};
