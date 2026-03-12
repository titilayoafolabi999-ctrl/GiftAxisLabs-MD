const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "antiviewonce",
    alias: ["antiviewonce"],
    desc: "Toggle anti-view-once. Re-sends view-once media so admins can see it.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const gs = database.getGroupSettings(from);
        const newState = !gs.antiviewonce;
        database.setGroupSetting(from, "antiviewonce", newState);
        reply(
            `┌ ❏ ◆ ⌜👁️ 𝗔𝗡𝗧𝗜-𝗩𝗜𝗘𝗪𝗢𝗡𝗖𝗘⌟ ◆\n│\n` +
            `├◆ sᴛᴀᴛᴜs: ${newState ? "✅ ᴇɴᴀʙʟᴇᴅ" : "❌ ᴅɪsᴀʙʟᴇᴅ"}\n` +
            `├◆ ${newState ? "ᴠɪᴇᴡ-ᴏɴᴄᴇ ᴍᴇᴅɪᴀ ᴡɪʟʟ ʙᴇ ʀᴇ-sᴇɴᴛ" : "ᴠɪᴇᴡ-ᴏɴᴄᴇ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴏғғ"}\n│\n└ ❏`
        );
    }
};
