FROM --platform=$BUILDPLATFORM node:22-alpine AS build

ARG OCULAR_GENESIS_HOST
ARG OCULAR_BUILD_VERSION
ARG OCULAR_BUILD_SHA

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV OCULAR_BUILD_VERSION=${OCULAR_BUILD_VERSION}
ENV OCULAR_BUILD_SHA=${OCULAR_BUILD_SHA}

RUN npx pnpm install --global pnpm@9
WORKDIR /app

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

COPY . /app
RUN pnpm run build

FROM busybox:1.37.0-musl

WORKDIR /home/static

COPY --from=build /app/dist /home/static

RUN echo 'E404:index.html' >> /etc/httpd.conf

EXPOSE 80

HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost/index.html || exit 1

CMD ["busybox", "httpd", "-v", "-f"]
