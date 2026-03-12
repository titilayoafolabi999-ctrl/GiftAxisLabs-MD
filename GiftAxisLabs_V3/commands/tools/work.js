const fs = require("fs-extra");
const path = require("path");
module.exports = {
    name: "work",
    async execute(sock, m, args, reply) {
        const dbPath = path.join(__dirname, "../../data/economy.json");
        await fs.ensureFile(dbPath);
        let db = await fs.readJson(dbPath).catch(() => ({}));
        const userId = m.key.participant || m.key.remoteJid;
        if (!db[userId]) db[userId] = { balance: 0, lastWork: 0 };
        const now = Date.now();
        const cooldown = 30 * 60 * 1000;
        if (now - (db[userId].lastWork || 0) < cooldown) {
            const remaining = cooldown - (now - db[userId].lastWork);
            const mins = Math.floor(remaining / 60000);
            return reply(`⏰ You're tired! Rest for *${mins} minutes* before working again.`);
        }
        const jobs = ["👨‍💻 Programming", "🎨 Designing", "📦 Delivering packages", "🍳 Cooking", "🔧 Fixing cars", "📝 Writing articles", "🎵 Making music"];
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const earned = Math.floor(Math.random() * 300) + 50;
        db[userId].balance = (db[userId].balance || 0) + earned;
        db[userId].lastWork = now;
        await fs.writeJson(dbPath, db);
        reply(`${job}\n\n💰 You earned *$${earned}*!\n💳 Balance: $${db[userId].balance}`);
    }
};
