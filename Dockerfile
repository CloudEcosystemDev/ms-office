FROM node:16-alpine
LABEL NAME="ms-office"
LABEL MAINTAINER CloudEcosystem "operations@openintegrationhub.com"
LABEL SUMMARY="This image is used to start the MS Office Adapter for OIH"

RUN apk --no-cache add \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install --production

COPY . /usr/src/app

RUN chown -R node:node .

USER node

ENTRYPOINT ["npm", "start"]
