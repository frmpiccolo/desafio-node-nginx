FROM node:15

WORKDIR /usr/src/app

COPY package*.json ./

# Install packages and handle possible errors
RUN npm install || { echo 'npm install failed'; exit 1; }

RUN mkdir -p /usr/src/app/node_modules
RUN ln -s /usr/src/app/node_modules ./node_modules

COPY . .

# Install Dockerize
ENV DOCKERIZE_VERSION v0.6.0
RUN wget --no-check-certificate https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz     

EXPOSE 8080

CMD [ "node", "index.js" ]
