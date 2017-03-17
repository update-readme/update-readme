<!-- TITLE/ -->

<h1>UNDER CONSTRUCTION</h1>

<!-- /TITLE -->


<!-- BADGES/ -->



<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Quickly generate or update your project's README, LICENSE, and so on

<!-- /DESCRIPTION -->

## Usage

It uses a browserify-like syntax for plugins. Something like...

```
"scripts": {
  "readme": "update-readme -p title -p license README.md",
  "license": "update-readme -p full-license LICENSE.md",
  "history": "update-readme -p git-history-file HISTORY.md",
  "update": "npm run readme; npm run license; npm run history"
}
```

We can literally use the browserify arg parser. Because @substack is awesome like that.

## Plugin Authoring

We need an API. Preferably an incredibly simple one, like a single function call.

```
// somewhere in update-doc's code, we call a plugin
var updatedMarkdown = plugin(originalMarkdown, pluginOptions, globalOptions) // return a Promise that resolves to Markdown string.
```

Only problem is how do we know which plugins are used with which sections. Off the top of my head, we add a registration property.

```
// somewhere in the plugin's code
module.exports = function (input, options, globalOptions) {
  return Promise.resolve(`type npm install ${require('./package.json').name}`)
}
module.exports.section = 'installation'
```

Is that flexible enough or is that too restrictive?

## License

Copyright 2017 William Hilton <wmhilton@gmail.com>.
Licensed under [The Unlicense](http://unlicense.org/).
