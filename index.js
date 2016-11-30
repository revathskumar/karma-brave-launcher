var which = require('which');

var BraveBrowser = function (baseBrowserDecorator, args) {
  baseBrowserDecorator(this);

};

function getBin(command) {
  if (process.platform !== 'linux') {
    return null;
  }
  try {
    return which.sync(command);
  }
  catch(err){};
}

BraveBrowser.prototype = {
  name: 'Brave',
  DEFAULT_CMD: {
    linux: getBin('brave')
  },
  ENV_CMD: 'BRAVE'
}

BraveBrowser.$inject = ['baseBrowserDecorator', 'args'];

module.exports = {
  'launcher:Brave': ['type', BraveBrowser]
}
