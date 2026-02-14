# Livatto - Production Deployment Checklist

## Pre-Deployment Checklist

### Security
- [ ] Change `JWT_SECRET` to a strong, random value (32+ characters)
- [ ] Use environment-specific `.env` files (never commit to git)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS to specific domains (not `*`)
- [ ] Set up rate limiting on API endpoints
- [ ] Enable helmet.js security headers
- [ ] Set `NODE_ENV=production`

### Database
- [ ] Provision production PostgreSQL database
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Set up database backups (automated)
- [ ] Configure connection pooling
- [ ] Set up database monitoring

### Backend
- [ ] Build production bundle: `npm run build`
- [ ] Set up process manager (PM2, systemd)
- [ ] Configure logging (Winston to files)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure file upload limits for production
- [ ] Set up nginx reverse proxy
- [ ] Enable compression (gzip)

### Frontend
- [ ] Build: `npm run build`
- [ ] Update `NEXT_PUBLIC_API_URL` to production API
- [ ] Configure CDN for static assets
- [ ] Enable ISR/SSG where applicable
- [ ] Set up analytics (Google Analytics, Plausible)

### File Storage
- [ ] Migrate to cloud storage (S3, Google Cloud Storage)
- [ ] Set up CDN for video delivery
- [ ] Configure proper file permissions
- [ ] Set up automatic backups

### Monitoring & Logs
- [ ] Set up application monitoring (New Relic, Datadog)
- [ ] Configure log aggregation (CloudWatch, Papertrail)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Create dashboards for key metrics

### Performance
- [ ] Enable Redis caching
- [ ] Optimize database queries (indexes)
- [ ] Enable CDN for frontend
- [ ] Compress images/videos
- [ ] Set up load balancer (if multi-server)

### Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment runbook
- [ ] Incident response plan
- [ ] Update README with production info

## Deployment Steps

### 1. Database Setup

**AWS RDS Example:**
```bash
# Create PostgreSQL RDS instance
# Update DATABASE_URL in production environment:
DATABASE_URL="postgresql://username:password@rds-endpoint:5432/livatto"

# Run migrations
npx prisma migrate deploy
```

### 2. Backend Deployment

**Using PM2 on VPS:**
```bash
# Install PM2 globally
npm install -g pm2

# Build backend
cd backend
npm run build

# Start with PM2
pm2 start dist/main.js --name livatto-api

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor
pm2 logs livatto-api
pm2 monit
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.livatto.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3. Frontend Deployment

**Vercel (Recommended for Next.js):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://api.livatto.com
```

**Self-Hosted:**
```bash
# Build
cd frontend
npm run build

# Start with PM2
pm2 start npm --name livatto-frontend -- start

# Or with nginx (serve static build)
npm run build
# Copy .next folder to nginx static directory
```

### 4. SSL Certificates

**Using Certbot (Let's Encrypt):**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.livatto.com -d livatto.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 5. Environment Variables

**Production .env (Backend):**
```env
DATABASE_URL="postgresql://user:pass@production-db:5432/livatto"
JWT_SECRET="super-secure-random-string-minimum-32-characters"
JWT_EXPIRATION="24h"
PORT=3001
NODE_ENV="production"
FRONTEND_URL="https://livatto.com"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5368709120
CORS_ORIGIN="https://livatto.com"

# Cloud Storage (if using S3)
AWS_S3_BUCKET="livatto-videos"
AWS_ACCESS_KEY="your-access-key"
AWS_SECRET_KEY="your-secret-key"
AWS_REGION="us-east-1"

# Monitoring
SENTRY_DSN="https://your-sentry-dsn"
```

## Post-Deployment Verification

### Health Checks

1. **API Health:**
```bash
curl https://api.livatto.com/auth/me \
  -H "Authorization: Bearer token"
```

2. **Frontend Load:**
- Visit https://livatto.com
- Check all pages load correctly
- Test authentication flow

3. **Database Connection:**
```bash
# Check Prisma connection
npx prisma studio
```

### Performance Testing

```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 https://api.livatto.com/videos

# Or use k6, Artillery, etc.
```

### Monitoring Setup

**PM2 Monitoring:**
```bash
pm2 install pm2-server-monit
```

**Application Monitoring:**
- Set up Sentry for error tracking
- Configure CloudWatch/Datadog for metrics
- Set up uptime alerts

## Scaling Strategy

### Horizontal Scaling

**Multi-Instance Setup:**
```bash
# Start multiple backend instances
pm2 start dist/main.js -i 4 --name livatto-api

# Load balancer (nginx)
upstream backend {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
    server localhost:3004;
}
```

### Database Scaling

- Read replicas for analytics queries
- Connection pooling (PgBouncer)
- Caching layer (Redis)

### File Storage Scaling

- Use S3 with CloudFront CDN
- Separate video delivery from API
- Implement lazy loading

## Backup Strategy

### Database Backups

**Automated Daily Backups:**
```bash
# Cron job for PostgreSQL backup
0 2 * * * pg_dump -U username -d livatto > /backups/livatto_$(date +\%Y\%m\%d).sql
```

### File Backups

**S3 Versioning:**
- Enable versioning on S3 bucket
- Set up lifecycle policies
- Cross-region replication

### Application State

- Version control for code (Git tags)
- Docker images for consistent deployments
- Infrastructure as Code (Terraform, CDK)

## Rollback Plan

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back migration_name
```

### Application Rollback

```bash
# PM2 rollback
pm2 reload livatto-api --update-env

# Or redeploy previous version
git checkout v1.0.0
npm run build
pm2 restart livatto-api
```

## Maintenance Windows

- Schedule during low-traffic hours
- Communicate downtime to users
- Have rollback plan ready
- Monitor closely during deployment

---

## Production Environment URLs

- **Frontend:** https://livatto.com
- **API:** https://api.livatto.com
- **Admin Panel:** https://admin.livatto.com (future)
- **Docs:** https://docs.livatto.com (future)

---

**Remember:** Always test in staging environment before production!
