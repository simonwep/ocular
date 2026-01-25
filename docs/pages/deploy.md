---
outline: deep
---

# Deployment

> [!TIP]
> This deployment as well as v2 are still fairly new ✨
> If you have any questions or something's missing, feel free to [open an issue](https://github.com/simonwep/ocular/issues).
> For deploying Ocular [Docker](https://docs.docker.com/engine/install/) is required.
>
> Running `v1`? Head over to the [migration guide](migrating.md) to update to `v2`!

## Quickstart

Ocular can be deployed via a single docker image.

```sh
docker run \
    -p 3030:80 \
    -v ./data:/data/genesis \
    -e "GENESIS_JWT_SECRET=$(openssl rand -base64 48)" \
    -e "GENESIS_JWT_TOKEN_EXPIRATION=60" \
    -e 'GENESIS_CREATE_USERS=my-admin-username!:my-very-secure-password' \
    ghcr.io/simonwep/ocular:v2
```

Ocular should then be accessible under `http://localhost:3030` in your browser 🚀
You can now log in with the specified user.

All data is saved under `./data`, make sure to backup this folder regularly, as it contains all your budgeting data.
Who knows what can happen to your container or server ;)

You can also use docker compose to deploy ocular, here is a minimal example `docker-compose.yml`:

```yml
services:
  ocular:
    image: ghcr.io/simonwep/ocular:v2
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

# JWT expiration in minutes
GENESIS_JWT_TOKEN_EXPIRATION=60

# Use ! as suffix for the username to indicate that this user should be created as an admin.
# Admins can add, remove and edit users, you can create multiple users by separating them with a comma.
# Comment this out if you already have users created!
GENESIS_CREATE_USERS=my-admin-username!:my-very-secure-password
```

Now run `docker compose up` and ocular should be accessible under `http://localhost:3030` in your browser 🚀
You can now log in with the specified user.

## Using ocular over `http`

> [!DANGER]
> Using ocular over plain `http` is not recommended for production environments as it transmits your data in plain text.
> Make sure to use `https` in production environments!

By default, ocular sets the session cookie to `Secure` which means it will only be sent over `https` connections.

If you're using ocular over plain `http`, for example in local, trusted networks, you need to set the environment variable `GENESIS_JWT_COOKIE_ALLOW_HTTP` to `true` to disable this behavior.
Although it's highly recommended to use `https` in any other environment than local development.

## Updating to a new version

> [!TIP]
> If you're using the `v2` tag, make sure to check for new versions regularly as it always points to the latest `v2.x.x` release.


Since ocular is contained within a single image, updating is fairly straightforward.
To update ocular to a new version, simply pull the new image and restart the container if you're using docker compose:

```sh
docker compose pull
docker compose up -d
```

Or if you're using docker directly just restart the container after pulling the new image.
