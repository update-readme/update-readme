#!/usr/bin/env node
'use strict'
const assert = require('assert')
const subarg = require('subarg')
const argv = subarg(process.argv.slice(2), {
  alias: {
    plugin: ['p'],
    global: ['g']
  }
})

assert.ok(argv._[0], 'at least one argument (the filename to update) is required')
console.log(`read and split: ${argv._[0]}`)

let plugins = []
for (let p of argv.plugin) {
  if (typeof p === 'string') {
    plugins.push({
      name: 'update-doc-' + p,
      options: {}
    })
  } else {
    plugins.push({
      name: 'update-doc-' + p._[0],
      options: p
    })
  }
}

for (let p of plugins) {
  console.log(`require('${p.name}')`)
}

