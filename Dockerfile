# Gunakan image Node.js sebagai base
FROM node:20-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Copy file package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Build project Next.js
RUN npm run build

# Buka port 3000
EXPOSE 3000

# Jalankan server saat container aktif
CMD ["npm", "start"]