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

- 🥳 Simple login via google.
- 🌚 Dark and light theme.
- 💻 Installable (PWA).
- ⬆️ Import your data from Google sheet's annual planner.
- ⬇️ Export your data as a single `.json`-file.
- 🕰 Track budgets across year.
- 🙈 Privacy mode for when you're in a public place.
- 🪩 Simple and straight-forward UI.

> Check out the [demo](https://ocular.reinisch.io#demo)!

### Summary

A small budgeting app as an alternative to Google sheet's annual budget planner.
The goal of the app is **not** to track individual expenses, work with multiple currencies at a time or anything related (if you're looking for something like this, check out [firefly-iii](https://www.firefly-iii.org/)).

This app comes without any backend and all your data is stored in your google-drive account as an app (no worry - you can always export your data in the app).
**This app does not have access to anything else except its own files**.
The (latest) version I use is automatically deployed to [ocular.reinisch.io](https://ocular.reinisch.io) - but feel free to [set it up yourself](#development)!

> **Attention:** It's currently **not** possibly to sync the app with your personal gmail account due to the google-cloud app not being verified yet.
> You can still use it and download / upload your data or [deploy it yourself](#development) (which is even cooler!).

### State of this project

I consider the current state of it as the MVP for personal use.
But I'm planning on adding more [features](https://github.com/Simonwep/ocular/issues) - I'm not planning of making it any more in-depth as it already is, planned features may only include adding a way to define goals or general improvements for mobile usage.
As I already said, if you're looking for an in-depth tool to manage your finances check out [firefly](https://www.firefly-iii.org/)!

### Contributing

If you want to work on this, make sure to out the [contributing guidelines](CONTRIBUTING.md) :)
Furthermore this project *does not* have releases.
Because of its simplicity the master branch is considered stable and any new feature will directly be merged into it.

#### Development

This app requires [NodeJS LTS](https://nodejs.org/en/) and uses [vite](https://vitejs.dev/) as builder.
You can build and preview the app using the following commands:

```sh
npm run build
npm run preview
```

To work on it simply run `npm run dev`.

#### Production

To run this app in production and to add cloud connectivity, you'll need a [Google Cloud App](https://console.cloud.google.com) with
the `drive.appdata` scope.

After you've set up your app fill copy the [.env.example](.env.example) to `.env` and fill in your credentials.

##### Using docker

This project can be built as a docker-image, that serves the app via nginx.
You can build and run it via:

```sh
docker build -t ocular . && docker run -p 8080:80 ocular
```

Ocular should then be available under [localhost:8080](http://localhost:8080)
