const config = require("../../config");
const database = require("../../lib/database");

module.exports = {
    name: "sleep",
    alias: ["hibernate", "offline"],
    desc: "Puts the bot into an offline/ignored state.",
    ownerOnly: true,
    async execute(sock, m, args, reply) {
        const from = m.key.remoteJid;
        const currentState = database.db.botSleeping;

        if (args[0] === "off" || args[0] === "wake") {
            database.setSleep(false);
            await sock.sendPresenceUpdate("available");
            return reply(
                `┌ ❏ ◆ ⌜𝗕𝗢𝗧 𝗔𝗪𝗔𝗞𝗘⌟ ◆\n` +
                `│\n` +
                `├◆ ✅ Bot is now active!\n` +
                `├◆ All commands are working\n` +
                `│\n` +
                `└ ❏`
            );
        }

        if (currentState) {
            return reply(
                `┌ ❏ ◆ ⌜𝗦𝗟𝗘𝗘𝗣⌟ ◆\n` +
                `│\n` +
                `├◆ 💤 Bot is already sleeping\n` +
                `├◆ Use .sleep off to wake up\n` +
                `│\n` +
                `└ ❏`
            );
        }

        database.setSleep(true);

        // Set presence to unavailable
        await sock.sendPresenceUpdate("unavailable");

        reply(
            `┌ ❏ ◆ ⌜𝗦𝗟𝗘𝗘𝗣 𝗠𝗢𝗗𝗘⌟ ◆\n` +
            `│\n` +
            `├◆ 💤 Bot is now sleeping\n` +
            `├◆ All commands are paused\n` +
            `├◆ Only owner can wake up\n` +
            `├◆ Use .sleep off to wake\n` +
            `│\n` +
            `└ ❏`
        );
    }
};
