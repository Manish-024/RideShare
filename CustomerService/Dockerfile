FROM node:18-alpine
WORKDIR /usr/src/app

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy code + env
COPY . .

# Expose the port your Express app uses (e.g. 4000)
EXPOSE 4000

# Start via nodemon or node
CMD ["npm", "start"]