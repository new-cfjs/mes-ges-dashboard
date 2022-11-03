#!/bin/bash

TARGET=$1

docker run -v $(pwd):/app/ --entrypoint=/app/build.sh node:16 /app

cp -r ./dist/mes-ges/* $1

echo "ok."
