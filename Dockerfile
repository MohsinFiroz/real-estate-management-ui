# Step 1: Build the app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if you're using pnpm)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (use pnpm as mentioned in your package.json)
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code
COPY . .

# Build the app using Vite
RUN pnpm run build

# Step 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
