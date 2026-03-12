module.exports = {
    name: "delete",
    alias: ["del"],
    async execute(sock, m, args, reply) {
        const quoted = m.message?.extendedTextMessage?.contextInfo;
        if (!quoted?.stanzaId) return reply("❌ Reply to a bot message to delete it.");
        try {
            await sock.sendMessage(m.key.remoteJid, { delete: { remoteJid: m.key.remoteJid, fromMe: true, id: quoted.stanzaId, participant: quoted.participant } });
        } catch (e) {
            reply("❌ Could not delete message. Make sure it's a bot message.");
        }
    }
};
