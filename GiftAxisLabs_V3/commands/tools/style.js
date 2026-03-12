module.exports = {
    name: "style",
    alias: ["font"],
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("✨ *Usage:* .style [text]\n\n_Converts text to fancy styles_");
        const text = args.join(" ");
        const bold = text.split("").map(c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D400);
            if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D41A);
            return c;
        }).join("");
        const italic = text.split("").map(c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D434);
            if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D44E);
            return c;
        }).join("");
        reply(`✨ *Styled Text*\n\n𝐁𝐨𝐥𝐝: ${bold}\n𝘐𝘵𝘢𝘭𝘪𝘤: ${italic}\n🔤 Original: ${text}`);
    }
};
