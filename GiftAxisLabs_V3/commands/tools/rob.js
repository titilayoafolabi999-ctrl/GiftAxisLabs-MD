const fs = require("fs-extra");
const path = require("path");
module.exports = {
    name: "rob",
    async execute(sock, m, args, reply) {
        const dbPath = path.join(__dirname, "../../data/economy.json");
        await fs.ensureFile(dbPath);
        let db = await fs.readJson(dbPath).catch(() => ({}));
        const userId = m.key.participant || m.key.remoteJid;
        if (!db[userId]) db[userId] = { balance: 0 };
        const success = Math.random() < 0.4;
        if (success) {
            const stolen = Math.floor(Math.random() * 200) + 10;
            db[userId].balance += stolen;
            await fs.writeJson(dbPath, db);
            reply(`🦹 *Robbery Successful!*\n\n+$${stolen} stolen!\n💳 Balance: $${db[userId].balance}`);
        } else {
            const fine = Math.floor(Math.random() * 100) + 20;
            db[userId].balance = Math.max(0, db[userId].balance - fine);
            await fs.writeJson(dbPath, db);
            reply(`🚔 *Caught by police!*\n\n-$${fine} fine!\n💳 Balance: $${db[userId].balance}`);
        }
    }
};
