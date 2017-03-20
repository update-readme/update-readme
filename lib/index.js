'use strict'

// Returned promise will resolve when the file has been saved.
module.exports = async function updateReadme (config = {}) {
  let {readme, plugins = [], ...globalOptions} = config
  // https://xkcd.com/208/
  let sections = readme.split(/^(?=#+)/gm)
  // Pre-require all the plugins so that we fail fast if a plugin is missing.
  // Node caches modules, so it doesn't cause extra work to be done, just
  // changes the order the work gets done.
  // This also gives them a chance to start doing asynchronous data gathering
  // operations like talking to Github or Travis.
  for (let plugin of plugins) {
    require(plugin.module)
  }
  // Set up chain of plugins
  for (let plugin of plugins) {
    let p = require(plugin.module)
    sections = await p(sections, plugin.options, globalOptions)
  }
  readme = sections.join('')
  return readme
}
