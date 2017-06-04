# karma-brave-launcher
Launcher for [Brave](https://brave.com/)

> NOTE: Windows support is not very good at the moment (meaning, very poor). Pull requests or pointers to docs to address this are welcomed.

## Installation

The easiest way is to keep `karma-brave-launcher` as a devDependency in your `package.json`,
by running

```bash
$ npm install --save-dev karma-brave-launcher
```

## Configuration

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['Brave']
  })
}
```

You can pass list of browsers as a CLI argument too:

```bash
$ karma start --browsers Brave
```


## References

For more information on Karma see the [homepage](http://karma-runner.github.com)