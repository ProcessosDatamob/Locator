# iOS Setup

[< Back](../README.md)

Welcome to the official documentation for **How to implement the Locator SDK for iOS**.

The SDK follows the definition described in [LocatorService](../reference/service.md).

---

## Initialization

To initialize the SDK, you must access the **shared** instance (`shared`) of the main class, ensuring that the environment is prepared in the application lifecycle (usually in `AppDelegate`).

```swift
import AppLocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // SDK Singleton initialization
        // Prepares the environment for use.
        AppLocatorSDK.shared.initSDK()
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

## Initialization and Configuration

To use the SDK, you need to initialize it, get an instance, and configure it. The complete process can be done through a unified function that receives a `LocatorConfig` and executes all steps sequentially.

### Step 1: Initialization in AppDelegate

First, initialize the SDK in your application's `AppDelegate`:

```swift
import AppLocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // SDK Singleton initialization
        // Prepares the environment for use.
        AppLocatorSDK.shared.initSDK()
        return true
    }
    // ...
}
```

### Step 2: Complete Configuration

After initialization, you can configure the SDK in a unified way. The function below receives a `LocatorConfig` and optionally a `LocatorIntegration`, executing all necessary steps:

```swift
/**
 * Configures the Locator SDK completely and sequentially.
 * 
 * - Parameters:
 *   - config: SDK configuration (LocatorConfig)
 *   - integration: Custom integrator (optional). If not provided, DefaultLocatorSDKIntegrationApiImpl will be used
 *   - autoStart: If true, automatically starts collection after configuration
 * - Returns: Result<AppLocatorSDK, Error> with the configured instance or error
 */
func setupLocatorSDK(
    config: LocatorConfig,
    integration: LocatorIntegration? = nil,
    autoStart: Bool = false
) -> Result<AppLocatorSDK, Error> {
    // 1. Ensure SDK is initialized
    AppLocatorSDK.shared.initialize()
    
    // 2. Get SDK instance
    switch AppLocatorSDK.shared() {
    case .success(let sdk):
        // 3. Register integrator (if provided)
        // Otherwise, DefaultLocatorSDKIntegrationApiImpl will be used
        if let integration = integration {
            sdk.registerIntegration(integration: integration)
        }
        
        // 4. Configure SDK with LocatorConfig
        sdk.setConfig(config: config)
        
        // 5. Start SDK (if requested)
        if autoStart {
            do {
                try sdk.start()
            } catch let error as LocatorSDKError {
                print("Error starting SDK: \(error.localizedDescription)")
                // Handle missing permissions or configuration not set
                return .failure(error)
            } catch {
                print("Unknown error starting SDK: \(error.localizedDescription)")
                return .failure(error)
            }
        }
        
        return .success(sdk)
        
    case .failure(let error):
        print("Error getting instance: \(error.localizedDescription)")
        return .failure(error)
    }
}
```

### Usage Example

```swift
class ViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Create LocatorConfig with all necessary configurations
        let locatorConfig = LocatorConfig(
            license: "your-license-here",
            sdkVersion: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                // MQTT configurations
            ),
            api: LocatorApiConfig(
                // API configurations
            ),
            process: LocatorProcessConfig(
                // Process configurations
            ),
            battery: LocatorBatteryConfig(
                // Battery configurations (optional)
            ),
            motion: LocatorMotionConfig(
                // Motion configurations (optional)
            ),
            collect: LocatorCollectConfig(
                // Collection configurations (optional)
            )
        )
        
        // Optional: Create custom integrator
        let customIntegration: LocatorIntegration? = nil // or your custom implementation
        
        // Configure SDK in a unified way
        switch setupLocatorSDK(
            config: locatorConfig,
            integration: customIntegration, // Optional: nil to use default
            autoStart: true // Optional: automatically start after configuration
        ) {
        case .success(let sdk):
            print("SDK configured and started successfully")
            // SDK ready to use
        case .failure(let error):
            print("Error configuring SDK: \(error.localizedDescription)")
            if let locatorError = error as? LocatorSDKError {
                switch locatorError {
                case .notInitialized:
                    // SDK was not initialized
                    break
                case .noConfigSet:
                    // Configuration not set
                    break
                case .missingPermissions:
                    // Missing permissions
                    break
                default:
                    // Other errors
                    break
                }
            }
        }
    }
}
```

### LocatorConfig Structure

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

By default, the SDK uses `DefaultLocatorSDKIntegrationApiImpl`. If you need a custom implementation, just implement the protocol and pass it as a parameter to the `setupLocatorSDK` function.

### Exceptions

SDK exceptions are mapped to the `LocatorSDKError` enum:

```swift
enum LocatorSDKError: Error {
    case notInitialized
    case noConfigSet
    case missingPermissions
    // Other error cases
}
```

### Starting Location Collection

After configuration, you can start location collection by calling the SDK's `start()` method. This can be done automatically through the `autoStart = true` parameter in the `setupLocatorSDK` function, or manually:

```swift
// Start manually after configuration
switch AppLocatorSDK.shared() {
case .success(let sdk):
    do {
        try sdk.start()
        print("Location collection started")
    } catch let error as LocatorSDKError {
        print("Error starting: \(error.localizedDescription)")
        // Check pending permissions or missing configuration
    } catch {
        print("Unknown error: \(error.localizedDescription)")
    }
case .failure(let error):
    print("Error getting instance: \(error.localizedDescription)")
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

    if AppLocatorSDK.isLocatorSDKCommand(notificationMsg: notificationMsg) {
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

