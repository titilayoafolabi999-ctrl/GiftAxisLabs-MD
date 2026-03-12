const config = require("../../config");

module.exports = {
    name: "pair",
    alias: ["paircode"],
    desc: "Requests a pairing code for a secondary phone number.",
    async execute(sock, m, args, reply) {
        if (!args[0]) {
            return reply(
                "📱 *Usage:* .pair <phone number>\n\n" +
                "_Format: Country code + number (no +)_\n" +
                "_Example: .pair 2347012345678_"
            );
        }

        const phoneNumber = args[0].replace(/[^0-9]/g, "");
        if (phoneNumber.length < 10 || phoneNumber.length > 15) {
            return reply("❌ Invalid phone number. Include country code (e.g., 2347012345678)");
        }

        reply(config.msg.wait);

        try {
            const code = await sock.requestPairingCode(phoneNumber);
            const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

            reply(
                `┌ ❏ ◆ ⌜𝗣𝗔𝗜𝗥𝗜𝗡𝗚 𝗖𝗢𝗗𝗘⌟ ◆\n` +
                `│\n` +
                `├◆ 🔑 Code: *${formattedCode}*\n` +
                `│\n` +
                `├◆ 📱 Steps:\n` +
                `├◆ 1. Open WhatsApp on ${phoneNumber}\n` +
                `├◆ 2. Go to Linked Devices\n` +
                `├◆ 3. Tap "Link a Device"\n` +
                `├◆ 4. Tap "Link with phone number"\n` +
                `├◆ 5. Enter the code above\n` +
                `│\n` +
                `└ ❏`
            );
        } catch (e) {
            reply("❌ Failed to generate pairing code: " + e.message);
        }
    }
};
