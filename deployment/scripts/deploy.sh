#!/bin/bash
GITHUB_TOKEN=$1
GITHUB_ACTOR=$2
DOCKER_SERVER_IP=$3
DOCKER_USER=$4
DOCKER_PASSWORD=$5
IMAGE_NAME=$(echo "$6" | tr '[:upper:]' '[:lower:]')

# Log in to GitHub Container Registry
echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin

# Pull the latest image from Docker Hub
echo "Pulling the latest Docker image..."
docker pull $IMAGE_NAME

# Stop and remove any running container with the same name
echo "Stopping existing Docker container..."
docker stop real-estate-management-ui || true
docker rm real-estate-management-ui || true

# Run the new Docker container
echo "Running the new Docker container..."
docker run -d --name real-estate-management-ui -p 80:80 $IMAGE_NAME

echo "Deployment completed successfully!"
