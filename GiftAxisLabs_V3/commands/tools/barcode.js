module.exports = {
    name: "barcode",
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("📊 *Usage:* .barcode [text]");
        try {
            const url = `https://barcodeapi.org/api/128/${encodeURIComponent(args.join(" "))}`;
            await sock.sendMessage(m.key.remoteJid, { image: { url }, caption: "📊 *Barcode Generated!*" }, { quoted: m });
        } catch (e) {
            reply("❌ Failed to generate barcode.");
        }
    }
};
