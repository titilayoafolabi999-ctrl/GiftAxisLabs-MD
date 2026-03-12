const config = require("../../config");

module.exports = {
    name: "type",
    alias: ["t"],
    desc: "Simulates typing then sends a stylized message box.",
    async execute(sock, m, args, reply) {
        if (!args.length) {
            return reply("┌ ❏ ◆ ⌜𝗧𝗬𝗣𝗘⌟ ◆\n│\n├◆ ᴜsᴀɢᴇ: .type [message]\n├◆ ᴇxᴀᴍᴘʟᴇ: .type Hello World\n│\n└ ❏");
        }

        const from = m.key.remoteJid;
        const text = args.join(" ");

        // Simulate typing
        await sock.sendPresenceUpdate("composing", from);

        // Wait based on message length (50ms per char, min 1s, max 5s)
        const delay = Math.min(Math.max(text.length * 50, 1000), 5000);
        await new Promise(r => setTimeout(r, delay));

        // Stop typing
        await sock.sendPresenceUpdate("paused", from);

        // Send stylized box
        const boxText =
            `┌ ❏ ◆ ⌜${config.botName}⌟ ◆\n` +
            `│\n` +
            `├◆ ${text}\n` +
            `│\n` +
            `└ ❏`;

        await sock.sendMessage(from, { text: boxText + config.footer }, { quoted: m });
    }
};
