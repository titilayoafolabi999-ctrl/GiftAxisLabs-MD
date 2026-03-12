const axios = require("axios");
module.exports = {
    name: "define",
    alias: ["dict", "meaning"],
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("📖 *Usage:* .define [word]\n\n_Example: .define serendipity_");
        try {
            const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${args[0]}`, { timeout: 10000 });
            const word = res.data[0];
            const meaning = word.meanings[0];
            const def = meaning.definitions[0];
            let text = `📖 *${word.word}*\n\n📝 *${meaning.partOfSpeech}*: ${def.definition}`;
            if (def.example) text += `\n💬 Example: "${def.example}"`;
            if (word.phonetic) text += `\n🔊 Pronunciation: ${word.phonetic}`;
            reply(text);
        } catch (e) {
            reply("❌ Word not found. Check spelling and try again.");
        }
    }
};
