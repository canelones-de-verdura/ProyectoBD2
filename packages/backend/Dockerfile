FROM node:24

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .env ./
COPY packages/backend ./packages/backend

RUN corepack enable pnpm && pnpm install && pnpm --filter backend build

CMD ["pnpm", "--filter", "backend", "dev"]
