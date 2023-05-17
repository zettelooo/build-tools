const fs = require('fs')
const path = require('path')

function throwError(message) {
  console.error(String(message))
  process.exit(1)
}

function ensureFolder(folderPath) {
  try {
    fs.accessSync(folderPath, fs.constants.F_OK)
  } catch {
    try {
      fs.mkdirSync(folderPath, { recursive: true })
    } catch {}
  }
}

async function findBinDirectoryPath() {
  const { findUp, pathExists } = await import('find-up')
  const binDirectoryProjectPath = await findUp(
    async directory => {
      const currentBinDirectoryPath = path.join(directory, 'node_modules', '.bin')
      const currentBinDirectoryPathExists = await pathExists(currentBinDirectoryPath)
      return currentBinDirectoryPathExists && directory
    },
    { cwd: __dirname, type: 'directory' }
  )
  return binDirectoryProjectPath && path.join(binDirectoryProjectPath, 'node_modules', '.bin')
}

module.exports = {
  throwError,
  ensureFolder,
  findBinDirectoryPath,
}
