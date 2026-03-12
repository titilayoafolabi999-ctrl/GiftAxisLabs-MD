module.exports = {
    name: "roll",
    alias: ["dice"],
    async execute(sock, m, args, reply) {
        const sides = parseInt(args[0]) || 6;
        const result = Math.floor(Math.random() * sides) + 1;
        reply(`🎲 You rolled a *${result}* (out of ${sides})`);
    }
};
