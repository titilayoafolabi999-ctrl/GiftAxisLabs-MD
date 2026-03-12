const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "antilink",
    desc: "Toggle anti-link protection. Deletes messages containing links.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const gs = database.getGroupSettings(from);
        const newState = !gs.antilink;
        database.setGroupSetting(from, "antilink", newState);
        reply(
            `┌ ❏ ◆ ⌜🔗 𝗔𝗡𝗧𝗜-𝗟𝗜𝗡𝗞⌟ ◆\n│\n` +
            `├◆ sᴛᴀᴛᴜs: ${newState ? "✅ ᴇɴᴀʙʟᴇᴅ" : "❌ ᴅɪsᴀʙʟᴇᴅ"}\n` +
            `├◆ ${newState ? "ʟɪɴᴋs ᴡɪʟʟ ʙᴇ ᴅᴇʟᴇᴛᴇᴅ" : "ʟɪɴᴋs ᴀʀᴇ ɴᴏᴡ ᴀʟʟᴏᴡᴇᴅ"}\n│\n└ ❏`
        );
    }
};
