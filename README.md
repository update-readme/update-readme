# update-readme
Quickly generate or update your project's README.md


<!-- BADGES/ -->



<!-- /BADGES -->

## Installation

```
npm install update-readme --save
```

## CLI usage

The command line API is intentionally similar to that of browserify or babel.
Here's an example command demonstrating the plugins currently available:

```sh
update-readme -p name-and-description -p [ license --long ] -p installation
```

## JavaScript API

The JS API is still in flux but I would like it to be similar to babel or browserify.
It is designed to be more explicit in order to be more flexible for developers.
For instance, whereas the CLI prepends `'update-readme-'` to the plugin names,
`'module'` can be any valid string to pass to `require()` including local files
that are project specific.

```
require('update-readme')({
  readme: 'README.md',
  plugins: [
    {
      module: 'update-readme-name-and-description',
      options: {}
    }, {
      module: 'update-readme-license',
      options: { long: true }
    }
  ]
})
.then( ... )
.catch( ... )
```

## Plugin Authoring API

Plugins can be thought of as filters. The README file gets split into
sections by headers (using a regex and assuming headers start with a `#`).
Those sections are passed as an array of Markdown strings to the plugin, which
can then loop through all the sections. Global plugins (for linting, etc) can
operate on every section. However most plugins will compare each section to a
regex and only update the specific section its concerned with. Plugins can also
loop through the sections and see that their section is missing and insert a new
section into the README.

### API

Plugins should export a single function call with the following type signature:

```
/**
 * An update-readme plugin
 * @param  {string[]} sections      - the sections of the README file
 * @param  {object}   pluginOptions - any commandline options passed to the plugin
 * @param  {object}   globalOptions - reserved for global options
 *
 * @return {string[] | Promise(string[])} - the processed Markdown sections
 */
}
```

### Example Plugin

This is an example of a plugin that just updates the copyright year in the License section.

```
export default function CopyrightYear (sections, { year }) {
  year = year || (new Date()).getFullYear()
  for (let n in sections) {
    if (sections[n].match(/^#+\s*License/i)) {
      sections[n] = sections[n].replace(/Copyright \d\d\d\d/g, `Copyright ${year}`)
    }
  }
  return sections
}
```

Example usage:

    update-readme -p copyrightyear

Since the year is an option we can even override it

    update-readme -p [ copyrightyear --year 1997 ]

### Plugin Naming Convention

Plugins can be named whatever you want, however if you publish the plugin
the name needs to start with `update-readme-` or it won't work with the command line
`update-readme` tool, which prepends `update-readme-` to the name of plugins to know
what module to use.

You can write a plugin specific to your project though, and use it via the
JavaScript API, since plugin names have to be fully spelled out there.

## Testing the latest version

```sh
git clone https://github.com/update-readme/update-readme-license
cd update-readme-license
npm install
npm link
cd ..
git clone https://github.com/update-readme/update-readme
cd update-readme
npm install
npm link update-readme-license
npm run build
node dist/bin/update-readme.js -p [ license --long ]
```

Try changing the value of 'license' in the package.json file and rerunning it.

## License

Copyright 2017 William Hilton.
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
