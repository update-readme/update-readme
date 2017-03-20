'use strict'
function renderLines (section) {
  let lines = []
  if (section.level > 0) {
    lines.push(`${'#'.repeat(section.level)}${section.title}`)
  }
  lines.push(...section.body)
  for (let subsection of section.subsections) {
    lines.push(...renderLines(subsection))
  }
  return lines
}
module.exports = function render (section) {
  return renderLines(section).join('\n')
}