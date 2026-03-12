const axios = require("axios");
module.exports = {
    name: "shorten",
    alias: ["short"],
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("🔗 *Usage:* .shorten [URL]\n\n_Example: .shorten https://google.com_");
        try {
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`, { timeout: 10000 });
            reply(`🔗 *Shortened URL:*\n\n${res.data}`);
        } catch (e) {
            reply("❌ Could not shorten URL. Make sure it's a valid link.");
        }
    }
};
