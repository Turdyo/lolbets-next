# Use the official Node.js image as base
FROM oven/bun

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY prisma ./prisma/

# Install project dependencies
RUN bun install

# Copy the rest of the application code to the container
COPY . .

# Build the Nuxt 3 project
RUN bun run build
RUN bun x prisma generate


# Expose the port that the application will run on
EXPOSE 3000

# Command to start the Nuxt 3 application
CMD [ "bun", "run", "start" ]
