const fs = require("fs-extra");
const path = require("path");
module.exports = {
    name: "gamble",
    alias: ["bet"],
    async execute(sock, m, args, reply) {
        const dbPath = path.join(__dirname, "../../data/economy.json");
        await fs.ensureFile(dbPath);
        let db = await fs.readJson(dbPath).catch(() => ({}));
        const userId = m.key.participant || m.key.remoteJid;
        if (!db[userId]) db[userId] = { balance: 0 };
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0) return reply("🎰 *Usage:* .gamble [amount]\n\n_Example: .gamble 100_");
        if (amount > db[userId].balance) return reply(`❌ You don't have enough! Balance: $${db[userId].balance}`);
        const win = Math.random() < 0.45;
        if (win) {
            db[userId].balance += amount;
            await fs.writeJson(dbPath, db);
            reply(`🎰 *YOU WON!* 🎉\n\n+$${amount}\n💳 Balance: $${db[userId].balance}`);
        } else {
            db[userId].balance -= amount;
            await fs.writeJson(dbPath, db);
            reply(`🎰 *YOU LOST!* 😢\n\n-$${amount}\n💳 Balance: $${db[userId].balance}`);
        }
    }
};
