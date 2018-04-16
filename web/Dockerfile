FROM node:9.4.0-alpine

RUN mkdir /src

WORKDIR /src

COPY package.json /src

RUN apk --no-cache add --virtual builds-deps build-base python

RUN npm install

COPY ./app ./app

RUN ls 

CMD ["npm", "run", "start"]