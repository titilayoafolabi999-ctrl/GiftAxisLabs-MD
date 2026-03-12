const config = require("../../config");
module.exports = {
  name: "encode", alias: ["decode","b64","urlencode"],
  description: "Encode/decode Base64, URL, HTML entities, JWT",
  category: "dev",
  async execute(sock, m, args, reply) {
    const type = (args[0]||"").toLowerCase();
    const text = args.slice(1).join(" ");
    if (!type || !text) return reply(
      "Usage: .encode <type> <text>\n\n" +
      "Types:\n" +
      "• b64encode — Base64 encode\n" +
      "• b64decode — Base64 decode\n" +
      "• urlencode — URL encode\n" +
      "• urldecode — URL decode\n" +
      "• htmlencode — HTML entities\n" +
      "• htmldecode — Decode HTML\n" +
      "• reverse — Reverse text\n" +
      "• rot13 — ROT13 cipher"
    );
    let result;
    try {
      switch(type) {
        case "b64encode": result = Buffer.from(text).toString("base64"); break;
        case "b64decode": result = Buffer.from(text,"base64").toString("utf8"); break;
        case "urlencode": result = encodeURIComponent(text); break;
        case "urldecode": result = decodeURIComponent(text); break;
        case "htmlencode": result = text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"); break;
        case "htmldecode": result = text.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#039;/g,"'"); break;
        case "reverse": result = text.split("").reverse().join(""); break;
        case "rot13": result = text.replace(/[a-zA-Z]/g,c=>{const base=c<="Z"?65:97;return String.fromCharCode((c.charCodeAt(0)-base+13)%26+base);}); break;
        default: return reply("Unknown type. Use: b64encode, b64decode, urlencode, urldecode, htmlencode, htmldecode, reverse, rot13");
      }
      reply("┌ ❏ ◆ ⌜🔄 𝗘𝗡𝗖𝗢𝗗𝗘/𝗗𝗘𝗖𝗢𝗗𝗘⌟ ◆\n│\n├◆ Type: " + type + "\n├◆ Input: " + text.slice(0,100) + "\n│\n├◆ Result:\n├◆ " + result.slice(0,2000) + "\n└ ❏" + config.footer);
    } catch(e) { reply("❌ Error: " + e.message); }
  }
};
