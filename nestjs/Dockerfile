FROM node:18.14.2 AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json yarn.lock ./
RUN yarn install

COPY --chown=node:node . .
RUN yarn build

FROM node:18.14.2 AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node entrypoint.sh ./entrypoint.sh

USER node

EXPOSE 3000 3001

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/src/main.js"]