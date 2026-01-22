#!/bin/bash
echo "Testing Worker..."
echo ""

echo "1. Submitting test lead..."
curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Worker Test",
    "email": "test-'$(date +%s)'@example.com",
    "notes": "Testing worker at '$(date)'"
  }'

echo ""
echo ""
echo "2. Checking worker logs (last 20 lines)..."
docker-compose logs --tail=20 worker | grep "Lead received"

echo ""
echo "Test completed!"
