# Use the official Node.js image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy the package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the SvelteKit app (both client and server)
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Run the SSR app with Node.js (start the app in production)
CMD ["node", "build"]
