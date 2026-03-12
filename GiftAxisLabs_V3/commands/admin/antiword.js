const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "antiword",
    alias: ["bannedword", "addword", "removeword"],
    desc: "Manage banned words. Messages containing them will be deleted.",
    adminOnly: true,
    groupOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const sub = args[0]?.toLowerCase();
        if (!sub || sub === "list") {
            const words = database.getBannedWords(from);
            if (words.length === 0) {
                return reply(`┌ ❏ ◆ ⌜🚫 𝗔𝗡𝗧𝗜-𝗪𝗢𝗥𝗗⌟ ◆\n│\n├◆ ɴᴏ ʙᴀɴɴᴇᴅ ᴡᴏʀᴅs sᴇᴛ\n│\n└ ❏`);
            }
            let text = `┌ ❏ ◆ ⌜🚫 𝗕𝗔𝗡𝗡𝗘𝗗 𝗪𝗢𝗥𝗗𝗦⌟ ◆\n│\n`;
            words.forEach((w, i) => { text += `├◆ ${i + 1}. ${w}\n`; });
            text += `│\n└ ❏`;
            return reply(text);
        }
        if (sub === "add") {
            const word = args[1];
            if (!word) return reply("❌ Usage: .antiword add <word>");
            database.addBannedWord(from, word);
            return reply(`┌ ❏ ◆ ⌜✅ 𝗪𝗢𝗥𝗗 𝗕𝗔𝗡𝗡𝗘𝗗⌟ ◆\n│\n├◆ "${word}" ᴀᴅᴅᴇᴅ ᴛᴏ ʙᴀɴ ʟɪsᴛ\n│\n└ ❏`);
        }
        if (sub === "remove" || sub === "del") {
            const word = args[1];
            if (!word) return reply("❌ Usage: .antiword remove <word>");
            database.removeBannedWord(from, word);
            return reply(`┌ ❏ ◆ ⌜✅ 𝗪𝗢𝗥𝗗 𝗥𝗘𝗠𝗢𝗩𝗘𝗗⌟ ◆\n│\n├◆ "${word}" ʀᴇᴍᴏᴠᴇᴅ ғʀᴏᴍ ʙᴀɴ ʟɪsᴛ\n│\n└ ❏`);
        }
        // Default: treat first arg as word to add
        database.addBannedWord(from, sub);
        reply(`┌ ❏ ◆ ⌜✅ 𝗪𝗢𝗥𝗗 𝗕𝗔𝗡𝗡𝗘𝗗⌟ ◆\n│\n├◆ "${sub}" ᴀᴅᴅᴇᴅ ᴛᴏ ʙᴀɴ ʟɪsᴛ\n│\n└ ❏`);
    }
};
