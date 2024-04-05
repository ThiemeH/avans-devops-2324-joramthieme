FROM oven/bun

ARG SERVICE_NAME=order-service

WORKDIR /app

COPY $SERVICE_NAME/package.json .
COPY $SERVICE_NAME/bun.lockb .

RUN bun install --production

COPY $SERVICE_NAME/src ./src
COPY $SERVICE_NAME/tsconfig.json .
COPY shared /shared


ENV NODE_ENV production

CMD ["bun", "src/index.ts"]

EXPOSE 3000
