module.exports = {
    name: "8ball",
    alias: ["eightball"],
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("🎱 *Usage:* .8ball [question]\n\n_Example: .8ball Will I be rich?_");
        const answers = [
            "🎱 It is certain.", "🎱 Without a doubt.", "🎱 Yes, definitely.",
            "🎱 You may rely on it.", "🎱 As I see it, yes.", "🎱 Most likely.",
            "🎱 Outlook good.", "🎱 Yes.", "🎱 Signs point to yes.",
            "🎱 Reply hazy, try again.", "🎱 Ask again later.", "🎱 Better not tell you now.",
            "🎱 Cannot predict now.", "🎱 Concentrate and ask again.",
            "🎱 Don't count on it.", "🎱 My reply is no.", "🎱 My sources say no.",
            "🎱 Outlook not so good.", "🎱 Very doubtful."
        ];
        reply(`❓ *Question:* ${args.join(" ")}\n\n${answers[Math.floor(Math.random() * answers.length)]}`);
    }
};
