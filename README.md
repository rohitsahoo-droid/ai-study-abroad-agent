# 🎓 AI Study Abroad Agent

An AI-powered study abroad planning platform built with Claude AI. Helps students shortlist universities, auto-generate SOPs, apply for education loans, and prepare for visas — all in one seamless flow.

---

## ✨ Features

- 🤖 **AI Twin Chat** — Powered by Claude, answers university, SOP, loan & visa questions
- 🏛 **University Navigator** — 24 universities across 9 countries with AI match scores
- 📝 **Auto SOP Generator** — Personalized statements of purpose in seconds
- 💳 **Loan Auto-Fill** — Complete loan application with smart pre-fill
- 🛂 **Visa Prep** — Checklists, timelines & tips for 5 visa types
- 🎮 **Gamified Journey** — XP points, progress tracking, step unlocks

---

## 📁 Project Structure

```
study-abroad-app/
├── public/
│   └── index.html        ← The entire frontend (single HTML file)
├── api/
│   └── chat.js           ← Vercel serverless proxy (hides your API key)
├── vercel.json           ← Vercel routing config
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Deploy in 10 Minutes

### Step 1 — Get your Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`) — save it somewhere safe

---

### Step 2 — Push to GitHub

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `ai-study-abroad-agent` → **Create repository**
3. Open your terminal and run:

```bash
# Navigate to this project folder
cd study-abroad-app

# Initialize git
git init
git add .
git commit -m "Initial commit — AI Study Abroad Agent"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-study-abroad-agent.git
git branch -M main
git push -u origin main
```

---

### Step 3 — Deploy on Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub (free)
2. Click **Add New Project**
3. Select your `ai-study-abroad-agent` repository → click **Import**
4. Click **Deploy** — wait ~30 seconds

---

### Step 4 — Add your API Key to Vercel

> ⚠️ This is the most important step — without this, AI features won't work.

1. In Vercel dashboard → click your project
2. Go to **Settings** → **Environment Variables**
3. Click **Add New**:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-your-actual-key-here`
   - **Environment:** select all (Production, Preview, Development)
4. Click **Save**
5. Go to **Deployments** → click the three dots on latest → **Redeploy**

✅ Done! Your app is live at `https://your-project.vercel.app`

---

## 💻 Run Locally (Optional)

```bash
# Install Vercel CLI
npm install -g vercel

# Create local env file
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env.local

# Run locally
vercel dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 💰 Cost Estimate

| Usage | Est. Cost |
|-------|-----------|
| 1,000 chat messages (Haiku) | ~$0.50 |
| 100 SOP generations (Sonnet) | ~$0.80 |
| 10,000 users/month light use | ~$5–15 |

Free $5 credits when you sign up on Anthropic console.

---

## 🔧 Customization

- **Change AI model:** Edit `model` in `api/chat.js` (default: `claude-haiku-4-5-20251001` for speed/cost, or use `claude-sonnet-4-6` for best quality)
- **Add universities:** Edit the `universities` array in `public/index.html`
- **Change branding:** Edit colors in `:root` CSS variables in `public/index.html`

---

## 🛠 Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (zero dependencies)
- **Backend:** Vercel Serverless Function (Node.js)
- **AI:** Anthropic Claude API
- **Hosting:** Vercel (free tier)

---

## 📄 License

MIT — free to use, modify, and deploy.
