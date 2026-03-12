module.exports = {
    name: "react",
    async execute(sock, m, args, reply) {
        const emoji = args[0] || "👍";
        const quoted = m.message?.extendedTextMessage?.contextInfo;
        const key = quoted?.stanzaId ? { remoteJid: m.key.remoteJid, id: quoted.stanzaId, participant: quoted.participant } : m.key;
        try {
            await sock.sendMessage(m.key.remoteJid, { react: { text: emoji, key: key } });
        } catch (e) {
            reply("❌ Could not react to message.");
        }
    }
};
