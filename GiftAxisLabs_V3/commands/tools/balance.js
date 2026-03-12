const fs = require("fs-extra");
const path = require("path");
module.exports = {
    name: "balance",
    alias: ["bal", "wallet"],
    async execute(sock, m, args, reply) {
        const dbPath = path.join(__dirname, "../../data/economy.json");
        await fs.ensureFile(dbPath);
        let db = await fs.readJson(dbPath).catch(() => ({}));
        const userId = m.key.participant || m.key.remoteJid;
        if (!db[userId]) db[userId] = { balance: 0, lastDaily: 0 };
        reply(`💳 *Your Balance:* $${db[userId].balance}`);
    }
};
