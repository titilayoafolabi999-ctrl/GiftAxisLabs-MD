const axios = require("axios");
module.exports = {
    name: "quote",
    alias: ["quotes", "inspire"],
    async execute(sock, m, args, reply) {
        try {
            const res = await axios.get("https://api.quotable.io/random", { timeout: 10000 });
            reply(`💬 *Quote:*\n\n"${res.data.content}"\n\n— *${res.data.author}*`);
        } catch (e) {
            const quotes = [
                { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
                { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
                { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
                { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
            ];
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            reply(`💬 *Quote:*\n\n"${q.text}"\n\n— *${q.author}*`);
        }
    }
};
