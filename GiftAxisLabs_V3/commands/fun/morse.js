const config = require("../../config");
const ENC = {A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----."," ":"/"};
const DEC = Object.fromEntries(Object.entries(ENC).map(([k,v])=>[v,k]));
module.exports = {
  name: "morse", alias: ["morsecode","dotdash"],
  description: "Encode/decode Morse code",
  category: "fun",
  async execute(sock, m, args, reply) {
    const type = (args[0]||"").toLowerCase();
    const text = args.slice(1).join(" ");
    if (!text && !type) return reply("Usage: .morse encode <text>\n.morse decode <morse code>\nExample: .morse encode HELLO\n.morse decode .... . .-.. .-.. ---");
    if (type==="decode") {
      const decoded = text.split(" ").map(c=>DEC[c]||"?").join("");
      return reply("🔓 *Morse Decoded:*\n\nMorse: " + text + "\nText: " + decoded + config.footer);
    }
    const input = type==="encode" ? text : (type+" "+text).trim();
    const encoded = input.toUpperCase().split("").map(c=>ENC[c]||"").filter(Boolean).join(" ");
    reply("📡 *Morse Code:*\n\nText: " + input + "\nMorse: " + encoded + config.footer);
  }
};
