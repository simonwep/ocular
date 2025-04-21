---
outline: deep
---

# Deployment

All source code for the deployment can be found under [ocular-docker](https://github.com/simonwep/ocular-docker).

## Quick install

> [!NOTE]
> This will perform the same steps as described in the [manual setup](#manual-setup) section and ask you questions if needed.
> You can always [take a look at the script](https://github.com/simonwep/ocular-docker/blob/main/setup.sh) before running it, or perform [these steps manually](#manual-setup).

To install the latest release run the following, it will download and run [this](https://github.com/simonwep/ocular-docker/blob/main/setup.sh) setup script.

```sh
bash <(curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/simonwep/ocular-docker/refs/heads/main/setup.sh)
```

## Manual setup

To deploy it via docker compose manually, follow these steps:

1. Download the [latest release](https://github.com/simonwep/ocular-docker/releases/latest) of [ocular-docker](https://github.com/simonwep/ocular-docker) and extract it. Do not clone the repository!
2. Copy the `.env.example` to `.env`, if your app is only used locally make sure to set `GENESIS_JWT_COOKIE_ALLOW_HTTP` to `true` if you want to use it without https, for example in an isolated network.
3. Run `./gen-passwords.sh` to generate secrets and an initial admin user with a random, secure password. You can use this admin to create other users.
4. Run `docker compose up -d`.
5. Ocular should be accessible under `http://localhost:3030` in your browser 🚀

> [!TIP]
> It's recommended to only use the admin account to manage users and create separate, non-admin accounts for daily usage.

## Updating to a new version

> [!NOTE]
> Usually it's sufficient to just bump the versions inside the `docker-compose.yml` file.
> However, sometimes new versions come with new `.env`-variables or changes to the config folder.
> This guide is to be 100%-sure that everything works as expected - but it's not always necessary.

To migrate to a newer version, follow these steps:

1. Stop all containers with `docker compose down`.
2. Backup the `./data` folder and your `.env` file.
3. Download the [latest release](https://github.com/simonwep/ocular-docker/releases/latest) and extract it.
4. Copy your old `./data` folder and `.env` to the new directory, compare the `.env.example` with your `.env` and copy default values if needed.
5. Run `docker compose up -d`.

## Admin controls

You can use the [genesis cli](https://github.com/simonwep/genesis?tab=readme-ov-file#cli) to manage users.
For example, to change a user's password:

```sh
docker run --rm -v "$(pwd)/data:/app/.data" \
    --env-file .env ghcr.io/simonwep/genesis:latest users update \
    --password {new password} {username}
```

Or the see all available commands:
```sh
docker run --rm -v "$(pwd)/data:/app/.data" \
    --env-file .env ghcr.io/simonwep/genesis:latest help
```
