module.exports = {
    name: "flip",
    alias: ["coinflip", "coin"],
    async execute(sock, m, args, reply) {
        const result = Math.random() < 0.5 ? "🪙 *Heads!*" : "🪙 *Tails!*";
        reply(result);
    }
};
