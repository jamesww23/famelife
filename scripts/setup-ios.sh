#!/bin/bash
set -euo pipefail

# Fame Life — iOS Setup Script
#
# Run this once after cloning, or after changing Capacitor plugins / Podfile.
# Prerequisites: Node.js, npm, CocoaPods (`gem install cocoapods`), Xcode 15+
#
# Usage:
#   chmod +x scripts/setup-ios.sh
#   ./scripts/setup-ios.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Fame Life iOS Setup ==="
echo ""

# 1. Install npm dependencies
echo "→ Installing npm dependencies..."
cd "$PROJECT_ROOT"
npm install

# 2. Build web assets (static export)
echo ""
echo "→ Building web assets..."
npm run build

# 3. Sync Capacitor
echo ""
echo "→ Syncing Capacitor..."
npx cap sync ios

# 4. Install CocoaPods (AppLovin MAX SDK)
echo ""
echo "→ Installing CocoaPods dependencies..."
cd "$PROJECT_ROOT/ios/App"
if ! command -v pod &> /dev/null; then
    echo "❌ CocoaPods not installed. Install it with:"
    echo "   sudo gem install cocoapods"
    echo "   — or —"
    echo "   brew install cocoapods"
    exit 1
fi
pod install

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Open ios/App/App.xcworkspace in Xcode (NOT .xcodeproj)"
echo "  2. Select your Development Team in Signing & Capabilities"
echo "  3. Verify Game Center capability is listed"
echo "  4. Set your AppLovin SDK key in Info.plist (AppLovinSdkKey)"
echo "  5. Create .env.local with your ad unit IDs (see docs/phase2-release-checklist.md)"
echo "  6. Build & run on a physical device"
echo ""
echo "To open in Xcode now:"
echo "  open ios/App/App.xcworkspace"
