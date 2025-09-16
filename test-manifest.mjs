import { minikitConfig } from './minikit.config.js';
import { withValidManifest } from './staticfruit-mini-app/node_modules/@coinbase/onchainkit/dist/minikit/utils/manifestUtils.js';

console.log(JSON.stringify(withValidManifest(minikitConfig), null, 2));