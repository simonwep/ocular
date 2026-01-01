---
outline: deep
---

# Deployment

> [!TIP]
> This deployment as well as v2 are still fairly new ✨
> If you have any questions or something's missing, feel free to [open an issue](https://github.com/simonwep/ocular/issues).
> For deploying Ocular [Docker](https://docs.docker.com/engine/install/) is required.

## Migrating from v1 to v2

> [!TIP]
> If you're setting ocular up for the first time, you can skip this section.

Migrating from the old ocular docker compose setup to the new v2 single-container setup is fairly straightforward:

1. Stop your existing ocular docker compose setup with `docker compose down`.
2. Backup your existing `./data` folder **twice**, in case something goes wrong.
3. Set up a new `.env` with `GENESIS_JWT_SECRET` and `GENESIS_JWT_TOKEN_EXPIRATION`, you can ignore `GENESIS_CREATE_USERS` as you already have users created.
4. Deploy the new v2 setup as described below.

## Quickstart

As of v2, ocular can be deployed via a single docker image.

```sh
docker run \
    -p 3030:80 \
    -v ./data:/data/genesis \
    -e "GENESIS_JWT_SECRET=$(openssl rand -base64 48)" \
    -e "GENESIS_JWT_TOKEN_EXPIRATION=60" \
    -e 'GENESIS_CREATE_USERS=my-admin-username!:my-very-secure-password' \
    ghcr.io/simonwep/ocular:v2.0
```

Ocular should then be accessible under `http://localhost:3030` in your browser 🚀
You can now log in with the specified user.

All data is saved under `./data`, make sure to backup this folder regularly, as it contains all your budgeting data.
Who knows what can happen to your container or server ;)

You can also use docker compose to deploy ocular, here is a minimal example `docker-compose.yml`:

```yml
services:
  ocular:
    image: ghcr.io/simonwep/ocular:v2.0
    restart: unless-stopped
    volumes:
      - ./data:/data/genesis
    ports:
      - 3030:80
    environment:
      - GENESIS_JWT_SECRET
      - GENESIS_CREATE_USERS
      - GENESIS_JWT_TOKEN_EXPIRATION
```

And a corresponding `.env` file:

```dotenv
# JWT secret known only to your token generator
# You can use `openssl rand -base64 48` for this.
GENESIS_JWT_SECRET=insert-a-very-long-random-string-here

# Use ! as suffix for the username to indicate that this user should be created as an admin.
# Admins can add, remove and edit users.
# You can create multiple users by separating them with a comma.
# Comment this out if you already have users created.
GENESIS_CREATE_USERS=my-admin-username!:my-very-secure-password

# JWT expiration in minutes
GENESIS_JWT_TOKEN_EXPIRATION=60
```

Now run `docker compose up` and ocular should be accessible under `http://localhost:3030` in your browser 🚀
You can now log in with the specified user.

## Updating to a new version

Since ocular is contained within a single image, updating is fairly straightforward.
To update ocular to a new version, simply pull the new image and restart the container if you're using docker compose:

```sh
docker compose pull
docker compose up -d
```

Or if you're using docker directly just restart the container after pulling the new image.
