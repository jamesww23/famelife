import Foundation
import Capacitor

// Conditional import: compiles with or without AppLovin MAX SDK installed.
// When the SDK is not present, all methods return graceful fallbacks.
#if canImport(AppLovinSDK)
import AppLovinSDK
#endif

/// Bridges AppLovin MAX ads to the web layer.
///
/// Supports interstitial and rewarded video ad formats.
/// The SDK is loaded conditionally — the app compiles and runs without it.
///
/// To enable ads:
/// 1. Add AppLovin MAX SDK via CocoaPods: `pod 'AppLovinSDK'`
/// 2. Run `pod install` in ios/App/
/// 3. Supply your SDK key and ad unit IDs via environment config
///
/// Reference: https://developers.applovin.com/en/ios/overview/integration
@objc(AdsPlugin)
public class AdsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AdsPlugin"
    public let jsName = "AdsPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "initialize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadInterstitial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showInterstitial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadRewarded", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showRewarded", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isRewardedReady", returnType: CAPPluginReturnPromise),
    ]

    #if canImport(AppLovinSDK)
    private var interstitialAd: MAInterstitialAd?
    private var rewardedAd: MARewardedAd?
    private var rewardedCall: CAPPluginCall?
    private var interstitialCall: CAPPluginCall?
    private var didEarnReward = false
    #endif

    @objc func initialize(_ call: CAPPluginCall) {
        #if canImport(AppLovinSDK)
        guard let sdkKey = call.getString("sdkKey"), !sdkKey.isEmpty else {
            call.reject("Missing SDK key")
            return
        }

        let hasConsent = call.getBool("hasConsent") ?? false

        // AppLovin MAX SDK 13.x: configuration goes through ALSdkInitializationConfiguration,
        // and ALSdk.shared() takes no arguments. The legacy `ALSdk.shared(withKey:)` and
        // `ALSdk.shared(withKey:settings:)` were removed.
        // Reference: https://developers.applovin.com/en/ios/overview/integration#initialize-the-sdk
        let initConfig = ALSdkInitializationConfiguration(sdkKey: sdkKey) { builder in
            builder.mediationProvider = ALMediationProviderMAX
        }

        // Set consent flag (GDPR / regional privacy) before init.
        ALPrivacySettings.setHasUserConsent(hasConsent)

        ALSdk.shared().initialize(with: initConfig) { _ in
            call.resolve()
        }
        #else
        call.resolve(["note": "AppLovin SDK not installed — ads disabled"])
        #endif
    }

    @objc func loadInterstitial(_ call: CAPPluginCall) {
        #if canImport(AppLovinSDK)
        guard let adUnitId = call.getString("adUnitId") else {
            call.reject("Missing adUnitId")
            return
        }
        DispatchQueue.main.async {
            let ad = MAInterstitialAd(adUnitIdentifier: adUnitId)
            ad.delegate = self
            self.interstitialAd = ad
            ad.load()
            call.resolve()
        }
        #else
        call.resolve()
        #endif
    }

    @objc func showInterstitial(_ call: CAPPluginCall) {
        #if canImport(AppLovinSDK)
        DispatchQueue.main.async {
            if let ad = self.interstitialAd, ad.isReady {
                self.interstitialCall = call
                ad.show()
            } else {
                call.resolve(["shown": false])
            }
        }
        #else
        call.resolve(["shown": false])
        #endif
    }

    @objc func loadRewarded(_ call: CAPPluginCall) {
        #if canImport(AppLovinSDK)
        guard let adUnitId = call.getString("adUnitId") else {
            call.reject("Missing adUnitId")
            return
        }
        DispatchQueue.main.async {
            let ad = MARewardedAd.shared(withAdUnitIdentifier: adUnitId)
            ad.delegate = self
            self.rewardedAd = ad
            ad.load()
            call.resolve()
        }
        #else
        call.resolve()
        #endif
    }

    @objc func showRewarded(_ call: CAPPluginCall) {
        #if canImport(AppLovinSDK)
        DispatchQueue.main.async {
            if let ad = self.rewardedAd, ad.isReady {
                self.didEarnReward = false
                self.rewardedCall = call
                ad.show()
            } else {
                call.resolve(["rewarded": false])
            }
        }
        #else
        // Without SDK, grant the reward (dev/testing mode)
        call.resolve(["rewarded": true])
        #endif
    }

    @objc func isRewardedReady(_ call: CAPPluginCall) {
        #if canImport(AppLovinSDK)
        let ready = rewardedAd?.isReady ?? false
        call.resolve(["ready": ready])
        #else
        call.resolve(["ready": false])
        #endif
    }
}

// MARK: - MAX Ad Delegate

#if canImport(AppLovinSDK)
extension AdsPlugin: MAAdDelegate, MARewardedAdDelegate {
    public func didLoad(_ ad: MAAd) {}
    public func didFailToLoadAd(forAdUnitIdentifier adUnitIdentifier: String, withError error: MAError) {}
    public func didDisplay(_ ad: MAAd) {}
    public func didFail(toDisplay ad: MAAd, withError error: MAError) {
        // Resolve pending calls on display failure
        interstitialCall?.resolve(["shown": false])
        interstitialCall = nil
        rewardedCall?.resolve(["rewarded": false])
        rewardedCall = nil
    }

    public func didHide(_ ad: MAAd) {
        // Interstitial hidden
        if ad.adUnitIdentifier == interstitialAd?.adUnitIdentifier {
            interstitialCall?.resolve(["shown": true])
            interstitialCall = nil
        }
        // Rewarded hidden
        if ad.adUnitIdentifier == rewardedAd?.adUnitIdentifier {
            rewardedCall?.resolve(["rewarded": didEarnReward])
            rewardedCall = nil
            didEarnReward = false
        }
    }

    public func didClick(_ ad: MAAd) {}

    // MARK: MARewardedAdDelegate
    public func didRewardUser(for ad: MAAd, with reward: MAReward) {
        didEarnReward = true
    }
}
#endif
