/// <reference types="vite/client" />

// Figma Make asset protocol — resolved by figmaAssetResolver plugin in vite.config.ts
declare module "figma:asset/*.png" {
  const src: string;
  export default src;
}
