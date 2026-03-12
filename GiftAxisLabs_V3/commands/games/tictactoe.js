const config = require("../../config");
const games = new Map();

function renderBoard(b) {
  const s = b.map((v,i) => v || String(i+1));
  return [
    "┌───┬───┬───┐",
    "│ "+s[0]+" │ "+s[1]+" │ "+s[2]+" │",
    "├───┼───┼───┤",
    "│ "+s[3]+" │ "+s[4]+" │ "+s[5]+" │",
    "├───┼───┼───┤",
    "│ "+s[6]+" │ "+s[7]+" │ "+s[8]+" │",
    "└───┴───┴───┘"
  ].join("\n");
}

function checkWin(b, p) {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(([a,bb,c]) => b[a]===p && b[bb]===p && b[c]===p);
}

module.exports = [
  {
    name: "tictactoe", alias: ["ttt","xo"],
    description: "Challenge someone to Tic Tac Toe",
    category: "games", groupOnly: true,
    async execute(sock, m, args, reply) {
      const from = m.key.remoteJid;
      const p1 = m.key.participant || m.key.remoteJid;
      const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const p2 = mentions[0];
      if (!p2) return reply("Usage: .tictactoe @opponent\nTag someone to challenge!");
      if (p2 === p1) return reply("You can't play against yourself!");
      games.set(from, { board: Array(9).fill(null), p1, p2, turn: p1, active: true });
      await sock.sendMessage(from, {
        text: "┌ ❏ ◆ ⌜🎮 𝗧𝗜𝗖-𝗧𝗔𝗖-𝗧𝗢𝗘⌟ ◆\n│\n" +
          "├◆ ❌ @" + p1.split("@")[0] + " vs ⭕ @" + p2.split("@")[0] + "\n│\n" +
          renderBoard(Array(9).fill(null)) + "\n│\n" +
          "├◆ @" + p1.split("@")[0] + "'s turn (❌)\n" +
          "├◆ Make a move: .move <1-9>\n└ ❏" + config.footer,
        mentions: [p1, p2]
      }, { quoted: m });
    }
  },
  {
    name: "move", alias: ["play","m2"],
    description: "Make a move in Tic Tac Toe",
    category: "games", groupOnly: true,
    async execute(sock, m, args, reply) {
      const from = m.key.remoteJid;
      const sender = m.key.participant || m.key.remoteJid;
      const g = games.get(from);
      if (!g?.active) return reply("No active game! Start with .tictactoe @opponent");
      if (sender !== g.turn) return reply("It's @" + g.turn.split("@")[0] + "'s turn!");
      const pos = parseInt(args[0]) - 1;
      if (isNaN(pos) || pos < 0 || pos > 8) return reply("Pick a number 1-9");
      if (g.board[pos]) return reply("That spot is taken!");
      const sym = sender === g.p1 ? "❌" : "⭕";
      g.board[pos] = sym;
      const board = renderBoard(g.board);
      if (checkWin(g.board, sym)) {
        games.delete(from);
        return await sock.sendMessage(from, {
          text: "┌ ❏ ◆ ⌜🏆 𝗚𝗔𝗠𝗘 𝗢𝗩𝗘𝗥⌟ ◆\n│\n" + board + "\n│\n🎉 @" + sender.split("@")[0] + " wins!\n└ ❏",
          mentions: [sender]
        }, { quoted: m });
      }
      if (g.board.every(Boolean)) { games.delete(from); return reply(board + "\n\n🤝 It's a draw!"); }
      g.turn = sender === g.p1 ? g.p2 : g.p1;
      const nextSym = g.turn === g.p1 ? "❌" : "⭕";
      await sock.sendMessage(from, {
        text: board + "\n│\n├◆ @" + g.turn.split("@")[0] + "'s turn (" + nextSym + ")\n├◆ .move <1-9>",
        mentions: [g.turn]
      }, { quoted: m });
    }
  }
];
