FROM --platform=$BUILDPLATFORM node:20-alpine AS build

ARG OCULAR_GENESIS_HOST

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npx pnpm install --global pnpm@8
WORKDIR /app

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

COPY . /app
RUN pnpm run build

FROM busybox:1.36.1-musl

WORKDIR /home/static
COPY --from=build /app/dist /home/static

EXPOSE 80

CMD ["busybox", "httpd", "-v", "-f"]
