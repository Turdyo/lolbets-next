# Use the official Node.js image as base
FROM node:20.5.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY prisma ./prisma/

# Install project dependencies
RUN npm install -g npm@10.0.0
RUN npm i

# Copy the rest of the application code to the container
COPY . .

# Build the Nuxt 3 project
RUN npm run build
RUN npx prisma generate
RUN node fix.cjs

# Expose the port that the application will run on
EXPOSE 3000

# Command to start the Nuxt 3 application
CMD [ "npm", "run", "start" ]
