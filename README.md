# Zettel: Build helper tools

Build and helper tools for Zettel projects development.

## Installation

```bash
$ npm install --save-dev @zettelooo/build-tools
```

## Usage

This package provides shell command `zettel-bt` executable binary.
You can use it to speed up a couple of tasks while developing Zettel extensions.

See help:

```bash
$ zettel-bt --help   # / -h
```

Check for all the updates available on the dependencies:

```bash
$ zettel-bt check
```

Upgrade all the dependencies to their very latest versions:

```bash
$ zettel-bt update-all
```

Upgrade all the Zettel official dependencies (which belong to `@zettelooo/` scope) to their very latest versions:

```bash
$ zettel-bt update
```

Validates the correctness of peer dependencies:

```bash
$ zettel-bt validate
```

Pre-version checks and actions (check branch is `master`):

```bash
$ zettel-bt preversion
```

Post-version checks and actions (push changes to the remote GIT repository):

```bash
$ zettel-bt postversion
```

View GIT history visualized:

```bash
$ zettel-bt gource
```

> You probably need to install `gource` globaly first.<br/>
See [this link](https://gource.io/).

Summarize the size of the code-base in lines of code:

```bash
$ zettel-bt status
```

## Configuration

You may provide the following configuration parameters either as the CLI command flags or options in the config file; which is either `.zettelbtrc`, `.zettelbtrc.json`, `.zettelbtrc.js`, `.zettelbtrc.yml`, or `.zettelbtrc.yaml`.

| RC file property path | Command-line flag | Default | Description |
|---|---|---|---|
| `paths.root` | `-r`, `--root-path` | `"."` | Project root relative path, contains `package.json` file
| `paths.src` | `-s`, `--src-path` | `"src"` | Source folder relative path to root

## Development

Clone the repository locally:

```bash
$ git clone https://github.com/zettelooo/build-tools.git
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

**Note:** As a Zettel repository, this package uses its own provided scripts by itself!

You can use the following NPM script to access it (See [this link](https://github.com/zettelooo/build-tools#usage) for more details):

```bash
$ npm run bt -- <command>   # e.g.: npm run bt - update
```

------------------

Copyright: **Zettel, 2020-23**
