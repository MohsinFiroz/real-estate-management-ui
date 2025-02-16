#!/bin/bash

GITHUB_TOKEN=$1
GITHUB_ACTOR=$2
DOCKER_SERVER_IP=$3
DOCKER_USER=$4
DOCKER_PASSWORD=$5
IMAGE_NAME=$(echo "$6" | tr '[:upper:]' '[:lower:]')

# Log in to GitHub Container Registry
echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin

# Pull the latest image
echo "Pulling the latest Docker image..."
docker pull $IMAGE_NAME

# Stop and remove existing container if running
echo "Stopping existing Docker container..."
docker stop real-estate-management-ui || true
docker rm real-estate-management-ui || true

# Run the new container with auto-restart policy
echo "Running the new Docker container..."
docker run -d \
  --name real-estate-management-ui \
  --network app-network \
  --restart unless-stopped \
  -p 3000:3000 \
  $IMAGE_NAME

echo "Deployment completed successfully!"
