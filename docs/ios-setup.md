# Fame Life — iOS App Setup (Phase 1)

## Architecture

Fame Life is a **Next.js static web app** wrapped in a native iOS shell using **Capacitor**.

```
Next.js (React 19)  -->  Static Export (out/)  -->  Capacitor  -->  iOS WKWebView App
```

**Why Capacitor?**
- Zero rewrite — the existing Next.js codebase runs as-is inside a WKWebView
- Native iOS project (Xcode/Swift) for full App Store submission support
- Easy to add native plugins later (ads, in-app purchases, push notifications)
- Active ecosystem with first-party and community plugins
- Simple build pipeline: `npm run build` -> `cap sync` -> Xcode archive

## Project Structure

```
influencer-life-sim/
  src/                    # Next.js app source
  out/                    # Static build output (git-ignored)
  ios/                    # Native iOS project
    App/
      App/
        AppDelegate.swift # Native entry point
        Info.plist        # iOS app configuration
        public/           # Web assets (copied by cap sync, git-ignored)
      App.xcodeproj       # Xcode project
  capacitor.config.ts     # Capacitor configuration
  next.config.ts          # Next.js config (output: "export")
```

## Prerequisites

- **Node.js** 20+ and npm
- **Xcode** 15+ (free from Mac App Store)
- **Apple Developer Account** ($99/year) — required for device testing and App Store
- **CocoaPods** — `sudo gem install cocoapods` (if using native pods later)

## How to Build & Run

### Web Development (browser)
```bash
npm run dev          # Start dev server at localhost:3000
```

### Build for iOS
```bash
npm run build:ios    # Builds Next.js static export + syncs to iOS project
npm run open:ios     # Opens the Xcode project
```

Or step by step:
```bash
npm run build        # Static export to out/
npx cap sync ios     # Copy web assets + update native plugins
npx cap open ios     # Open in Xcode
```

### Run on Simulator
1. `npm run build:ios`
2. `npm run open:ios`
3. In Xcode, select a simulator (e.g., iPhone 16)
4. Press Cmd+R to build and run

### Run on Physical Device
1. Open Xcode project (`npm run open:ios`)
2. Select your device as the build target
3. Under Signing & Capabilities, select your Apple Developer team
4. Press Cmd+R

### Live Reload During Development
1. Start the dev server: `npm run dev`
2. In `capacitor.config.ts`, uncomment the server URL:
   ```ts
   server: {
     url: "http://YOUR_LOCAL_IP:3000",
   }
   ```
3. Run on device/simulator — it will load from the dev server
4. **Remember to comment it back out before building for release**

## App Configuration

| Setting | Value | Location |
|---------|-------|----------|
| App Name | Fame Life | `capacitor.config.ts` / `Info.plist` |
| Bundle ID | `com.uptap.famelife` | `capacitor.config.ts` |
| Orientation | Portrait only | `Info.plist` |
| Min iOS | 16.0 (Capacitor default) | Xcode project settings |

## What's Included in Phase 1

- [x] Dead code cleanup (orphaned extend-offer.tsx removed)
- [x] Build passes (`npm run lint` + `npm run build` clean)
- [x] Next.js configured for static export
- [x] Capacitor installed and iOS project generated
- [x] Web assets sync to native project
- [x] Web Audio hardened for WKWebView (null-safe AudioContext)
- [x] Safe area CSS already handled (`env(safe-area-inset-*)`)
- [x] Portrait-only orientation lock
- [x] ESLint configured to ignore native project files
- [x] Convenience npm scripts (`build:ios`, `open:ios`)

## What's Still Needed Before App Store Submission

### Required
- [ ] **Apple Developer Account** — enroll at developer.apple.com ($99/year)
- [x] **App Icons** — 1024x1024 master icon at `assets/app-icon-1024.png`; AppIcon.appiconset configured
- [ ] **Launch Screen** — still default Capacitor splash; replace with branded art before submission
- [x] **Screenshots** — 6.7" + 6.5" + iPad 11" + iPad 13" generated in `assets/screenshots/`
- [x] **Privacy Policy URL** — <https://www.uptap.com/p/privacy-policy/>
- [x] **Support URL** — <https://www.uptap.com>
- [ ] **App Store Connect metadata** — description, keywords, category, age rating

### Phase 2: Monetization (AppLovin MAX)
- [ ] AppLovin MAX SDK integration via custom Capacitor plugin
- [ ] App Tracking Transparency (ATT) prompt
- [ ] SKAdNetwork IDs in Info.plist
- [ ] Ad unit IDs (banner, interstitial, rewarded)
- [ ] Privacy manifest / nutrition labels for ads

### Phase 3: Polish
- [ ] Custom app icon
- [ ] Custom splash/launch screen
- [ ] Push notification support (optional)
- [ ] Analytics (optional)
- [ ] In-app purchases (optional)
- [ ] TestFlight beta distribution
