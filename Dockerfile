	# Dockerfile for Next.js 13 App
	 
	# Specify a base image
	FROM node:18.4-alpine
	 
	# Set the working directory
	WORKDIR /usr/src/app
	 
	# Copy the package.json and package-lock.json
	COPY package*.json ./
	 
	# Install dependencies
	RUN npm install
	 
	# Copy the source code
	COPY . .
	 
	# Expose port 3000
	EXPOSE 3000
	 
	# Set environment variables
	ENV NODE_ENV production
	ENV PORT 3000
	 
	# Run the app
	CMD ["npm", "run", "start"]
	 
	# Add labels
	LABEL maintainer="Your Name"
	LABEL version="1.0"