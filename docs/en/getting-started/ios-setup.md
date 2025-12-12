# iOS Setup

[< Back](../README.md)

Welcome to the official documentation for **How to implement the Locator SDK for iOS**.

The SDK follows the definition described in [LocatorService](../reference/service.md).

---

## Initialization

To initialize the SDK, you must access the **shared** instance (`shared`) of the main class, ensuring that the environment is prepared in the application lifecycle (usually in `AppDelegate`).

```swift
import LocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // SDK Singleton initialization
        // Prepares the environment for use.
        LocatorSDK.shared.initialize()
        return true
    }
    // ...
}
```

## SDK Instance

To use the SDK, you will need to get an instance of the SDK, which can be done via:

`static func shared() -> Result<LocatorSDK, LocatorSDKError>`

Note: In Swift, the Result pattern is used to handle success or failure. The exception in Kotlin is mapped to a specific Error in Swift.

```swift
class ViewController: UIViewController {
    var sdk: LocatorSDK
    override func viewDidLoad() {
        super.viewDidLoad()

        switch LocatorSDK.shared() {
            case .success(let instance):
                self.sdk = instance
            case .failure(let error):
                print("Error getting SDK instance: \(error.localizedDescription)")
                if let locatorError = error as? LocatorSDKError, locatorError == .notInitialized {
                // Try to initialize or show an error message
                }
        }
    }
}
```

---

## Configuration

After obtaining the instance, you need to configure the Integrator and `LocatorConfig`, which will be the SDK's configurator.

By default, the SDK will have a default Integrator (`DefaultLocatorSDKIntegrationApiImpl`), which will be used as default if no new one is configured.

### Integrator (LocatorIntegration)

The Integrator uses the `LocatorIntegration` protocol:

```swift
protocol LocatorIntegration {
    func getCert(payload: LocatorRequestApiCert) async throws -> LocatorResponseApiCert
    func getToken(payload: LocatorRequestApiToken) async throws -> LocatorResponseApiToken
    func getScopes(payload: LocatorRequestApiScopes) async throws -> LocatorResponseApiScopes
    func getFeatures(payload: LocatorRequestApiFeatures) async throws -> LocatorResponseApiFeatures
    func getConfig(payload: LocatorRequestApiConfig) async throws -> LocatorResponseApiConfig
    func getGroups(payload: LocatorRequestApiGroups) async throws -> LocatorResponseApiGroups
    func getGeofences(payload: LocatorRequestApiGeofences) async throws -> LocatorResponseApiGeofences
}
```

If you need a new implementation, just implement this protocol. To configure the Integrator, use the method `func registerIntegration(integration: LocatorIntegration)`.

```swift
func configureSDK() {
    switch LocatorSDK.shared() {
    case .success(let sdk):
        // ...
        sdk.registerIntegration(integration: LocatorSDKIntegrationApiImpl())
        // ...
    case .failure(_):
        // Handle error
        break
    }
}
```

### LocatorConfig

Struct used to configure the SDK

```swift
struct LocatorConfig {
    let license: String
    let sdkVersion: String // Equivalent to BuildConfig.LIBRARY_VERSION
    let osPlatform: String = OS_PLATFORM_IOS
    let mqtt: LocatorMqttConfig
    let api: LocatorApiConfig
    let process: LocatorProcessConfig
    let battery: LocatorBatteryConfig?
    let motion: LocatorMotionConfig?
    let collect: LocatorCollectConfig?
    let revision: Int? // Long type in Kotlin is Int/Int64 in Swift
    let createdAt: Int?
    let updatedAt: Int?
}
```

```swift
func configureSDK() {
    switch LocatorSDK.shared() {
    case .success(let sdk):
        // ...
        // TODO configure all necessary parameters of LocatorConfig
        let config = LocatorConfig(
            license: "YOUR_LICENSE", 
            sdkVersion: "1.0.0", 
            mqtt: LocatorMqttConfig(/*...*/), 
            api: LocatorApiConfig(/*...*/), 
            process: LocatorProcessConfig(/*...*/)
        )
        
        sdk.setConfig(config: config)
        // ...
    case .failure(_):
        // Handle error
        break
    }
}
```

### SDK Operation Initialization

If everything is configured, you can call the SDK's `start` method. With this, the SDK will begin collecting locations.

```swift
func configureSDK() {
    switch LocatorSDK.shared() {
    case .success(let sdk):
        // ...
        do {
            try sdk.start()
        } catch let error as LocatorSDKError {
            // Handle SDK-specific exceptions mapped to `LocatorSDKError`
            print("Error starting SDK: \(error.localizedDescription)")
        } catch {
            print("Unknown error starting SDK: \(error.localizedDescription)")
        }
        // ...
    case .failure(_):
        // Handle error
        break
    }
}
```

### Commands

To validate if a command should be executed by the Locator SDK, use the `isLocatorSDKCommand` method. If it belongs to the SDK, use `convertLocatorSDKCommand` to convert the message and `execute` for the SDK to run the command. Both methods belong to the `LocatorSDK` class as static/class methods, so there is no need for an instance to call these methods.

Note: Remote message notification is handled in `AppDelegate` in the method `application(_:didReceiveRemoteNotification:fetchCompletionHandler:)` or related methods in a service class, if applicable.

```swift
import Foundation
import UserNotifications // Required if in AppDelegate

// Assuming this function is called after receiving FCM data
// (e.g., inside AppDelegate in method 'application(_:didReceiveRemoteNotification:fetchCompletionHandler:)')
func handleRemoteMessage(userInfo: [AnyHashable: Any]) {
    
    // Get SDK instance. Assuming initialization occurred in AppDelegate.
    guard case .success(let sdk) = LocatorSDK.shared() else {
        print("Error: LocatorSDK not initialized or unavailable.")
        return 
    }
    
    // Equivalent to 'message.data' on Android
    let notificationMsg = userInfo 

    if LocatorSDK.isLocatorSDKCommand(notificationMsg: notificationMsg) {
        // Call to conversion method that returns a Result<LocatorCommand, Error>
        switch LocatorSDK.convertLocatorSDKCommand(notificationMsg: notificationMsg) {
            
        case .success(let command):
            // Equivalent to .onSuccess { sdk.execute(command = it) }
            do {
                try sdk.execute(command: command)
                print("SDK command executed successfully.")
            } catch {
                // Handle command execution errors (if execute is a throw method)
                print("Error executing SDK command: \(error.localizedDescription)")
            }

        case .failure(let exception):
            // Equivalent to .onFailure { exception -> ... }
            // exception is of type LocatorSDKCommandConverterError (or similar)
            print("Command conversion error: \(exception.localizedDescription)")
        }
    }
}

