FROM node:18-alpine AS build

ARG OCULAR_ACKEE_HOST
ARG OCULAR_ACKEE_DOMAIN_ID
ARG OCULAR_GENESIS_HOST
ARG OCULAR_TEST_USERNAME
ARG OCULAR_TEST_PASSWORD

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

COPY . /app
RUN pnpm run build

FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/config/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
