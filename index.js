'use strict'
const assert = require('assert')
const fs = require('mz/fs')
const parser = require('./parser')
const render = require('./render')

module.exports = function updateDocFactory (config = {}) {
  let { plugins = [], ...globalOptions} = config
  // Returned promise will resolve when the file has been saved.
  return async function updateDoc (filename) {
    if (typeof filename !== 'string') {
      console.warn('Is that a Buffer or a Stream? What a good idea, implement that and send me a pull request!')
      throw new Error(`Expected a 'string' type for argument 'filename' but got a '${typeof filename}'`)
    }
    let filebody = await fs.readFile(filename, 'utf8')
    let tree = parser(filebody)
    // Pre-require all the plugins so that we fail fast if a plugin is missing.
    // Node caches modules, so it doesn't cause extra work to be done, just
    // changes the order the work gets done.
    for (let plugin of plugins) {
      require(plugin.module)
    }
    // Trust plugins not to interfere with each other and just run them all
    // in parallel in case they make a ton of network calls and are slow.
    let waitFor = []
    for (let plugin of plugins) {
      let p = require(plugin.module)
      try {
        let section = p.title ? tree.find({title: p.title}) : tree
        // Plugins modify the tree directly, but can return a promise.
        let prom = p(section, plugin.options, globalOptions)
        if (prom) waitFor.push(prom)
      } catch (e) {
        console.warn(e.message)
      }
    }
    await Promise.all(waitFor)
    filebody = render(tree)
    await fs.writeFile(filename, filebody, 'utf8')
    return
  }
}