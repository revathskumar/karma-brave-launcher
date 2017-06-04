var fs = require('fs');
var path = require('path');
var which = require('which');

var WINDOWS_EXE_DIRS = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']];
var WINDOWS_SUBPATH = '\\Brave\\Application\\brave.exe';
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
    windowsBraveDirectory = path.join(prefixes[i], WINDOWS_SUBPATH);

    if (fs.existsSync(windowsBraveDirectory)) {
      return windowsBraveDirectory;
    }
  }

  return windowsBraveDirectory;
}

function BraveBrowser(baseBrowserDecorator, args) {
   baseBrowserDecorator(this);
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
