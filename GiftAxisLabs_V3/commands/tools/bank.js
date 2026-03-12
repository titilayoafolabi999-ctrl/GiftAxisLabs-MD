const fs = require("fs-extra");
const path = require("path");
module.exports = {
    name: "bank",
    async execute(sock, m, args, reply) {
        const dbPath = path.join(__dirname, "../../data/economy.json");
        await fs.ensureFile(dbPath);
        let db = await fs.readJson(dbPath).catch(() => ({}));
        const userId = m.key.participant || m.key.remoteJid;
        if (!db[userId]) db[userId] = { balance: 0, bank: 0 };
        const action = args[0]?.toLowerCase();
        const amount = parseInt(args[1]);
        if (action === "deposit" && amount > 0) {
            if (amount > db[userId].balance) return reply("❌ Insufficient balance.");
            db[userId].balance -= amount;
            db[userId].bank = (db[userId].bank || 0) + amount;
            await fs.writeJson(dbPath, db);
            reply(`🏦 Deposited $${amount}\n💳 Wallet: $${db[userId].balance}\n🏦 Bank: $${db[userId].bank}`);
        } else if (action === "withdraw" && amount > 0) {
            if (amount > (db[userId].bank || 0)) return reply("❌ Insufficient bank balance.");
            db[userId].bank -= amount;
            db[userId].balance += amount;
            await fs.writeJson(dbPath, db);
            reply(`🏦 Withdrew $${amount}\n💳 Wallet: $${db[userId].balance}\n🏦 Bank: $${db[userId].bank}`);
        } else {
            reply(`🏦 *Bank*\n\n💳 Wallet: $${db[userId].balance}\n🏦 Bank: $${db[userId].bank || 0}\n\n_Use: .bank deposit [amount] or .bank withdraw [amount]_`);
        }
    }
};
