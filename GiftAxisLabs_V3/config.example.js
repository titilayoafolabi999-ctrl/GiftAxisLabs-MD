/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GIFT AXIS LABS™ — Configuration Template
 *
 * Copy this file to config.js and fill in your values:
 *   cp config.example.js config.js
 *
 * NEVER commit config.js with real API keys to GitHub!
 * Add config.js to your .gitignore.
 * ─────────────────────────────────────────────────────────────────────────────
 */

module.exports = {
    // ── IDENTITY ──────────────────────────────────────────────────────────────
    botName:     "𝐆𝐈𝐅𝐓-𝐀𝐗𝐈𝐒 𝐌𝐃",
    ownerName:   "Gift",

    // Your WhatsApp number in international format (no + sign, add @s.whatsapp.net)
    // Example: 2347012345678@s.whatsapp.net
    ownerNumber: [process.env.OWNER_NUMBER ? process.env.OWNER_NUMBER + "@s.whatsapp.net" : "YOUR_NUMBER@s.whatsapp.net"],

    prefix: ".",

    // ── API KEYS ──────────────────────────────────────────────────────────────
    // Get free Gemini key: https://ai.google.dev/gemini-api/docs/api-key
    geminiKey:   process.env.GEMINI_KEY   || "YOUR_GEMINI_API_KEY",
    geminiModel: "gemini-2.0-flash",

    // ── TELEGRAM BOT TOKENS ───────────────────────────────────────────────────
    // Create bots with @BotFather on Telegram → /newbot
    // Up to 5 bots supported (Bot 1 is the main/default)
    telegramBotToken:  process.env.TELEGRAM_BOT_TOKEN  || "YOUR_TELEGRAM_BOT_TOKEN",
    telegramBotToken2: process.env.TELEGRAM_BOT_TOKEN2 || "",
    telegramBotToken3: process.env.TELEGRAM_BOT_TOKEN3 || "",
    telegramBotToken4: process.env.TELEGRAM_BOT_TOKEN4 || "",
    telegramBotToken5: process.env.TELEGRAM_BOT_TOKEN5 || "",

    // Your personal Telegram user ID (get it with /id command in your bot)
    telegramOwnerId: process.env.TELEGRAM_OWNER_ID || "",

    // ── NGROK TUNNEL ──────────────────────────────────────────────────────────
    // Get free authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
    // Required for local development. Not needed on Railway/Render/Heroku/VPS.
    ngrokAuthToken: process.env.NGROK_AUTH_TOKEN || "",
    ngrokEnabled:   process.env.NGROK_ENABLED !== "false",

    // ── PAIRING ACCESS CONTROL ────────────────────────────────────────────────
    // true  → any Telegram user can /pair (public bot)
    // false → only allowlisted users can /pair (private bot)
    openPairing: true,

    // ── ADMIN PANEL ──────────────────────────────────────────────────────────
    // Login at /admin — CHANGE THESE before going public!
    adminUser:     process.env.ADMIN_USER     || "admin",
    adminPassword: process.env.ADMIN_PASSWORD || "change-this-password",

    // ── DEVELOPER API ─────────────────────────────────────────────────────────
    // Secret key for the /api/pair and /api/status endpoints
    apiSecretKey: process.env.API_SECRET_KEY || "giftaxis-secret-change-me",

    // ── BRANDING ──────────────────────────────────────────────────────────────
    footer: "\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ Gift Axis Labs™",

    // ── SETTINGS ──────────────────────────────────────────────────────────────
    autoRead:   false,   // Auto-read all messages
    autoStatus: true,    // Auto-view status updates

    // ── REPLIES ───────────────────────────────────────────────────────────────
    msg: {
        wait:  "┌ ❏ ◆ ⌜⏳ 𝗣𝗥𝗢𝗖𝗘𝗦𝗦𝗜𝗡𝗚⌟ ◆\n│\n├◆ ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ...\n│\n└ ❏",
        admin: "┌ ❏ ◆ ⌜⚠️ 𝗔𝗗𝗠𝗜𝗡 𝗢𝗡𝗟𝗬⌟ ◆\n│\n├◆ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ʀᴇǫᴜɪʀᴇs ᴀᴅᴍɪɴ\n│\n└ ❏",
        owner: "┌ ❏ ◆ ⌜⚠️ 𝗢𝗪𝗡𝗘𝗥 𝗢𝗡𝗟𝗬⌟ ◆\n│\n├◆ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ʀᴇǫᴜɪʀᴇs ᴏᴡɴᴇʀ\n│\n└ ❏",
        group: "┌ ❏ ◆ ⌜⚠️ 𝗚𝗥𝗢𝗨𝗣 𝗢𝗡𝗟𝗬⌟ ◆\n│\n├◆ ᴜsᴇ ɪɴ ɢʀᴏᴜᴘ ᴄʜᴀᴛ ᴏɴʟʏ\n│\n└ ❏",
        error: "┌ ❏ ◆ ⌜❌ 𝗘𝗥𝗥𝗢𝗥⌟ ◆\n│\n├◆ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ\n│\n└ ❏"
    }
};
