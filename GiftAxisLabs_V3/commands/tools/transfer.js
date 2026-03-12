const fs = require("fs-extra");
const path = require("path");
module.exports = {
    name: "transfer",
    alias: ["pay", "send"],
    async execute(sock, m, args, reply) {
        if (!args[0] || !args[1]) return reply("💸 *Usage:* .transfer @user [amount]");
        const dbPath = path.join(__dirname, "../../data/economy.json");
        await fs.ensureFile(dbPath);
        let db = await fs.readJson(dbPath).catch(() => ({}));
        const userId = m.key.participant || m.key.remoteJid;
        const amount = parseInt(args[1]) || parseInt(args[0]);
        if (!amount || amount <= 0) return reply("❌ Invalid amount.");
        if (!db[userId] || db[userId].balance < amount) return reply("❌ Insufficient balance.");
        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentioned) return reply("❌ Please mention a user to transfer to.");
        if (!db[mentioned]) db[mentioned] = { balance: 0 };
        db[userId].balance -= amount;
        db[mentioned].balance += amount;
        await fs.writeJson(dbPath, db);
        reply(`✅ *Transfer Successful!*\n\n💸 Sent $${amount}\n💳 Your Balance: $${db[userId].balance}`);
    }
};
