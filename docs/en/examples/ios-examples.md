# iOS Examples

[< Back](../README.md)

This document contains practical examples of using the Locator SDK for iOS.

## Complete Initialization and Configuration Example

This example shows the complete flow of initialization, configuration, and starting the Locator SDK.

### 1. Basic Initialization

Basic SDK initialization is done in the `AppDelegate`:

```swift
import LocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Basic initialization
        LocatorSDK.shared.initialize()
        return true
    }
}
```

### 2. Initialization with Configuration

Alternatively, you can initialize the SDK by passing the configuration directly to the `initialize` method:

```swift
import LocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Create configuration before initialization
        let config = createLocatorConfig()
        
        // Initialize with configuration
        LocatorSDK.shared.initialize(config: config)
        
        return true
    }
    
    private func createLocatorConfig() -> LocatorConfig {
        return LocatorConfig(
            license: "YOUR_LICENSE_HERE",
            sdkVersion: "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                clientId: "ios-client-\(UUID().uuidString)",
                broker: "mqtt.example.com",
                port: "8883",
                username: "mqtt-user"
            ),
            api: LocatorApiConfig(
                token: "JWT_TEMPORARY_TOKEN",
                certUrl: "https://api.example.com/cert",
                scopesUrl: "https://api.example.com/scopes",
                tokenUrl: "https://api.example.com/token",
                configUrl: "https://api.example.com/config",
                groupsUrl: "https://api.example.com/groups",
                featuresUrl: "https://api.example.com/features",
                geofencesUrl: "https://api.example.com/geofences"
            ),
            process: LocatorProcessConfig(
                retryPolicy: LocatorRetryPolicy(
                    maxRetries: 3,
                    baseDelayMs: 1000,
                    backoffFactor: 2.0
                ),
                offlineRetentionDays: 7,
                foregroundServiceNotification: nil // iOS does not require foreground service notification
            ),
            battery: LocatorBatteryConfig(
                events: [
                    LocatorBatteryEvent(
                        name: "low_battery",
                        min: 0,
                        max: 20,
                        interval: 3600000, // 1 hour in milliseconds
                        charging: false,
                        powerMode: [.normal]
                    )
                ]
            ),
            motion: LocatorMotionConfig(
                sensitivity: 0.5
            ),
            collect: LocatorCollectConfig(
                collectIntervalMillis: 30000, // 30 seconds
                sendIntervalMillis: 60000, // 1 minute
                minDisplacementMeters: 10.0,
                maxTravelDistanceMeters: 1000.0,
                highAccuracy: true,
                maxBatchSize: 50
            )
        )
    }
}
```

### 3. Complete Flow: Get Instance, Configure and Start

Complete example showing the entire configuration flow:

