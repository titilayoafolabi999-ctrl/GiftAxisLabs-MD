const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "listmuted",
    alias: ["mutedlist"],
    desc: "Lists all currently muted members in the group.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const mutedList = database.getMutedMembers(from);
        if (!mutedList || mutedList.length === 0) {
            return reply(`┌ ❏ ◆ ⌜🔇 𝗠𝗨𝗧𝗘𝗗 𝗟𝗜𝗦𝗧⌟ ◆\n│\n├◆ ✅ ɴᴏ ᴍᴜᴛᴇᴅ ᴍᴇᴍʙᴇʀs\n│\n└ ❏`);
        }
        let text = `┌ ❏ ◆ ⌜🔇 𝗠𝗨𝗧𝗘𝗗 𝗠𝗘𝗠𝗕𝗘𝗥𝗦⌟ ◆\n│\n`;
        mutedList.forEach((id, i) => {
            text += `├◆ ${i + 1}. @${id.split("@")[0]}\n`;
        });
        text += `│\n├◆ 𝗧𝗼𝘁𝗮𝗹: ${mutedList.length}\n│\n└ ❏`;
        await sock.sendMessage(from, {
            text: text + config.footer,
            mentions: mutedList
        }, { quoted: m });
    }
};
