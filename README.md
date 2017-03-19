# update-readme
Quickly generate or update your project's README.md


<!-- BADGES/ -->



<!-- /BADGES -->


## To test it out

```sh
git clone https://github.com/update-doc/update-doc-license
cd update-doc-license
npm install
npm link
cd ..
git clone https://github.com/update-doc/update-doc
cd update-doc
npm install
npm link update-doc-license
npm run watchify &
node update-doc-cli.js -p license README.md
```

Try changing the value of 'license' in the package.json file and rerunning it.

## Installation

## Usage concept

It uses a browserify-like syntax for plugins. Something like...

```json
"scripts": {
  "readme": "update-readme -p title -p license README.md",
  "license": "update-readme -p full-license LICENSE.md",
  "history": "update-readme -p git-history-file HISTORY.md",
  "update": "npm run readme; npm run license; npm run history"
}
```

We can literally use the browserify arg parser. Because @substack is awesome like that.

## CLI usage

The command line API is intentionally similar to that of browserify or babel.

```sh
update-doc -p name-and-description -p [ license --plugin-option=foobar --use-things ] README.md
```

## JavaScript API

The JS API is intentionally similar to that of browserify or babel.

```js
const updateDoc = require('update-doc')
let command = updateDoc({
  plugins: [
    'update-doc-name-and-description',
    ['update-doc-license', {'plugin-option': 'foobar', 'use-things': true}]
  ]
})
command('README.md').then(() => {
  console.log('README.md has been updated.')
})
```

## Plugin Authoring for 0.0.x

Plugins can be either global or for a particular section.
Sections are identified by their title. So for instance, a plugin that
generates the license section of a README might look like this:

```js
// basic license plugin
const path = require('path')
/**
 * @param {Section} section - Represents a section of the Markdown document (see details below)
 * @param {object} pluginOptions - Options passed to only your plugin
 * @param {object} globalOptions - Options passed to every plugin
 * @return {Promise} - Asynchronous plugins must return a promise that resolves when the plugin is done. (Synchronous plugins do not need to return anything.)
 */
module.exports = function (section, pluginOptions, globalOptions) {
  let pkg = require(path.join(process.cwd(), 'package.json'))
  
  section.body = [
    '',
    'Copyright ' + pkg.author,
    'License: ' pkg.license
  ]
}
/** Register this module to operate on sections that have this title.
 * (titles are lowercased and trimmed before comparison)
 * If no title is provided, that means the plugin is global and will
 * be handed the root section.
 */
module.exports.title = 'License'
```

### Sections
`update-doc` works by parsing a Markdown file into sections. Each section
has a `title` that is a single line of text and a `body` that is an array of lines of text.
Sections also have a `level` which indicates the number of `#` at the front of the title.
E.g. `## Getting Started` is a level 2 header, `### foo` is a level 3 header, and
so on. Right now the level information isn't used for anything.

Here's an example of how `update-doc` would parse this Markdown:

    # my-module
    This is the best module ever.

    ## Installation

    Pay careful attention...


is represented by a section looking like this:

```js
{
  parent: null,
  level: 1,
  title: ' my-module',
  body: [
    'This is the best module ever.',
    ''
  ],
  subsections: [
    {
      parent: null,
      level: 2,
      title: ' Installation',
      body: [
        '',
        'Pay careful attention...'
      ]
      subsections: [],
    }
  ]
}
```

### Naming

Plugins can be named whatever you want, however if you publish the plugin
the name needs to start with `update-doc-` or it won't work with the command line
`update-doc` tool, which prepends `update-doc-` to the name of plugins to know
what module to use.

You can write a plugin specific to your project though, and use it via the
JavaScript API, since plugin names have to be fully spelled out there.

## License

Copyright 2017 William Hilton <wmhilton@gmail.com>.
Licensed under [The Unlicense](http://unlicense.org/).
