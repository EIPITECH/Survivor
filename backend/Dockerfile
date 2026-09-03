FROM node:22

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm install --legacy-peer-dep

COPY . /usr/src/app

# RUN npm build

CMD ["npm", "run", "start:dev"]
