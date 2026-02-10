---
outline: deep
---

# How to Deploy

> [!NOTE]
> This deployment as well as v2 are still fairly new ✨
> If you have any questions or something's missing, feel free to [open an issue](https://github.com/simonwep/ocular/issues).
> For deploying Ocular [Docker](https://docs.docker.com/engine/install/) is required.
>
> Running `v1`? Head over to the [migration guide](migrating.md) to update to `v2`!

## Quickstart

> [!NOTE]
> Outside of `localhost` ocular by default requires `https` for secure cookie handling.
> It's highly recommended to use `https` in production environments.
> If you know what you're doing, you can also run ocular over plain `http`, see the [using ocular over `http`](#using-ocular-over-http) section for more information.

Ocular can be deployed via a single docker image:

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

----

You can also use docker compose to deploy ocular, here is a minimal example `compose.yml`:

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
      - GENESIS_JWT_TOKEN_EXPIRATION
      - GENESIS_JWT_SECRET
      - GENESIS_CREATE_USERS
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

## Using docker secrets

> [!INFO]
> This feature is / will be available as of ocular `v2.3`

If you want to use docker secrets to manage your secrets, you can do so by creating a secret for each environment variable and then referencing them in your `compose.yml` file.

First, docker needs to be initialized in [swarm mode](https://docs.docker.com/reference/cli/docker/swarm/) to use secrets, you can do this by running the following command:

```sh
docker swarm init
```

To move, for example, all three environment variables to secrets, you can use [`docker secret`](https://docs.docker.com/reference/cli/docker/secret/) to create the secrets:

```sh
echo '60' | docker secret create ocular_jwt_token_expiration -
echo 'insert-a-very-long-random-string-here' | docker secret create ocular_jwt_secret -
echo 'my-admin-username!:my-very-secure-password' | docker secret create ocular_create_users -
```

Then, you can reference these secrets in your `compose.yml` file.
Every variable can be passed with the suffix `_FILE` to read the value from a file.

```yml
services:
  ocular:
    image: ghcr.io/simonwep/ocular:v2
    volumes:
      - ./data:/data/genesis
    ports:
      - 3030:80
    environment:
      GENESIS_JWT_TOKEN_EXPIRATION_FILE: /run/secrets/ocular_jwt_token_expiration
      GENESIS_JWT_SECRET_FILE: /run/secrets/ocular_jwt_secret
      GENESIS_CREATE_USERS_FILE: /run/secrets/ocular_create_users
    secrets:
      - ocular_jwt_token_expiration
      - ocular_jwt_secret
      - ocular_create_users
secrets:
  ocular_jwt_token_expiration:
    external: true
  ocular_jwt_secret:
    external: true
  ocular_create_users:
    external: true
```

To deploy ocular with docker secrets, run the following command:

```sh
docker stack deploy -c compose.yml ocular
```

Ocular should then be accessible under `http://localhost:3030` in your browser 🚀

## Using ocular over `http`

> [!DANGER]
> Using ocular over plain `http` is not recommended for production environments as it transmits your data in plain text.
> Make sure to use `https` in production environments!
> Tools such as [certbot](https://certbot.eff.org/) can help you to set up `https` for free.

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
