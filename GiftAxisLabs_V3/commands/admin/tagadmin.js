const config = require("../../config");

module.exports = {
    name: "tagadmin",
    alias: ["adminping", "calladmin"],
    desc: "Tags/mentions all admins in the group.",
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const customMsg = args.length > 0 ? args.join(" ") : "📢 Admins, your attention is needed!";
        try {
            const group = await sock.groupMetadata(from);
            const admins = group.participants.filter(p => p.admin);
            if (admins.length === 0) {
                return reply("❌ No admins found in this group.");
            }
            let text = `┌ ❏ ◆ ⌜👑 𝗧𝗔𝗚 𝗔𝗗𝗠𝗜𝗡𝗦⌟ ◆\n│\n`;
            text += `├◆ 📢 ${customMsg}\n│\n`;
            admins.forEach(p => {
                const role = p.admin === "superadmin" ? "👑" : "🛡️";
                text += `├◆ ${role} @${p.id.split("@")[0]}\n`;
            });
            text += `│\n├◆ 𝗧𝗼𝘁𝗮𝗹 𝗔𝗱𝗺𝗶𝗻𝘀: ${admins.length}\n│\n└ ❏`;
            await sock.sendMessage(from, {
                text: text + config.footer,
                mentions: admins.map(p => p.id)
            }, { quoted: m });
        } catch (e) {
            reply("❌ Failed to tag admins: " + e.message);
        }
    }
};
