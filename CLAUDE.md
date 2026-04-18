# Fame Life — Project Context for Claude Code

> If you are a Claude session working in this repo, read this first.

## What Fame Life is

A Reigns-style single-player card game where the player builds an
influencer career across 10 years (40 quarters). Next.js 16 + React 19 +
TypeScript web app wrapped in a Capacitor 8 iOS shell. Bundle ID
`com.uptap.famelife`, App Store name **Fame Life**.

- **Live Vercel**: https://famelife.vercel.app
- **GitHub**: https://github.com/jamesww23/famelife
- **Privacy Policy**: https://www.uptap.com/p/privacy-policy/
- **Support**: https://www.uptap.com

## 🚨 Read these before suggesting any submission work

The user has **already done most of the App Store submission setup**.
Do NOT walk them through UI steps they've already completed.

- **[`docs/submission-state.md`](docs/submission-state.md)** — authoritative
  snapshot of what's configured in App Store Connect + Game Center. Canonical
  IDs, metadata state, remaining blockers.
- **[`docs/asc-cli-workflow.md`](docs/asc-cli-workflow.md)** — automation
  workflow using `tddworks/asc-cli`. User has credentials set up at
  `~/.asc/credentials.json`; asc-cli is installed at `/usr/local/bin/asc`.

## Key facts (quickref — but always defer to submission-state.md)

- App Store Connect **App ID**: `6762315526`
- **v1.0 Version ID**: `9a0f4a64-161d-4f1f-b439-e6c81a72abe9` (state: PREPARE_FOR_SUBMISSION)
- **Game Center**: all 31 achievements + 1 leaderboard already created
- **Screenshots**: all 4 device-class sets uploaded
- **Metadata**: name, subtitle, description, keywords, URLs, review contact all filled
- **Blocking**: build not uploaded yet. Age rating is 4+ which may not match content.

## Tech stack

- **Frontend**: Next.js 16 (static export to `out/`), React 19, TailwindCSS 4
- **Native**: Capacitor 8 + 3 Swift plugins (AdsPlugin, GameCenterPlugin, PrivacyPlugin)
- **Ads**: AppLovin MAX SDK (pinned `~> 13.6` via CocoaPods)
- **Hosting**: Vercel for web, App Store for iOS
- **Save format**: versioned envelope (`SAVE_VERSION` in `src/lib/game/constants.ts`)

## Directory layout

```
src/app/              Next.js App Router + error boundaries
src/components/game/  Screens and modals
src/components/ui/    shadcn/ui primitives (use sparingly)
src/lib/game/         Pure game engine — no React, no DOM, no native
src/lib/native/       Capacitor bridges (ads/Game Center/ATT/storage) with web fallbacks
src/data/             Game content (events, archetypes, shop, badges, milestones)
src/state/            GameProvider context wrapping the engine
ios/App/              Xcode project + Swift plugins (fully committed)
docs/                 ios-setup, phase2-release-checklist, submission-state, asc-cli-workflow
assets/               App icon (1024x1024) + 20 screenshots
scripts/              Build helpers (setup-ios.sh)
```

## Standing rules

- **Game logic is pure.** `src/lib/game/` never imports React, DOM, or native.
- **Web fallbacks.** `src/lib/native/` must work in browser — every native call
  has a web no-op so `npm run dev` runs unmodified.
- **Save schema.** Bump `SAVE_VERSION` in `src/lib/game/constants.ts` when the
  `GameState` shape changes incompatibly. Old saves are rejected at parse time
  via the envelope (see `src/state/game-context.tsx` → `decodeSave`).
- **Before pushing code changes**: run `npm run lint` + `npm run build`.
  Both must pass. Vercel auto-deploys on push to `main`.
- **Before iOS archive**: run `npm run build:ios` to sync fresh web bundle
  into `ios/App/App/public/`.

## Common commands

```bash
# Web development
npm run dev                  # localhost:3000

# Web verification
npm run lint
npm run build

# iOS prep
npm run build:ios            # next build + cap sync
cd ios/App && pod install    # one-time, installs AppLovinSDK

# Submission (via asc-cli, requires ~/.asc/credentials.json)
asc apps list                                                    # sanity
asc versions list --app-id 6762315526                            # check state
asc versions check-readiness --version-id <v>                    # submission gates
asc builds archive --scheme App \
  --workspace ios/App/App.xcworkspace \
  --upload --app-id 6762315526 --version 1.0                     # archive + upload
```

## Agent etiquette in this project

- If the user asks about iOS submission, read `docs/submission-state.md` first.
- Never recommend creating App Store Connect UI items (app, achievements,
  leaderboard, metadata) without first checking `docs/submission-state.md` —
  they probably already exist.
- When state changes (item gets configured), update `submission-state.md`
  in the same commit that made the change.
- The user has a busy Apple account — they manage 7+ apps under `com.uptap.*`.
  Bundle ID conflicts and registry issues are rare.
