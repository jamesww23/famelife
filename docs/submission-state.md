# Fame Life — Live Submission State (v1.0)

**This is the authoritative snapshot of what's configured in App Store Connect
+ Game Center + local tooling. Any future Claude session reading this file
should NOT ask the user to redo any item marked ✅.**

Last verified: 2026-04-19 (via asc-cli queries).

**Current active build**: **build 7** (ID `b0a6d238-4cee-42cb-a967-5ddfa527f3e8`),
processed VALID, attached to Internal TestFlight group with "What's New" notes.
When submitting v1.0, link this build via `asc versions set-build`.

### Build history

| # | ID | State | Notes |
|---|---|---|---|
| 1 | — | Rejected | ITMS-90474 (iPad orientations) → fixed with `UIRequiresFullScreen=true` in commit 9f41412 |
| 2 | `a4c45cc3...` | VALID (superseded) | First valid upload, but Watch Ad/Share were stubbed, no scroll, no BGM |
| 3 | `7f7ec5e6...` | VALID (superseded) | Added scroll fix, real ad wiring, share sheet, BGM. Tested on device — boost modal only fired once/run due to triggerCondition filter bug |
| 4 | — | Upload rejected | Stale `ios/.build` cache with CFBundleVersion=2 baked into IPA (ITMS-90189) |
| 5 | — | Upload rejected | Same cache bug as 4 |
| 6 | `812e767d...` | VALID (superseded) | Clean archive after moving `.build` aside. Boost filter fallback to any-pool + BOOST_CHANCE bumped 0.22→0.40 + interstitial attempt every turn |
| 7 | `b0a6d238...` | **VALID (ACTIVE)** | New Nano Banana app icon (neon purple + crown + 1M badge + FAME wordmark). Uploaded but not distributed — `add-beta-group` and `update-beta-notes` were missed post-archive; reattached on 2026-04-19 |

### Stale-cache lesson

`asc builds archive --output-dir ios/.build` reuses archive content across
invocations. If Info.plist version changes between archives, the rebuild may
fail to pick up the new version. Always move `ios/.build` aside (or use a
per-build output-dir) when bumping CFBundleVersion.

---

## Identifiers (canonical — use these everywhere)

