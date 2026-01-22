FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "until pg_isready -h db -p 5432 -U postgres; do sleep 1; done; npm run prisma:migrate && npm run start:dev"]
