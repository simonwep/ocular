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
- ...and more to come!

## Summary

Ocular is a small budgeting app as an alternative to Google sheet's annual budget planner.
Its goal is **not** to track individual expenses, work with multiple currencies at a time or anything related (if you're looking for something like this, check out [firefly-iii](https://www.firefly-iii.org/)).

This app comes with its own backend (by using [genesis](https://github.com/simonwep/genesis)), so the only thing you need to do is to host it somewhere.
Your data stays on your server and is not shared with anyone else.

## Setup

### Development

1. Make sure you have the latest [node LTS](https://nodejs.org/en/) installed.
2. Install [pnpm](https://pnpm.io/) via `npm i -g pnpm`.
3. Clone this repository.
4. Run `pnpm install` in the root directory.
5. Copy the `.env.example` to `.env`, you can leave the default values.
6. Start the backend with `pnpm run genesis`.
7. Start the frontend with `pnpm run dev`.
8. Open `http://localhost:3000` in your browser.

> [!NOTE]  
> To modify the backend, head over to [genesis](https://github.com/simonwep/genesis).

### Production

This app can be deployed using [docker-compose](https://docs.docker.com/compose/).
See [ocular-docker](https://github.com/simonwep/ocular-docker) for deployment.

### Contributing

If you want to work on this, make sure to out the [contributing guidelines](CONTRIBUTING.md) :)
Other than that, follow the steps under [development](#development) to get started.
