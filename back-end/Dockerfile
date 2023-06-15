FROM node:lts
LABEL authors="Louis De Wilde"
# update dependencies and install curl
RUN apt-get update && \
    apt-get install -y build-essential python3 && \
    rm -rf /var/lib/apt/lists/*
# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./ \
#     ./source ./

# This will copy everything from the source path
# --more of a convenience when testing locally.
COPY . .
# If you are building your code for production
RUN npm ci

RUN npm run build
CMD npm run start:prod