FROM --platform=$BUILDPLATFORM ghcr.io/simonwep/genesis:v1.4.2 AS genesis

FROM --platform=$BUILDPLATFORM node:22-alpine AS frontend

ARG OCULAR_BUILD_VERSION
ARG OCULAR_BUILD_SHA

# Fixed environment for ocular build
ENV OCULAR_GENESIS_HOST='/api'

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV OCULAR_BUILD_VERSION=${OCULAR_BUILD_VERSION}
ENV OCULAR_BUILD_SHA=${OCULAR_BUILD_SHA}

RUN npx pnpm install --global pnpm@10.11.0
WORKDIR /app

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

COPY . /app
RUN pnpm run build

FROM caddy:2.11-alpine

WORKDIR /

ARG GENESIS_JWT_TOKEN_EXPIRATION
ARG GENESIS_JWT_SECRET
ARG GENESIS_CREATE_USERS

# Fixed environment for genesis
ENV GENESIS_DB_PATH='/data/genesis'
ENV GENESIS_JWT_COOKIE_ALLOW_HTTP='false'
ENV GENESIS_GIN_MODE='release'
ENV GENESIS_LOG_MODE='production'
ENV GENESIS_PORT='8080'
ENV GENESIS_BASE_URL='/'
ENV GENESIS_USERNAME_PATTERN='^[\w]{0,32}$'
ENV GENESIS_KEY_PATTERN='^[\w]{0,32}$'
ENV GENESIS_DATA_MAX_SIZE='512'
ENV GENESIS_KEYS_PER_USER='2'

COPY --from=genesis /app/genesis /usr/local/bin/genesis
COPY --from=frontend /app/dist /usr/share/caddy

COPY ./docker/Caddyfile /etc/caddy/Caddyfile
COPY ./docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${GENESIS_PORT}/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
