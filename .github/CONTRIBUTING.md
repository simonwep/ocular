## Commit guidelines

This project *strictly* follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
Check out [their explanation](https://www.conventionalcommits.org/en/v1.0.0/#summary) of how to use it.
In this project we have the following scopes / types:

### Scopes

* `core` - Core code, anything app / user-facing related.
* `setup` - Anything *only* relevant to the build-process / CI.

### Types

* `feat` - A new feature.
* `refactor` - A refactoring.
* `fix` - A bug fix.
* `docs` - Documentation only.
* `improve` - Nothing changed, only improved (such as performance improvements).


## Adding support for a new language

To add support for a new language, you need to do the following:

1. Add a new file under `src/i18n/locales` with the language code as the filename (e.g. `en.json`). 
2. Import the file from step 1. in `src/i18n/index.ts` and add it to `messages`.
