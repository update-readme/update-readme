'use strict'
const registry = require('package-stream')()
let haves = 0
let total = 0

registry.on('package', (pkg) => {
  total++
  if (pkg.readme) haves++
  if (total % 1000 === 0) console.log(`${haves} / ${total}    ${(100 * haves / total).toFixed(1)}%`)
})
registry.on('end', () => {
  console.log(`${haves} / ${total}`)
  console.log('percent =', (100 * haves / total).toFixed(2))
  process.stderr.write('DONE\n')
  process.exit(0)
})
