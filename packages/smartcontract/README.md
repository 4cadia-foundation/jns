# Welcome to Janus Name Service, a.k.a. JNS 👋

[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://janusproj.atlassian.net/wiki/spaces/JanusProj/overview)

## Prerequisites

* Node: `>=10.15.5 <12.0.0`
* Yarn: `>=1.0.0`

## Install Dependencies

_If you have already done this in the root level of this monorepo, you can skip this step._

```
yarn install
```

## Build

```sh
yarn build
```

## Run tests

```sh
yarn test
```

## Usage

```sh
yarn deploy [--network <network>]
```
Currently the only available values for network are:

- `local`: local `ganache-cli` running on port `8545`
- `development`: development `ganache-cli` (run it with `yarn ganache-dev`)
- `rinkeby`: Rinkeby test network

**IMPORTANT:** To use this smart contract, you need to at least deploy it to `local` or `development`.

## 🤝  Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](issues/).

---
_This README was generated with ❤️ by [JC Bombardelli](https://medium.com/@jcbombardelli)_
