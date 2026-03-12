const config = require("../../config");
const axios = require("axios");
const userMails = new Map();
module.exports = {
    name: "tempmail", alias: ["tmpmail","disposable"],
    async execute(sock, m, args, reply) {
        const userId = m.key.participant || m.key.remoteJid;
        const sub = args[0]?.toLowerCase();
        try {
            if (sub === "check") {
                const mail = userMails.get(userId);
                if (!mail) return reply("❌ No temp mail. Use .tempmail to generate one.");
                const [user, domain] = mail.split("@");
                const res = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${domain}`, { timeout: 10000 });
                const msgs = res.data;
                if (!msgs.length) return reply(`📬 *${mail}*\n\n📭 No emails yet. Try again in a moment.`);
                const latest = msgs.slice(0, 3).map((e,i) => `├◆ ${i+1}. From: ${e.from}\n├◆    Subject: ${e.subject}`).join("\n│\n");
                return reply(`📬 *${mail}*\n│\n${latest}\n│\n├◆ Use .tempmail read <id> for full email\n└ ❏` + config.footer);
            }
            if (sub === "read" && args[1]) {
                const mail = userMails.get(userId);
                if (!mail) return reply("❌ No temp mail active. Use .tempmail first.");
                const [user, domain] = mail.split("@");
                const res = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${user}&domain=${domain}&id=${args[1]}`, { timeout: 10000 });
                const d = res.data;
                return reply(`📧 *Email*\n\n📨 From: ${d.from}\n📋 Subject: ${d.subject}\n\n${(d.textBody||d.htmlBody||"Empty").slice(0,1500)}` + config.footer);
            }
            // Generate new
            const domains = ["1secmail.com","1secmail.net","1secmail.org"];
            const randomStr = Math.random().toString(36).slice(2,10);
            const domain = domains[Math.floor(Math.random()*domains.length)];
            const email = `${randomStr}@${domain}`;
            userMails.set(userId, email);
            reply(
                `┌ ❏ ◆ ⌜📬 𝗧𝗘𝗠𝗣 𝗠𝗔𝗜𝗟⌟ ◆\n│\n` +
                `├◆ 📧 ${email}\n│\n` +
                `├◆ .tempmail check — check inbox\n` +
                `├◆ .tempmail read <id> — read email\n│\n` +
                `├◆ ⚠️ Expires in ~1 hour\n└ ❏` + config.footer
            );
        } catch(e) { reply("❌ " + e.message); }
    }
};