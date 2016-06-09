'use strict';

module.exports = (function() {
  let winston = require('winston'),
    logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({ colorize: true, handleExceptions: true }),
        new (winston.transports.File)({ filename:  __dirname + '/../node.log', handleExceptions: true  })
      ]
    });

  return logger;
})();
