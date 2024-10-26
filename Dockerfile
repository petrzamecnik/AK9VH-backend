# Use the official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies, including dev dependencies
RUN npm install

# Install ts-node-dev globally
#RUN npm install -g ts-node-dev

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev"]
