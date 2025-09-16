const { minikitConfig } = require('./minikit.config.js');
const { withValidManifest } = require('./staticfruit-mini-app/node_modules/@coinbase/onchainkit/dist/minikit/utils/manifestUtils.js');

console.log(JSON.stringify(withValidManifest(minikitConfig), null, 2));