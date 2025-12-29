# Quickstart

> [!NOTE]
> If you have any questions or something's missing, feel free to [open an issue](https://github.com/simonwep/ocular/issues) 💖

## Summary

Ocular is a small budgeting app, initially implemented as an alternative to Google sheet's annual budget planner.
Its goal is **not** to track individual expenses, work with multiple currencies at a time or anything related (if you're looking for something like this, check out [firefly-iii](https://www.firefly-iii.org/)).

If you are not sure if it's something for you, check out the [demo](https://simonwep.github.io/ocular/demo#demo).

This app comes with its own backend (by using [genesis](https://github.com/simonwep/genesis)), so the only thing you need to do is to host it somewhere.
Your data stays on your server and is not shared with anyone else.

## What's next?

- 🤖 If you want to install it, head over to [deployment](./deploy.md).
- 🤨 If you have any questions, check out the [FAQs](./faq.md).
- 💡 Missing a feature, found a bug or having troubles setting it up? Please open an issue at [github/ocular](https://github.com/simonwep/ocular/issues).
- 🧑‍💻 Want to contribute? Head over to our [contributing guidelines](https://github.com/simonwep/ocular/blob/main/.github/CONTRIBUTING.md).

## Feature list

Notable features of Ocular:

- Self-hosted. Deploy it via docker-compose in seconds, your data stays on your server.
- Themed, light and dark mode.
- Multi-language and currency support.
- Installable as a Progressive Web App and optimized for mobile devices as well.
- Import your data from Google sheet's annual planner or export as json.
- Dashboard with extensive statistics and a detailed view with sankey diagram.
- All-time overview of your budgets including analytics.
- Privacy mode for when you're in a public place.
- Track budgets across multiple years.
- User management and authentication via app and cli.
- Customizable, financial year, start at any month.
- Carry over budgets to the next year.
- Inline expression evaluation.
- ...and much more!

## Repositories

Ocular consists of one frontend and a generic backend, all maintained in separate repositories:

- [ocular](https://github.com/simonwep/ocular) - The main repo with the source of this documentation, the frontend and all you need to work on the app.
- [genesis](https://github.com/simonwep/genesis) - A generic backend powering the app. Usually no change is needed here as it's kept unrelated to the app itself (but initially made for it).
