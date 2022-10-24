FROM node:16-alpine

WORKDIR /home/api

CMD yarn && yarn start:docker:dev