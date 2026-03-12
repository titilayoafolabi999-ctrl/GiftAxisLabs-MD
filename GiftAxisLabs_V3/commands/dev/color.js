const config = require("../../config");
function hexToRgb(hex) {
  const r = parseInt(hex.slice(0,2),16); const g = parseInt(hex.slice(2,4),16); const b = parseInt(hex.slice(4,6),16);
  return {r,g,b};
}
function rgbToHsl(r,g,b) {
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}else{
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;}
  }
  return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
}
module.exports = {
  name: "color", alias: ["colour","hex2rgb","colorinfo"],
  description: "Convert and analyze colors (HEX, RGB, HSL)",
  category: "dev",
  async execute(sock, m, args, reply) {
    const input = (args[0]||"").replace("#","").toLowerCase();
    if (!input) return reply("Usage: .color <hex>\nExample: .color #FF5733 or .color FF5733");
    if (!/^[0-9a-f]{6}$/.test(input)) return reply("❌ Invalid hex color. Use 6 hex digits. Example: FF5733");
    const {r,g,b} = hexToRgb(input);
    const {h,s,l} = rgbToHsl(r,g,b);
    const luminance = (0.299*r+0.587*g+0.114*b)/255;
    const onDark = luminance > 0.5 ? "Light color (use dark text)" : "Dark color (use light text)";
    const analogous = [
      "#" + [(h+30)%360,s,l].map(v=>Math.round(v)).join(","),
      "#" + [(h-30+360)%360,s,l].map(v=>Math.round(v)).join(",")
    ];
    reply("┌ ❏ ◆ ⌜🎨 𝗖𝗢𝗟𝗢𝗥 𝗜𝗡𝗙𝗢⌟ ◆\n│\n" +
      "├◆ HEX: #" + input.toUpperCase() + "\n" +
      "├◆ RGB: rgb(" + r + ", " + g + ", " + b + ")\n" +
      "├◆ HSL: hsl(" + h + "deg, " + s + "%, " + l + "%)\n" +
      "├◆ Luminance: " + (luminance*100).toFixed(1) + "%\n" +
      "├◆ Usage: " + onDark + "\n└ ❏" + config.footer);
  }
};
