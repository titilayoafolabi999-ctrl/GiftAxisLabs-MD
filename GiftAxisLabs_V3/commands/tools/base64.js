module.exports = {
    name: "base64",
    alias: ["b64"],
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("🔐 *Usage:* .base64 encode/decode [text]");
        const action = args[0].toLowerCase();
        const text = args.slice(1).join(" ");
        if (!text) return reply("❌ Provide text to encode/decode.");
        if (action === "encode") {
            reply(`🔐 *Base64 Encoded:*\n\n${Buffer.from(text).toString("base64")}`);
        } else if (action === "decode") {
            try { reply(`🔓 *Base64 Decoded:*\n\n${Buffer.from(text, "base64").toString("utf-8")}`); }
            catch (e) { reply("❌ Invalid base64 string."); }
        } else {
            reply("❌ Use: .base64 encode [text] or .base64 decode [text]");
        }
    }
};
