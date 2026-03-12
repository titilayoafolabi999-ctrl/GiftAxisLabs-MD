module.exports = {
    name: "password",
    alias: ["passgen", "genpass"],
    async execute(sock, m, args, reply) {
        const length = parseInt(args[0]) || 16;
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
        let password = "";
        for (let i = 0; i < length; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
        reply(`🔐 *Generated Password (${length} chars):*\n\n\`${password}\``);
    }
};
