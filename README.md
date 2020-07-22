# vue-i18n

## Development

```sh
yarn install
yarn test
```

### (Mandatory) Linting on commits

We're using git commit hook `pre-commit` to run codestyle checks over **staged** files.

To enable this feature, please install [`pre-commit`](https://pre-commit.com/) framework with simple command (from the **root** of the project), if you haven't run it yet:

```sh
make init-git-hooks
```

_NOTE_: If you experience some troubles with this step, please go to the official `pre-commit` [website](https://pre-commit.com/#install) and folllow manual installation instructions.
