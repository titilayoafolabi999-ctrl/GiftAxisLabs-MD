const axios = require("axios");
module.exports = {
    name: "github",
    alias: ["gh"],
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("🐱 *Usage:* .github [username]\n\n_Example: .github torvalds_");
        try {
            const res = await axios.get(`https://api.github.com/users/${args[0]}`, { timeout: 10000 });
            const u = res.data;
            reply(`🐱 *GitHub Profile*\n\n👤 Name: ${u.name || "N/A"}\n📝 Bio: ${u.bio || "N/A"}\n📂 Repos: ${u.public_repos}\n👥 Followers: ${u.followers}\n👤 Following: ${u.following}\n🔗 ${u.html_url}`);
        } catch (e) {
            reply("❌ User not found or API error.");
        }
    }
};
