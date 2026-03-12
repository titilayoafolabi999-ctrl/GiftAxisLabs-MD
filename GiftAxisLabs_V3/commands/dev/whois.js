const config = require("../../config");
const axios = require("axios");
module.exports = {
  name: "whois", alias: ["domainlookup","domaininfo"],
  description: "Domain WHOIS and DNS lookup",
  category: "dev",
  async execute(sock, m, args, reply) {
    const domain = (args[0]||"").replace(/https?:\/\//,"").split("/")[0].toLowerCase();
    if (!domain || !domain.includes(".")) return reply("Usage: .whois <domain>\nExample: .whois google.com");
    reply("🔍 Looking up " + domain + "...");
    try {
      const [dnsRes, rdapRes] = await Promise.allSettled([
        axios.get("https://dns.google/resolve?name=" + domain + "&type=A", { timeout: 8000 }),
        axios.get("https://rdap.org/domain/" + domain, { timeout: 8000 })
      ]);
      const dns = dnsRes.status==="fulfilled" ? dnsRes.value.data : null;
      const rdap = rdapRes.status==="fulfilled" ? rdapRes.value.data : null;
      const ips = dns?.Answer?.filter(a=>a.type===1).map(a=>a.data).join(", ") || "N/A";
      const registrar = rdap?.entities?.find(e=>e.roles?.includes("registrar"))?.vcardArray?.[1]?.find(a=>a[0]==="fn")?.[3] || "N/A";
      const registered = rdap?.events?.find(e=>e.eventAction==="registration")?.eventDate?.split("T")[0] || "N/A";
      const expires = rdap?.events?.find(e=>e.eventAction==="expiration")?.eventDate?.split("T")[0] || "N/A";
      const status = rdap?.status?.join(", ") || "N/A";
      reply("┌ ❏ ◆ ⌜🌐 𝗪𝗛𝗢𝗜𝗦: " + domain.toUpperCase() + "⌟ ◆\n│\n" +
        "├◆ 🌍 IP: " + ips + "\n" +
        "├◆ 🏢 Registrar: " + registrar + "\n" +
        "├◆ 📅 Registered: " + registered + "\n" +
        "├◆ ⏰ Expires: " + expires + "\n" +
        "├◆ 🔒 Status: " + status + "\n└ ❏" + config.footer);
    } catch(e) { reply("❌ Lookup failed for " + domain + ": " + e.message); }
  }
};
