<h3 align="center">
  <img src="https://user-images.githubusercontent.com/30767528/169694460-0e85f361-6fd6-4ac6-bf7a-6f98d9241c20.png" alt="Logo" height="200">
</h3>

<h3 align="center">
  <a href="https://budget.reinisch.io/">Ocular</a> - Helps you see your budget more clearly.
</h3>

<br/>

<p align="center">
  <a href="https://github.com/Simonwep/ocular/actions?query=workflow%3ACI"><img
     alt="CI Status"
     src="https://github.com/Simonwep/ocular/workflows/CI/badge.svg"/></a>
</p>

### Summary

A small budgeting app as an alternative to Google sheet's annual budget planner.
The goal of the app is **not** to track individual expenses, work with multiple currencies at a time or anything related (if you're looking for something like this, check
out [firefly-iii](https://www.firefly-iii.org/)).
It should merely be used to roughly plan your budget across the year - a bit easier to use than google sheets and much simpler than highly sophisicated apps such
as [firefly-iii](https://www.firefly-iii.org/).

This app comes without any backend and all your data is stored in your google-drive account as an app (no worry - you can always export your data in the app). **This app
does not have access to anything else except its own files**. The (latest) version I use is automatically deployed to [ocular.reinisch.io](https://ocular.reinisch.io) - but feel
free to [set it up yourself](#setup)!

> Thanks [@nateseymour](https://github.com/nateseymour) for coming up with a good name for this!

### Features

- [x] Simple login via google drive.
- [x] Dark / light theme.
- [x] Installable (PWA).
- [x] Import your data from Google sheet's annual planner.
- [x] Export your data as a single `.json`-file.
- [ ] Full mobile support ([#4](https://github.com/Simonwep/ocular/issues/4)).
- [ ] A settings-page to customize things such as the currency / locale and possibly a starting balance ([#1](https://github.com/Simonwep/ocular/issues/1)).
- [ ] Support for planning a budget for multiple years ([#2](https://github.com/Simonwep/ocular/issues/2)).

### Setup

This app requires [NodeJS LTS](https://nodejs.org/en/) and uses [vite](https://vitejs.dev/) as builder. You can build and preview the app using the following commands:

```sh
npm run build
npm run preview
```

To work on it simply run `npm run dev`.

#### Production

To run this app in production and to add cloud connectivity, you'll need a [Google Cloud App](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en) with
the `drive.appdata` scope.

After you've set up your app fill copy the [.env.example](.env.example) to `.env` and fill in your credentials.
