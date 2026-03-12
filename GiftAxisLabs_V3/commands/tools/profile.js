module.exports = {
    name: "profile",
    alias: ["me"],
    async execute(sock, m, args, reply) {
        const userId = m.key.participant || m.key.remoteJid;
        const number = userId.split("@")[0];
        try {
            const pp = await sock.profilePictureUrl(userId, "image").catch(() => null);
            const status = await sock.fetchStatus(userId).catch(() => null);
            let text = `👤 *Profile*\n\n📱 Number: +${number}`;
            if (status?.status) text += `\n📝 About: ${status.status}`;
            if (pp) {
                await sock.sendMessage(m.key.remoteJid, { image: { url: pp }, caption: text }, { quoted: m });
            } else {
                reply(text + "\n🖼️ No profile picture");
            }
        } catch (e) {
            reply(`👤 *Profile*\n\n📱 Number: +${number}`);
        }
    }
};
