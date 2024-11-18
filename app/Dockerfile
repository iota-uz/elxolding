FROM node:20-alpine AS build-stage

WORKDIR /app
RUN npm install -g pnpm@8.15.2
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm i --frozen-lockfile
COPY . .

FROM build-stage AS prod
ARG NUXT_PUBLIC_API_URL
ENV NUXT_PUBLIC_API_URL=$NUXT_PUBLIC_API_URL
RUN pnpm build
CMD pnpm start:prod

