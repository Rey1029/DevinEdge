# DevinEdge Full-Stack Deployment Guide

This guide details how to deploy the DevinEdge website, admin dashboard, and Node.js Express backend API to the internet.

---

## Architecture Overview

```text
                             ┌────────────────────────┐
                             │  Static Site Hosting   │
                             │ (Vercel / Render / Git)│
                             └───────────┬────────────┘
                                         │
                                         ▼ Serves UI Assets
                                 ┌───────────────┐
                                 │ Client Browser│
                                 └───────┬───────┘
                                         │
                 Sends API Requests      │ (with JWT header)
                 (to production URL)     ▼
                             ┌────────────────────────┐
                             │  Node.js Web Service   │
                             │   (Render / Railway)   │
                             └───────────┬────────────┘
                                         │
                                         ▼ Reads/Writes
                             ┌────────────────────────┐
                             │   Persistent Database  │
                             │ (MongoDB / Postgres /  │
                             │  Render Disk Volume)   │
                             └────────────────────────┘
```

---

## Option 1: Easiest Cloud Deploy (Free Tier on Render / Railway)

This is the fastest, zero-cost method using GitHub.

### Step 1: Deploy the Backend API Server
1. Create a free account on [Render](https://render.com/) or [Railway](https://railway.app/).
2. Push your project code to a private GitHub repository.
3. In the Render Dashboard, click **New +** and select **Web Service**.
4. Connect your GitHub repository.
5. Configure the Web Service settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
6. Add the following **Environment Variables** in the "Environment" tab:
   - `PORT`: `10000` (Render binds automatically)
   - `JWT_SECRET`: `your_custom_secure_key_phrase`
   - `NODE_ENV`: `production`
7. **Important (Persistent DB Disk)**:
   - Because Render/Railway server instances restart occasionally, any local JSON files inside `backend/data/` will be deleted unless you attach a persistent disk.
   - On Render: Scroll to **Disks** -> click **Add Disk** -> mount at `/opt/render/project/src/backend/data` with size `1 GB` (Free).

### Step 2: Deploy the Client Website
1. In the Render/Vercel Dashboard, select **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure the Static Site settings:
   - **Root Directory**: `(Leave empty - root of the project)`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add the following **Environment Variable** so the frontend knows where the backend API lives:
   - `VITE_API_BASE_URL`: `https://your-backend-web-service-url.onrender.com/api`

### Step 3: Deploy the Admin Dashboard
1. Select **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure the Static Site settings:
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add the following **Environment Variable**:
   - `VITE_API_BASE_URL`: `https://your-backend-web-service-url.onrender.com/api`

---

## Option 2: Professional VPS Hosting (DigitalOcean / AWS / Hostinger)

Recommended for development agencies. This lets you run everything on a single private Linux server ($4-$6/mo) and keeps the local JSON database working natively.

### Step 1: Configure the VPS
1. Get a basic Ubuntu VPS instance.
2. Log in via SSH:
   ```bash
   ssh root@your_vps_ip
   ```
3. Install Node.js, Git, and Nginx:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm git nginx
   ```
4. Install **PM2** globally to keep your backend server running forever:
   ```bash
   sudo npm install -y -g pm2
   ```

### Step 2: Clone and Start Backend
1. Clone your git repository to `/var/www/devinedge`:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git /var/www/devinedge
   cd /var/www/devinedge
   ```
2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```
3. Start the server using PM2:
   ```bash
   pm2 start server.js --name "devinedge-api"
   pm2 save
   pm2 startup
   ```

### Step 3: Build & Host Frontends
1. Build the Main Client Website:
   ```bash
   cd /var/www/devinedge
   npm install
   # Create a production .env file
   echo "VITE_API_BASE_URL=https://api.yourdomain.com/api" > .env
   npm run build
   ```
2. Build the Admin Dashboard:
   ```bash
   cd /var/www/devinedge/admin
   npm install
   echo "VITE_API_BASE_URL=https://api.yourdomain.com/api" > .env
   npm run build
   ```

### Step 4: Configure Nginx Reverse Proxy
1. Create a configuration block for Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/devinedge
   ```
2. Paste the following configuration (replace `yourdomain.com` with your actual domain):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com; # Main website

       location / {
           root /var/www/devinedge/dist;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
   }

   server {
       listen 80;
       server_name admin.yourdomain.com; # Admin Dashboard

       location / {
           root /var/www/devinedge/admin/dist;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
   }

   server {
       listen 80;
       server_name api.yourdomain.com; # Express Backend API

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Enable the configuration and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/devinedge /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```
4. Set up Free SSL Certificates using Certbot (LetsEncrypt):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d admin.yourdomain.com -d api.yourdomain.com
   ```
