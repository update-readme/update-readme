#!/usr/bin/env node
'use strict'
const fs = require('fs')
const assert = require('assert')
const subarg = require('subarg')
const updateDoc = require('./index.min.js')

const argv = subarg(process.argv.slice(2), {
  alias: {
    plugin: ['p']
  }
})

assert.ok(argv._[0], 'at least one argument (the filename to update) is required')

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

let opts = {}
opts.plugins = plugins

let command = updateDoc(opts)

command(argv._[0]).then(process.exit)
