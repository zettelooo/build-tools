# Zettel: Build helper tools

Build and helper tools for Zettel projects development.

## Installation

```bash
$ npm install --save-dev @zettelyay/build-tools
```

## Usage

Not documented yet.

## Configuration

Not documented yet.

## Development

Clone the repository locally:

```bash
$ git clone https://github.com/zettelyay/build-tools.git
```

Install the dependencies:

```bash
$ cd build-tools
$ npm install
```

It's recommended to use **VS Code** to develop this project.
You need to have **Prettier** extension to be installed on your IDE.

## Publication

Publish a new version of the NPM package:

- Push all the changes. The workspace needs to be cleaned.
- Make sure you're on `master` branch.

```bash
$ npm version patch   # / minor / major / any other valid semantic version
```

## Misc

Check for all the updates available on the dependencies:

```bash
$ npm run updates.check
```

Upgrade all the dependencies to their very latest versions:

```bash
$ npm run updates.install
```

View GIT history visualized:

```bash
$ npm run gource
```

> You probably need to install `gource` locally first.<br/>
See [this link](https://gource.io/).

Summarize the size of the code base in lines of code:

```bash
$ npm run status
```

------------------

Copyright: **Zettel, 2020-23**
