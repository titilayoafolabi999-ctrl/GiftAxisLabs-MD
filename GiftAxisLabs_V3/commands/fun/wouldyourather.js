const config = require("../../config");
const WYR = [
  ["be able to fly","be invisible"],["lose all your memories","never be able to make new ones"],
  ["code in only JavaScript forever","never use JavaScript again"],
  ["have infinite money but no free time","infinite free time but no money"],
  ["read minds","see the future"],["speak all languages","play all instruments"],
  ["live without music","live without the internet"],["be 10 minutes early","20 minutes late to everything"],
  ["fight 100 duck-sized horses","one horse-sized duck"],
  ["only be able to code in dark mode","only in light mode with no themes"],
  ["debug someone else's undocumented code","document someone else's undebuggable code"],
  ["have perfect memory","have perfect focus"],["be famous","be rich"],
  ["give up social media for a year","give up your phone for a month"],
  ["know when you'll die","know how you'll die"],
];
const votes = new Map();
module.exports = {
  name: "wyr", alias: ["wouldyourather","wr"],
  description: "Would You Rather — vote and see group results",
  category: "fun",
  async execute(sock, m, args, reply) {
    const from = m.key.remoteJid; const sender = m.key.participant||m.key.remoteJid;
    if ((args[0]==="1"||args[0]==="2") && votes.has(from)) {
      const v = votes.get(from);
      if (!v.voters) v.voters = {};
      v.voters[sender] = parseInt(args[0]);
      const a1 = Object.values(v.voters).filter(x=>x===1).length;
      const a2 = Object.values(v.voters).filter(x=>x===2).length;
      const total = a1+a2;
      const pct1 = total ? Math.round((a1/total)*100) : 0;
      const pct2 = 100-pct1;
      const bar1 = "█".repeat(Math.floor(pct1/10))+"░".repeat(10-Math.floor(pct1/10));
      const bar2 = "█".repeat(Math.floor(pct2/10))+"░".repeat(10-Math.floor(pct2/10));
      return reply("🗳️ Vote registered!\n\n1️⃣ " + v.options[0] + "\n[" + bar1 + "] " + pct1 + "% ("+a1+")\n\n2️⃣ " + v.options[1] + "\n[" + bar2 + "] " + pct2 + "% ("+a2+")" + config.footer);
    }
    const wyr = WYR[Math.floor(Math.random()*WYR.length)];
    votes.set(from, { options: wyr, voters: {} });
    reply("┌ ❏ ◆ ⌜🤔 𝗪𝗢𝗨𝗟𝗗 𝗬𝗢𝗨 𝗥𝗔𝗧𝗛𝗘𝗥⌟ ◆\n│\n├◆ 1️⃣ " + wyr[0] + "\n│\n├◆        — OR —\n│\n├◆ 2️⃣ " + wyr[1] + "\n│\n├◆ Vote: .wyr 1  or  .wyr 2\n└ ❏" + config.footer);
  }
};
