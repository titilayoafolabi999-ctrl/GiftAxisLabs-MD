module.exports = {
    name: "calc",
    alias: ["calculate"],
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("🔢 *Usage:* .calc [expression]\n\n_Example: .calc 2+2*5_");
        try {
            const expr = args.join(" ").replace(/[^0-9+\-*/().%\s]/g, "");
            const result = Function('"use strict"; return (' + expr + ')')();
            reply(`🔢 *Calculator*\n\n📝 ${args.join(" ")}\n= *${result}*`);
        } catch (e) {
            reply("❌ Invalid expression. Use numbers and operators (+, -, *, /, %).");
        }
    }
};
