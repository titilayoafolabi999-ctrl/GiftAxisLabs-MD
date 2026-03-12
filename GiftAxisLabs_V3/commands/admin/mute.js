const config = require("../../config");

module.exports = {
    name: "mute",
    desc: "Closes the group so only admins can send messages.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        await sock.groupSettingUpdate(from, 'announcement');
        reply(
            `┌ ❏ ◆ ⌜🔒 𝗚𝗥𝗢𝗨𝗣 𝗠𝗨𝗧𝗘𝗗⌟ ◆\n│\n` +
            `├◆ 🔒 ɢʀᴏᴜᴘ ɪs ɴᴏᴡ ᴄʟᴏsᴇᴅ\n` +
            `├◆ ᴏɴʟʏ ᴀᴅᴍɪɴs ᴄᴀɴ sᴇɴᴅ ᴍsɢs\n` +
            `├◆ ᴜsᴇ .unmute ᴛᴏ ᴏᴘᴇɴ\n│\n└ ❏`
        );
    }
};