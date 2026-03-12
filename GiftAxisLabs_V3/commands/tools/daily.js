const fs = require("fs-extra");
const path = require("path");
module.exports = {
    name: "daily",
    async execute(sock, m, args, reply) {
        const dbPath = path.join(__dirname, "../../data/economy.json");
        await fs.ensureFile(dbPath);
        let db = await fs.readJson(dbPath).catch(() => ({}));
        const userId = m.key.participant || m.key.remoteJid;
        if (!db[userId]) db[userId] = { balance: 0, lastDaily: 0 };
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000;
        if (now - db[userId].lastDaily < cooldown) {
            const remaining = cooldown - (now - db[userId].lastDaily);
            const hours = Math.floor(remaining / 3600000);
            const mins = Math.floor((remaining % 3600000) / 60000);
            return reply(`⏰ You already claimed your daily reward!\nCome back in *${hours}h ${mins}m*`);
        }
        const reward = Math.floor(Math.random() * 500) + 100;
        db[userId].balance += reward;
        db[userId].lastDaily = now;
        await fs.writeJson(dbPath, db);
        reply(`💰 *Daily Reward Claimed!*\n\n+$${reward}\n💳 Balance: $${db[userId].balance}`);
    }
};
