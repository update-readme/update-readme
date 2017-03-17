'use strict'
// Breadth-first tree search for the right section
// Remember that here, 'section' is a string identifier
// that is just the normalized version of the section title
function find ({tree, section}) {
  for (let subsection of tree.subsections) {
    if (subsection.section === section) {
      return subsection
    }
  }
  for (let subsection of tree.subsections) {
    let result = find({tree: subsection, section})
    if (result) return result
  }
  return null
}

// Here section is an object, and section.section is the
// string that identifies the section.
function update ({tree, section}) {
  for (let n in tree.subsections) {
    if (tree.subsections[n].section === section.section) {
      tree.subsections[n] = section
      return tree
    }
  }
  for (let subsection of tree.subsections) {
    let result = update({tree: subsection, section})
    if (result) return result
  }
  return null
}

module.exports = {
  find,
  update
}