import Foundation
import Capacitor
import AppTrackingTransparency

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

    @objc func requestTrackingAuthorization(_ call: CAPPluginCall) {
        if #available(iOS 14, *) {
            ATTrackingManager.requestTrackingAuthorization { status in
                call.resolve(["status": self.statusString(status)])
            }
        } else {
            // Pre-iOS 14: tracking is always available
            call.resolve(["status": "authorized"])
        }
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
