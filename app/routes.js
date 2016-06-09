'use strict';

const fs = require('fs');

let routes = (app) => {
  const
    dirName = 'routes',
    ext = /\.js$/,
    dirContents = fs.readdirSync(`${__dirname}/../${dirName}`);

  [].concat(dirContents).forEach(function(methodName) {
    const
      isNotJSFile = !ext.test(methodName),
      isPrivate = process.env.NODE_ENV == 'production' && /^_/.test(methodName);

    if (isNotJSFile || isPrivate) return;

    app.use(
      `/${methodName.replace('index.js', '').replace(ext, '')}`,
      require(`../${dirName}/${methodName}`)
    );
  });
}

module.exports = routes;