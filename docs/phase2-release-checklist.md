# Fame Life — App Store Submission Checklist

## Current Repo State

Everything below marked with ✅ is **implemented in code** and committed.
Items marked with 🔧 require **your manual action** (dashboard, credentials, or local install).

> **📍 Live submission state**: Most of this checklist is already **done**.
> See [`submission-state.md`](submission-state.md) for the current snapshot
> (App IDs, what's configured, what's still blocking). Most App Store Connect
> + Game Center work listed below is complete: all 31 achievements, the
> leaderboard, metadata, screenshots, privacy URL, review contact are all set.

> **💡 Automation**: Remaining App Store Connect steps can be scripted via
> [`asc-cli`](https://github.com/tddworks/asc-cli) — see
> [`asc-cli-workflow.md`](asc-cli-workflow.md). asc-cli is already installed
> and authenticated at `~/.asc/credentials.json`.

---

## What's Implemented in Code ✅

### Monetization (AppLovin MAX)
- ✅ **Ad formats**: Interstitial (between turns, every 3 turns) + Rewarded Video (user-initiated boosts)
- ✅ **No banners** — doesn't fit the card-based UI, low eCPM
- ✅ **Clean abstraction**: All ad logic lives in `src/lib/native/ads.ts`
- ✅ **Graceful degradation**: Ads fail silently; game is fully playable without them
- ✅ **Conditional SDK**: Swift plugin uses `#if canImport(AppLovinSDK)` — compiles and runs with or without the SDK installed
- ✅ **Frequency cap**: Interstitials capped at every 3 turns (configurable in `config.ts`)
- ✅ **Remove Ads ready**: `ADS_ENABLED` flag can be toggled by future IAP
- ✅ **Credential validation**: Detects placeholder/missing keys and skips init gracefully

### Game Center Achievements
- ✅ **22 milestone achievements** mapped from in-game milestones
- ✅ **9 badge achievements** mapped from cross-run badges
- ✅ **1 leaderboard** for fame score
- ✅ **Auto-reporting**: Milestones report to Game Center as they're earned
- ✅ **End-of-run reporting**: Badges + fame score reported when a run completes
- ✅ **Native UI**: `showAchievementsUI()` and `showLeaderboardsUI()` available
- ✅ **Entitlements**: `App.entitlements` with `com.apple.developer.game-center` capability
- ✅ **Xcode project wired**: Entitlements file referenced in `CODE_SIGN_ENTITLEMENTS` build setting

### Privacy & Compliance
- ✅ **App Tracking Transparency** prompt via native Swift plugin
- ✅ **NSUserTrackingUsageDescription** in Info.plist
- ✅ **SKAdNetwork IDs** for AppLovin (9 primary IDs)
- ✅ **Consent flow**: ATT → Ad init (correct order per Apple/AppLovin docs)
- ✅ **PrivacyInfo.xcprivacy** privacy manifest with:
  - `NSPrivacyTracking = true` (IDFA for ad personalization)
  - `NSPrivacyCollectedDataTypes`: Device ID for third-party advertising
  - `NSPrivacyAccessedAPITypes`: UserDefaults (reason CA92.1 — app-exclusive data)

### Native iOS Project
- ✅ **3 Swift plugins** registered in Xcode project:
  - `AdsPlugin.swift` — AppLovin MAX bridge (conditional SDK import)
  - `GameCenterPlugin.swift` ��� GameKit achievements/leaderboards bridge
  - `PrivacyPlugin.swift` — ATT prompt bridge
- ✅ **All plugins in Xcode Sources build phase** (compile correctly)
- ✅ **Info.plist** configured:
  - `arm64` in UIRequiredDeviceCapabilities (correct for iOS 15+)
  - Portrait-only orientation
  - ATT usage description
  - AppLovin SDK key placeholder
  - SKAdNetwork IDs
- ✅ **Podfile** for AppLovin MAX SDK via CocoaPods
- ✅ **Capacitor 8.3** with SPM for core + plugins

### Storage & Persistence
- ✅ **Capacitor Preferences** (UserDefaults on iOS) as primary storage
- ✅ **localStorage fallback** for web/dev
- ✅ **Auto-migration**: First launch migrates existing localStorage data to Preferences

### Lifecycle & Reliability
- ✅ **Capacitor App plugin** for suspend/resume events
- ✅ **Audio recovery**: AudioContext resumes on foreground
- ✅ **Offline-first**: All gameplay works without network

### Analytics / Observability
- ✅ **Lightweight custom service** with breadcrumb trail + error capture
- ✅ **Ad observability**: Load/show/reward/error events tracked
- ✅ **Game Center observability**: Auth/achievement/score errors tracked
- ✅ **Pluggable**: Shaped for easy Sentry swap-in later

---

## Architecture

```
src/lib/native/
  index.ts          — Barrel export + initNativeServices() orchestration
  platform.ts       — Capacitor/web detection
  config.ts         — All SDK keys, ad unit IDs, feature flags (env-based)
  ads.ts            — AppLovin MAX abstraction
  achievements.ts   — Game Center achievement/leaderboard bridge
  privacy.ts        — ATT prompt bridge
  storage.ts        — Durable storage (Preferences + localStorage)
  lifecycle.ts      — App suspend/resume
  analytics.ts      — Error + event tracking

ios/App/App/
  AppDelegate.swift         — Standard Capacitor app delegate
  App.entitlements           — Game Center capability
  PrivacyInfo.xcprivacy      — Apple privacy manifest
  Info.plist                 — App configuration

ios/App/App/Plugins/
  AdsPlugin.swift            — MAX native bridge (conditional SDK import)
  GameCenterPlugin.swift     — GameKit native bridge
  PrivacyPlugin.swift        — ATT native bridge
```

### Initialization Order (in `initNativeServices()`)
1. Lifecycle listeners (sync)
2. Audio resume handler (sync)
3. Game Center authenticate (async, non-blocking)
4. ATT prompt (async, blocks ads only)
5. Ad SDK initialize (async, after ATT)

---

## 🔧 Manual Steps Required

### Step 1: Apple Developer Account
- [ ] Enroll at [developer.apple.com](https://developer.apple.com) ($99/year)
- [ ] Accept all agreements in App Store Connect

### Step 2: AppLovin MAX Account & Credentials
- [ ] Create account at [dash.applovin.com](https://dash.applovin.com)
- [ ] Add app: iOS, bundle ID `com.uptap.famelife`
- [ ] Create ad units:
  - Interstitial ad unit
  - Rewarded video ad unit
- [ ] Copy your credentials and set them:

| Credential | Where to set | How to get |
|---|---|---|
| SDK Key | `ios/App/App/Info.plist` → `AppLovinSdkKey` (replace `YOUR_APPLOVIN_SDK_KEY`) | AppLovin Dashboard → Account → Keys |
| SDK Key | `.env.local` → `NEXT_PUBLIC_APPLOVIN_SDK_KEY` | Same key |
| Interstitial Ad Unit ID | `.env.local` → `NEXT_PUBLIC_AD_UNIT_INTERSTITIAL` | AppLovin Dashboard → MAX → Ad Units |
| Rewarded Ad Unit ID | `.env.local` → `NEXT_PUBLIC_AD_UNIT_REWARDED` | AppLovin Dashboard → MAX → Ad Units |

Create `.env.local` in the project root (never committed):
```bash
NEXT_PUBLIC_APPLOVIN_SDK_KEY=your_sdk_key_here
NEXT_PUBLIC_AD_UNIT_INTERSTITIAL=your_interstitial_unit_id
NEXT_PUBLIC_AD_UNIT_REWARDED=your_rewarded_unit_id
NEXT_PUBLIC_ADS_ENABLED=true
```

### Step 3: Local iOS Build Setup
```bash
# One-command setup (installs npm deps, builds web, syncs Capacitor, installs pods)
npm run setup:ios

# Or step by step:
npm install
npm run build
npx cap sync ios
cd ios/App && pod install && cd ../..

# IMPORTANT: Always open the workspace, not the project
open ios/App/App.xcworkspace
```

### Step 4: Xcode Configuration
- [ ] Open `ios/App/App.xcworkspace` in Xcode
- [ ] Select your **Development Team** in Signing & Capabilities
- [ ] **Add Game Center capability** in Signing & Capabilities (this registers the entitlement with Apple's provisioning)
- [ ] Verify bundle ID: `com.uptap.famelife`
- [ ] Build and run on a **physical device** (Game Center + ads don't work in Simulator)

### Step 5: App Store Connect — App Setup
- [ ] Create new app: "Fame Life", bundle ID `com.uptap.famelife`
- [ ] Set category: Games → Simulation
- [ ] Set age rating (complete questionnaire)
- [ ] Set pricing: Free (with ads)
- [ ] Add Privacy Policy URL → `https://www.uptap.com/p/privacy-policy/`
- [ ] Add Support URL → `https://www.uptap.com`

### Step 6: Game Center — Create Achievements

In App Store Connect → Your App → Services → Game Center → Achievements, create each:

**Milestone Achievements (22):**

| Achievement ID | Title | Points | Hidden |
|---|---|---|---|
| `com.uptap.famelife.achievement.first_10k` | 10K Club | 10 | No |
| `com.uptap.famelife.achievement.first_100k` | 100K Creator | 25 | No |
| `com.uptap.famelife.achievement.half_million` | Half a Million | 50 | No |
| `com.uptap.famelife.achievement.first_1m` | Millionaire (Followers) | 100 | No |
| `com.uptap.famelife.achievement.rich` | Cashed Out | 25 | No |
| `com.uptap.famelife.achievement.quarter_mil` | Quarter Millionaire | 50 | No |
| `com.uptap.famelife.achievement.millionaire_money` | Actual Millionaire | 100 | No |
| `com.uptap.famelife.achievement.first_brand_deal` | First Bag | 10 | No |
| `com.uptap.famelife.achievement.first_scandal` | First Scandal | 10 | No |
| `com.uptap.famelife.achievement.first_celebrity_event` | Celebrity Status | 10 | No |
| `com.uptap.famelife.achievement.burnout_survivor` | Burnout Survivor | 25 | Yes |
| `com.uptap.famelife.achievement.triple_scandal` | Teflon Creator | 50 | Yes |
| `com.uptap.famelife.achievement.viral_king` | Viral Machine | 50 | No |
| `com.uptap.famelife.achievement.comeback_kid` | Comeback Kid | 25 | Yes |
| `com.uptap.famelife.achievement.empire_builder` | Empire Builder | 50 | No |
| `com.uptap.famelife.achievement.managed_talent` | Managed Talent | 10 | No |
| `com.uptap.famelife.achievement.first_purchase` | First Upgrade | 10 | No |
| `com.uptap.famelife.achievement.luxury_life` | Luxury Life | 50 | No |
| `com.uptap.famelife.achievement.business_mogul` | Business Mogul | 100 | No |
| `com.uptap.famelife.achievement.charity_hero` | Charity Hero | 25 | Yes |
| `com.uptap.famelife.achievement.feud_starter` | Drama Starter | 10 | Yes |
| `com.uptap.famelife.achievement.industry_respect` | Industry Respected | 25 | No |

**Badge Achievements (9):**

| Achievement ID | Title | Points | Hidden |
|---|---|---|---|
| `com.uptap.famelife.achievement.global_icon` | Global Icon | 100 | No |
| `com.uptap.famelife.achievement.millionaire_badge` | Millionaire | 100 | No |
| `com.uptap.famelife.achievement.chaos_agent` | Chaos Agent | 50 | Yes |
| `com.uptap.famelife.achievement.empire_builder_badge` | Empire Builder (Full) | 100 | No |
| `com.uptap.famelife.achievement.comeback_monarch` | Comeback Monarch | 50 | Yes |
| `com.uptap.famelife.achievement.fame_life` | Fame Life | 100 | No |
| `com.uptap.famelife.achievement.speed_runner` | Speed Runner | 100 | Yes |
| `com.uptap.famelife.achievement.hall_of_fame` | Hall of Fame | 50 | No |
| `com.uptap.famelife.achievement.veteran` | Veteran | 25 | No |

### Step 7: Game Center — Create Leaderboard
- [ ] Create leaderboard: ID `com.uptap.famelife.leaderboard.fame_score`
- [ ] Title: "Fame Score"
- [ ] Score format: Integer (0-1000)
- [ ] Sort order: High to Low

### Step 8: Privacy & Compliance
- [ ] Privacy Policy URL set in App Store Connect → `https://www.uptap.com/p/privacy-policy/`
- [ ] Privacy Nutrition Labels completed:
  - **Data Used to Track You**: Device ID (via IDFA, if ATT authorized)
  - **Data Linked to You**: None (no accounts)
  - **Data Not Linked to You**: Game progress (UserDefaults)
- [ ] NSUserTrackingUsageDescription string review (currently: "Fame Life uses this to show you relevant ads and support free gameplay.")

### Step 9: App Store Assets
- [ ] **App Icon**: 1024x1024 PNG (no alpha, no rounded corners)
- [ ] **Screenshots** (required sizes):
  - 6.7" (iPhone 16 Pro Max / 15 Pro Max): 1290 x 2796
  - 6.5" (iPhone 14 Plus / 13 Pro Max): 1284 x 2778
  - 5.5" (iPhone 8 Plus): 1242 x 2208
- [ ] **App description** (max 4000 chars)
- [ ] **Subtitle** (max 30 chars)
- [ ] **Keywords** (max 100 chars)
- [ ] **What's New** text
- [ ] **Support URL**
- [ ] **Privacy Policy URL**
- [ ] **Launch screen** updated from Capacitor default

---

## Device Testing Checklist

### Core Gameplay
- [ ] New game starts correctly
- [ ] All 6 archetypes are selectable
- [ ] Activity selection works
- [ ] Events display and choices resolve
- [ ] Shop purchases work
- [ ] Milestones trigger and display
- [ ] Boosts appear and can be accepted/declined
- [ ] Game over screen shows correctly
- [ ] Career Legacy / badges display after run
- [ ] Multiple runs work (legacy persists)

### Persistence
- [ ] Kill app → relaunch → game state restored
- [ ] Background app for 5+ minutes → resume → state intact
- [ ] Complete a run → restart → legacy data preserved
- [ ] Start new game → previous save cleared

### Audio
- [ ] Sounds play on first interaction
- [ ] Sounds resume after backgrounding/foregrounding
- [ ] Silent mode / mute switch respected
- [ ] No audio crashes in any state

### Monetization
- [ ] ATT prompt appears on first launch (iOS 14+)
- [ ] Interstitial shows between turns (not on first turn)
- [ ] Rewarded ad offer appears (boost modal)
- [ ] Rewarded ad grants boost on completion
- [ ] Declining rewarded ad works correctly
- [ ] Game works correctly when ads fail to load
- [ ] Game works correctly with no network

### Game Center
- [ ] Game Center welcome banner shows on launch (if signed in)
- [ ] Milestones report as achievements
- [ ] Fame score appears on leaderboard after run
- [ ] `showAchievementsUI()` opens native view
- [ ] Game works if user is NOT signed into Game Center

### Privacy
- [ ] ATT prompt text is clear and non-deceptive
- [ ] Denying ATT doesn't break any functionality
- [ ] App works correctly if user denies tracking

---

## Build & Submit

### Pre-Submission Checks
1. [ ] All credentials configured (AppLovin SDK key + ad unit IDs in `.env.local` AND Info.plist)
2. [ ] `npm run setup:ios` completed successfully
3. [ ] Device tested on physical iPhone
4. [ ] All test checklist items pass
5. [ ] Privacy nutrition labels completed in App Store Connect
6. [ ] App icon and screenshots uploaded
7. [ ] App description and metadata complete

### Build Commands
```bash
# Rebuild web + sync to native
npm run build:ios

# Open in Xcode
open ios/App/App.xcworkspace
```

### Archive & Upload (in Xcode)
1. [ ] Select "Any iOS Device" as build target
2. [ ] Product → Archive
3. [ ] Distribute App → App Store Connect
4. [ ] Upload dSYM symbols for crash reporting
5. [ ] In App Store Connect: select build, submit for review

### Post-Submission
- [ ] Monitor review status in App Store Connect
- [ ] Prepare response for reviewer questions (ad monetization, tracking)
- [ ] Verify Game Center achievements work in TestFlight
- [ ] Verify ad serving in TestFlight

---

## Blocking Items Before Submission

These items **must** be completed before you can submit to the App Store:

| # | Item | Type | Status |
|---|---|---|---|
| 1 | Apple Developer account ($99/year) | Account | 🔧 Required |
| 2 | AppLovin SDK key in Info.plist + .env.local | Credential | 🔧 Required |
| 3 | AppLovin ad unit IDs in .env.local | Credential | 🔧 Required |
| 4 | `pod install` (installs AppLovin SDK) | Local install | ���� Required |
| 5 | Xcode signing team selected | Local config | 🔧 Required |
| 6 | Game Center capability added in Xcode | Local config | 🔧 Required |
| 7 | App Store Connect app created | Dashboard | 🔧 Required |
| 8 | Game Center achievements created (31 total) | Dashboard | 🔧 Required |
| 9 | Game Center leaderboard created | Dashboard | �� Required |
| 10 | Privacy Policy URL | Content | 🔧 Required |
| 11 | App icon (1024x1024) | Asset | 🔧 Required |
| 12 | Screenshots (3 sizes) | Asset | 🔧 Required |
| 13 | App description + metadata | Content | 🔧 Required |
| 14 | Physical device testing | Testing | 🔧 Required |

---

## Future Expansion Notes

### Remove Ads IAP
1. Add StoreKit IAP for "Remove Ads" product
2. On purchase, set `ADS_ENABLED` to false via Preferences
3. All ad code respects the `ADS_ENABLED` flag — no ad code runs when disabled

### Sentry Integration
1. `npm install @sentry/browser`
2. Replace `captureError()` in `analytics.ts` with `Sentry.captureException()`
3. Add `NEXT_PUBLIC_SENTRY_DSN` to `.env.local`

### Firebase Analytics
1. Add `@capacitor-firebase/analytics`
2. Replace `trackEvent()` in `analytics.ts` with Firebase `logEvent()`
3. Add `GoogleService-Info.plist` to the iOS project
