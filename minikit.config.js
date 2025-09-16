"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minikitConfig = void 0;
var ROOT_URL = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || "https://staticfruit-mini-lxcnzrq2y-tina-shaws-projects-29e2e121.vercel.app";
/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
exports.minikitConfig = {
    accountAssociation: {
        header: process.env.FARCASTER_HEADER || "",
        payload: process.env.FARCASTER_PAYLOAD || "",
        signature: process.env.FARCASTER_SIGNATURE || "",
    },
    frame: {
        version: "1",
        name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "staticfruit-mini-app",
        subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE || "",
        description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "",
        screenshotUrls: [],
        iconUrl: process.env.NEXT_PUBLIC_APP_ICON || "".concat(ROOT_URL, "/icon.png"),
        splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || "".concat(ROOT_URL, "/splash.png"),
        splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#000000",
        homeUrl: ROOT_URL,
        webhookUrl: "".concat(ROOT_URL, "/api/webhook"),
        primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY || "utility",
        tags: [],
        heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || "".concat(ROOT_URL, "/hero.png"),
        tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "",
        ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE || "",
        ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION || "",
        ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE || "".concat(ROOT_URL, "/hero.png"),
        noindex: true,
        baseBuilder: {
            allowedAddresses: ["0x9C053E44DDB483689cC70f63D5e0d7dE9be90d71"]
        },
    },
};
