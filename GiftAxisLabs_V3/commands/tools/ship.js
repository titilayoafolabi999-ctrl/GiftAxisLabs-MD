module.exports = {
    name: "ship",
    async execute(sock, m, args, reply) {
        if (args.length < 2) return reply("💕 *Usage:* .ship @person1 @person2");
        const percentage = Math.floor(Math.random() * 101);
        let meter = "";
        for (let i = 0; i < 10; i++) meter += i < Math.floor(percentage / 10) ? "❤️" : "🖤";
        let comment = percentage > 80 ? "Perfect match! 💍" : percentage > 60 ? "Great chemistry! 💕" : percentage > 40 ? "There's potential! 💛" : percentage > 20 ? "Just friends maybe... 😅" : "Not meant to be 💔";
        reply(`💕 *Love Calculator*\n\n${args[0]} ❤️ ${args[1]}\n\n${meter}\n*${percentage}%* — ${comment}`);
    }
};
