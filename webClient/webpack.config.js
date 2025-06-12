

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

var path = require('path');
var webpackConfig = require('webpack-config');
var CopyWebpackPlugin = require('copy-webpack-plugin');

if (process.env.MVD_DESKTOP_DIR == null) {
  throw new Error('You must specify MVD_DESKTOP_DIR in your environment');
}
var desktopDir = process.env.MVD_DESKTOP_DIR;

var config = {
  'entry': [
    path.resolve(__dirname, './src/index.tsx')
  ],
  'output': {
    'path': path.resolve(__dirname, '../web'),
    'filename': 'main.js',
  },
  'resolve': {
    'extensions': ['.js', '.ts', '.jsx', '.tsx'],
    'alias': {
      'pluginlib': path.resolve(desktopDir, 'src/pluginlib'),
      'zlux-base': path.resolve(__dirname, '../../zlux-platform/base/src'),
      'zlux-interface': path.resolve(__dirname, '../../zlux-platform/interface/src'),
      '~': path.resolve(__dirname, './node_modules/'),
      '@': path.resolve(__dirname),
    },
  },
  'plugins': [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/assets'),
        to: path.resolve('../web/assets')
      }
    ])
  ]
};

module.exports = new webpackConfig.Config()
  .extend(path.resolve(process.env.MVD_DESKTOP_DIR, 'plugin-config/webpack.react.base.js'))
  .merge(config);


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

