# Base Image
FROM node:20-alpine

# Work Directory
WORKDIR /app

# Dependency
COPY package.json ./  
COPY package-lock.json ./  

RUN npm install

# Set environment variable to fix OpenSSL issue
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy Source Files
COPY src /app/src
COPY public /app/public

# Expose Port
EXPOSE 3000

# Start the frontend app (development server for React)
CMD ["npm", "start"]
