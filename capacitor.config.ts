import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.uptap.famelife",
  appName: "Fame Life",
  webDir: "out",
  server: {
    // In production, content is served from the local bundle.
    // Uncomment the line below during development to load from the dev server:
    // url: "http://localhost:3000",
  },
  ios: {
    contentInset: "always",
    allowsLinkPreview: false,
    // scrollEnabled MUST be true for content-driven layouts. Setting it false
    // disables ALL WebView vertical scroll on iOS — including legitimate scroll
    // when content overflows the viewport. The game screen, shop panel, and
    // event card flows all rely on native scrolling.
    scrollEnabled: true,
    backgroundColor: "#764ba2",
    preferredContentMode: "mobile",
  },
};

export default config;
