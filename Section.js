'use strict'
module.exports = class Section {
  constructor () {
    this.parent = null
    this.level = 0
    this.title = ''
    this.body = []
    this.subsections = []
  }
  blank () {
    // This lets plugin authors easily create new section objects
    // from existing ones that are guaranteed to be compatible.
    return new Section()
  }
  find ({title}) {
    // Breadth-first tree search for the right section by title
    for (let subsection of this.subsections) {
      if (subsection.title.toLowerCase().trim() === title.toLowerCase().trim()) {
        return subsection
      }
    }
    // If none of our children match, recursively search
    for (let subsection of this.subsections) {
      let result = subsection.find({title})
      if (result) return result
    }
    // Last but not least... throw an error. Because it is better to throw
    // the error now and than to wait until it manifests as
    // an Uncaught TypeError: Cannot read property 'title' of null
    // or something
    throw new Error(`Expected a section titled '${title}' but did not find one!`)
  }
}
