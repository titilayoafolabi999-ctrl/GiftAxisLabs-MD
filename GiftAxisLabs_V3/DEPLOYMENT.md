# 🚀 Deployment Guide — GiftAxis MD

> How to host GiftAxis MD on Railway, Render, Heroku, a VPS (Ubuntu), and Termux (Android).

---

## 📋 Before You Deploy

Make sure you have these ready:

| Item | Where to get it |
|---|---|
| Gemini API Key | [ai.google.dev](https://ai.google.dev) → Get API key (free) |
| Telegram Bot Token | Telegram → [@BotFather](https://t.me/BotFather) → `/newbot` |
| Ngrok Auth Token | [dashboard.ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken) (free) |
| Your WhatsApp number | International format e.g. `2347012345678` |

---

## 🚂 Railway (Recommended — Free Tier Available)

Railway is the easiest option. Free $5/month credit, no credit card needed.

### Step 1 — Prepare your repo

```bash
# Add a .gitignore (very important — never push session or config with keys)
cat > .gitignore << 'EOF'
session1/
session2/
session3/
session4/
session5/
data/
node_modules/
public/generated/
.env
EOF
```

Create a `config.example.js` (copy of config.js with placeholders) for others:
```bash
cp config.js config.example.js
# Then replace actual values with YOUR_KEY_HERE placeholders
```

Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/GiftAxisLabs_V3.git
git push -u origin main
```

### Step 2 — Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway auto-detects Node.js and runs `npm start`

### Step 3 — Set Environment Variables

In Railway dashboard → your project → **Variables** tab, add:

```
GEMINI_KEY=your_gemini_api_key
TELEGRAM_BOT_TOKEN=your_telegram_token
NGROK_AUTH_TOKEN=your_ngrok_token
ADMIN_PASSWORD=your_secure_password
API_SECRET_KEY=your_api_secret
BOT_INDEX=1
PORT=3000
```

### Step 4 — Update config.js to use env vars

```javascript
// config.js — Railway / production version
module.exports = {
    geminiKey:        process.env.GEMINI_KEY        || "fallback-key",
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
    ngrokAuthToken:   process.env.NGROK_AUTH_TOKEN  || "",
    adminPassword:    process.env.ADMIN_PASSWORD    || "giftaxis123",
    apiSecretKey:     process.env.API_SECRET_KEY    || "giftaxis-secret",
    ownerNumber:      [(process.env.OWNER_NUMBER || "2347084362145") + "@s.whatsapp.net"],
    // ... rest of config
};
```

### Step 5 — Pair the bot

1. Once deployed, Railway gives you a public URL like `https://your-app.railway.app`
2. Open `https://your-app.railway.app` to access the pairing page
3. Or use Telegram: message your bot `/start` → `/pair`

> **Note:** With Railway, your app has a permanent URL — you don't need ngrok! Set `ngrokEnabled: false` in config.

---

## 🎨 Render (Free Tier — Spins Down After 15min Inactivity)

### Step 1 — Push to GitHub
Same as Railway Step 1 above.

### Step 2 — Create Web Service on Render

1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `giftaxis-md`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** Free

### Step 3 — Environment Variables

In Render → your service → **Environment** tab, add the same vars as Railway above.

### Step 4 — Prevent Sleep (Free Tier)

Free Render services sleep after 15 minutes of inactivity. To keep it awake:

```javascript
// Add to index.js after server.listen()
// Keep-alive ping to prevent Render from sleeping
if (process.env.RENDER_EXTERNAL_URL) {
    setInterval(() => {
        require("https").get(process.env.RENDER_EXTERNAL_URL + "/api/ping").on("error", ()=>{});
    }, 14 * 60 * 1000); // every 14 minutes
}
```

Also add this route to index.js:
```javascript
app.get("/api/ping", (req, res) => res.json({ status: "alive", time: Date.now() }));
```

> **Note:** Render gives you a permanent URL. Disable ngrok (`ngrokEnabled: false`).

---

## 🟣 Heroku

> **Note:** Heroku no longer has a free tier as of Nov 2022. Minimum ~$7/month.

### Step 1 — Install Heroku CLI

```bash
# macOS
brew install heroku/brew/heroku

# Ubuntu/Debian
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

# Windows — download installer from heroku.com/install
```

### Step 2 — Login and Create App

```bash
heroku login
heroku create giftaxis-md-yourname
```

### Step 3 — Configure

```bash
# Set environment variables
heroku config:set GEMINI_KEY=your_key
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set NGROK_AUTH_TOKEN=your_token
heroku config:set ADMIN_PASSWORD=your_password
heroku config:set NODE_ENV=production

# Add a Procfile
echo "web: node index.js" > Procfile
```

### Step 4 — Deploy

```bash
git add .
git commit -m "Add Procfile"
git push heroku main
```

### Step 5 — Open

```bash
heroku open
# Or:
heroku logs --tail   # Watch live logs
```

> Heroku gives you a permanent URL (e.g. `https://giftaxis-md.herokuapp.com`). Disable ngrok.

---

## 🖥️ VPS — Ubuntu 20.04 / 22.04 (DigitalOcean, Hetzner, Linode, Contabo)

This gives you the most control. Any VPS with 1GB RAM minimum works.

### Step 1 — Connect to your VPS

```bash
ssh root@your.server.ip.address
```

### Step 2 — Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # Should show v20.x.x
```

### Step 3 — Install PM2 (Process Manager)

PM2 keeps the bot running 24/7 and auto-restarts on crashes:

```bash
npm install -g pm2
```

### Step 4 — Clone and Configure

```bash
cd /root
git clone https://github.com/yourusername/GiftAxisLabs_V3.git
cd GiftAxisLabs_V3
npm install

# Create your config
cp config.example.js config.js
nano config.js   # Fill in all your API keys
```

### Step 5 — Start with PM2

```bash
# Start the bot
pm2 start index.js --name giftaxis-md

# Save PM2 process list (auto-restart on server reboot)
pm2 save
pm2 startup    # Follow the printed command

# Useful commands
pm2 logs giftaxis-md    # View live logs
pm2 status              # Check status
pm2 restart giftaxis-md # Restart
pm2 stop giftaxis-md    # Stop
```

### Step 6 — Set Up Nginx Reverse Proxy (Optional but Recommended)

This lets you use a domain name and HTTPS:

```bash
sudo apt install nginx certbot python3-certbot-nginx -y

# Create nginx config
sudo nano /etc/nginx/sites-available/giftaxis
```

Paste this (replace `yourdomain.com`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the config
sudo ln -s /etc/nginx/sites-available/giftaxis /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Enable HTTPS with Let's Encrypt (free SSL)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Now your bot is at `https://yourdomain.com/dashboard` 🎉

> With a real domain + HTTPS, disable ngrok (`ngrokEnabled: false`) and update config to use your domain URL.

### Step 7 — Firewall

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 📱 Termux (Android — Testing Only)

> Good for testing, not recommended for production.

```bash
# Install in Termux
pkg update && pkg upgrade -y
pkg install nodejs git -y

# Clone and install
git clone https://github.com/yourusername/GiftAxisLabs_V3.git
cd GiftAxisLabs_V3
npm install

# Edit config
nano config.js

# Run
node index.js
```

To keep it running when screen is off:
```bash
# Install tmux
pkg install tmux
tmux new -s bot
node index.js
# Detach: Ctrl+B, then D
# Reattach: tmux attach -t bot
```

---

## 🐳 Docker (Advanced)

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN mkdir -p session1 data public/generated

EXPOSE 3000
CMD ["node", "index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  giftaxis:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./session1:/app/session1   # Persist session
      - ./data:/app/data           # Persist economy/settings
    environment:
      - GEMINI_KEY=${GEMINI_KEY}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - NGROK_AUTH_TOKEN=${NGROK_AUTH_TOKEN}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
    restart: unless-stopped
```

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🌍 Ngrok vs Permanent URL

| Setup | Ngrok needed? | Notes |
|---|---|---|
| **Local / Development** | ✅ Yes | Ngrok gives public URL for testing |
| **Railway / Render** | ❌ No | They provide permanent HTTPS URLs |
| **Heroku** | ❌ No | Permanent HTTPS URL provided |
| **VPS + Nginx** | ❌ No | Your own domain + SSL |
| **VPS (no domain)** | ✅ Optional | Use ngrok OR just `http://IP:3000` |

When you have a permanent URL, update `config.js`:
```javascript
ngrokEnabled: false,
// The bot will use process.env.PUBLIC_URL or the server's own URL
```

---

## 🔄 Updating the Bot

```bash
# On VPS:
cd /root/GiftAxisLabs_V3
git pull origin main
npm install   # In case new dependencies were added
pm2 restart giftaxis-md

# On Railway/Render/Heroku:
git push origin main   # Auto-deploys
```

---

## 🔑 Environment Variables Reference

| Variable | Description | Required |
|---|---|---|
| `GEMINI_KEY` | Google Gemini API key | ✅ |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | ✅ |
| `NGROK_AUTH_TOKEN` | Ngrok authtoken | Optional |
| `ADMIN_PASSWORD` | Admin panel password | Recommended |
| `ADMIN_USER` | Admin panel username (default: `admin`) | Optional |
| `API_SECRET_KEY` | API webhook secret key | Optional |
| `OWNER_NUMBER` | Owner's WhatsApp number (no `@s.whatsapp.net`) | Optional |
| `PORT` | Express server port (default: `3000`) | Optional |
| `BOT_INDEX` | Bot instance number for multi-bot (default: `1`) | Optional |
| `PUBLIC_URL` | Your public domain (disables ngrok) | Optional |

---

## ❓ Common Deployment Issues

**Port already in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Session lost after redeploy:**
> This is expected. Persistent sessions require persistent storage.
> - Railway: Use a Volume for `/app/session1`
> - Render: Use a Persistent Disk
> - VPS: Sessions persist naturally in the filesystem

**Bot connects but no messages received:**
> Check that your WhatsApp is not logged in on too many devices (max 4 linked devices).

**Ngrok `ERR_NGROK_108` (session limit):**
> Free ngrok allows 1 concurrent tunnel. Kill any existing ngrok processes:
> ```bash
> pkill ngrok
> ```

**Memory issues on small VPS (512MB):**
```bash
# Add swap space
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

<div align="center">

**Gift Axis Labs™** · [GitHub](https://github.com/yourusername/GiftAxisLabs_V3) · [Issues](https://github.com/yourusername/GiftAxisLabs_V3/issues)

</div>
