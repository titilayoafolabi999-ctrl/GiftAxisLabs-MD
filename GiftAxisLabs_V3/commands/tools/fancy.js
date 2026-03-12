module.exports = {
    name: "fancy",
    async execute(sock, m, args, reply) {
        if (!args[0]) return reply("🎨 *Usage:* .fancy [text]");
        const text = args.join(" ");
        const styles = [
            text.split("").join(" "),
            text.toUpperCase().split("").map(c => c + "̲").join(""),
            "『" + text.split("").join("』『") + "』",
            "【" + text + "】",
            "★ " + text + " ★"
        ];
        reply(`🎨 *Fancy Text*\n\n${styles.join("\n\n")}`);
    }
};
