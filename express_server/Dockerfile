FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

# Expose the port that the app runs on
# EXPOSE 8080

# Command to run the app
CMD ["npm", "run", "dev"]
