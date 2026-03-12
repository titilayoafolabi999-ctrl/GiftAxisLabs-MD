const config = require("../../config");
const fs = require("fs-extra");
const path = require("path");
const POLLS_FILE = path.join(__dirname, "../../data/polls.json");
async function getPolls() { await fs.ensureFile(POLLS_FILE); return fs.readJson(POLLS_FILE).catch(() => ({})); }
async function savePolls(p) { await fs.writeJson(POLLS_FILE, p); }
const EMOJIS = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣"];
module.exports = [
  {
    name: "poll", alias: ["createpoll"],
    description: "Create a group poll", category: "group", groupOnly: true,
    async execute(sock, m, args, reply) {
        const raw = args.join(" ");
        const parts = raw.split("|").map(s => s.trim()).filter(Boolean);
        if (parts.length < 3) return reply("Usage: .poll <question> | <option1> | <option2> | ...\nExample: .poll Favorite language? | JavaScript | Python | Go");
        const [question, ...options] = parts;
        if (options.length > 8) return reply("❌ Max 8 options.");
        const from = m.key.remoteJid;
        const polls = await getPolls();
        const pollId = Date.now().toString();
        polls[from] = { id: pollId, question, options, votes: {}, createdBy: m.key.participant || m.key.remoteJid, createdAt: Date.now(), active: true };
        await savePolls(polls);
        const optStr = options.map((o,i) => `${EMOJIS[i]} ${o}`).join("\n");
        await sock.sendMessage(from, {
            text: `┌ ❏ ◆ ⌜📊 𝗣𝗢𝗟𝗟⌟ ◆\n│\n├◆ ❓ ${question}\n│\n${optStr.split("\n").map(l=>"├◆ "+l).join("\n")}\n│\n├◆ Vote: .vote <number>\n├◆ Results: .pollresult\n└ ❏` + config.footer
        }, { quoted: m });
    }
  },
  {
    name: "vote",
    description: "Vote in the active poll", category: "group", groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid; const sender = m.key.participant || m.key.remoteJid;
        const polls = await getPolls(); const poll = polls[from];
        if (!poll?.active) return reply("❌ No active poll. Use .poll to create one.");
        const choice = parseInt(args[0]) - 1;
        if (isNaN(choice) || choice < 0 || choice >= poll.options.length) return reply(`❌ Vote 1–${poll.options.length}`);
        // Remove previous vote
        for (const [opt, voters] of Object.entries(poll.votes)) {
            poll.votes[opt] = voters.filter(v => v !== sender);
        }
        if (!poll.votes[choice]) poll.votes[choice] = [];
        poll.votes[choice].push(sender);
        await savePolls(polls);
        reply(`✅ Voted for: *${poll.options[choice]}*` + config.footer);
    }
  },
  {
    name: "pollresult", alias: ["results","pollresults"],
    description: "Show poll results", category: "group", groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid; const polls = await getPolls(); const poll = polls[from];
        if (!poll) return reply("❌ No poll found.");
        const total = Object.values(poll.votes).reduce((s,v) => s + v.length, 0) || 1;
        const rows = poll.options.map((opt,i) => {
            const count = poll.votes[i]?.length || 0;
            const pct = Math.round((count/total)*100);
            const bar = "█".repeat(Math.floor(pct/10)) + "░".repeat(10-Math.floor(pct/10));
            return `├◆ ${EMOJIS[i]} ${opt}\n├◆   [${bar}] ${pct}% (${count} votes)`;
        }).join("\n│\n");
        reply(`┌ ❏ ◆ ⌜📊 𝗣𝗢𝗟𝗟 𝗥𝗘𝗦𝗨𝗟𝗧𝗦⌟ ◆\n│\n├◆ ❓ ${poll.question}\n│\n${rows}\n│\n├◆ 🗳️ Total votes: ${total}\n└ ❏` + config.footer);
    }
  },
  {
    name: "endpoll", alias: ["closepoll"],
    description: "End the active poll", category: "group", adminOnly: true, groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid; const polls = await getPolls();
        if (!polls[from]) return reply("❌ No active poll.");
        polls[from].active = false; await savePolls(polls);
        reply("🏁 Poll ended. Use .pollresult to see final results." + config.footer);
    }
  }
];