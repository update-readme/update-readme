'use strict'
function Section () {
  return {
    parent: null,
    level: 0,
    title: '',
    section: '',
    body: '',
    subsections: []
  }
}

module.exports = function (markdown) {
  /*
# This is a title

This is a body.

## This is a subsection title

This is the subsection's body
   */
  let lines = markdown.split('\n')
  let state = {
    section: '',
    headingLevel: 0
  }
  let root = new Section()
  let currentSection = root
  for (let line of lines) {
    let level = line.match(/^#*/)[0].length
    if (level === 0) {
      currentSection.body += line + '\n'
    } else {
      while (level <= currentSection.level && currentSection.parent) {
        currentSection = currentSection.parent
      }
      let newSection = new Section()
      newSection.parent = currentSection
      newSection.title = line.match(/^#+ ?(.*)$/)[1]
      newSection.section = newSection.title.trim().toLowerCase()
      newSection.level = level
      currentSection.subsections.push(newSection)
      currentSection = newSection
    }
  }
  return root
}

if (!module.parent) {
  const util = require('util')
  console.log(util.inspect(module.exports(`
(this will throw you off!)

# Title
subheading

## Installation

do some stuff

## Help
asdf
#### deep

## License

MIT
`), {depth:10}))
}
