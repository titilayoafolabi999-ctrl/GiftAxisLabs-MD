const config = require("../../config");
const CHARS = {
  A:"  #\n # #\n###\n#  #\n#  #",B:"## \n# #\n## \n# #\n## ",C:" ##\n#  \n#  \n#  \n ##",
  D:"## \n# #\n# #\n# #\n## ",E:"###\n#  \n## \n#  \n###",F:"###\n#  \n## \n#  \n#  ",
  G:" ##\n#  \n# ##\n#  #\n ###",H:"# #\n# #\n###\n# #\n# #",I:"###\n #  \n # \n # \n###",
  J:"  #\n  #\n  #\n# #\n ##",K:"# #\n##  \n##  \n# #\n#  #",L:"#  \n#  \n#  \n#  \n###",
  M:"# #\n###\n# #\n# #\n# #",N:"# #\n##  #\n# # #\n#  ##\n#  #",O:" # \n# #\n# #\n# #\n # ",
  P:"## \n# #\n## \n#  \n#  ",R:"## \n# #\n## \n##  \n# #",S:" ##\n#  \n ## \n  #\n## ",
  T:"###\n # \n # \n # \n # ",U:"# #\n# #\n# #\n# #\n ###",V:"# #\n# #\n# #\n ###\n # ",
  W:"# #\n# #\n###\n###\n# #",X:"# #\n # \n # \n # #\n# #",Y:"# #\n ###\n  # \n  # \n  # ",
  Z:"###\n  #\n ## \n#  \n###",
  "0":" # \n# #\n# #\n# #\n # ","1":" #\n##\n #\n #\n###","2":" # \n# #\n  #\n #  \n###",
  "3":"## \n  #\n ##\n  #\n## ","4":"# #\n# #\n###\n  #\n  #",
  "5":"###\n#  \n## \n  #\n## ","6":" ##\n#  \n## \n# #\n ## ",
  "7":"###\n  #\n  #\n  #\n  #","8":" # \n# #\n # \n# #\n # ","9":" ##\n# #\n ##\n  #\n ## ",
  "!":"# \n# \n# \n  \n# ","?":" ##\n#  #\n  # \n    \n  # "," ":"   "
};
function textToAscii(text, fill="█") {
  const rows = [["","","","",""],["","","","",""]];
  for(const ch of text.toUpperCase().slice(0,10)) {
    const pattern = CHARS[ch];
    if(!pattern) continue;
    const lines = pattern.split("\n");
    for(let i=0;i<5;i++) rows[0][i]=(rows[0][i]||"")+(lines[i]||"   ").replace(/#/g,fill)+" ";
  }
  return rows[0].join("\n");
}
module.exports = {
  name: "ascii", alias: ["asciart","textart","bigtext"],
  description: "Convert text to ASCII art",
  category: "fun",
  async execute(sock, m, args, reply) {
    const fill = (args[0]||"").length===1 && !/[a-z0-9]/i.test(args[0]) ? args[0] : null;
    const text = (fill ? args.slice(1) : args).join(" ").slice(0,10);
    if (!text) return reply("Usage: .ascii <text>\nExample: .ascii HELLO\n.ascii GIFT ★  (custom fill char)");
    const art = textToAscii(text, fill || "█");
    reply("```\n" + art + "\n```" + config.footer);
  }
};
