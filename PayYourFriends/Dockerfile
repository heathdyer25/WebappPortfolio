# Use the LTS (Long Term Support) version of the Node.js image as base image.
FROM node:lts

# Set the working directory in the image to `/pay-your-friends`.
WORKDIR /pay-your-friends

# Copy the `package.json` and `package-lock.json` files from your machine to the working directory in the image.
COPY package.* ./

# Install the dependencies for the application.
RUN npm install

# Copy the rest of the application code into the image.
COPY . .

# Expose the port that the app runs on.
EXPOSE 3000

# Specify the command to run the app when the container runs.
CMD ["npm", "run", "dev"]
