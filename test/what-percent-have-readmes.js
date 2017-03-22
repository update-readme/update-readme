'use strict'
if (process.platform === 'win32') {
  process.env.TERM = 'windows-ansi'
}
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const screen = blessed.screen()
// eslint-disable-next-line
const grid = new contrib.grid({rows: 3, cols: 3, screen: screen})

const gauge = grid.set(0, 0, 1, 1, contrib.gauge, {
  label: 'Progress', stroke: 'green', fill: 'white'
})

const donut = grid.set(0, 1, 1, 1, contrib.donut, {
  label: 'READMEs',
  radius: 10,
  arcWidth: 4,
  remainColor: [0, 255, 255],
  yPadding: 2,
  data: []
})

const line = grid.set(0, 2, 1, 1, contrib.line, {
  label: 'How long are READMEs? (log10)'
})

var bar = grid.set(1, 0, 1, 1, contrib.bar, {
  label: 'Raw stats',
  barWidth: 10,
  barSpacing: 6,
  xOffset: 2,
  maxHeight: 9
})

var log = grid.set(1, 1, 1, 1, contrib.log, {
  fg: 'green',
  label: 'One-line READMEs'
})

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

// --------------------

const registry = require('package-stream')()
let haves = 0
let total = 0

let lengths = []
let max = 0
let min = Infinity
function measure (readme) {
  let len = (readme.split('\n') || []).length
  lengths.push(len)
  max = Math.max(max, len)
  min = Math.min(min, len)
}

const tooShort = (readme) => !readme || (!readme.includes('\n') && !readme.includes('\n') && readme.length < 50)
const notReadme = (readme) => !readme || typeof readme !== 'string' || ['ERROR: No README file found!', 'ERROR: No README data found!', 'ERROR: No README.md file found!'].includes(readme)

registry.on('package', (pkg) => {
  total++
  if (notReadme(pkg.readme)) return
  if (tooShort(pkg.readme)) log.log(pkg.readme)
  measure(pkg.readme)
  haves++
})
registry.on('end', () => {
  console.log(`${haves} / ${total}`)
  console.log('percent =', (100 * haves / total).toFixed(2))
  process.stderr.write('DONE\n')
  process.exit(0)
})

setInterval(function () {
  // Percent complete of test
  gauge.setPercent((total / 400000).toFixed(0))
  bar.setData({
    titles: ['total', 'haves'],
    data: [total, haves]
  })
  // What percent have readmes
  donut.setData([{
    percent: (100 * haves / total).toFixed(1),
    label: 'have',
    color: 'blue'
  }])
  // What's the length distribution
  let {x, y} = whyyyyHistogram(lengths)
  line.setData([{
    title: 'Length distribution',
    x,
    y,
    style: {
      line: 'red'
    }
  }])
  screen.render()
}, 1000)

function whyyyyHistogram (data) {
  data.sort((a, b) => a - b)
  let width = Math.floor(data.length / 10) + 1
  let x = []
  let y = []
  for (let i = data.length - 1; i > 0; i -= width) {
    x.unshift(Math.floor(i * 100 / data.length) + '%')
    y.unshift(Math.log10(data[i]))
  }
  return {x, y}
}
