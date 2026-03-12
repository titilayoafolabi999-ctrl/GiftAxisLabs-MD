const config = require("../../config");
const crypto = require("crypto");
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{
    const r=crypto.randomBytes(1)[0]&0xf; return (c==="x"?r:(r&0x3|0x8)).toString(16);
  });
}
function uuidv1Style() {
  const now = Date.now().toString(16).padStart(12,"0");
  const rand = crypto.randomBytes(10).toString("hex");
  return now.slice(0,8)+"-"+now.slice(8,12)+"-1"+rand.slice(0,3)+"-"+rand.slice(3,7)+"-"+rand.slice(7);
}
module.exports = {
  name: "uuid", alias: ["guid","generateid","nanoid"],
  description: "Generate UUIDs, secure tokens, and random IDs",
  category: "dev",
  async execute(sock, m, args, reply) {
    const count = Math.min(parseInt(args[0])||1, 10);
    const type = (args[0]||"").toLowerCase();
    if (type==="token"||args[1]==="token") {
      const tokens = Array.from({length:Math.min(parseInt(args[0])||1,5)},()=>crypto.randomBytes(32).toString("hex"));
      return reply("🔑 *Secure Tokens (256-bit):*\n\n" + tokens.map((t,i)=>(i+1)+". `"+t+"`").join("\n") + config.footer);
    }
    if (type==="nano"||args[1]==="nano") {
      const size = parseInt(args[1])||21;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
      const ids = Array.from({length:3},()=>Array.from({length:size},()=>chars[crypto.randomBytes(1)[0]%64]).join(""));
      return reply("🆔 *NanoIDs:*\n\n" + ids.map((id,i)=>(i+1)+". `"+id+"`").join("\n") + config.footer);
    }
    const uuids = Array.from({length:count},()=>uuidv4());
    reply("┌ ❏ ◆ ⌜🆔 𝗨𝗨𝗜𝗗 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥⌟ ◆\n│\n" +
      uuids.map((u,i)=>"├◆ "+(i+1)+". `"+u+"`").join("\n") + "\n│\n" +
      "├◆ .uuid 5 — generate 5 UUIDs\n├◆ .uuid token — secure token\n├◆ .uuid nano — NanoID\n└ ❏" + config.footer);
  }
};
