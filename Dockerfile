# Use an official Node runtime as a parent image
FROM node:18 AS builder

# Set the working directory to /app
WORKDIR /app

ARG PHASE=production

# Copy package.json and yarn.lock to the container at /app
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the current directory contents into the container at /app
COPY . .
# Build the app
RUN yarn build

# Use an official Nginx runtime as a parent image
FROM nginx:alpine

ARG PHASE=production

#Copy inginx
COPY nginx.conf /etc/nginx/nginx.conf

# Set the environment variable to determine the build environment
ARG ENVIRONMENT
# Copy the build output from the builder stage to the nginx web server's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Set the environment variable to determine the build environment
# Copy the staging environment configuration file

COPY .environments/.env.$PHASE /usr/share/nginx/html/.env

# Expose port 80 to the outside world
EXPOSE 80

# Command to run on container start
CMD ["nginx", "-g", "daemon off;"]