```swift
import LocatorSDK
import UIKit

class ViewController: UIViewController {
    var sdk: LocatorSDK?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Configure and start the SDK
        setupLocatorSDK()
    }
    
    private func setupLocatorSDK() {
        // 1. Get SDK instance
        switch LocatorSDK.shared() {
        case .success(let instance):
            self.sdk = instance
            
            // 2. Register custom integrator (optional)
            registerCustomIntegration()
            
            // 3. Configure the SDK
            configureSDK()
            
            // 4. Check permissions before starting
            checkPermissionsAndStart()
            
        case .failure(let error):
            if let locatorError = error as? LocatorSDKError, locatorError == .notInitialized {
                print("SDK not initialized. Initialize in AppDelegate.")
                // Try to initialize here if necessary
                LocatorSDK.shared.initialize()
                setupLocatorSDK() // Try again
            } else {
                print("Error getting instance: \(error.localizedDescription)")
            }
        }
    }
    
    private func registerCustomIntegration() {
        guard let sdk = sdk else { return }
        
        // Register custom integrator (optional)
        // If not registered, DefaultLocatorSDKIntegrationApiImpl will be used
        sdk.registerIntegration(integration: CustomLocatorIntegration())
    }
    
    // Example of custom integrator
    class CustomLocatorIntegration: LocatorIntegration {
        func getCert(payload: LocatorRequestApiCert) async throws -> LocatorResponseApiCert {
            // Custom implementation to get certificate
            return try await yourApiService.getCert(payload: payload)
        }
        
        func getToken(payload: LocatorRequestApiToken) async throws -> LocatorResponseApiToken {
            // Custom implementation to get token
            return try await yourApiService.getToken(payload: payload)
        }
        
        func getScopes(payload: LocatorRequestApiScopes) async throws -> LocatorResponseApiScopes {
            return try await yourApiService.getScopes(payload: payload)
        }
        
        func getFeatures(payload: LocatorRequestApiFeatures) async throws -> LocatorResponseApiFeatures {
            return try await yourApiService.getFeatures(payload: payload)
        }
        
        func getConfig(payload: LocatorRequestApiConfig) async throws -> LocatorResponseApiConfig {
            return try await yourApiService.getConfig(payload: payload)
        }
        
        func getGroups(payload: LocatorRequestApiGroups) async throws -> LocatorResponseApiGroups {
            return try await yourApiService.getGroups(payload: payload)
        }
        
        func getGeofences(payload: LocatorRequestApiGeofences) async throws -> LocatorResponseApiGeofences {
            return try await yourApiService.getGeofences(payload: payload)
        }
    }
    
    private func configureSDK() {
        guard let sdk = sdk else { return }
        
        // Create complete configuration
        let config = LocatorConfig(
            license: "LICENSE_12345",
            sdkVersion: "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                clientId: "ios-\(Int64(Date().timeIntervalSince1970 * 1000))",
                broker: "mqtt.yourserver.com",
                port: "8883",
                username: "mqtt-username"
            ),
            api: LocatorApiConfig(
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                certUrl: "https://api.yourserver.com/v1/cert",
                scopesUrl: "https://api.yourserver.com/v1/scopes",
                tokenUrl: "https://api.yourserver.com/v1/token",
                configUrl: "https://api.yourserver.com/v1/config",
                groupsUrl: "https://api.yourserver.com/v1/groups",
                featuresUrl: "https://api.yourserver.com/v1/features",
                geofencesUrl: "https://api.yourserver.com/v1/geofences"
            ),
            process: LocatorProcessConfig(
                retryPolicy: LocatorRetryPolicy(
                    maxRetries: 5,
                    baseDelayMs: 2000,
                    backoffFactor: 1.5
                ),
                offlineRetentionDays: 10,
                foregroundServiceNotification: nil
            ),
            battery: LocatorBatteryConfig(
                events: [
                    LocatorBatteryEvent(
                        name: "battery_low",
                        min: 0,
                        max: 15,
                        interval: 1800000, // 30 minutes
                        charging: false,
                        powerMode: [.normal, .lowPower]
                    ),
                    LocatorBatteryEvent(
                        name: "battery_charging",
                        min: 80,
                        max: 100,
                        interval: 600000, // 10 minutes
                        charging: true,
                        powerMode: [.normal]
                    )
                ]
            ),
            motion: LocatorMotionConfig(
                sensitivity: 0.7
            ),
            collect: LocatorCollectConfig(
                collectIntervalMillis: 15000, // 15 seconds
                sendIntervalMillis: 30000, // 30 seconds
                minDisplacementMeters: 5.0,
                maxTravelDistanceMeters: 500.0,
                highAccuracy: false,
                maxBatchSize: 100
            )
        )
        
        // Apply configuration
        sdk.setConfig(config: config)
    }
    
    private func checkPermissionsAndStart() {
        guard let sdk = sdk else { return }
        
        // Check pending permissions
        let pendingPermissions = sdk.pendingPermissions()
        
        if pendingPermissions.isEmpty {
            // All permissions granted, can start
            startSDK()
        } else {
            // Request missing permissions
            requestPermissions(pendingPermissions)
        }
    }
    
    private func requestPermissions(_ permissions: [String]) {
        // Implement permission request logic
        // On iOS, you need to request location permissions using CLLocationManager
        // After granting permissions, call startSDK()
        
        let locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        // or locationManager.requestAlwaysAuthorization() for background
    }
    
    private func startSDK() {
        guard let sdk = sdk else { return }
        
        do {
            try sdk.start()
            print("SDK started successfully!")
        } catch let error as LocatorSDKError {
            switch error {
            case .missingPermissions:
                print("Missing permissions. Request permissions again.")
                checkPermissionsAndStart()
            case .noConfigSet:
                print("Configuration not set. Configure again.")
                configureSDK()
            default:
                print("Error starting SDK: \(error.localizedDescription)")
            }
        } catch {
            print("Unknown error starting SDK: \(error.localizedDescription)")
        }
    }
}

// MARK: - CLLocationManagerDelegate
extension ViewController: CLLocationManagerDelegate {
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status {
        case .authorizedWhenInUse, .authorizedAlways:
            // Permissions granted, start SDK
            startSDK()
        case .denied, .restricted:
            print("Location permissions denied.")
        case .notDetermined:
            break
        @unknown default:
            break
        }
    }
}
```

### 4. Example with Combine (Modern Architecture)

For a more modern architecture using Combine:

