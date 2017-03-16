'use strict'
module.exports = function render (section) {
  let text = ''
  if (section.level > 0) {
    text += `${'#'.repeat(section.level)} ${section.title}\n`
  }
  text += section.body
  for (let subsection of section.subsections) {
    text += render(subsection)
  }
  return text
}