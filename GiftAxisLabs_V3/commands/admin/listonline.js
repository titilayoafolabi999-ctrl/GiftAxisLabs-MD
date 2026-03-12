const config = require("../../config");

module.exports = {
    name: "listonline",
    alias: ["onlinelist", "whosonline"],
    desc: "Lists members who have been recently active (last seen recently) in the group.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        try {
            const group = await sock.groupMetadata(from);
            const participants = group.participants;
            // WhatsApp doesn't expose real-time online status via Baileys for all users,
            // so we check presence/last seen from the store contacts
            const onlineMembers = [];
            const recentMembers = [];
            for (const p of participants) {
                try {
                    const contact = global.store?.contacts?.[p.id];
                    if (contact) {
                        if (contact.lastKnownPresence === "available") {
                            onlineMembers.push(p.id);
                        } else if (contact.lastSeen && (Date.now() - contact.lastSeen * 1000) < 300000) {
                            recentMembers.push({ id: p.id, lastSeen: contact.lastSeen });
                        }
                    }
                } catch (_) {}
            }
            let text = `┌ ❏ ◆ ⌜🟢 𝗢𝗡𝗟𝗜𝗡𝗘 𝗠𝗘𝗠𝗕𝗘𝗥𝗦⌟ ◆\n│\n`;
            text += `├◆ 👥 𝗚𝗿𝗼𝘂𝗽: ${group.subject}\n│\n`;
            if (onlineMembers.length > 0) {
                text += `├◆ 🟢 𝗖𝘂𝗿𝗿𝗲𝗻𝘁𝗹𝘆 𝗢𝗻𝗹𝗶𝗻𝗲:\n`;
                onlineMembers.forEach((id, i) => {
                    text += `├◆ ${i + 1}. @${id.split("@")[0]}\n`;
                });
                text += `│\n`;
            } else {
                text += `├◆ 🟢 ɴᴏ ᴏɴᴇ ᴄᴜʀʀᴇɴᴛʟʏ ᴏɴʟɪɴᴇ\n│\n`;
            }
            if (recentMembers.length > 0) {
                text += `├◆ 🕐 𝗥𝗲𝗰𝗲𝗻𝘁𝗹𝘆 𝗔𝗰𝘁𝗶𝘃𝗲 (𝗹𝗮𝘀𝘁 𝟱 𝗺𝗶𝗻):\n`;
                recentMembers.forEach((m, i) => {
                    const mins = Math.floor((Date.now() - m.lastSeen * 1000) / 60000);
                    text += `├◆ ${i + 1}. @${m.id.split("@")[0]} (${mins}m ago)\n`;
                });
                text += `│\n`;
            }
            text += `├◆ 👥 𝗧𝗼𝘁𝗮𝗹 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${participants.length}\n`;
            text += `├◆ 🟢 𝗢𝗻𝗹𝗶𝗻𝗲: ${onlineMembers.length}\n`;
            text += `│\n└ ❏`;
            const allMentioned = [...onlineMembers, ...recentMembers.map(r => r.id)];
            await sock.sendMessage(from, {
                text: text + config.footer,
                mentions: allMentioned
            }, { quoted: m });
        } catch (e) {
            reply("❌ Failed to fetch online members: " + e.message);
        }
    }
};
