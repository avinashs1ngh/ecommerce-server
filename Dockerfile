# Development Stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install nodemon for hot-reloading
RUN npm install -g nodemon

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 5000
EXPOSE 5000

# Run with nodemon for hot-reloading
CMD ["nodemon", "src/server.js"]
# Product Stage 