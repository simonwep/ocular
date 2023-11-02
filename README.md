<br/>

<h3 align="center">
  <img src="https://github.com/simonwep/ocular/assets/30767528/2cbd76cd-adfb-4183-a69a-15784c4dccb6" alt="Logo" height="150">
</h3>

<br/>

<h3 align="center">
  <a href="https://budget.reinisch.io">Ocular</a> - Helps you see your budget more clearly ✨
</h3>

<p align="center">
  <a href="https://github.com/Simonwep/ocular/actions?query=workflow%3ACI"><img
     alt="CI Status"
     src="https://github.com/Simonwep/ocular/workflows/CI/badge.svg"/></a>
</p>

### Features

- 🦾 Self-hosted.
- 🕶️ Dark and light theme.
- 💻 Installable as a PWA.
- 🔼 Import your data from Google sheet's annual planner.
- 🛠️ Export your data as a single `.json`-file.
- 🎇 Track budgets across multiple years.
- 🙈 Privacy mode for when you're in a public place.
- ⚡️ Simple and straight-forward UI.

> Check out the [demo](https://ocular.reinisch.io#demo)!
> Looking for the legacy google-app based version? Check out the [legacy](https://github.com/simonwep/ocular/tree/legacy) branch.

### Summary

A small budgeting app as an alternative to Google sheet's annual budget planner.
The goal of the app is **not** to track individual expenses, work with multiple currencies at a time or anything related (if you're looking for something like this, check out [firefly-iii](https://www.firefly-iii.org/)).

This app comes with its own backend (by using [genesis](https://github.com/simonwep/genesis)), so the only thing you need to do is to host it somewhere.
Your data stays on your server and is not shared with anyone else.

### State of this project

I consider the current state of it as the MVP for personal use.
But I'm planning on adding more [features](https://github.com/Simonwep/ocular/issues) - I'm not planning of making it any more in-depth as it already is, planned features may only include adding a way to define goals or general improvements for mobile usage.
As I already said, if you're looking for an in-depth tool to manage your finances check out [firefly](https://www.firefly-iii.org/)!

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