const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "antispam",
    desc: "Toggle anti-spam protection. Auto-mutes members who send 5+ messages in 10 seconds.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const gs = database.getGroupSettings(from);
        const newState = !gs.antispam;
        database.setGroupSetting(from, "antispam", newState);
        reply(
            `┌ ❏ ◆ ⌜🚫 𝗔𝗡𝗧𝗜-𝗦𝗣𝗔𝗠⌟ ◆\n│\n` +
            `├◆ sᴛᴀᴛᴜs: ${newState ? "✅ ᴇɴᴀʙʟᴇᴅ" : "❌ ᴅɪsᴀʙʟᴇᴅ"}\n` +
            `├◆ ${newState ? "sᴘᴀᴍᴍᴇʀs ᴡɪʟʟ ʙᴇ ᴀᴜᴛᴏ-ᴍᴜᴛᴇᴅ" : "sᴘᴀᴍ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴏғғ"}\n` +
            `├◆ ᴛʜʀᴇsʜᴏʟᴅ: 5 ᴍsɢs / 10s\n│\n└ ❏`
        );
    }
};
