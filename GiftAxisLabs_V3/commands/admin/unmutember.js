const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "unmutember",
    alias: ["unsilencemember"],
    desc: "Unmutes a previously muted group member.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        let target = m.message?.extendedTextMessage?.contextInfo?.participant || null;
        if (!target && args[0]) {
            target = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        }
        if (!target) {
            return reply(
                `┌ ❏ ◆ ⌜𝗨𝗡𝗠𝗨𝗧𝗘 𝗠𝗘𝗠𝗕𝗘𝗥⌟ ◆\n│\n` +
                `├◆ ❌ ɴᴏ ᴜsᴇʀ sᴘᴇᴄɪғɪᴇᴅ\n` +
                `├◆ 📌 ᴜsᴀɢᴇ:\n` +
                `├◆ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ ᴏʀ\n` +
                `├◆ .unmutember 2347012345678\n│\n└ ❏`
            );
        }
        database.unmuteMember(from, target);
        const num = target.split("@")[0];
        await sock.sendMessage(from, {
            text: `┌ ❏ ◆ ⌜🔊 𝗨𝗡𝗠𝗨𝗧𝗘𝗗⌟ ◆\n│\n├◆ @${num} ʜᴀs ʙᴇᴇɴ ᴜɴᴍᴜᴛᴇᴅ\n├◆ ᴛʜᴇʏ ᴄᴀɴ ɴᴏᴡ sᴇɴᴅ ᴍᴇssᴀɢᴇs\n│\n└ ❏` + config.footer,
            mentions: [target]
        }, { quoted: m });
    }
};
