# Table of contents

Welcome to ocular—a small budgeting app as an alternative to Google sheet's annual budget planner.
Every contribution is welcome, no matter if it's a bug report, a feature request, or a pull request.
Make sure to check out the guidelines below before you start to make sure everything goes smoothly :)

- [Table of contents](#table-of-contents)
- [Development](#development)
  - [Setup](#setup)
  - [Commit guidelines](#commit-guidelines)
  - [Adding support for a new language](#adding-support-for-a-new-language)
  - [Adding support for a new currency](#adding-support-for-a-new-currency)
  - [Adding a new feature](#adding-a-new-feature)

# Development

## Setup

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (LTS version)
- [Docker](https://www.docker.com/) (for the backend)
- [pnpm](https://pnpm.io/) (for package management)

After you've installed the required software, follow these steps:

1. Clone this repository via `git clone https://github.com/simonwep/ocular`.
2. Run `pnpm install` in the root directory.
3. Copy the `.env.example` to `.env`, you can leave the default values.
4. Start both the back- and frontend with `pnpm dev`.
5. Open `http://localhost:3000` in your browser.

You're now ready to start developing 🚀

## Commit guidelines

This project *strictly* follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
Check out [their explanation](https://www.conventionalcommits.org/en/v1.0.0/#summary) in case you're not familiar with it.

Since this project's scope is rather small, we only use types to categorize our commits:

* `feat` - A new feature.
* `chore` - A small task that doesn't add any new features or fix any bugs.
* `refactor` - A code change that neither fixes a bug nor adds a feature.
* `fix` - A bug fix.
* `docs` - Documentation only changes.

## Adding support for a new language

To add support for a new language, you need to do the following:

1. Add a new file under [`src/i18n/locales`](../src/i18n/locales) with the language code as the filename (e.g. `en.json`). 
2. Import the file from step 1. in [`src/i18n/index.ts`](../src/i18n/index.ts) and add it to the `messages` constant.

## Adding support for a new currency

To add support for a new currency, you need to do the following:

1. Add your currency code to [src/store/state/types.ts](../src/store/state/types.ts) to the `availableCurrencies` array.

## Adding a new feature

If you want to add a new feature, make sure to [create an issue](https://github.com/simonwep/ocular/issues/new/choose) first to discuss it, so we can make sure it fits the project's scope.
I appreciate every contribution, but I want to keep the project focused on its main goal.
