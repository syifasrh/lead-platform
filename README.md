# Task A - Lead Management (Next.js + NestJS + Prisma)

## Services

- `web`: Next.js frontend (port 3000)
- `api`: NestJS backend (port 3001)
- `db`: PostgreSQL (port 5432)

## Run with Docker

```bash
docker-compose up --build
```

## API Endpoints

- `POST /leads` - create lead
- `GET /leads?page=1&pageSize=10` - list leads with pagination

## Schema Decisions

- `Lead` uses UUID primary key for safe client-side usage.
- `email` and `campaignId` indexed to support common filtering/search.
- `createdAt` auto-filled to enable ordering newest-first.
