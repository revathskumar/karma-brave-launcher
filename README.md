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
  });
}
```

You can pass list of browsers as a CLI argument too:

```bash
$ karma start --browsers Brave
```

### CustomLaunchers

Karma allows you to pass other configuration options to the browser launchers.  You do this something like the following:

```
module.exports = function(config) {
  config.set({
    browsers: [ 'MyEpicBraveVariation' ],
    customLaunchers: {
      MyEpicBraveVariation: {
        base: 'Brave',
        dataDir: '/some/path',
        flags: '--some-option=thing',
        startupSettings: {
          settings: {
            'general.check-default-on-startup': false
          },
          someSetting: {
          }
        }
      }
    }
  });
} 
```

That is, you tell Karma to use the MyEpicBraveVersion "browser".  This, in turn, is defined in the configuration file as the base browser launcher (this one) with some addional configuration options.

At this time, the Brave launcher supports three configuration options:

* `dataDir`: The path to the location that the browser should store its data in. You should use this if you wanted to preserve state across testing sessions.  By default, this launcher will create a temporary directory for each run.
* `flags`: Specify any command line flags.  These are in addition to the `--user-data-dir` and the URL to launch.
* startupSettings: A JavaScript object that should be used to seed the Brave session store file (`${dataDir}/session-store-1`). By default, this launcher uses this to keep the Brave window from being full screen, and not checking if Brave is the default browser at startup time. Note: This is not a "public" interface in Brave, so naturally these settings may break between releases.

## References

For more information on Karma see the [homepage](http://karma-runner.github.com)