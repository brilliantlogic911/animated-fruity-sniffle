const { withValidManifest } = require('./staticfruit-mini-app/node_modules/@coinbase/onchainkit/dist/minikit/utils/manifestUtils.js');

const manifest = {
  accountAssociation: {
    header: "eyJmaWQiOjEyMzAzOTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0NTFEODllMjBmZjNBZjIwRjUwNzJDQUI4NDFFZGZENDlERTY5RTBBIn0",
    payload: "eyJkb21haW4iOiJzdGF0aWNmcnVpdC1taW5pLWx4Y256cnEyeS10aW5hLXNoYXdzLXByb2plY3RzLTI5ZTJlMTIxLnZlcmNlbC5hcHAifQ",
    signature: "MHgxZTk3MGJhNjExNzAwODJiMDQ4ZjcyZTNlNDZmZThlZTFjNWZhYjFkNGFiYjExODE0NjI1ZDAyYzc4ZDZmMzEyNTM0YjNhNTJjN2ZiNmQ4OTI1YjliODRiNzI2YmU1MmIyMTFlYjVjZjM5YzNiM2E3Y2VmNTE5YjFjMmMyOGM0YjFj"
  },
  frame: {
    version: "1",
    name: "staticfruit-mini-app",
    subtitle: "",
    description: "",
    screenshotUrls: [],
    iconUrl: "https://staticfruit-mini-lxcnzrq2y-tina-shaws-projects-29e2e121.vercel.app/icon.png",
    splashImageUrl: "https://staticfruit-mini-lxcnzrq2y-tina-shaws-projects-29e2e121.vercel.app/splash.png",
    splashBackgroundColor: "#000000",
    homeUrl: "https://staticfruit-mini-lxcnzrq2y-tina-shaws-projects-29e2e121.vercel.app",
    webhookUrl: "https://staticfruit-mini-lxcnzrq2y-tina-shaws-projects-29e2e121.vercel.app/api/webhook",
    primaryCategory: "utility",
    tags: [],
    heroImageUrl: "https://staticfruit-mini-lxcnzrq2y-tina-shaws-projects-29e2e121.vercel.app/hero.png",
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "https://staticfruit-mini-lxcnzrq2y-tina-shaws-projects-29e2e121.vercel.app/hero.png",
    noindex: true,
    baseBuilder: {
      allowedAddresses: ["0x9C053E44DDB483689cC70f63D5e0d7dE9be90d71"]
    }
  }
};

console.log(JSON.stringify(withValidManifest(manifest), null, 2));