#!/usr/bin/env node
'use strict'
;(async function () {
  try {
    const fs = require('mz/fs')
    const subarg = require('subarg')
    const updateReadme = require('../lib/index')

    const argv = subarg(process.argv.slice(2), {
      alias: {
        plugin: ['p'],
        filename: ['f']
      },
      default: {
        filename: 'README.md'
      }
    })

    let pluginOptions = argv.plugin
    if (!pluginOptions) {
      pluginOptions = []
    }
    else if (typeof pluginOptions === 'string') {
      pluginOptions = [pluginOptions]
    }
    let plugins = []
    for (let p of pluginOptions) {
      if (typeof p === 'string') {
        plugins.push({
          module: 'update-readme-' + p,
          options: {}
        })
      } else {
        plugins.push({
          module: 'update-readme-' + p._[0],
          options: p
        })
      }
    }

    let filebody = await fs.readFile(argv.filename, 'utf8')
    let opts = {}
    opts.plugins = plugins
    opts.readme = filebody
    filebody = await updateReadme(opts)
    await fs.writeFile(argv.filename, filebody, 'utf8')
    process.exit()
  } catch (err) {
    console.log(err.message)
  }
})()
