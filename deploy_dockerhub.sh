#!/bin/sh

docker login -u $DOCKER_USER -p $DOCKER_PASS

IMAGE_NAME="azzurra-essex-website"

if [ "$TRAVIS_BRANCH" = "master" ]; then
    TAG="latest"
elif [ "$TRAVIS_BRANCH" != "master" ]; then
    TAG="$TRAVIS_BRANCH"
else
    TAG="latest"
fi

echo "Building Docker Image"
docker build -f Dockerfile -t $IMAGE_NAME .

echo "Tagging Docker Image"
docker tag $IMAGE_NAME $DOCKER_USER/$IMAGE_NAME

echo "Pushing Docker Image"
docker push $DOCKER_USER/$IMAGE_NAME