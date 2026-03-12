# 🚀 Oracle Cloud VPS Setup Guide — Gift Axis Labs Bot

## Step 1: Create a Free Oracle Cloud Account
1. Go to https://cloud.oracle.com and sign up for a free account
2. You get **2 free AMD VMs** (Always Free tier) — no credit card charges

---

## Step 2: Create a VM Instance
1. Log in to Oracle Cloud Console
2. Go to **Compute > Instances > Create Instance**
3. Settings:
   - **Name:** GiftAxisBot
   - **Image:** Ubuntu 22.04 (Canonical)
   - **Shape:** VM.Standard.E2.1.Micro (Always Free)
   - **SSH Keys:** Generate a key pair and download the private key
4. Click **Create**

---

## Step 3: Open Port 3000 (for web dashboard)
1. Go to your instance > **Subnet** > **Security List**
2. Click **Add Ingress Rules**
3. Add:
   - Source CIDR: `0.0.0.0/0`
   - Destination Port: `3000`
   - Protocol: TCP
4. Also open port `443` and `80` if you want HTTPS later

---

## Step 4: Connect to Your VPS
On Windows, use PuTTY or Windows Terminal:
```
ssh -i your-key.pem ubuntu@YOUR_VPS_IP
```
On Mac/Linux:
```
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR_VPS_IP
```

---

## Step 5: Install Node.js on the VPS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # Should show v20.x.x
```

---

## Step 6: Upload Your Bot Files
**Option A: Using SCP (from your PC):**
```bash
scp -i your-key.pem GiftAxisLabs_V3_updated.zip ubuntu@YOUR_VPS_IP:~/
```

**Option B: Using GitHub (recommended):**
```bash
# On VPS:
sudo apt install git unzip -y
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

**Option C: Direct upload via unzip:**
```bash
# Upload zip then on VPS:
unzip GiftAxisLabs_V3_updated.zip
cd GiftAxisLabs_V3
```

---

## Step 7: Install Dependencies
```bash
cd GiftAxisLabs_V3
npm install
```

---

## Step 8: Configure Your Bot
Edit `config.js` with your details:
```bash
nano config.js
```
Set:
- `telegramBotToken` — your main Telegram bot token
- `telegramOwnerId` — your Telegram user ID (get it with /id)
- `ownerNumber` — your WhatsApp number
- `apiSecretKey` — change to a strong secret key

Save with `Ctrl+X`, then `Y`, then `Enter`

---

## Step 9: Run with PM2 (keeps bot alive 24/7)
```bash
# Install PM2
sudo npm install -g pm2

# Start the bot
pm2 start index.js --name giftaxis

# Save so it restarts on reboot
pm2 save
pm2 startup
# Copy and run the command it gives you

# Useful PM2 commands:
pm2 logs giftaxis        # View live logs
pm2 restart giftaxis     # Restart bot
pm2 stop giftaxis        # Stop bot
pm2 status               # Check status
```

---

## Step 10: Access Web Dashboard
Open your browser and go to:
```
http://YOUR_VPS_IP:3000
```

---

## Developer API Usage

### Generate Pairing Code via API:
```bash
curl -X POST http://YOUR_VPS_IP:3000/api/pair \
  -H "Content-Type: application/json" \
  -H "x-api-key: giftaxis-secret-change-me" \
  -d '{"phone": "2347012345678"}'
```

**Response:**
```json
{
  "success": true,
  "phone": "2347012345678",
  "code": "ABCD-EFGH",
  "instructions": "Open WhatsApp > Linked Devices > Link a Device > Link with phone number > Enter the code above"
}
```

### Check Bot Status:
```bash
curl http://YOUR_VPS_IP:3000/api/status \
  -H "x-api-key: giftaxis-secret-change-me"
```

---

## Firewall Fix (if dashboard not accessible)
Oracle Linux has an internal firewall. Run this:
```bash
sudo iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
sudo netfilter-persistent save
```
Or:
```bash
sudo ufw allow 3000
```

---

## Tips
- Your VPS IP is shown in Oracle Cloud Console under your instance
- Always Free tier = **FREE FOREVER**, no charges
- Use `pm2 logs giftaxis --lines 100` to debug issues
- To update the bot, upload new files and run `pm2 restart giftaxis`
