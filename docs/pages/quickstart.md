# Quickstart

> [!TIP]
> If you have any questions or something's missing, feel free to [open an issue](https://github.com/simonwep/ocular/issues) 🐞
> Want to deploy it? Head over to the [deployment guide](./deploy.md) 🚀

## Getting started

Ocular is a small budgeting app, initially implemented as an alternative to Google sheet's annual budget planner.
Its goal is **not** to track individual expenses, work with multiple currencies at a time or anything related (if you're looking for something like this, check out [firefly-iii](https://www.firefly-iii.org/)).

If you are not sure if it's something for you, check out the [demo](https://simonwep.github.io/ocular/demo#demo).

This app comes with its own backend (by using [genesis](https://github.com/simonwep/genesis)), so the only thing you need to do is to host it somewhere.
Your data stays on your server and is not shared with anyone else.

- 🤖 If you want to install it, head over to [deployment](./deploy.md).
- 🤨 If you have any questions, check out the [FAQs](./faq.md).
- 💡 Missing a feature, found a bug or having issues? [Open an issue](https://github.com/simonwep/ocular/issues).
- 🧑‍💻 Want to contribute? Head over to our [contributing guidelines](https://github.com/simonwep/ocular/blob/main/.github/CONTRIBUTING.md).

## Notable features

- 🏠 Self-hosted. Deploy it via docker in seconds, your data stays on your server.
- 🎨 Themed, light and dark mode.
- 🌍 Multi-language and support for all common currencies.
- 📱 Installable as a Progressive Web App and optimized for mobile devices.
- 🔁 Import your data from Google sheet's annual planner and export as json.
- 📊 Dashboard with extensive statistics and charts including a sankey diagram.
- ⌨️ Keyboard navigation for power users.
- 📈 All-time overview of your budgets including analytics.
- 🕶️ Privacy mode for when you're in a public place.
- 📅 Track budgets across multiple years.
- 👥 User management and authentication via app and cli.
- ⚙️ Customizable, financial year, start at any month.
- 🔄 Carry over budgets to the next year.
- 🧮 Inline expression evaluation.
- 🚀 ...and much more! 🚀

## References

Ocular consists of one frontend and a generic backend, both maintained in separate repositories:

- [ocular](https://github.com/simonwep/ocular) - The main repo with the source of this documentation, the frontend and all you need to work on the app.
- [genesis](https://github.com/simonwep/genesis) - A generic backend powering the app. Usually no change is needed here as it's kept unrelated to the app itself (but initially made for it).
