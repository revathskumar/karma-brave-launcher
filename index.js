var fs = require('fs');
var path = require('path');
var which = require('which');

var WINDOWS_EXE_DIRS = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']];
var WINDOWS_SUBPATH = '\\brave\\Brave.exe';
var DARWIN_SUBPATH = 'Applications/Brave.app/Contents/MacOS/Brave';

function getBin(command) {
  if (process.platform !== 'linux') {
    return null;
  }
  try {
    return which.sync(command);
  }
  catch(err){};
}

/*
 * On darwin, try to find the browser at the path, relative to the 
 * user's home directory, otherwise try to find it relative to the
 * root directory
 */
function getPathToBraveOnDarwin(defaultPath) {
  if (process.platform !== 'darwin') {
    return;
  }

  var homePath = path.join(process.env.HOME, DARWIN_SUBPATH);
  var rootPath = path.join('/', DARWIN_SUBPATH);

  return fs.existsSync(homePath) ? homePath : rootPath;
}

/*
 * On Windows, cycle through a set of special app locations, and look for it
 * relative to those
 */
function getPathToBraveOnWindows() {
  if (process.platform !== 'win32') {
    return;
  }

  var windowsBraveDirectory;

  for (var i = 0; i < WINDOWS_EXE_DIRS.length; i++) {
    windowsBraveDirectory = path.join(WINDOWS_EXE_DIRS[i], WINDOWS_SUBPATH);

    if (fs.existsSync(windowsBraveDirectory)) {
      return windowsBraveDirectory;
    }
  }

  return windowsBraveDirectory;
}

function isJSFlags(flag) {
  return flag.indexOf('--js-flags=') === 0;
}

function sanitizeJSFlags(flag) {
  var test = /--js-flags=(['"])/.exec(flag);
  if (!test) {
    return flag;
  }

  var escapeChar = test[1];
  var endExp = new RegExp(escapeChar + '$');
  var startExp = new RegExp('--js-flags=' + escapeChar);
  return flag.replace(startExp, '--js-flags=').replace(endExp, '');
}

function BraveBrowser(baseBrowserDecorator, args) {
  baseBrowserDecorator(this);

  // Blindly do the same option processing that karma-chrome-launcher does
  var flags = args.flags || []
  var userDataDir = args.braveDataDir || this._tempDir

  this._getOptions = function(url) {
    // Chromeium CLI options
    // http://peter.sh/experiments/chromium-command-line-switches/
    flags.forEach(function(flag, i) {
      if (isJSFlags(flag)) {
        flags[i] = sanitizeJSFlags(flag)
      };
    });

    return [
      '--user-data-dir=' + userDataDir,
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-default-apps',
      '--disable-popup-blocking',
      '--disable-translate',
      '--disable-background-timer-throttling'
    ].concat(flags, [url])
  }
}

BraveBrowser.prototype = {
  name: 'Brave',
  DEFAULT_CMD: {
    darwin: getPathToBraveOnDarwin(),
    win32: getPathToBraveOnWindows(),
    linux: getBin('brave')
  },
  ENV_CMD: 'BRAVE_BIN'
}

BraveBrowser.$inject = ['baseBrowserDecorator', 'args'];

module.exports = {
  'launcher:Brave': ['type', BraveBrowser]
};
