FROM node:24

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .env ./
COPY packages/frontend ./packages/frontend

RUN corepack enable pnpm && pnpm install && pnpm --filter frontend build

CMD ["pnpm", "--filter", "frontend", "dev"]
