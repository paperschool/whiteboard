FROM node:12-slim as base

WORKDIR /home/node/app
RUN chown -Rh node:node /home/node/app
USER node

FROM base as devDependencies

COPY --chown=node ./package.json .
COPY --chown=node ./yarn.lock .

RUN yarn --frozen-lockfile

FROM devDependencies as productionBuild 

COPY --chown=node ./app ./app
COPY --chown=node ./build ./build
COPY --chown=node ./.babelrc .

RUN yarn build:prod

FROM productionBuild as production

COPY --chown=node --from=productionBuild /home/node/app/bin .
COPY --chown=node ./package.json .

RUN chmod +x ./bin/server/server.bundle.js

ENTRYPOINT [ "node" ]
CMD ["/home/node/app/bin/server/server.bundle.js"]
