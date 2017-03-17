'use strict'
const chalk = require('chalk')
const jsdiff = require('diff')
const registry = require('package-stream')()
const parse = require('../parser')
const render = require('../render')

let haves = 0
let total = 0

registry.on('package', (pkg) => {
  total++
  if (pkg.readme) haves++
  if (total % 1000 === 0) console.log(`${haves} / ${total}    ${(100 * haves / total).toFixed(1)}%`)
  if (pkg.readme) {
    try {
      var readme = pkg.readme
      var readmeParse = parse(readme)
    } catch (e) {
      process.stdout.write(`\nParse failure for '${pkg.name}'\n`)
      console.log(e)
      process.stderr.write(pkg.readme)
      return
    }
    try {
      var readmeRender = render(readmeParse)
    } catch (e) {
      process.stdout.write(`\nRender failure for '${pkg.name}'\n`)
      console.log(e)
      process.stderr.write(pkg.readme)
      return
    }
    if (readmeRender !== readme) {
      process.stdout.write(`\nNon-identity transform for package '${pkg.name}'\n`)
      var diff = jsdiff.diffLines(readme, readmeRender)
 
      diff.forEach(function(part){
        // green for additions, red for deletions
        // grey for common parts
        if (part.added) {
          process.stdout.write(chalk.green(part.value))
        } else if (part.removed) {
          process.stdout.write(chalk.red(part.value))
        } else {
          process.stdout.write(chalk.gray(part.value))
        }
      })
      return
    }
  }
})
registry.on('end', () => {
  process.stderr.write('DONE')
  process.exit(0)
})