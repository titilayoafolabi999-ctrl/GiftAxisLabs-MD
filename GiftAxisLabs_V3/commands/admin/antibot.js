const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "antibot",
    desc: "Toggle anti-bot protection. Removes other bots added to the group.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const gs = database.getGroupSettings(from);
        const newState = !gs.antibot;
        database.setGroupSetting(from, "antibot", newState);
        reply(
            `┌ ❏ ◆ ⌜🤖 𝗔𝗡𝗧𝗜-𝗕𝗢𝗧⌟ ◆\n│\n` +
            `├◆ sᴛᴀᴛᴜs: ${newState ? "✅ ᴇɴᴀʙʟᴇᴅ" : "❌ ᴅɪsᴀʙʟᴇᴅ"}\n` +
            `├◆ ${newState ? "ᴏᴛʜᴇʀ ʙᴏᴛs ᴡɪʟʟ ʙᴇ ʀᴇᴍᴏᴠᴇᴅ" : "ʙᴏᴛ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴏғғ"}\n│\n└ ❏`
        );
    }
};
