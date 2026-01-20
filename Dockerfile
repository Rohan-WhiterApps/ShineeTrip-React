# Stage 1: Build/Development Environment
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other source files
COPY . .

# Expose the port Vite typically runs on (default is 5173)
EXPOSE 5174

# Command to start the development server
CMD ["npm", "run", "dev"]