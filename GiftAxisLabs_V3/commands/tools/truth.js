module.exports = {
    name: "truth",
    async execute(sock, m, args, reply) {
        const truths = [
            "What is your biggest fear?", "What is the most embarrassing thing you've done?",
            "What is your biggest secret?", "What is the last lie you told?",
            "Who is your secret crush?", "What is your most annoying habit?",
            "What is the worst thing you've ever said to someone?",
            "If you could be invisible for a day, what would you do?",
            "What is the most childish thing you still do?",
            "What is something you've never told anyone?"
        ];
        reply(`🤔 *Truth:*\n\n${truths[Math.floor(Math.random() * truths.length)]}`);
    }
};
