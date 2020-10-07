FROM node:alpine

ENV APP_ROOT /app

WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN apk add g++ make python

RUN npm ci

CMD ["npm", "run", "start"]
