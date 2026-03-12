const config = require("../../config");
const activeGames = new Map();
const STAGES = [
  "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========="
];
const WORDS = ["javascript","python","algorithm","database","frontend","backend","variable","function","component","recursion","interface","encryption","debugging","middleware","deployment","repository","asynchronous","inheritance","polymorphism","abstraction","useState","callback","promise","closure","prototype","mutation","framework","compiler","interpreter","threading"];
module.exports = {
  name: "hangman", alias: ["hm","wordguess"],
  description: "Play hangman - guess the programming word",
  category: "games",
  async execute(sock, m, args, reply) {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const key = from + ":" + sender;
    const g = activeGames.get(key);
    const letter = (args[0] || "").toLowerCase();
    if (letter.length === 1 && /[a-z]/.test(letter) && g) {
      if (g.guessed.includes(letter)) return reply("Already guessed: " + letter);
      g.guessed.push(letter);
      if (!g.word.includes(letter)) g.wrong++;
      const display = g.word.split("").map(c => g.guessed.includes(c) ? c.toUpperCase() : "_").join(" ");
      const wrong = g.guessed.filter(l => !g.word.includes(l));
      if (g.wrong >= 6) {
        activeGames.delete(key);
        return reply(STAGES[6] + "\n\n💀 Game over! Word: *" + g.word + "*");
      }
      if (g.word.split("").every(c => g.guessed.includes(c))) {
        activeGames.delete(key);
        return reply(STAGES[g.wrong] + "\n\n🎉 You got it! Word: *" + g.word + "*\n⭐ +20 XP!");
      }
      return reply(STAGES[g.wrong] + "\n\n" + display + "\n\n❌ Wrong guesses: " + (wrong.join(", ") || "none") + "\n❤️ Lives: " + (6-g.wrong) + "\n\n.hangman <letter>");
    }
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    activeGames.set(key, { word, guessed: [], wrong: 0 });
    const display = word.split("").map(() => "_").join(" ");
    reply(STAGES[0] + "\n\n" + display + "\n\n📝 " + word.length + "-letter programming word\nGuess with: .hangman <letter>" + config.footer);
  }
};
