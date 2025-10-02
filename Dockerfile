# 1. Base image
FROM node:22-alpine AS build

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy source code
COPY . .

# 6. Build project
RUN npm run build

# 7. Production image
FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/.env ./

COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

EXPOSE 3001
