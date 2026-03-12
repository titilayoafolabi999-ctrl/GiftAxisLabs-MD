const axios = require("axios");
module.exports = {
    name: "fact",
    alias: ["facts"],
    async execute(sock, m, args, reply) {
        try {
            const res = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random", { timeout: 10000 });
            reply(`📚 *Random Fact:*\n\n${res.data.text}`);
        } catch (e) {
            const facts = [
                "Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that was still edible.",
                "Octopuses have three hearts and blue blood.",
                "A group of flamingos is called a 'flamboyance'.",
                "Bananas are berries, but strawberries aren't.",
                "The shortest war in history lasted 38 minutes."
            ];
            reply(`📚 *Random Fact:*\n\n${facts[Math.floor(Math.random() * facts.length)]}`);
        }
    }
};
