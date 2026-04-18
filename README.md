# Fame Life

A Reigns-style card game where you rise from nobody to global icon. Every choice
shapes your story across 10 years of brand deals, drama, and viral moments.

- **Stack**: Next.js 16 (static export) + React 19 + TypeScript + TailwindCSS 4
- **Native shell**: Capacitor 8 → iOS WKWebView
- **Bundle ID**: `com.uptap.famelife`
- **Privacy Policy**: <https://www.uptap.com/p/privacy-policy/>
- **Support**: <https://www.uptap.com>

## Quick start

```bash
npm install
npm run dev          # web dev at localhost:3000
```

## iOS build

```bash
npm run setup:ios    # one-shot: install + build + cap sync + pod install
npm run build:ios    # rebuild web + sync to native after changes
npm run open:ios     # opens Xcode workspace
```

Always open `ios/App/App.xcworkspace` (the workspace), never `App.xcodeproj`.

## Project layout

```
src/app/              Next.js App Router (entry, error boundaries, layout)
src/components/game/  Screens (start, game, summary) and modals
src/components/ui/    shadcn/ui primitives
src/lib/game/         Pure game engine (reducers, progression, balance)
src/lib/native/       Capacitor bridges (ads, Game Center, ATT, storage)
src/data/             Game content (events, archetypes, shop, badges, milestones)
src/state/            React context that wraps the engine
ios/App/              Native Xcode project + Swift plugins
```

## Conventions

- Game logic in `src/lib/game/` is pure — no React, no DOM, no native imports.
- `src/lib/native/` provides web fallbacks for every native call so the game
  runs unmodified in the browser.
- Save data is wrapped in a versioned envelope (`SAVE_VERSION` in
  `src/lib/game/constants.ts`). Bump the version when the `GameState` shape
  changes incompatibly so old saves are discarded cleanly instead of corrupted.

## Submission checklist

See [`docs/phase2-release-checklist.md`](docs/phase2-release-checklist.md) for
the App Store submission checklist (Apple Developer enrollment, Game Center
setup, App Store Connect metadata, screenshots, etc.).
