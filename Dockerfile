# Gunakan Node versi 20/22/24 sesuai kebutuhan
FROM node:24-alpine AS builder

WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Stage untuk production
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Salin node_modules dan build hasil dari builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
