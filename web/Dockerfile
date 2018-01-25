FROM node:9.4.0-alpine

RUN mkdir /src

WORKDIR /src

COPY app/package.json /src

RUN npm install

COPY ./app ./app

RUN ls 

CMD ["npm", "run", "start"]