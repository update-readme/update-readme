'use strict'
const Section = require('./Section')

module.exports = function (markdown) {
  /*
# This is a title

This is a body.

## This is a subsection title

This is the subsection's body
   */
  
  let lines = markdown.split('\n')
  let root = new Section()
  let currentSection = root
  
  for (let line of lines) {
    let level = line.match(/^#*/)[0].length
    if (level === 0) {
      currentSection.body.push(line)
    } else {
      while (level <= currentSection.level && currentSection.parent) {
        currentSection = currentSection.parent
      }
      let newSection = new Section()
      newSection.parent = currentSection
      try {
        newSection.title = line.slice(level)
      } catch (e) {
        console.log('level =', level)
        console.log(line)
        throw e
      }
      newSection.level = level
      currentSection.subsections.push(newSection)
      currentSection = newSection
    }
  }
  return root
}