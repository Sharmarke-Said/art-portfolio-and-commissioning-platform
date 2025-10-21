# Docker Setup Guide

This guide explains how to run the Art Portfolio and Commissioning application using Docker and Docker Compose.

## 📦 Services Overview

The docker-compose setup includes:

1. **MongoDB** - Primary database (port 27017)
2. **Redis** - Caching and session management (port 6379)
3. **Bun App** - Node.js application running with Bun runtime (port 3000)
4. **Caddy** - API Gateway, reverse proxy, and automatic HTTPS (ports 80, 443)

## 🚀 Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+

### 1. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your preferred values
# IMPORTANT: Change default passwords in production!
```

### 2. Start All Services

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
```

### 3. Verify Services

```bash
# Check service status
docker-compose ps

# Check application health
curl http://localhost/health

# Test API endpoint
curl http://localhost/api/health
```

## 🛠️ Common Commands

### Start Services

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### Restart Services

```bash
docker-compose restart

# Restart specific service
docker-compose restart app
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f caddy
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Rebuild Application

```bash
# Rebuild after code changes
docker-compose up -d --build app
```

### Clean Up

```bash
# Stop and remove containers, networks
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## 🔧 Configuration

### MongoDB Access

```bash
# Connect to MongoDB container
docker exec -it art-portfolio-mongodb mongosh

# Use the database
use art_portfolio

# Authenticate
db.auth('admin', 'admin123')
```

### Redis Access

```bash
# Connect to Redis container
docker exec -it art-portfolio-redis redis-cli

# Authenticate
AUTH redis123

# Test connection
PING
```

### Application Logs

Caddy logs are stored in a Docker volume and can be accessed:

```bash
# View Caddy access logs
docker exec art-portfolio-caddy cat /var/log/caddy/api-access.log

# Follow access logs
docker exec art-portfolio-caddy tail -f /var/log/caddy/api-access.log
```

## 🌐 Caddy Configuration

### Local Development

By default, Caddy serves on `localhost`. Access your application at:

- http://localhost
- https://localhost (with self-signed certificate)

### Production Deployment

1. Update `DOMAIN` in `.env`:

   ```env
   DOMAIN=api.yourdomain.com
   ```

2. Ensure DNS points to your server

3. Caddy will automatically obtain Let's Encrypt SSL certificates

### Caddy Features

- ✅ Automatic HTTPS with Let's Encrypt
- ✅ HTTP/2 and HTTP/3 support
- ✅ Gzip and Zstandard compression
- ✅ Request/response logging in JSON format
- ✅ Health checks for backend services
- ✅ Security headers
- ✅ Reverse proxy with load balancing support

## 🔒 Security Notes

### For Production:

1. **Change all default passwords** in `.env`:

   - `MONGO_ROOT_PASSWORD`
   - `REDIS_PASSWORD`
   - `JWT_SECRET` (use at least 32 random characters)

2. **Limit port exposure** in docker-compose.yml:

   - Remove `ports` section from MongoDB and Redis
   - Only expose Caddy ports (80, 443)

3. **Enable Caddy email** in Caddyfile:

   ```
   email admin@yourdomain.com
   ```

4. **Set proper CORS** in your application

5. **Use Docker secrets** for sensitive data:
   ```bash
   docker secret create mongo_password ./mongo_password.txt
   ```

## 📊 Monitoring

### Health Checks

All services include health checks:

```bash
# Check health status
docker-compose ps

# Inspect specific service
docker inspect art-portfolio-app --format='{{json .State.Health}}'
```

### Resource Usage

```bash
# View resource usage
docker stats

# View specific service
docker stats art-portfolio-app
```

## 🐛 Troubleshooting

### Application won't start

```bash
# Check logs
docker-compose logs app

# Verify MongoDB connection
docker-compose exec app bun run -e "fetch('http://localhost:3000/health')"
```

### Database connection issues

```bash
# Check MongoDB health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Verify environment variables
docker-compose exec app env | grep MONGO
```

### Caddy proxy errors

```bash
# Check Caddy logs
docker-compose logs caddy

# Verify Caddyfile syntax
docker-compose exec caddy caddy validate --config /etc/caddy/Caddyfile

# Reload Caddy configuration
docker-compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```

### Port conflicts

```bash
# Check if ports are in use
netstat -tuln | grep -E ':(80|443|3000|27017|6379)'

# Change ports in .env file
```

## 🔄 Development Workflow

### With Hot Reload (Development)

Create `docker-compose.dev.yml`:

```yaml
version: "3.8"

services:
  app:
    build:
      target: base
    command: bun --watch run src/server.ts
    environment:
      NODE_ENV: development
    volumes:
      - ./src:/app/src
      - ./package.json:/app/package.json
    ports:
      - "3000:3000"
```

Run with:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## 📝 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Bun Documentation](https://bun.sh/docs)

## 📄 License

Same as the main project.
