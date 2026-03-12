const fs = require("fs-extra");
const path = require("path");
module.exports = {
    name: "leaderboard",
    alias: ["lb", "top"],
    async execute(sock, m, args, reply) {
        const dbPath = path.join(__dirname, "../../data/economy.json");
        await fs.ensureFile(dbPath);
        let db = await fs.readJson(dbPath).catch(() => ({}));
        const sorted = Object.entries(db).sort((a, b) => (b[1].balance + (b[1].bank || 0)) - (a[1].balance + (a[1].bank || 0))).slice(0, 10);
        if (sorted.length === 0) return reply("📊 No data yet. Start earning with .daily or .work!");
        let text = "🏆 *Leaderboard*\n\n";
        const medals = ["🥇", "🥈", "🥉"];
        sorted.forEach(([id, data], i) => {
            const num = id.split("@")[0];
            const total = data.balance + (data.bank || 0);
            text += `${medals[i] || `${i + 1}.`} +${num.slice(-4)} — $${total}\n`;
        });
        reply(text);
    }
};
