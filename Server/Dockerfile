# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Copy wait-for-it.sh into the container at /app
COPY wait-for-it.sh /app/wait-for-it.sh

# Make wait-for-it.sh executable
RUN chmod +x wait-for-it.sh

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 9090 available to the world outside this container
EXPOSE 9090

# Run wait-for-it.sh to wait for MongoDB to be ready, then run app.py
CMD ["./wait-for-it.sh", "-t", "3", "mongo:27017", "--", "python", "src/main.py"]