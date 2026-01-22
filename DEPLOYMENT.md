# Deployment Guide - Lead Management Platform

## Project Structure (Mono-repo)
```
lead-platform/
├── api/           # NestJS Backend
├── web/           # Next.js Frontend
├── worker/        # BullMQ Worker
├── python-ai/     # FastAPI Sentiment Analysis
├── docker-compose.yml
└── README.md
```

---

## Step 1: Git Initialization

### Initialize Git Repository
```bash
cd "/Users/syifasrh/Documents/PT Usaha Kreatif Indonesia/lead-platform"

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Lead Management Platform

- Next.js frontend with form and table
- NestJS backend with Prisma ORM
- PostgreSQL database
- Redis queue with BullMQ worker
- Python FastAPI sentiment analysis with VADER
- Auto-generated Campaign ID (CMP-YYYY-XXX)
- Sentiment analysis on lead notes
- Docker compose setup for all services"
```

### Create GitHub Repository
```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/lead-platform.git
git branch -M main
git push -u origin main
```

---

## Step 2: Environment Variables Setup

### Production .env Files

**Create `.env.example` files** (for documentation):

**api/.env.example:**
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/leads?schema=public"
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
REDIS_HOST=redis
REDIS_PORT=6379
SENTIMENT_URL=http://python-ai:8000
```

**web/.env.example:**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

**Note:** Actual `.env` files are gitignored for security!

---

## Step 3: Deployment Options

### Option A: Railway.app (Recommended - Free Tier)

**Why Railway:**
- Free $5/month credit
- Easy Docker deployment
- PostgreSQL included
- Redis included
- Auto SSL certificates

**Steps:**
1. Create account: https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Add services:
   - PostgreSQL (add to project)
   - Redis (add to project)
   - API service (point to `./api`)
   - Web service (point to `./web`)
   - Worker service (point to `./worker`)
   - Python-AI service (point to `./python-ai`)

5. Set environment variables in Railway dashboard
6. Deploy!

---

### Option B: Vercel + Railway (Split Deployment)

**Frontend (Vercel):**
- Best for Next.js
- Global CDN
- Free tier generous

**Backend (Railway):**
- API, Worker, Python-AI, PostgreSQL, Redis

**Steps:**
1. **Deploy Web to Vercel:**
   ```bash
   cd web
   vercel
   ```

2. **Deploy Backend to Railway:**
   - Follow Option A for API, Worker, Python-AI, DB, Redis

3. **Update CORS:**
   - Set `CORS_ORIGIN` in API to Vercel domain
   - Set `NEXT_PUBLIC_API_URL` in Web to Railway API domain

---

### Option C: DigitalOcean / AWS / GCP (Production)

**Requirements:**
- Docker & Docker Compose installed
- Server with min 2GB RAM

**Steps:**
1. **Setup Server:**
   ```bash
   # SSH to server
   ssh user@your-server-ip

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Docker Compose
   sudo apt install docker-compose
   ```

2. **Clone Repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lead-platform.git
   cd lead-platform
   ```

3. **Setup Environment Variables:**
   ```bash
   # Copy example files
   cp api/.env.example api/.env
   cp web/.env.example web/.env
   cp python-ai/.env.example python-ai/.env

   # Edit with production values
   nano api/.env
   nano web/.env
   ```

4. **Deploy:**
   ```bash
   docker-compose up -d --build
   ```

5. **Setup Nginx Reverse Proxy:**
   ```nginx
   # /etc/nginx/sites-available/lead-platform
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }

   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
   ```

---

## Step 4: Database Migration

### Production Database Setup

```bash
# On first deploy, run migrations
docker-compose exec api npx prisma migrate deploy

# Generate Prisma client
docker-compose exec api npx prisma generate
```

---

## Step 5: Monitoring & Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f worker
docker-compose logs -f python-ai
```

### Health Checks
```bash
# API health
curl https://api.yourdomain.com/

# Python AI health
curl https://ai.yourdomain.com/sentiment -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}'
```

---

## Step 6: CI/CD (Optional)

### GitHub Actions Example

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /path/to/lead-platform
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 PID
```

### Docker Issues
```bash
# Clean restart
docker-compose down -v
docker-compose up --build

# Remove all containers
docker system prune -a
```

### Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose logs db

# Connect to database
docker-compose exec db psql -U postgres -d leads
```

---

## Security Checklist

- [ ] All `.env` files are gitignored
- [ ] Database credentials are strong
- [ ] CORS is configured properly
- [ ] SSL/HTTPS enabled in production
- [ ] API rate limiting enabled (optional)
- [ ] Error messages don't expose sensitive info

---

## Performance Optimization

### Production Build
```bash
# Build optimized images
docker-compose -f docker-compose.prod.yml build

# Use multi-stage builds (already in Dockerfiles)
```

### Database Indexing
```sql
-- Already indexed in schema:
-- - email
-- - campaignId
-- - sentiment
```

---

## Cost Estimate

### Railway (Recommended for MVP)
- Free tier: $5 credit/month
- Estimated usage: ~$0-10/month for low traffic

### DigitalOcean
- Droplet (2GB): $12/month
- Database: $15/month
- Total: ~$27/month

### AWS/GCP
- Variable based on usage
- Estimated: $20-50/month for low traffic

---

## Support & Documentation

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **API Docs (if added):** http://localhost:3001/api
- **Sentiment AI:** http://localhost:8000

---

## Backup Strategy

### Database Backup
```bash
# Manual backup
docker-compose exec db pg_dump -U postgres leads > backup.sql

# Restore
docker-compose exec -T db psql -U postgres leads < backup.sql

# Automated (cron)
0 2 * * * cd /path/to/lead-platform && docker-compose exec db pg_dump -U postgres leads > backup_$(date +\%Y\%m\%d).sql
```

---

Good luck with your deployment! 🚀
