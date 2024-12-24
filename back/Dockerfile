# syntax=docker/dockerfile:1

FROM node:16.15.0

ENV NODE_ENV=production

# Copy the code to the Docker image
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4000
CMD [ "npm", "start" ]