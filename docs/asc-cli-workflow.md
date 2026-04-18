# App Store Connect automation via `asc-cli`

**Long-term memory for this project.** Any App Store submission workflow
(first launch, 1.1 update, metadata tweak, screenshot refresh) should use
[`tddworks/asc-cli`](https://github.com/tddworks/asc-cli) instead of the
App Store Connect web UI wherever possible. Reproducible, scriptable,
faster, and survives across releases.

---

## Why asc-cli over the UI

| Task | UI time | asc-cli time |
|---|---|---|
| Create all 31 Game Center achievements | ~40 min of form clicks | `scripts/gc-create-achievements.sh` (~30s) |
| Upload 20 screenshots × 4 device classes | ~15 min | `scripts/upload-screenshots.sh` (~2 min) |
| Update description + keywords | ~3 min + 2FA login | 1 command |
| Submit for review | ~5 min + build selection | 1 command |
| Reproducible for v1.1 | Re-click everything | Re-run script |

---

## One-time setup

### 1. Install

```bash
brew install tddworks/tap/asccli
```

### 2. Generate an App Store Connect API key

Go to https://appstoreconnect.apple.com/access/api:
- Click **Keys** tab → **+**
- Name: `fame-life-asc-cli`
- Access: **App Manager** (sufficient for submissions; use **Admin** if you also want to manage users)
- Download the `.p8` file — **you only get it once**. Save to `~/.asc/AuthKey_XXXXXX.p8`
- Copy the **Key ID** (10-char alphanumeric) and **Issuer ID** (UUID) from the dashboard

### 3. Log in

```bash
asc auth login \
  --key-id YOUR_KEY_ID \
  --issuer-id YOUR_ISSUER_ID \
  --private-key-path ~/.asc/AuthKey_YOUR_KEY_ID.p8 \
  --name famelife
```

Credentials stored in `~/.asc/credentials.json`. Named profile `famelife` — switch with `asc auth use famelife`.

### 4. Verify

```bash
asc apps list           # should show Fame Life once the app exists
asc auth whoami         # confirms active credentials
```

---

## First-release workflow (v1.0)

Assume the app has already been registered in App Store Connect (one-time web step) with bundle ID `com.uptap.famelife` — asc-cli can create apps but bundle ID registration + team association still go through the developer portal.

### Step 1 — Create the v1.0 version

```bash
export APP_ID=$(asc apps list --bundle-id com.uptap.famelife --format json | jq -r '.[0].id')

asc versions create \
  --app-id "$APP_ID" \
  --version 1.0 \
  --platform ios
```

### Step 2 — Configure metadata

```bash
# App Info (name, subtitle, category)
export INFO_LOC_ID=$(asc app-info-localizations list --app-id "$APP_ID" --locale en-US --format json | jq -r '.[0].id')

asc app-info-localizations update \
  --localization-id "$INFO_LOC_ID" \
  --name "Fame Life" \
  --subtitle "Card game. Rise to stardom."

# Version content (description, keywords, what's new, URLs)
export VERSION_ID=$(asc versions list --app-id "$APP_ID" --version 1.0 --format json | jq -r '.[0].id')
export VER_LOC_ID=$(asc version-localizations list --version-id "$VERSION_ID" --locale en-US --format json | jq -r '.[0].id')

asc version-localizations update \
  --localization-id "$VER_LOC_ID" \
  --description-file docs/store/description.txt \
  --keywords "fame,influencer,life sim,reigns,story,choices,career,viral,social media,creator" \
  --support-url "https://www.uptap.com" \
  --marketing-url "https://www.uptap.com" \
  --whats-new "Initial launch."
```

### Step 3 — Age rating

Run `scripts/set-age-rating.sh` (see that file for exact declaration-id lookup). Target rating: **12+**. See `phase2-release-checklist.md` for the full answer table.

### Step 4 — Game Center

```bash
scripts/gc-create-leaderboard.sh   # creates the fame_score leaderboard
scripts/gc-create-achievements.sh  # creates all 31 achievements from milestones.ts + badges.ts
```

### Step 5 — Screenshots

```bash
scripts/upload-screenshots.sh   # uploads all 20 PNGs across 4 device sizes
```

### Step 6 — Privacy

```bash
# Set privacy policy URL and data collection details
asc app-privacy update \
  --app-id "$APP_ID" \
  --privacy-policy-url "https://www.uptap.com/p/privacy-policy/"

# Declare tracking (IDFA via AppLovin)
# Full details in phase2-release-checklist.md → Privacy section
```

### Step 7 — Archive and upload the build

```bash
# From repo root
npm run build:ios

# Archive + upload in one command (asc-cli calls xcodebuild under the hood)
asc builds archive \
  --scheme App \
  --workspace ios/App/App.xcworkspace \
  --upload \
  --app-id "$APP_ID" \
  --version 1.0

# Wait for processing — asc-cli polls automatically
asc builds list --app-id "$APP_ID" --version 1.0 --format table
```

### Step 8 — Select build + submit

```bash
# Attach the processed build to the v1.0 version
export BUILD_ID=$(asc builds list --app-id "$APP_ID" --version 1.0 --status VALID --format json | jq -r '.[0].id')

asc versions update \
  --version-id "$VERSION_ID" \
  --build-id "$BUILD_ID"

# Submit for review
asc versions submit --version-id "$VERSION_ID"
```

---

## What `asc-cli` can NOT do (still manual)

| Task | Why | Where |
|---|---|---|
| Apple Developer enrollment ($99/yr) | Apple legal agreement | developer.apple.com/programs/enroll |
| Register bundle ID for the first time | Certificates & Identifiers requires web + email verification | developer.apple.com/account/resources/identifiers |
| Generate initial App Store Connect API key | Security — key can only be downloaded once | appstoreconnect.apple.com/access/api |
| `pod install` (AppLovinSDK) | Must run on local macOS | `cd ios/App && pod install` |
| Xcode: select signing team (first time) | Automatic signing needs Xcode trust | Signing & Capabilities tab (one-time) |
| Xcode: add Game Center capability flag | Must register with Apple's provisioning | Signing & Capabilities tab (one-time) |
| Physical device testing | Need a real iPhone | Connected device + ▶ |

---

## Follow-up release workflow (v1.1, v1.2, ...)

Much shorter — most of the metadata persists.

```bash
# Bump version in Xcode (or via xcrun agvtool)
export VERSION=1.1
agvtool new-marketing-version $VERSION
agvtool next-version -all

# Rebuild
npm run build:ios

# Create the new version in App Store Connect
asc versions create --app-id "$APP_ID" --version $VERSION --platform ios
export VERSION_ID=$(asc versions list --app-id "$APP_ID" --version $VERSION --format json | jq -r '.[0].id')
export VER_LOC_ID=$(asc version-localizations list --version-id "$VERSION_ID" --locale en-US --format json | jq -r '.[0].id')

# Update what's new
asc version-localizations update --localization-id "$VER_LOC_ID" \
  --whats-new-file docs/store/whats-new-v${VERSION}.txt

# Archive + upload
asc builds archive --scheme App --workspace ios/App/App.xcworkspace \
  --upload --app-id "$APP_ID" --version $VERSION

# Attach + submit
export BUILD_ID=$(asc builds list --app-id "$APP_ID" --version $VERSION --status VALID --format json | jq -r '.[0].id')
asc versions update --version-id "$VERSION_ID" --build-id "$BUILD_ID"
asc versions submit --version-id "$VERSION_ID"
```

---

## Scripts in `scripts/`

| Script | Purpose |
|---|---|
| `gc-create-leaderboard.sh` | Create the `fame_score` Game Center leaderboard |
| `gc-create-achievements.sh` | Batch-create all 31 Game Center achievements from `src/data/milestones.ts` and `src/data/badges.ts` |
| `upload-screenshots.sh` | Upload 20 PNGs to the 4 device-class screenshot sets |
| `set-age-rating.sh` | Set the 12+ age rating declarations |
| `set-privacy.sh` | Set privacy policy URL + data collection declarations |

Each script is idempotent: re-running it is safe (uses `list | filter` to skip items that already exist).

---

## Auth + safety notes

- **Never commit `.p8` private key files.** `.gitignore` already excludes `.env*` but explicitly add `*.p8` too if you store keys in-repo.
- The API key has `App Manager` scope — it can submit builds but cannot delete the app, manage team members, or modify banking info.
- Rotate the key annually: App Store Connect → Keys → Revoke old, create new, update `~/.asc/AuthKey_*.p8`.

---

## References

- Tool repo: https://github.com/tddworks/asc-cli
- App Store Connect API docs: https://developer.apple.com/documentation/appstoreconnectapi
- Release checklist (manual + auto): `docs/phase2-release-checklist.md`
