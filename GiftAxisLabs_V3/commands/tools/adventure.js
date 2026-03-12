module.exports = {
    name: "adventure",
    alias: ["adv"],
    async execute(sock, m, args, reply) {
        const scenarios = [
            { text: "🏔️ You ventured into the mountains and found a treasure chest!", reward: Math.floor(Math.random() * 300) + 50 },
            { text: "🌊 You sailed across the ocean and discovered a hidden island!", reward: Math.floor(Math.random() * 200) + 100 },
            { text: "🌲 You explored the forest but got lost... A friendly elf helped you out.", reward: Math.floor(Math.random() * 100) + 20 },
            { text: "🏰 You stormed the castle and defeated the dragon!", reward: Math.floor(Math.random() * 500) + 200 },
            { text: "🕳️ You fell into a cave but found ancient gold coins!", reward: Math.floor(Math.random() * 400) + 100 },
            { text: "👻 You entered a haunted house... and barely escaped!", reward: 0 },
            { text: "🌋 You climbed a volcano and found rare gems at the top!", reward: Math.floor(Math.random() * 350) + 150 }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const fs = require("fs-extra");
        const path = require("path");
        const dbPath = path.join(__dirname, "../../data/economy.json");
        await fs.ensureFile(dbPath);
        let db = await fs.readJson(dbPath).catch(() => ({}));
        const userId = m.key.participant || m.key.remoteJid;
        if (!db[userId]) db[userId] = { balance: 0 };
        db[userId].balance += scenario.reward;
        await fs.writeJson(dbPath, db);
        reply(`🗺️ *Adventure!*\n\n${scenario.text}\n\n💰 Reward: $${scenario.reward}\n💳 Balance: $${db[userId].balance}`);
    }
};
