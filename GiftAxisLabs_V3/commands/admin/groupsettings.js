const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "groupsettings",
    alias: ["gsettings", "groupinfo"],
    desc: "View all current group protection settings.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const gs = database.getGroupSettings(from);
        const on = "✅";
        const off = "❌";
        reply(
            `┌ ❏ ◆ ⌜⚙️ 𝗚𝗥𝗢𝗨𝗣 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦⌟ ◆\n│\n` +
            `├◆ 🔗 ᴀɴᴛɪʟɪɴᴋ:      ${gs.antilink ? on : off}\n` +
            `├◆ 🚫 ᴀɴᴛɪsᴘᴀᴍ:      ${gs.antispam ? on : off}\n` +
            `├◆ 🏷️ ᴀɴᴛɪᴛᴀɢ:       ${gs.antitag ? on : off}\n` +
            `├◆ 🤖 ᴀɴᴛɪʙᴏᴛ:       ${gs.antibot ? on : off}\n` +
            `├◆ 👁️ ᴀɴᴛɪᴠɪᴇᴡᴏɴᴄᴇ:  ${gs.antiviewonce ? on : off}\n` +
            `├◆ 🔇 ᴍᴜᴛᴇᴅ ᴍᴇᴍʙᴇʀs: ${(gs.mutedMembers || []).length}\n` +
            `├◆ 🚫 ʙᴀɴɴᴇᴅ ᴡᴏʀᴅs:  ${(gs.bannedWords || []).length}\n│\n└ ❏`
        );
    }
};
