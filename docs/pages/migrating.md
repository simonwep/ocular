---
outline: deep
---

# Migrating from v1 to v2

Migrating from the old ocular docker compose setup to the new `v2` single-container setup is fairly straightforward:

1. Stop your existing ocular docker compose setup with `docker compose down`.
2. Backup your existing `./data` folder **twice**, in case something goes wrong.
3. Deploy the new `v2` container as described in the [deployment guide](deploy.md#quickstart), mounting the previously used `./data` folder to `/data/genesis` in the container.
4. You're now running ocular `v2` with your existing data! Enjoy the latest features 🎉
