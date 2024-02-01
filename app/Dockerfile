FROM node:16-alpine as build-stage

WORKDIR /app
RUN npm install -g pnpm@7.22.0
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm i --frozen-lockfile
COPY . .

FROM build-stage as prod
RUN pnpm build
CMD pnpm start:prod

FROM nginx:1.21.6 as nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/.output/public /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
