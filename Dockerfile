FROM node:20.11.1 as build

RUN apt-get update && apt-get -y upgrade && apt-get autoremove
RUN apt-get install -y dumb-init --no-install-recommends

WORKDIR /app/edoo-nodejs

COPY ./src src
COPY package.json \
  yarn.lock \
  tsconfig.json \
  ./

RUN yarn install --frozen-lockfile
RUN yarn yarn-audit-fix --audit-level=moderate --force
RUN yarn build
RUN rm -rf node_modules
RUN yarn install --production

FROM node:20.11.1-bullseye-slim as production

WORKDIR /app/edoo-nodejs-production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node
COPY --from=build --chown=node:node /app/edoo-nodejs/node_modules ./node_modules
COPY --from=build --chown=node:node /app/edoo-nodejs/dist ./dist

EXPOSE 80

ENV NODE_ENV=production
CMD ["dumb-init", "node", "./dist/index.js"]
