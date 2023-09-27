# Use the official Node.js 14 Alpine image as the base
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install --production

# Copy the application code
COPY . .


# Start the application
CMD ["npm", "start"]

