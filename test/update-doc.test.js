// import test from 'ava'
const util = require('util')
const parse = require('../parser')
const render = require('../render')

const README = `
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
`

// test('parse', t => {
let tree = parse(README)
  console.log(util.inspect(tree, {depth: 10}))
  console.log('>' + render(tree) + '<')
  // t.ok()
// })
