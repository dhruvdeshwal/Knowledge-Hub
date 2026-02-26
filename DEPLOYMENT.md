# Knowledge Hub — Deployment Guide

A full-stack EdTech platform built with **React** (frontend) + **Node.js/Express** (backend), using MongoDB, Cloudinary, Razorpay, and Nodemailer.

---

## 📋 Prerequisites (All Deployment Methods)

You need accounts/credentials for these services before deploying:

| Service | Purpose | Get it |
|---|---|---|
| **MongoDB Atlas** | Database | [mongodb.com/atlas](https://www.mongodb.com/atlas) — free M0 tier works |
| **Cloudinary** | Media/image/video storage | [cloudinary.com](https://cloudinary.com) — free tier works |
| **Razorpay** | Payment processing | [razorpay.com](https://razorpay.com) — use test keys |
| **Gmail / SMTP** | Sending emails | Gmail App Password or any SMTP provider |

---

## 🔧 Environment Variables Reference

### Server (`server/.env`)

```env
PORT=4000
NODE_ENV=production

# MongoDB Atlas connection string
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/knowledge-hub

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
FOLDER_NAME=KnowledgeHub

# Razorpay
RAZORPAY_KEY=rzp_test_xxxxx
RAZORPAY_SECRET=your_secret

# JWT (use a strong random string, 32+ chars)
JWT_SECRET=change_this_to_a_long_random_secret_string

# Email (Gmail example)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your@gmail.com
MAIL_PASS=your_gmail_app_password   # NOT your regular password

# CORS — set to your actual frontend URL in production
CLIENT_URL=https://your-domain.com
```

> **Gmail App Password setup:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

### Frontend (`.env` in project root)

```env
REACT_APP_API_BASE_URL=    # Leave empty if frontend & backend are on same domain
REACT_APP_RAZORPAY_KEY=rzp_test_xxxxx
```

---

## 🚀 Deployment Options

---

### Option 1: Render.com (Recommended — Free Tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your repo — it will detect `render.yaml` automatically
4. Add all environment variables from the list above in the Render dashboard
5. Deploy! Render will build and serve the app.

**Or manually:**
- New Web Service → Connect GitHub repo
- Build Command: `npm ci --legacy-peer-deps && npm run build:prod && cd server && npm ci --omit=dev`
- Start Command: `node server/index.js`
- Add env vars in the Environment tab

---

### Option 2: Railway.app

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. It detects `railway.toml` automatically
4. Add environment variables in the Variables tab
5. Deploy

---

### Option 3: Heroku

```bash
# Install Heroku CLI, then:
heroku login
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URL=mongodb+srv://...
heroku config:set CLOUD_NAME=xxx API_KEY=xxx API_SECRET=xxx
heroku config:set RAZORPAY_KEY=xxx RAZORPAY_SECRET=xxx
heroku config:set JWT_SECRET=xxx
heroku config:set MAIL_HOST=smtp.gmail.com MAIL_USER=xxx MAIL_PASS=xxx
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
git push heroku main
```

---

### Option 4: Docker

```bash
# Build and run with Docker Compose
cp server/.env.example server/.env   # fill in values
cp .env.example .env                  # fill in values

docker-compose up -d

# App will be at http://localhost:4000
```

Or build manually:
```bash
docker build \
  --build-arg REACT_APP_RAZORPAY_KEY=rzp_test_xxx \
  -t knowledge-hub .

docker run -d \
  -p 4000:4000 \
  --env-file server/.env \
  knowledge-hub
```

---

### Option 5: VPS / Linux Server (Ubuntu)

```bash
# 1. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2 and Nginx
sudo npm install -g pm2
sudo apt install nginx -y

# 3. Clone and setup
git clone https://github.com/your-username/knowledge-hub.git
cd knowledge-hub

# 4. Set environment variables
cp server/.env.example server/.env
nano server/.env   # fill in all values

# 5. Install and build
npm ci --legacy-peer-deps
npm run build:prod
cd server && npm ci --omit=dev && cd ..

# 6. Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # follow the command it outputs

# 7. Setup Nginx
sudo cp nginx.conf /etc/nginx/sites-available/knowledge-hub
# Edit the file: replace "your-domain.com" with your actual domain
sudo nano /etc/nginx/sites-available/knowledge-hub
sudo ln -s /etc/nginx/sites-available/knowledge-hub /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 8. (Optional) SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

### Option 6: Local Development

```bash
# 1. Install dependencies
npm run install:all

# 2. Configure environment
cp server/.env.example server/.env
nano server/.env   # add your credentials

# 3. Start both frontend and backend
npm run dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:4000
```

---

## 📁 Project Structure

```
knowledge-hub/
├── src/                    # React frontend source
│   ├── components/
│   ├── pages/
│   ├── services/           # API calls
│   └── ...
├── server/                 # Express backend
│   ├── controllers/
│   ├── models/             # Mongoose models
│   ├── routes/
│   ├── config/             # DB, Cloudinary, Razorpay
│   ├── middlewares/
│   ├── utils/
│   └── index.js            # Entry point
├── public/                 # Static assets
├── .env                    # Frontend env vars (create from .env.example)
├── .env.example            # Frontend env template
├── Dockerfile              # Docker build
├── docker-compose.yml      # Docker Compose
├── ecosystem.config.js     # PM2 config
├── nginx.conf              # Nginx reverse proxy
├── render.yaml             # Render.com blueprint
└── railway.toml            # Railway.app config
```

---

## 🔑 Key Notes

- **Never commit `.env` files** — they're in `.gitignore`
- Razorpay: use **test keys** for development, **live keys** for production
- MongoDB: whitelist your server's IP in Atlas Network Access (or use `0.0.0.0/0` for all)
- Cloudinary: the `FOLDER_NAME` is just an organizational folder name — set it to anything
- `CLIENT_URL` must match your actual frontend URL exactly (no trailing slash) for CORS to work
- `CI=false` is set in the build script to prevent treating warnings as errors

---

## 🆘 Troubleshooting

| Issue | Fix |
|---|---|
| CORS errors | Make sure `CLIENT_URL` in `server/.env` matches your exact frontend URL |
| DB connection failed | Check MongoDB Atlas IP whitelist and connection string format |
| Emails not sending | Verify Gmail App Password (not regular password); check `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` |
| Payments not working | Ensure Razorpay key/secret are correct and match (both test or both live) |
| Build fails | Try `CI=false npm run build` locally first |
| Images not uploading | Check all 3 Cloudinary vars (`CLOUD_NAME`, `API_KEY`, `API_SECRET`) |
