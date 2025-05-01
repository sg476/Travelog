# Base Image
FROM node:20-alpine

# Work Directory
WORKDIR /app

# Dependency
COPY package.json ./

RUN npm i --only=production

# App Code / File
COPY src /app/src

# Expose APP PORT
EXPOSE 4000

# Start App
CMD ["npm", "start"]
