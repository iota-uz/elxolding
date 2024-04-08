FROM node:20-alpine as build-stage
WORKDIR /app

RUN npm add -g nodemon@3.0.2 ts-node@10.9.1 pnpm@8.15.2 sequelize-cli@6.6.2
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm lint

FROM build-stage as dev
CMD pnpm dev

FROM build-stage as prod
RUN pnpm compile

CMD pnpm migrate && pnpm seed && pnpm start
