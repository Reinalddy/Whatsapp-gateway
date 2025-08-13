FROM node:20-alpine AS builder

WORKDIR /app

# Install tools untuk build dan library vips (buat sharp)
RUN apk add --no-cache \
    git \
    openssh \
    libc6-compat \
    build-base \
    python3 \
    vips-dev

# Salin file package
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build


# ------------------------
# Stage production
# ------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install libvips di production agar sharp tetap bisa jalan
RUN apk add --no-cache libc6-compat vips-dev

# Pastikan folder auth ada & writable
RUN mkdir -p /app/auth && chmod -R 777 /app/auth

# Salin node_modules & hasil build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Jadikan folder auth sebagai volume agar session tetap ada walau container restart
VOLUME ["/app/auth"]

EXPOSE 3000

CMD ["npm", "start"]