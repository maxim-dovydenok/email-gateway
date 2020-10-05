FROM node:12-alpine

WORKDIR /opt/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

ENTRYPOINT ["node", "bin/www"]
