<div align="center">

# 𝐆𝐈𝐅𝐓-𝐀𝐗𝐈𝐒 𝐌𝐃
### The Most Feature-Rich WhatsApp Bot for Learning Groups & Communities

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-Latest-25D366?style=flat-square&logo=whatsapp)](https://github.com/WhiskeySockets/Baileys)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**124+ commands** · **AI-powered learning** · **Live web dashboard** · **Multi-bot support** · **Ngrok tunneling**

![Dashboard Preview](https://img.shields.io/badge/Dashboard-/dashboard-6366f1?style=for-the-badge)
![Admin Panel](https://img.shields.io/badge/Admin%20Panel-/admin-f97316?style=for-the-badge)

</div>

---

## ✨ What Makes This Different

GiftAxis MD is not just another WhatsApp bot. It's a **complete learning management system** built into WhatsApp, powered by Gemini AI, with a real-time web dashboard and admin panel accessible publicly via ngrok tunneling.

| Feature | Description |
|---|---|
| 🧠 **AI Coding Labs** | Gemini generates personalized, FCC-style coding challenges with live browser pages |
| 📊 **Web Dashboard** | Real-time stats, pairing, leaderboard — accessible via your public ngrok URL |
| ⚙️ **Admin Panel** | Full bot control, economy management, broadcast, live logs at `/admin` |
| 🌍 **Ngrok Tunneling** | Every generated file (labs, invoices, code) gets a public URL automatically |
| 🎮 **Full Economy** | Virtual economy with wallet, bank, shop, fishing, mining, gambling |
| 🃏 **Live Games** | Blackjack, Wordle, TicTacToe, Trivia, Hangman — all playable in-chat |
| 🛠️ **Dev Tools** | Run code in 20+ languages, WHOIS, regex tester, hash generator, UUID |
| 👥 **Group Management** | Anti-flood, slow mode, polls, auto-reply, anonymous confessions |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- A Telegram bot token (for pairing)
- A Google Gemini API key (free at [ai.google.dev](https://ai.google.dev))
- An ngrok account (free at [ngrok.com](https://ngrok.com))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/GiftAxisLabs_V3.git
cd GiftAxisLabs_V3

# 2. Install dependencies
npm install

# 3. Configure the bot
cp config.example.js config.js
nano config.js   # Fill in your tokens

# 4. Start the bot
node index.js
```

### Configuration (`config.js`)

```javascript
module.exports = {
    // Bot identity
    botName:       "𝐆𝐈𝐅𝐓-𝐀𝐗𝐈𝐒 𝐌𝐃",
    ownerNumber:   ["2347084362145@s.whatsapp.net"],  // Your WhatsApp number

    // API Keys (required)
    geminiKey:     "YOUR_GEMINI_API_KEY",    // https://ai.google.dev
    telegramBotToken: "YOUR_TELEGRAM_TOKEN", // @BotFather on Telegram

    // Ngrok (free at https://dashboard.ngrok.com)
    ngrokAuthToken: "YOUR_NGROK_TOKEN",
    ngrokEnabled:   true,

    // Admin Panel
    adminUser:     "admin",
    adminPassword: "change-this-password",   // ← IMPORTANT: Change this!
};
```

### Pairing Your WhatsApp

**Method 1 — Telegram Bot (Recommended):**
1. Add your Telegram bot
2. Send `/start` → `/pair`
3. Enter your phone number
4. Enter the 8-character code in WhatsApp → Linked Devices → Link a Device

**Method 2 — Web Dashboard:**
1. Start the bot: `node index.js`
2. Open `http://localhost:3000` (or your ngrok URL)
3. Enter your phone number and follow the instructions

**Method 3 — API:**
```bash
curl -X POST http://localhost:3000/api/pair \
  -H "x-api-key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"phone": "2347012345678"}'
```

---

## 📋 Command Reference

### 🏫 Learning System
| Command | Description |
|---|---|
| `.setclass <name> \| <language>` | Set up a learning group |
| `.lab <topic> [difficulty]` | Generate an AI coding lab + browser page |
| `.submit <code>` | Submit your lab solution for AI grading |
| `.labsolution` | Reveal the lab solution (downloadable) |
| `.curriculum [weeks]` | Generate a full course curriculum |
| `.quiz` | Start an AI-generated quiz |
| `.ask <question>` | Ask the AI tutor anything |
| `.assign <task>` | Give students an assignment |
| `.attendance` | Take attendance |
| `.leaderboard` | Show class rankings |

### 🎮 Games
| Command | Description |
|---|---|
| `.blackjack <bet>` | Blackjack vs dealer with hit/stand/double |
| `.wordle` | Guess the 5-letter word in 6 tries |
| `.trivia [category]` | Real questions from OpenTDB API |
| `.tictactoe @user` | Challenge someone to TicTacToe |
| `.hangman` | Guess the programming word |
| `.rps rock\|paper\|scissors [bet]` | Rock Paper Scissors with optional bet |

### 💰 Economy
| Command | Description |
|---|---|
| `.daily` | Claim daily reward ($500) |
| `.balance` | Check your wallet & bank |
| `.bank deposit <amount>` | Deposit to bank |
| `.shop` | View item shop |
| `.buy <item>` | Purchase an item |
| `.fish` · `.hunt` · `.mine` | Gather resources (cooldowns apply) |
| `.gamble <amount>` | Try your luck |
| `.rank` | Economy leaderboard |

### 🛠️ Dev Tools
| Command | Description |
|---|---|
| `.run <lang> <code>` | Execute code in 20+ languages |
| `.npm <package>` | Look up any NPM package |
| `.hash [algo] <text>` | Generate MD5/SHA256/SHA512 hashes |
| `.uuid [count]` | Generate UUIDs, tokens, NanoIDs |
| `.encode <type> <text>` | Base64, URL, HTML, ROT13 encode/decode |
| `.regex <pattern> \| <test>` | Test regex with presets |
| `.whois <domain>` | Domain WHOIS + DNS lookup |
| `.color #RRGGBB` | Hex color → RGB → HSL converter |
| `.format <pretty\|minify> <json>` | JSON formatter/validator |

### 🤖 AI Features
| Command | Description |
|---|---|
| `.ai <question>` | Chat with Gemini AI |
| `.debate <topic>` | AI argues both sides |
| `.persona <name> <message>` | Chat as Einstein, Yoda, Tony Stark, etc. |
| `.story new <genre>` | Collaborative AI storytelling |
| `.imagine <idea>` | Generate AI image prompts |
| `.summary` | Summarize a quoted message |
| `.solve <problem>` | Step-by-step AI problem solver |
| `.translate <lang> <text>` | Translate to 15+ languages |
| `.roast <subject>` | Playful AI roast |

### 👥 Group Management
| Command | Description |
|---|---|
| `.setwelcome <message>` | Custom welcome message with {name} {group} |
| `.poll <question> \| opt1 \| opt2...` | Create a poll |
| `.vote <A/B/C>` | Vote in an active poll |
| `.autoreply <keyword> => <response>` | Set keyword auto-replies |
| `.slowmode <seconds>` | Rate-limit messages |
| `.antiflood [limit]` | Auto-mute spammers |
| `.afk [reason]` | Set AFK status |
| `.setrules <rule1 \| rule2...>` | Set group rules |
| `.setconfession` | Enable anonymous confession channel |
| `.confess <message>` | Post anonymously |
| `.analytics` | Group message analytics |

### 🌐 Media & Utilities
| Command | Description |
|---|---|
| `.sticker` | Convert image/video to sticker |
| `.toimg` | Convert sticker to image |
| `.tiktok <url>` | Download TikTok video |
| `.lyrics <artist - song>` | Fetch song lyrics |
| `.currency <amount> <from> <to>` | Currency converter |
| `.convert <val> <from> <to>` | Unit converter (length/weight/temp) |
| `.invoice <client> \| item:price...` | Generate a professional invoice |
| `.tempmail` | Generate a temporary email |
| `.shorten <url>` | Shorten any URL |
| `.weather <city>` | Current weather |

---

## 🌐 Web Interfaces

Once the bot is running, these URLs are available:

| Path | Description |
|---|---|
| `/` | Pairing page (scan QR or enter code) |
| `/dashboard` | **User dashboard** — stats, sessions, commands, leaderboard |
| `/admin` | **Admin panel** — full bot control (requires login) |
| `/generated/<filename>` | Generated files (labs, invoices, code) |
| `/api/status` | Bot status JSON (requires API key) |
| `/api/pair` | Pairing webhook (requires API key) |

With ngrok enabled, all these are accessible at your public URL:
```
https://abc123.ngrok.io/dashboard
https://abc123.ngrok.io/admin
```

---

## 🏗️ Project Structure

```
GiftAxisLabs_V3/
├── index.js              # Main entry point, Express server, message handler
├── config.js             # All configuration (API keys, settings)
├── package.json
│
├── commands/             # All bot commands (auto-discovered)
│   ├── admin/            # Group admin commands (kick, ban, promote, etc.)
│   ├── ai/               # AI commands (debate, persona, story, roast, etc.)
│   ├── dev/              # Developer tools (run code, npm, hash, uuid, etc.)
│   ├── fun/              # Fun commands (ascii, morse, riddle, wyr, etc.)
│   ├── games/            # Games (blackjack, wordle, trivia, tictactoe, etc.)
│   ├── group/            # Group management (poll, autoreply, slowmode, etc.)
│   ├── learning/         # Learning system (lab, quiz, assignment, etc.)
│   ├── media/            # Media (sticker, tiktok, lyrics, etc.)
│   ├── productivity/     # Productivity (invoice, translate, currency, etc.)
│   └── tools/            # Tools (economy: fish, hunt, mine, bank, shop, etc.)
│
├── lib/
│   ├── database.js       # Persistent data layer
│   ├── geminiAgent.js    # Gemini AI brain (labs, quizzes, moderation)
│   ├── learningDB.js     # Learning group data management
│   ├── ngrokManager.js   # Ngrok tunnel manager
│   └── fileServer.js     # Generated file serving + HTML builders
│
├── public/               # Web assets
│   ├── index.html        # Pairing page
│   ├── dashboard.html    # User dashboard
│   ├── admin.html        # Admin panel
│   └── generated/        # Auto-generated files (labs, invoices, code)
│
└── data/                 # Runtime data (auto-created)
    ├── economy.json
    ├── birthdays.json
    ├── polls.json
    └── ...
```

---

## 🤖 Multi-Bot Support

Run up to 5 bot instances simultaneously:

```bash
# Start all bots (uses config for up to 5 Telegram tokens)
node start-all.js

# Start specific bots
node index.js 1    # Port 3000
node index.js 2    # Port 3001
node index.js 3    # Port 3002
```

Each bot gets its own:
- Session directory (`session1/`, `session2/`, etc.)
- Port (3000, 3001, 3002...)
- Telegram bot token

---

## 🔒 Security Notes

1. **Change the admin password** in `config.js` before deploying
2. **Never commit `config.js`** with real API keys — add it to `.gitignore`
3. **Session folders** (`session1/`, etc.) contain auth keys — never share them
4. The ngrok URL changes every restart (free tier) — use a paid ngrok plan for a static URL
5. The admin panel token expires after 4 hours

---

## 🐛 Troubleshooting

**`Bad MAC` error / can't connect:**
```bash
rm -rf session1/   # Delete the session folder
node index.js      # Re-pair from scratch
```

**Ngrok not starting:**
```bash
npm install ngrok  # Install ngrok package
# Add your authtoken to config.js → ngrokAuthToken
```

**`Module not found` errors:**
```bash
npm install        # Install all dependencies
```

**Bot paired but not responding:**
- Check that the prefix in `config.js` matches what you're using (default: `.`)
- Make sure you're messaging the bot's WhatsApp number directly or in a group it's in

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `@whiskeysockets/baileys` | WhatsApp Web API |
| `@google/generative-ai` | Gemini AI |
| `express` + `socket.io` | Web dashboard + real-time |
| `node-telegram-bot-api` | Telegram pairing bot |
| `ngrok` | Public tunnel for local server |
| `fs-extra` | Enhanced file system |
| `axios` | HTTP requests |
| `qrcode` | QR code generation |
| `pino` | Logging |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ❤️ by **Gift Axis Labs™**

⭐ Star this repo if it helped you!

</div>
