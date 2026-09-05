FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --no-audit

COPY . .

RUN npm run build

CMD ["npm", "run", "preview", "--", "--host"]
