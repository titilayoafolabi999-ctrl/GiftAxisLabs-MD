const config = require("../../config");
const axios = require("axios");
module.exports = {
    name: "video", alias: ["ytvideo","ytdl"],
    async execute(sock, m, args, reply) {
        const url = args[0];
        if (!url) return reply("Usage: .video <youtube url>");
        if (!url.includes("youtu")) return reply("❌ Please provide a valid YouTube URL");
        const videoId = url.match(/(?:v=|youtu.be/)([\w-]{11})/)?.[1];
        if (!videoId) return reply("❌ Invalid YouTube URL");
        try {
            const infoRes = await axios.get(`https://www.youtube.com/oembed?url=https://youtu.be/${videoId}&format=json`, { timeout: 5000 });
            const title = infoRes.data.title;
            reply(
                `🎬 *${title}*\n\n🔗 https://youtu.be/${videoId}\n\n💡 Download via:\n• https://yt1s.com\n• https://y2mate.com\n\nFor auto-download install ytdl-core:\`npm install ytdl-core\`` + config.footer
            );
        } catch(e) { reply("❌ " + e.message); }
    }
};