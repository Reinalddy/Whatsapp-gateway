FROM node:20-alpine AS builder

WORKDIR /app

# Install git & openssh supaya bisa ambil dependency dari repo git
RUN apk add --no-cache git openssh

# Salin file yang dibutuhkan untuk install dependencies
COPY package*.json ./

# Install dependencies (termasuk @prisma/client)
RUN npm install

# Salin semua file project
COPY . .

# Pastikan Prisma Client ter-generate sesuai environment container
RUN npx prisma generate

# RUN MIGRATE
# RUN npx prisma migrate deploy

# Build Next.js
RUN npm run build

# Stage production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Salin node_modules & hasil build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]