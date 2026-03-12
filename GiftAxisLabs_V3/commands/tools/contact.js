module.exports = {
    name: "contact",
    async execute(sock, m, args, reply) {
        if (!args[0] || !args[1]) return reply("📇 *Usage:* .contact [name] [number]\n\n_Example: .contact John 2341234567890_");
        const name = args[0];
        const number = args[1].replace(/[^0-9]/g, "");
        try {
            await sock.sendMessage(m.key.remoteJid, {
                contacts: {
                    displayName: name,
                    contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD` }]
                }
            }, { quoted: m });
        } catch (e) {
            reply("❌ Could not create contact card.");
        }
    }
};
