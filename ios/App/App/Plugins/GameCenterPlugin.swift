import Foundation
import Capacitor
import GameKit

/// Bridges Game Center achievements and leaderboards to the web layer.
/// Reference: https://developer.apple.com/documentation/gamekit
@objc(GameCenterPlugin)
public class GameCenterPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GameCenterPlugin"
    public let jsName = "GameCenterPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authenticate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reportAchievement", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reportScore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showAchievements", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showLeaderboards", returnType: CAPPluginReturnPromise),
    ]

    @objc func authenticate(_ call: CAPPluginCall) {
        GKLocalPlayer.local.authenticateHandler = { viewController, error in
            if let vc = viewController {
                // Present the Game Center login UI
                DispatchQueue.main.async {
                    self.bridge?.viewController?.present(vc, animated: true)
                }
                // Don't resolve yet — wait for authentication to complete
                return
            }

            if let error = error {
                call.resolve([
                    "authenticated": false,
                    "error": error.localizedDescription
                ])
                return
            }

            let player = GKLocalPlayer.local
            call.resolve([
                "authenticated": player.isAuthenticated,
                "playerId": player.gamePlayerID
            ])
        }
    }

    @objc func reportAchievement(_ call: CAPPluginCall) {
        guard let achievementId = call.getString("id") else {
            call.reject("Missing achievement id")
            return
        }
        let percentComplete = call.getDouble("percentComplete") ?? 100.0

        let achievement = GKAchievement(identifier: achievementId)
        achievement.percentComplete = percentComplete
        achievement.showsCompletionBanner = true

        GKAchievement.report([achievement]) { error in
            if let error = error {
                call.reject("Failed to report achievement: \(error.localizedDescription)")
            } else {
                call.resolve()
            }
        }
    }

    @objc func reportScore(_ call: CAPPluginCall) {
        guard let leaderboardId = call.getString("leaderboardId") else {
            call.reject("Missing leaderboardId")
            return
        }
        let score = call.getInt("score") ?? 0

        GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local,
                                   leaderboardIDs: [leaderboardId]) { error in
            if let error = error {
                call.reject("Failed to report score: \(error.localizedDescription)")
            } else {
                call.resolve()
            }
        }
    }

    @objc func showAchievements(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let gcVC = GKGameCenterViewController(state: .achievements)
            gcVC.gameCenterDelegate = self
            self.bridge?.viewController?.present(gcVC, animated: true)
            call.resolve()
        }
    }

    @objc func showLeaderboards(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let gcVC = GKGameCenterViewController(state: .leaderboards)
            gcVC.gameCenterDelegate = self
            self.bridge?.viewController?.present(gcVC, animated: true)
            call.resolve()
        }
    }
}

extension GameCenterPlugin: GKGameCenterControllerDelegate {
    public func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true)
    }
}
