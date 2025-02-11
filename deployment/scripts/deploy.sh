#!/bin/bash

# Accept arguments passed from GitHub Actions
DOCKER_SERVER_IP=$1
DOCKER_USER=$2
DOCKER_PASSWORD=$3
IMAGE_NAME=$(echo "$4" | tr '[:upper:]' '[:lower:]')

# Log in to GitHub Container Registry
echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin

# Pull the latest image from Docker Hub
echo "Pulling the latest Docker image..."
docker pull $IMAGE_NAME

# Stop and remove any running container with the same name
echo "Stopping existing Docker container..."
docker stop frontend-app || true
docker rm frontend-app || true

# Run the new Docker container
echo "Running the new Docker container..."
docker run -d --name real-estate-management-ui -p 80:80 $IMAGE_NAME

echo "Deployment completed successfully!"
