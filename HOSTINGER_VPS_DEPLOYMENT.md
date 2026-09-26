# Complete Hostinger VPS & phpMyAdmin Deployment Guide

This guide provides the exact step-by-step instructions to deploy the **School Management Application** on a **Hostinger VPS** with **MySQL & phpMyAdmin**.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: phpMyAdmin Database Setup & SQL Import](#step-1-phpmyadmin-database-setup--sql-import)
3. [Step 2: Connect to Hostinger VPS via SSH](#step-2-connect-to-hostinger-vps-via-ssh)
4. [Step 3: Install Node.js, Git, Nginx & PM2](#step-3-install-nodejs-git-nginx--pm2)
5. [Step 4: Deploy the Application Code](#step-4-deploy-the-application-code)
6. [Step 5: Configure Environment Variables (.env)](#step-5-configure-environment-variables-env)
7. [Step 6: Build Frontend & Start Backend with PM2](#step-6-build-frontend--start-backend-with-pm2)
8. [Step 7: Configure Nginx Reverse Proxy & SSL](#step-7-configure-nginx-reverse-proxy--ssl)
9. [Default Login Credentials](#default-login-credentials)
10. [Troubleshooting & Common Fixes](#troubleshooting--common-fixes)

---

## 1. Prerequisites
- A **Hostinger VPS** (Ubuntu 22.04 or 24.04 LTS recommended) or Hostinger Cloud/Web Hosting with Remote MySQL.
- Domain name pointed to your Hostinger VPS IP Address (A Record `@` and `www` -> `YOUR_VPS_IP`).
- Access to **phpMyAdmin** on Hostinger.

---

## Step 1: phpMyAdmin Database Setup & SQL Import

1. **Log in to Hostinger hPanel**:
   - Navigate to **Databases** > **MySQL Databases**.
   - Create a new Database:
     - **Database Name**: e.g., `u469762185_school_app`
     - **Database User**: e.g., `u469762185_school_user`
     - **Password**: Create a strong password (save this for `.env`).
2. **Open phpMyAdmin**:
   - Click **Enter phpMyAdmin** next to your database.
3. **Import SQL Schema**:
   - Click the **Import** tab in the top navigation bar of phpMyAdmin.
   - Click **Choose File** and select `backend/schema.sql` (or `database/schema.sql`).
   - Click **Go** / **Import** at the bottom.
   - You will see a green success message: `Import has been successfully finished, 14 tables created`.

> **Note**: The `schema.sql` file creates all 14 tables, creates initial classes (1–12, LKG, UKG), sections (A, B, C, D), subjects, default settings, and seeds the initial Super Admin account (`superadmin@school.edu`).

---

## Step 2: Connect to Hostinger VPS via SSH

Open terminal / PowerShell on your computer and connect to your VPS:
```bash
ssh root@YOUR_VPS_IP
```

---

## Step 3: Install Node.js, Git, Nginx & PM2

Run the following commands on your VPS:
```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x LTS & npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Verify versions
node -v
npm -v

# Install PM2 Process Manager globally
sudo npm install -g pm2
```

---

## Step 4: Deploy the Application Code

```bash
# Navigate to web root directory
cd /var/www

# Clone your repository (or upload project files)
git clone https://github.com/rithikgroupofcompanies/school-application.git school-app
cd school-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

---

## Step 5: Configure Environment Variables (.env)

Create and edit the `.env` file in the `backend` folder:
```bash
nano backend/.env
```

Paste your database details:
```ini
DB_HOST=127.0.0.1
DB_USER=u469762185_school_user
DB_PASSWORD=YourDatabasePasswordHere
DB_NAME=u469762185_school_app
DB_PORT=3306

PORT=3000
JWT_SECRET=super_secure_jwt_secret_key_change_in_production_2026
```
*(Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit).*

> **Tip for Remote MySQL**: If your MySQL database is hosted on a separate Hostinger shared server instead of localhost on the VPS:
> 1. Set `DB_HOST` to the Hostinger MySQL Host IP/Domain (found in Hostinger MySQL dashboard).
> 2. In Hostinger hPanel > **Remote MySQL**, add your VPS IP address or `%` to allow the connection.

---

## Step 6: Build Frontend & Start Backend with PM2

```bash
# Make sure you are in the root directory (/var/www/school-app)
cd /var/www/school-app

# Build the React frontend production bundle (outputs to /dist)
npm run build

# Start the Node.js server with PM2 from the backend folder
cd backend
pm2 start server.js --name "school-backend"

# Configure PM2 to auto-start on VPS reboot
pm2 startup
pm2 save
```

To monitor server status:
```bash
pm2 status
pm2 logs school-backend
```

---

## Step 7: Configure Nginx Reverse Proxy & SSL

1. **Create Nginx Configuration**:
```bash
sudo nano /etc/nginx/sites-available/school-app
```

2. **Paste the following Nginx configuration** (replace `yourdomain.com` with your actual domain name):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Maximum file upload size for assignments/attachments
    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Enable the site and reload Nginx**:
```bash
sudo ln -s /etc/nginx/sites-available/school-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

4. **Install Free SSL Certificate with Certbot**:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Default Login Credentials

| Role | Email / Username | Password | Notes |
|---|---|---|---|
| **Super Admin** | `superadmin@school.edu` | `password123` | Full access across all classes, settings, backup, user registry. |
| **Super Admin (Alias)** | `superadmin@school.com` | `password123` | Secondary superadmin account. |

---

## Troubleshooting & Common Fixes

### 1. Database Connection Error (`ECONNREFUSED` / `Access Denied`)
- Ensure MySQL service is active on VPS: `sudo systemctl status mysql`
- If using Hostinger Remote MySQL: Add your VPS IP to **Hostinger Remote MySQL** whitelist in hPanel.
- Verify credentials by running `node backend/test-connection.js`.

### 2. Internal Server Error (500)
- Check PM2 live logs: `pm2 logs school-backend --lines 100`
- Make sure all tables from `backend/schema.sql` were imported into phpMyAdmin.

### 3. Restarting the Server after Updates
```bash
cd /var/www/school-app
git pull
npm run build
pm2 restart school-backend
```
