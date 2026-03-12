const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "antitag",
    desc: "Toggle anti-tag protection. Prevents mass mentions/tags in the group.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const gs = database.getGroupSettings(from);
        const newState = !gs.antitag;
        database.setGroupSetting(from, "antitag", newState);
        reply(
            `┌ ❏ ◆ ⌜🏷️ 𝗔𝗡𝗧𝗜-𝗧𝗔𝗚⌟ ◆\n│\n` +
            `├◆ sᴛᴀᴛᴜs: ${newState ? "✅ ᴇɴᴀʙʟᴇᴅ" : "❌ ᴅɪsᴀʙʟᴇᴅ"}\n` +
            `├◆ ${newState ? "ᴍᴀss ᴛᴀɢɢɪɴɢ ᴡɪʟʟ ʙᴇ ᴅᴇʟᴇᴛᴇᴅ" : "ᴛᴀɢɢɪɴɢ ɴᴏᴡ ᴀʟʟᴏᴡᴇᴅ"}\n` +
            `├◆ ᴛʜʀᴇsʜᴏʟᴅ: 5+ ᴍᴇɴᴛɪᴏɴs\n│\n└ ❏`
        );
    }
};
