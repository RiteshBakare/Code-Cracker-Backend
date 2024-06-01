FROM node:20

ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install necessary tools
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

# Install g++ and dependencies
RUN apt-get install -y g++

# Install OpenJDK 17
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application source code
COPY . .

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]