---
outline: deep
---

# FAQs

> [!TIP]
> As of v2 the old docker compose deployment is **deprecated**.
> It's recommended to use the new single-container deployment as described in the [deployment guide](./deploy.md).
> However, these FAQs may still be relevant for some users.

## Table of Contents

- [I can't log in to the app over the network!](#i-cant-log-in-to-the-app-over-the-network)
- [What kind of config do I need if I want to run it behind a nginx reverse proxy?](#what-kind-of-config-do-i-need-if-i-want-to-run-it-behind-a-nginx-reverse-proxy)
- [I'm having troubles deploying it on Traefik](#im-having-troubles-deploying-it-on-traefik)
- [Should I use nginx in the docker compose.yaml file if I already have my own reverse proxy already set up?](#should-i-use-nginx-in-the-docker-composeyaml-file-if-i-already-have-my-own-reverse-proxy-already-set-up)
- [When reverse proxying Ocular, which Docker service do I point to: frontend, backend, or nginx?](#when-reverse-proxying-ocular-which-docker-service-do-i-point-to-frontend-backend-or-nginx)

## I can't log in to the app over the network!

If you don't use https, make sure to set `GENESIS_JWT_COOKIE_ALLOW_HTTP` to `true` in your `.env` file.
Otherwise, run it behind a reverse proxy like [nginx](https://www.nginx.com/) and get a free certificate from [letsencrypt](https://letsencrypt.org/).

Make sure to restart the app after changing the `.env` file via `docker compose restart`.

> Discussed [here](https://github.com/simonwep/ocular-docker/issues/2)

## What kind of config do I need if I want to run it behind a nginx reverse proxy?

Here's an example of a basic nginx config (v1.25+):

```nginx
server {
    listen 443 quic reuseport;
    listen 443 ssl;

    server_name ocular.example.com;
    add_header Alt-Svc 'h3=":443"; ma=86400';

    location / {
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_read_timeout 300s;
        proxy_pass http://127.0.0.1:3030$request_uri;
    }

    # Specify the path to your certificate and key, or use letsencrypt
    #ssl_certificate
    #ssl_certificate_key
}

# HTTP Redirect
server {
	listen 80;
	server_name ocular.example.com;

	if ($host = ocular.example.com) {
		return 301 https://$host$request_uri;
	}

	return 404;
}
```

## I'm having troubles deploying it on [Traefik](https://traefik.io/traefik/)

Required changes to make this work:

1. Backend (genesis) container:
```yml
- "traefik.enable=true"
- "traefik.http.routers.genesis.rule=Host(`ocular.example.com`) && PathPrefix(`/api`)"
# Important: This is what took a bit to figure out; we want to remove the `/api` from the
# request before forwarding it, otherwise the backend would get a request on `/api`, which
# would not work, as it expects requests to / by default. An alternative would be to set
# GENESIS_BASE_URL to `/api`
- "traefik.http.middlewares.strip-prefix.stripprefix.prefixes=/api"
- "traefik.http.routers.genesis.middlewares=strip-prefix"
# The entrypoint and TLS here are mandatory, see https://community.traefik.io/t/different-container-behind-and-api-how/7622
- "traefik.http.routers.genesis.entrypoints=https"
- "traefik.http.routers.genesis.tls=true"
- "traefik.http.routers.genesis.tls.certresolver=letsencrypt"
- "traefik.http.routers.genesis.service=genesis-service"
- "traefik.http.services.genesis-service.loadbalancer.server.port=3031"
```

2. Frontend (ocular) container:
```yml
- "traefik.enable=true"
- "traefik.http.routers.ocular.rule=Host(`ocular.example.com`)"
- "traefik.http.routers.ocular.entrypoints=https"
- "traefik.http.routers.ocular.tls=true"
- "traefik.http.routers.ocular.tls.certresolver=letsencrypt"
- "traefik.http.routers.ocular.service=ocular-service"
- "traefik.http.services.ocular-service.loadbalancer.server.port=80"
```

> [!NOTE]
> Traefik prioritizes routers based on the length of the rule, so since the `genesis` router has a larger rule length, it matches `/api` requests first.
> This is necessary as if the `ocular` router picked up requests, it would return 501 Unimplemented statuses (this is hardcoded).

> Discussed [here](https://github.com/simonwep/ocular-docker/issues/5#issuecomment-2535524284) of [#5](https://github.com/simonwep/ocular-docker/issues/5) by @CompeyDev.

## Should I use nginx in the docker compose.yaml file if I already have my own reverse proxy already set up?
Yes, Ocular's nginx handles the _internal_ routing between the frontend and backend of Ocular.
Your reverse proxy can be used to handle _external_ routing as usual.

> Discussed [here](https://github.com/simonwep/ocular-docker/discussions/11)

## When reverse proxying Ocular, which Docker service do I point to: frontend, backend, or nginx?
Point your reverse proxy to Ocular's nginx, which in turn will handle routing between everything else.
It may be helpful to use a `container_name` for Ocular's nginx to distinguish it from your own reverse proxy (e.g., `ocular-nginx`).
If both your reverse proxy and Ocular are on the same docker network, you can use the container name `ocular-nginx` and its default internal port `80`, such as in the screenshot below (NPM):

![Screenshot 2025-02-16 101619](https://github.com/user-attachments/assets/f2ed13eb-0fab-4686-a74d-6f70a91a3cfb)

> Discussed [here](https://github.com/simonwep/ocular-docker/discussions/11)