| What | Value |
|---|---|
| App Store Connect **App ID** | `6762315526` |
| App Store Connect **App Info ID** | `7dfb855f-11dd-425e-8053-6c52a5a60e44` |
| v1.0 **Version ID** | `9a0f4a64-161d-4f1f-b439-e6c81a72abe9` |
| en-US **Version Localization ID** | `cea9da5c-2de3-4471-84cd-1f19b40ce835` |
| en-US **App Info Localization ID** | `9164fb37-4398-44d5-8a57-b9a46701f70c` |
| **Game Center Detail ID** | `0a86707c-5abd-410c-86e4-8789fa90d90e` |
| **Fame Score Leaderboard ID** | `19089ae3-62b2-49be-9e12-601ebc2c0da3` |
| **Review Detail ID** | `a0d4e23b-0f2c-410f-9f09-3efbfdf05d76` |
| Bundle ID | `com.uptap.famelife` |
| Apple Developer team account | `ac2ji8@gmail.com` (do NOT confuse with the review contact below) |
| App Review contact email | `j@uptap.com` (James Wu, +86 15711172951) |
| TestFlight Internal Group ID | `211f19db-b4ec-4d87-8763-31e295dd3945` (auto-includes all team members; do not try to add `j@uptap.com` as a tester — it's not a team member) |

## Infrastructure state

| Item | Status | Notes |
|---|---|---|
| Apple Developer Program enrolled | ✅ | Same team that owns other Uptap apps (Idle Gun, Puzzle Block, Allscribe, Knock & Smash, Tap Tap Boom) |
| Bundle ID `com.uptap.famelife` registered | ✅ | App exists in ASC, linked to team |
| App Store Connect API key | ✅ | `~/.asc/credentials.json` — Key ID `48U9…7LQU`, Issuer `3c25…b42e`, PEM inline |
| asc-cli installed | ✅ | `/usr/local/bin/asc` — `asc apps list` works |

## App Store Connect — configured

### App Info (already set ✅)
- **Name**: `Fame Life`
- **Subtitle**: `Influencer Tycoon Simulator`
- **Privacy Policy URL**: `https://www.uptap.com/p/privacy-policy/`
- **Primary locale**: `en-US`

### v1.0 Version Localization (already set ✅)
- **Description**: Full 4000-char description — starts "Rise from zero followers to global fame in Fame Life..." and covers Start from Nothing / Build Your Empire / Make Tough Choices / Manage Your Life / Compete for Glory / Features. Already live in ASC.
- **Keywords**: `influencer,simulator,tycoon,social media,creator,fame,youtuber,streamer,career,life sim`
- **Support URL**: `https://www.uptap.com/`
- **Screenshots**: **4 sets uploaded** (one per device class)
- **Promotional Text / What's New**: Not set (pass: true — optional for v1.0 initial launch)

### Review Contact (already set ✅)
- James Wu / `j@uptap.com` / `+86 15711172951`
- Notes: "Fame Life is a single-player influencer career simulator. No login required. Tap Start Your Fame Story to begin."
- No demo account required

### Pricing (already set ✅)
- Check passes — app is configured as free with ad monetization.

### Age Rating (⚠️ currently all NONE — see Warnings below)

All declaration categories currently set to `NONE`, which yields a **4+** rating. The `isAdvertising: true` flag is correctly set. Other flags: `isLootBox: false`, `isGambling: false`, `isUnrestrictedWebAccess: false`.

## Game Center — configured

### Leaderboard (already created ✅)
- **Reference Name**: `Fame Score`
- **Vendor ID**: `com.uptap.famelife.leaderboard.fame_score`
- **Sort**: DESC (higher is better), **Submission**: BEST_SCORE
- **Leaderboard ID**: `19089ae3-62b2-49be-9e12-601ebc2c0da3`
- **Integration code**: `src/lib/native/achievements.ts` → `LEADERBOARD_FAME_SCORE` (in `config.ts`) references this vendor ID ✅

### Achievements (all 32 created ✅)

All vendor IDs below match the code mappings in `src/lib/native/achievements.ts`
(`MILESTONE_TO_ACHIEVEMENT` + `BADGE_TO_ACHIEVEMENT`). No ID mismatches detected.

**Total achievement points = 1000 (the Apple-enforced cap).** Any new achievement
must be 0 points, or another achievement's points must be reduced to make room.
Storyteller is 0 points (social/fun, not a skill milestone).

| Vendor ID | Title | Points |
|---|---|---|
| `com.uptap.famelife.achievement.first_10k` | 10K Club | 10 |
| `com.uptap.famelife.achievement.first_100k` | 100K Creator | 25 |
| `com.uptap.famelife.achievement.half_million` | Half a Million | 50 |
| `com.uptap.famelife.achievement.first_1m` | Millionaire Followers | 100 |
| `com.uptap.famelife.achievement.rich` | Cashed Out | 25 |
| `com.uptap.famelife.achievement.quarter_mil` | Quarter Millionaire | 50 |
| `com.uptap.famelife.achievement.millionaire_money` | Actual Millionaire | 100 |
| `com.uptap.famelife.achievement.first_brand_deal` | First Bag | 10 |
| `com.uptap.famelife.achievement.first_scandal` | First Scandal | 10 |
| `com.uptap.famelife.achievement.first_celebrity_event` | Celebrity Status | 10 |
| `com.uptap.famelife.achievement.burnout_survivor` | Burnout Survivor | 25 |
| `com.uptap.famelife.achievement.triple_scandal` | Teflon Creator | 50 |
| `com.uptap.famelife.achievement.viral_king` | Viral Machine | 50 |
| `com.uptap.famelife.achievement.comeback_kid` | Comeback Kid | 25 |
| `com.uptap.famelife.achievement.empire_builder` | Empire Builder | 50 |
| `com.uptap.famelife.achievement.managed_talent` | Managed Talent | 10 |
| `com.uptap.famelife.achievement.first_purchase` | First Upgrade | 10 |
| `com.uptap.famelife.achievement.luxury_life` | Luxury Life | 50 |
| `com.uptap.famelife.achievement.business_mogul` | Business Mogul | 100 |
| `com.uptap.famelife.achievement.charity_hero` | Charity Hero | 25 |
| `com.uptap.famelife.achievement.feud_starter` | Drama Starter | 10 |
| `com.uptap.famelife.achievement.industry_respect` | Industry Respected | 25 |
| `com.uptap.famelife.achievement.global_icon` | Global Icon | 100 |
| `com.uptap.famelife.achievement.chaos_agent` | Chaos Agent | 50 |
| `com.uptap.famelife.achievement.veteran` | Veteran | 25 |
| `com.uptap.famelife.achievement.millionaire_badge` | Millionaire | 1 |
| `com.uptap.famelife.achievement.empire_builder_badge` | Empire Builder Full | 1 |
| `com.uptap.famelife.achievement.comeback_monarch` | Comeback Monarch | 1 |
| `com.uptap.famelife.achievement.fame_life` | Fame Life | 1 |
| `com.uptap.famelife.achievement.speed_runner` | Speed Runner | 1 |
| `com.uptap.famelife.achievement.hall_of_fame` | Hall of Fame | 0 |
| `com.uptap.famelife.achievement.storyteller` | Storyteller | 0 |

**Do not recreate.** If you need to modify (e.g., change points), use
`asc game-center achievements update` rather than delete + create.

---

## ⚠️ What's still open (the actual remaining work)

### Blocking submission
| # | Item | Command / Action |
|---|---|---|
| 1 | No build uploaded | `asc builds archive --scheme App --workspace ios/App/App.xcworkspace --upload --app-id 6762315526 --version 1.0` (runs xcodebuild + uploads) |
| 2 | Link build to v1.0 version | `asc versions update --version-id 9a0f4a64-161d-4f1f-b439-e6c81a72abe9 --build-id <VALID_BUILD_ID>` |
| 3 | Submit for review | `asc versions submit --version-id 9a0f4a64-161d-4f1f-b439-e6c81a72abe9` |

### Warnings — review before submit
- **Age rating is all NONE → computes to 4+.** The game contains drama events, scandals, "hot takes", cancel-culture themes, sketchy crypto sponsorships, and relationship/breakup events. A 4+ rating may fail Apple review for "content doesn't match age rating." Recommend setting:
  - `profanityOrCrudeHumor: INFREQUENT_MILD` (hot takes, ratio, drama language)
  - `matureOrSuggestiveThemes: INFREQUENT_MILD` (scandals, feuds, dating rumors)
  - Other categories correctly NONE.
  - Expected resulting rating: **9+** or **12+**. Safer for review.
  - Command: `asc age-rating update --declaration-id 7dfb855f-11dd-425e-8053-6c52a5a60e44 --profanity-or-crude-humor INFREQUENT_MILD --mature-or-suggestive-themes INFREQUENT_MILD` (verify flag names via `asc age-rating update --help`)
- **"What's New" text not set.** Not required for v1.0 initial launch (Apple silently accepts absence for first release). Required for 1.1+ updates. Current state passes localization check.
- **Launch screen is still default Capacitor splash.** Not a rejection risk, but a poor first-impression; branded splash recommended post-launch.

### Manual steps still needed (local Mac only)
1. **`pod install`** in `ios/App/` — installs AppLovinSDK. Must run before archiving:
   ```bash
   cd "ios/App" && pod install && cd ../..
   ```
2. **Xcode: open workspace, select signing team, add Game Center capability.** One-time Xcode UI work. After this, `asc builds archive --upload` handles archive + upload from CLI.
   ```bash
   open ios/App/App.xcworkspace
   # → click "App" in navigator → Signing & Capabilities tab
   # → check "Automatically manage signing", select Team
   # → click "+ Capability" → Game Center
   # → Save, close Xcode
   ```
3. **Physical device test** — Game Center auth, ATT prompt, ads, mute switch, save persistence. ~20 min.

---

## Workflow references

- [asc-cli general workflow](asc-cli-workflow.md) — commands + auth + release pattern
- [`phase2-release-checklist.md`](phase2-release-checklist.md) — complete checklist (most now ✅)

## Update this doc when state changes

Any time an item here moves from ⚠️/❌ to ✅, update this file in the same
commit. Every future Claude session should start here to avoid re-asking the
user about already-done work.
