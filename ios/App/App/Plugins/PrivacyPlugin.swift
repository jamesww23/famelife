import Foundation
import Capacitor
import AppTrackingTransparency
import UIKit

/// Bridges App Tracking Transparency to the web layer.
/// Reference: https://developer.apple.com/documentation/apptrackingtransparency
@objc(PrivacyPlugin)
public class PrivacyPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "PrivacyPlugin"
    public let jsName = "PrivacyPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestTrackingAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getTrackingStatus", returnType: CAPPluginReturnPromise),
    ]

    private var pendingActivationObserver: NSObjectProtocol?

    @objc func requestTrackingAuthorization(_ call: CAPPluginCall) {
        if #available(iOS 14, *) {
            // ATTrackingManager.requestTrackingAuthorization only presents
            // the system prompt when the app is in foregroundActive state.
            // If called earlier (e.g. during launch / WKWebView boot), the
            // completion fires immediately with .notDetermined and no
            // prompt is shown — this is what caused Apple's v1.0 build 9
            // rejection under Guideline 2.1. The JS side now triggers this
            // from a user gesture; this Swift guard is belt-and-suspenders
            // in case a future caller doesn't.
            DispatchQueue.main.async { [weak self] in
                guard let self = self else { return }
                if UIApplication.shared.applicationState == .active {
                    self.requestNow(call)
                } else {
                    self.requestWhenActive(call)
                }
            }
        } else {
            // Pre-iOS 14: tracking is always available
            call.resolve(["status": "authorized"])
        }
    }

    @available(iOS 14, *)
    private func requestNow(_ call: CAPPluginCall) {
        ATTrackingManager.requestTrackingAuthorization { status in
            call.resolve(["status": self.statusString(status)])
        }
    }

    @available(iOS 14, *)
    private func requestWhenActive(_ call: CAPPluginCall) {
        // Defer until the app is active, then fire the prompt once.
        let observer = NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            guard let self = self else { return }
            if let obs = self.pendingActivationObserver {
                NotificationCenter.default.removeObserver(obs)
                self.pendingActivationObserver = nil
            }
            self.requestNow(call)
        }
        pendingActivationObserver = observer
    }

    @objc func getTrackingStatus(_ call: CAPPluginCall) {
        if #available(iOS 14, *) {
            let status = ATTrackingManager.trackingAuthorizationStatus
            call.resolve(["status": statusString(status)])
        } else {
            call.resolve(["status": "authorized"])
        }
    }

    @available(iOS 14, *)
    private func statusString(_ status: ATTrackingManager.AuthorizationStatus) -> String {
        switch status {
        case .authorized: return "authorized"
        case .denied: return "denied"
        case .notDetermined: return "not-determined"
        case .restricted: return "restricted"
        @unknown default: return "unavailable"
        }
    }
}
