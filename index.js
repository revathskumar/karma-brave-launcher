var fs = require('fs');
var path = require('path');
var which = require('which');

var WINDOWS_EXE_DIRS = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']];
var WINDOWS_SUBPATH = '\\brave\\Brave.exe';
var DARWIN_SUBPATHS = [
  'Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  'Applications/Brave.app/Contents/MacOS/Brave',
];

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
function getPathToBraveOnDarwin() {
  if (process.platform !== 'darwin') {
    return;
  }

  return DARWIN_SUBPATHS
    .reduce(function (paths, DARWIN_SUBPATH) {
      paths.push(path.join('/', DARWIN_SUBPATH), path.join(process.env.HOME, DARWIN_SUBPATH));
      return paths;
    }, [])
    .find(function(fullPath) {
      return fs.existsSync(fullPath);
    });
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

function BraveBrowser(baseBrowserDecorator, args) {
  baseBrowserDecorator(this);

  var flags = args.flags || [];
  var userDataDir = args.dataDir || this._tempDir;
  var startupSettings = args.startupSettings || {
      settings: {
        'general.check-default-on-startup': false
      },
      // While we are here, don't start it full screen
      defaultWindowParams: {
        width: 512,
        height: 512,
        x: 0,
        y: 0
      }
    };

  //
  // Do the rather fragile task of "configuring" Brave by putting values
  // into its session store. As this is not a public API, it is likely to
  // break between releases!
  //
  var sessionFilePath = path.join(userDataDir, 'session-store-1');

  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir);
  }

  if (!fs.existsSync(sessionFilePath)) {
    fs.writeFileSync(sessionFilePath, JSON.stringify(startupSettings));
  }

  this._getOptions = function(url) {
    return flags.concat([
      '--user-data-dir=' + userDataDir,
      '--',
      url,
    ]);
  };
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