```swift
import LocatorSDK
import Combine
import UIKit

class LocatorManager: ObservableObject {
    @Published var sdkStatus: String = "Not initialized"
    @Published var permissionsNeeded: [String] = []
    
    private var sdk: LocatorSDK?
    private var cancellables = Set<AnyCancellable>()
    
    func initializeSDK() {
        switch LocatorSDK.shared() {
        case .success(let instance):
            self.sdk = instance
            setupSDK()
        case .failure(let error):
            sdkStatus = "Error: \(error.localizedDescription)"
        }
    }
    
    private func setupSDK() {
        guard let sdk = sdk else { return }
        
        // Configure integrator
        sdk.registerIntegration(integration: LocatorSDKIntegrationApiImpl())
        
        // Create and apply configuration
        let config = buildLocatorConfig()
        sdk.setConfig(config: config)
        
        // Check permissions
        let pendingPermissions = sdk.pendingPermissions()
        if pendingPermissions.isEmpty {
            startSDK()
        } else {
            permissionsNeeded = pendingPermissions
            sdkStatus = "Waiting for permissions"
        }
    }
    
    private func buildLocatorConfig() -> LocatorConfig {
        return LocatorConfig(
            license: "YOUR_LICENSE",
            sdkVersion: "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                clientId: "client-\(UUID().uuidString)",
                broker: "mqtt.example.com",
                port: "8883"
            ),
            api: LocatorApiConfig(
                token: "YOUR_JWT_TOKEN",
                certUrl: "https://api.example.com/cert",
                scopesUrl: "https://api.example.com/scopes",
                tokenUrl: "https://api.example.com/token",
                configUrl: "https://api.example.com/config",
                groupsUrl: "https://api.example.com/groups",
                featuresUrl: "https://api.example.com/features",
                geofencesUrl: "https://api.example.com/geofences"
            ),
            process: LocatorProcessConfig(
                retryPolicy: LocatorRetryPolicy(
                    maxRetries: 3,
                    baseDelayMs: 1000,
                    backoffFactor: 2.0
                ),
                offlineRetentionDays: 7,
                foregroundServiceNotification: nil
            ),
            collect: LocatorCollectConfig(
                collectIntervalMillis: 30000,
                sendIntervalMillis: 60000,
                minDisplacementMeters: 10.0,
                highAccuracy: true
            )
        )
    }
    
    func startSDK() {
        guard let sdk = sdk else { return }
        
        do {
            try sdk.start()
            sdkStatus = "SDK started successfully"
        } catch {
            sdkStatus = "Error: \(error.localizedDescription)"
        }
    }
}

// Usage in ViewController
class ViewController: UIViewController {
    @ObservedObject private var locatorManager = LocatorManager()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        locatorManager.initializeSDK()
        
        // Observe status changes
        locatorManager.$sdkStatus
            .sink { [weak self] status in
                print("SDK Status: \(status)")
            }
            .store(in: &cancellables)
    }
}
```

### 5. Example with Async/Await (Swift 5.5+)

For a more modern approach using async/await:

```swift
import LocatorSDK

class LocatorService {
    private var sdk: LocatorSDK?
    
    func setupAndStart() async throws {
        // 1. Get instance
        guard case .success(let instance) = LocatorSDK.shared() else {
            throw LocatorSDKError.notInitialized
        }
        
        sdk = instance
        
        // 2. Register integrator
        sdk?.registerIntegration(integration: LocatorSDKIntegrationApiImpl())
        
        // 3. Configure
        let config = await buildConfig()
        sdk?.setConfig(config: config)
        
        // 4. Check and request permissions if necessary
        let pendingPermissions = sdk?.pendingPermissions() ?? []
        if !pendingPermissions.isEmpty {
            await requestPermissions(pendingPermissions)
        }
        
        // 5. Start
        try sdk?.start()
    }
    
    private func buildConfig() async -> LocatorConfig {
        // Fetch configuration from server if necessary
        return LocatorConfig(
            license: "YOUR_LICENSE",
            sdkVersion: "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                clientId: UUID().uuidString,
                broker: "mqtt.example.com",
                port: "8883"
            ),
            api: LocatorApiConfig(
                token: "YOUR_JWT_TOKEN",
                certUrl: "https://api.example.com/cert",
                scopesUrl: "https://api.example.com/scopes",
                tokenUrl: "https://api.example.com/token",
                configUrl: "https://api.example.com/config",
                groupsUrl: "https://api.example.com/groups",
                featuresUrl: "https://api.example.com/features",
                geofencesUrl: "https://api.example.com/geofences"
            ),
            process: LocatorProcessConfig(
                retryPolicy: LocatorRetryPolicy(
                    maxRetries: 3,
                    baseDelayMs: 1000,
                    backoffFactor: 2.0
                ),
                offlineRetentionDays: 7,
                foregroundServiceNotification: nil
            ),
            collect: LocatorCollectConfig(
                collectIntervalMillis: 30000,
                sendIntervalMillis: 60000,
                minDisplacementMeters: 10.0,
                highAccuracy: true
            )
        )
    }
    
    private func requestPermissions(_ permissions: [String]) async {
        // Implement permission request
        // Use continuation to convert callback to async
    }
}

// Usage
Task {
    do {
        try await locatorService.setupAndStart()
        print("SDK configured and started successfully")
    } catch {
        print("Error: \(error)")
    }
}
```

## Models

To see the complete models in Swift, see [Models](../examples/models.md).
