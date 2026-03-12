const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "mutemember",
    alias: ["silencemember"],
    desc: "Mutes a group member — their messages will be auto-deleted.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        // Get target: replied-to user or @mention
        let target = m.message?.extendedTextMessage?.contextInfo?.participant || null;
        if (!target && args[0]) {
            target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        }
        if (!target) {
            return reply(
                `┌ ❏ ◆ ⌜𝗠𝗨𝗧𝗘 𝗠𝗘𝗠𝗕𝗘𝗥⌟ ◆\n│\n` +
                `├◆ ❌ ɴᴏ ᴜsᴇʀ sᴘᴇᴄɪғɪᴇᴅ\n` +
                `├◆ 📌 ᴜsᴀɢᴇ:\n` +
                `├◆ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ ᴏʀ\n` +
                `├◆ .mutemember 2347012345678\n│\n└ ❏`
            );
        }
        // Don't mute admins
        try {
            const groupMeta = await sock.groupMetadata(from);
            const targetParticipant = groupMeta.participants.find(p => p.id === target);
            if (!targetParticipant) return reply("❌ User not found in this group.");
            if (targetParticipant.admin) return reply("❌ Cannot mute an admin.");
        } catch (e) {
            return reply("❌ Could not verify user: " + e.message);
        }
        database.muteMember(from, target);
        const num = target.split("@")[0];
        await sock.sendMessage(from, {
            text: `┌ ❏ ◆ ⌜🔇 𝗠𝗨𝗧𝗘𝗗⌟ ◆\n│\n├◆ @${num} ʜᴀs ʙᴇᴇɴ ᴍᴜᴛᴇᴅ\n├◆ ᴛʜᴇɪʀ ᴍᴇssᴀɢᴇs ᴡɪʟʟ ʙᴇ ᴅᴇʟᴇᴛᴇᴅ\n├◆ ᴜsᴇ .unmutember ᴛᴏ ᴜɴᴍᴜᴛᴇ\n│\n└ ❏` + config.footer,
            mentions: [target]
        }, { quoted: m });
    }
};
