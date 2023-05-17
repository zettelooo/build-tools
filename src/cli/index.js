#!/usr/bin/env node

const childProcess = require('child_process')
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { loadRcFile } = require('./config')
const { findOfficialDependencies } = require('./official')
const { throwError, findBinDirectoryPath } = require('./utilities')

const rcConfig = loadRcFile('zettelbt')
const defaultConfig = {
  paths: {
    root: rcConfig.paths?.root || '.',
    src: rcConfig.paths?.src || 'src',
  },
}

yargs(hideBin(process.argv))
  .alias('v', 'version')
  .alias('h', 'help')

  .option('r', {
    alias: 'root-path',
    describe: 'Project root relative path, contains "package.json" file, defaults to the current working directory',
    type: 'string',
  })
  .option('s', {
    alias: 'src-path',
    describe: 'Source folder relative path to root, defaults to "src"',
    type: 'string',
  })

  .command(
    'lint-staged',
    'Runs ESLint on all the staged files with NODE_ENV=production',
    argv => argv,
    async args => {
      try {
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const lintStaged = path.join(await findBinDirectoryPath(), 'lint-staged')
        const lintStagedRc = path.join(__dirname, '..', '..', '.lintstagedrc.js')
        const stdout = childProcess.execSync(`${lintStaged} --config ${lintStagedRc} --verbose`, {
          cwd: rootPath,
          env: {
            NODE_ENV: 'production',
          },
          encoding: 'utf8',
          stdio: 'inherit',
        })
        // console.log(stdout)
      } catch ({ stderr }) {
        throwError(stderr)
      }
    }
  )

  .command(
    'check',
    'Checks all the updates available on the dependencies',
    argv => argv,
    async args => {
      try {
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const ncu = path.join(await findBinDirectoryPath(), 'ncu')
        const stdout = childProcess.execSync(`${ncu}`, {
          cwd: rootPath,
          encoding: 'utf8',
          stdio: 'inherit',
        })
        // console.log(stdout)
      } catch ({ stderr }) {
        throwError(stderr)
      }
    }
  )

  .command(
    'update-all',
    'Updates all the dependencies to their latest versions',
    argv => argv,
    async args => {
      try {
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const ncu = path.join(await findBinDirectoryPath(), 'ncu')
        const stdout = childProcess.execSync(`${ncu} --upgrade && npm install --force`, {
          cwd: rootPath,
          encoding: 'utf8',
          stdio: 'inherit',
        })
        // console.log(stdout)
      } catch ({ stderr }) {
        throwError(stderr)
      }
    }
  )

  .command(
    'update',
    'Updates all official Zettel dependencies',
    argv => argv,
    args => {
      const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
      const oldOfficialDependencies = findOfficialDependencies(rootPath, { skipPackageLock: true })
      console.log('Checking and updating Zettel official dependencies...')
      try {
        const stdout = childProcess.execSync(
          `npm install --force ${oldOfficialDependencies.map(dependency => `${dependency.name}@latest`).join(' ')}`,
          {
            cwd: rootPath,
            encoding: 'utf8',
            stdio: 'ignore',
          }
        )
        // console.log(stdout)
      } catch ({ stderr }) {
        throwError(stderr)
      }
      const newOfficialDependencies = findOfficialDependencies(rootPath)
      const upgrades = oldOfficialDependencies
        .map(oldDependency => {
          const newDependency = newOfficialDependencies.find(dependency => dependency.name === oldDependency.name)
          return {
            name: oldDependency.name,
            oldVersion: oldDependency.version,
            newVersion: newDependency?.version,
          }
        })
        .map(
          upgrade =>
            `\u2022 ${upgrade.name}\t${upgrade.oldVersion}${
              upgrade.newVersion && upgrade.newVersion !== upgrade.oldVersion
                ? ` \u21D2 ${upgrade.newVersion}`
                : ' \u2713'
            }` // • Bullet, ⇒ Rightwards double arrow, ✓ Check mark
        )
        .join('\n')
      console.log(upgrades ? upgrades : 'No official dependencies are found.')
      console.log('Done \u2714') // ✔ Heavy check mark
    }
  )

  .command(
    'validate',
    'Validates the correctness of peer dependencies',
    argv => argv,
    async args => {
      try {
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const checkPeerDependencies = path.join(await findBinDirectoryPath(), 'check-peer-dependencies')
        const stdout = childProcess.execSync(`${checkPeerDependencies} --runOnlyOnRootDependencies`, {
          cwd: rootPath,
          encoding: 'utf8',
          stdio: 'inherit',
        })
        // console.log(stdout)
      } catch ({ stderr }) {
        throwError(stderr)
      }
    }
  )

  .command(
    'preversion',
    'Pre-version common checks and actions',
    argv => argv,
    async args => {
      try {
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const gitBranchIs = path.join(await findBinDirectoryPath(), 'git-branch-is')
        const stdout = childProcess.execSync(`${gitBranchIs} master`, {
          cwd: rootPath,
          encoding: 'utf8',
          stdio: 'inherit',
        })
        // console.log(stdout)
      } catch ({ stderr }) {
        throwError(stderr)
      }
    }
  )

  .command(
    'postversion',
    'Post-version common checks and actions',
    argv => argv,
    args => {
      try {
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const stdout = childProcess.execSync(`git push --follow-tags`, {
          cwd: rootPath,
          encoding: 'utf8',
          stdio: 'inherit',
        })
        // console.log(stdout)
      } catch ({ stderr }) {
        throwError(stderr)
      }
    }
  )

  .command(
    'gource',
    'Runs Gource to visualize GIT history',
    argv => argv,
    args => {
      try {
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const stdout = childProcess.execSync(
          `gource --seconds-per-day 0.35 --auto-skip-seconds 0.1 --file-idle-time 0 --max-file-lag 1`,
          {
            cwd: rootPath,
            encoding: 'utf8',
            stdio: 'inherit',
          }
        )
        // console.log(stdout)
      } catch ({ stderr }) {
        throwError(stderr)
      }
    }
  )

  .command(
    'status',
    'Runs sloc to report lines of code',
    argv => argv,
    async args => {
      try {
        const rootPath = path.join(process.cwd(), args.r || defaultConfig.paths.root)
        const srcPath = path.join(rootPath, args.s || defaultConfig.paths.src)
        const sloc = path.join(await findBinDirectoryPath(), 'sloc')
        const stdout = childProcess.execSync(`${sloc} ${srcPath}`, {
          cwd: rootPath,
          encoding: 'utf8',
          stdio: 'inherit',
        })
        // console.log(stdout)
      } catch ({ stderr }) {
        throwError(stderr)
      }
    }
  )

  .demandCommand(1, 1)
  .strict()
  .help()
  .parse()
