# Testing Guide - Lead Platform

## Prerequisites
```bash
# Pastikan semua service running
docker-compose up --build

# Atau cek status
docker-compose ps
```

---

## Task A - Full-Stack Feature Implementation

### 1. Test Create Lead (Frontend)
- Buka browser: `http://localhost:3000`
- Isi form:
  - Nama: `John Doe`
  - Email: `john@example.com`
  - Campaign ID: `CMP-2025-001`
- Klik "Simpan Lead"
- **Expected**: Lead muncul di tabel, form kosong

### 2. Test Create Lead (API)
```bash
curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","campaignId":"CMP-2025-002"}'
```
**Expected**: Response JSON dengan `id`, `name`, `email`, `campaignId`, `createdAt`, `sentiment`

### 3. Test List Leads (API)
```bash
curl http://localhost:3001/leads?page=1&pageSize=10
```
**Expected**: Response dengan `total`, `page`, `pageSize`, `data[]`

### 4. Test Pagination (Frontend)
- Buka `http://localhost:3000`
- Buat lebih dari 10 leads
- **Expected**: Pagination muncul, bisa klik Prev/Next

### 5. Test Validation
```bash
# Test invalid email
curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid","campaignId":"CMP-001"}'
```
**Expected**: Error 400 dengan message validation

---

## Task B - Messaging & Queue (Redis + Queue)

### 1. Test Queue Publisher
```bash
curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Queue Test","email":"queue@example.com","campaignId":"CMP-2025-003"}'
```

### 2. Test Worker Consumer
```bash
# Cek worker log
docker-compose logs worker | grep "Lead received"
```
**Expected**: Log muncul `Lead received: queue@example.com`

### 3. Test Retry & Failure Handling
- Stop worker: `docker-compose stop worker`
- Submit lead (akan masuk queue)
- Start worker: `docker-compose start worker`
- **Expected**: Worker process job yang pending

### 4. Cek Redis Queue
```bash
# Masuk ke Redis container
docker-compose exec redis redis-cli

# Di dalam redis-cli:
KEYS *
LLEN bull:leads:wait
LLEN bull:leads:active
LLEN bull:leads:completed
LLEN bull:leads:failed
```

---

## Task C - Python AI Microservice Integration

### 1. Test Sentiment Service (Direct)
```bash
curl -X POST http://localhost:8000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a great product!"}'
```
**Expected**: `{"sentiment":"positive"}`

```bash
curl -X POST http://localhost:8000/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"This is bad and terrible"}'
```
**Expected**: `{"sentiment":"negative"}`

### 2. Test Sentiment via API (Integrated)
```bash
curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Sentiment Test","email":"sentiment@example.com","campaignId":"CMP-2025-004"}'
```
**Expected**: Response include `sentiment: "positive"` atau `"negative"` atau `"neutral"`

### 3. Test Sentiment di Frontend
- Buka `http://localhost:3000`
- Submit lead dengan nama yang mengandung kata positif/negatif
- **Expected**: Sentiment muncul di tabel (kolom terakhir)

### 4. Test Error Handling (Python Service Down)
```bash
# Stop Python service
docker-compose stop python-ai

# Submit lead
curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Error Test","email":"error@example.com","campaignId":"CMP-2025-005"}'
```
**Expected**: API tetap return lead (tanpa sentiment) atau error message yang jelas

---

## Integration Tests

### Full Flow Test
1. Submit lead via frontend → Lead tersimpan di DB
2. Worker log muncul → Queue bekerja
3. Sentiment muncul di response → Python AI terintegrasi
4. Data muncul di tabel → Frontend update

### Check All Services
```bash
# Cek semua service running
docker-compose ps

# Cek logs semua service
docker-compose logs

# Cek specific service
docker-compose logs api
docker-compose logs worker
docker-compose logs python-ai
docker-compose logs web
```

---

## Troubleshooting

### Service tidak running
```bash
docker-compose up -d
docker-compose ps
```

### Database error
```bash
docker-compose exec api npm run prisma:migrate
```

### Port conflict
- Cek port 3000, 3001, 5433, 6379, 8000 sudah dipakai
- Atau ubah port di `docker-compose.yml`

### Worker tidak consume
```bash
docker-compose restart worker
docker-compose logs -f worker
```
