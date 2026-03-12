const axios = require("axios");
module.exports = {
    name: "meme",
    alias: ["memes"],
    async execute(sock, m, args, reply) {
        try {
            const res = await axios.get("https://meme-api.com/gimme", { timeout: 10000 });
            const { title, url, subreddit } = res.data;
            await sock.sendMessage(m.key.remoteJid, {
                image: { url: url },
                caption: `😂 *${title}*\n📂 r/${subreddit}`
            }, { quoted: m });
        } catch (e) {
            reply("❌ Could not fetch meme. Try again later.");
        }
    }
};
