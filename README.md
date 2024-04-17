<br/>

<h3 align="center">
  <img src="https://github.com/simonwep/ocular/assets/30767528/2cbd76cd-adfb-4183-a69a-15784c4dccb6" alt="Logo" height="150">
</h3>

<br/>

<h3 align="center">
  ✨ <a href="https://budget.reinisch.io">Ocular</a> - Helps you see your budgets more clearly ✨
</h3>

<p align="center">
  <a href="https://github.com/Simonwep/ocular/actions?query=workflow%3ACI"><img
     alt="CI Status"
     src="https://github.com/Simonwep/ocular/workflows/CI/badge.svg"/></a>
</p>

> [!TIP]
> Check out the [demo](https://ocular.reinisch.io#demo) to get a live preview with demo data!

## Features

- 🦾 Self-hosted. [Deploy](https://github.com/simonwep/ocular-docker) it via docker-compose in seconds.
- 🕶️ Beautiful light and dark theme.
- 💻 Installable as a PWA.
- 🔼 Import your data from Google sheet's annual planner.
- 🛠️ Export your data as a single `.json`-file.
- ✨ Dashboard with sankey diagram and a detailed view.
- 🎇 Track budgets across multiple years.
- 🙈 Privacy mode for when you're in a public place.
- ⚡️ Simple, fast and straight-forward UI.
- 🫂 User management and authentication.
- 🗣️ Internationalized, comes with german and english - more to come.
- ...and more to come!

## Summary

Ocular is a small budgeting app as an alternative to Google sheet's annual budget planner.
Its goal is **not** to track individual expenses, work with multiple currencies at a time or anything related (if you're looking for something like this, check out [firefly-iii](https://www.firefly-iii.org/)).

This app comes with its own backend (by using [genesis](https://github.com/simonwep/genesis)), so the only thing you need to do is to host it somewhere.
Your data stays on your server and is not shared with anyone else.

## Setup

### Development

This app uses [genesis](https://github.com/simonwep/genesis) as generic backend.
Go to the [genesis](https://github.com/simonwep/genesis) repository and follow the instructions to set it up first.

To run the frontend make sure you have the latest [node LTS](https://nodejs.org/en/) installed, as well as [pnpm](https://pnpm.io/).
You can then start the frontend by running `pnpm run dev` in the root directory.

### Production

This app is deployed using [docker-compose](https://docs.docker.com/compose/).
See [ocular-docker](https://github.com/simonwep/ocular-docker) for deployment.

### Contributing

If you want to work on this, make sure to out the [contributing guidelines](CONTRIBUTING.md) :)
Other than that, follow the steps under [development](#development) to get started.
