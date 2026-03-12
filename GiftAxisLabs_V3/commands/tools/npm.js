const axios = require("axios");
module.exports = {
    name: "npm",
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("📦 *Usage:* .npm [package-name]\n\n_Example: .npm express_");
        try {
            const res = await axios.get(`https://registry.npmjs.org/${args[0]}`, { timeout: 10000 });
            const pkg = res.data;
            const latest = pkg["dist-tags"]?.latest || "N/A";
            reply(`📦 *NPM Package*\n\n📛 Name: ${pkg.name}\n📝 Description: ${pkg.description || "N/A"}\n🏷️ Latest: ${latest}\n🔗 https://www.npmjs.com/package/${pkg.name}`);
        } catch (e) {
            reply("❌ Package not found.");
        }
    }
};
