#!/bin/bash

# Set PUBLIC_MODE to "prod" in .env
sed -i '' 's/PUBLIC_MODE=dev/PUBLIC_MODE=prod/' .env

firebase deploy

# Set PUBLIC_MODE back to "dev" in .env
sed -i '' 's/PUBLIC_MODE=prod/PUBLIC_MODE=dev/' .env