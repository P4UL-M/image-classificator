# Use the latest official node image as the base image
FROM node:alpine AS build

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . .

# Install dependencies
RUN npm install

# Put the environment variables in the build
ARG VITE_API_URL
ENV VITE_API_URL $VITE_API_URL

# Build the application
RUN npm run build

# Use an official nginx image as the base image for serving the app
FROM nginx:alpine

# Copy the build output to the nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html/image-classificator

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]