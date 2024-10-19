# Use the latest official Node.js image as the base image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy wait-for-it.sh
COPY wait-for-it.sh /usr/wait-for-it.sh
# Grant execute permission to wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the migrations
RUN npm run init

# Expose the port the app runs on
EXPOSE 3000

# Command to wait for the postgres to be ready and then start the application
CMD ["/usr/wait-for-it.sh", "postgres:5432", "--", "node", "src/index.js"]