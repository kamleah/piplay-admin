# use the official nodejs
FROM node:14-alpine as build-stage

# setting the work directory
WORKDIR /app

# copy the package json file to the container
COPY package*.json ./

# installing the  dependencies
RUN npm install

# copy remaining files to the container
COPY . .

# buid the react app
RUN npm run build

# using a liteweight alphine version to reduce the load
FROM nginx:1.21-alpine as production-stage

# copying the react build to the nginx directory
COPY --from=build-stage /app/build /usr/share/nginx/html

# exposing the default port
EXPOSE 3000

# starting the server
CMD ["nginx", "-g", "daemon off;"]
