const QRCode = require("qrcode");
module.exports = {
    name: "qr",
    alias: ["qrcode"],
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("📱 *Usage:* .qr [text or URL]\n\n_Example: .qr https://google.com_");
        try {
            const buffer = await QRCode.toBuffer(args.join(" "), { width: 300 });
            await sock.sendMessage(m.key.remoteJid, { image: buffer, caption: "📱 *QR Code Generated!*" }, { quoted: m });
        } catch (e) {
            reply("❌ Failed to generate QR code.");
        }
    }
};
