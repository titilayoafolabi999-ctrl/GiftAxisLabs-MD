module.exports = {
    name: "quoted",
    alias: ["q"],
    async execute(sock, m, args, reply) {
        const quoted = m.message?.extendedTextMessage?.contextInfo;
        if (!quoted?.quotedMessage) return reply("❌ Reply to a message to see its details.");
        const type = Object.keys(quoted.quotedMessage)[0];
        const text = quoted.quotedMessage?.conversation || quoted.quotedMessage?.extendedTextMessage?.text || `[${type}]`;
        reply(`📝 *Quoted Message*\n\n👤 From: @${(quoted.participant || "unknown").split("@")[0]}\n📄 Type: ${type}\n💬 Content: ${text}`);
    }
};
