# Use Node.js official image as a build stage
FROM node:14 AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy your app source code
COPY . .

# Build the Angular app
RUN npm run build -- --outputPath=dist

# Use NGINX official image for the final stage
FROM nginx:1.19

# Copy the built Angular app and your custom NGINX configuration (if any)
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the api-config.conf file to the container
COPY ./api-config.conf /etc/nginx/api-config.conf

# Include the api-config.conf file in the main NGINX configuration
RUN echo 'include /etc/nginx/api-config.conf;' >> /etc/nginx/conf.d/default.conf
