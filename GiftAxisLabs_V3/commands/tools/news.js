const axios = require("axios");
module.exports = {
    name: "news",
    async execute(sock, m, args, reply) {
        try {
            const topic = args.join(" ") || "technology";
            const res = await axios.get(`https://newsdata.io/api/1/news?apikey=pub_0&q=${encodeURIComponent(topic)}&language=en`, { timeout: 10000 });
            if (res.data.results && res.data.results.length > 0) {
                let text = `📰 *Latest News: ${topic}*\n\n`;
                res.data.results.slice(0, 5).forEach((item, i) => {
                    text += `${i + 1}. *${item.title}*\n${item.link}\n\n`;
                });
                reply(text);
            } else {
                reply("📰 No news found for that topic.");
            }
        } catch (e) {
            reply("📰 *News service temporarily unavailable.* Try again later.");
        }
    }
};
