# Exemplos iOS

[< Back](../README.md)

This document contains practical examples of using the Locator SDK for iOS.

To view the complete Swift templates, see [Templates](../examples/models.md).

### 1. Basic Initialization

To start using the SDK, you need to initialize it. We recommend that you do this in the `application(_:didFinishLaunchingWithOptions:)` method of the `AppDelegate`. If you are not using the `AppDelegate` file, initialize the SDK in the class that starts your application.

```swift
import AppLocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
  func  application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    Task {
      do {
        try await LocatorServiceSdk.shared.start()
      } catch {
        print("Failed to start Locator SDK: \(error.localizedDescription)")
      }
    }
    
    return true
  }
}
```

### 2. Initialization with configuration

You can initialize the SDK with a pre-configured setup.

```swift
import AppLocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
  func  application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    Task {
      startSdk()
    }
    
    return true
  }

  func createSdkConfig() -> LocatorConfig {
    var license = UUID().uuidString
    
    if let vendorId = UIDevice.current.identifierForVendor {
      license = "\(vendorId.uuidString)-APP-EXAMPLE-IOS"
    }
    
    let initialMqttConfig = LocatorMqttConfig(
      clientId: license,
      broker: "vivo-locator-mqtt.datamobpro.com",
      port: "8883",
      username: license
    )
    
    let initialApiConfig = LocatorApiConfig(
      token: "",
      certUrl: "https://locator-api-stage-13376dba-1ef4-41e2-ab1b-ea98248b0b3d.datamobpro.com/cert",
      scopesUrl: "https://locator-api-stage-13376dba-1ef4-41e2-ab1b-ea98248b0b3d.datamobpro.com/scopes",
      tokenUrl: "https://locator-api-stage-13376dba-1ef4-41e2-ab1b-ea98248b0b3d.datamobpro.com/token",
      configUrl: "https://locator-api-stage-13376dba-1ef4-41e2-ab1b-ea98248b0b3d.datamobpro.com/config",
      groupsUrl: "https://locator-api-stage-13376dba-1ef4-41e2-ab1b-ea98248b0b3d.datamobpro.com/groups",
      featuresUrl: "https://locator-api-stage-13376dba-1ef4-41e2-ab1b-ea98248b0b3d.datamobpro.com/features",
      geofencesUrl: "https://locator-api-stage-13376dba-1ef4-41e2-ab1b-ea98248b0b3d.datamobpro.com/geofences"
    )
    
    let process = LocatorProcessConfig(
      retryPolicy: LocatorRetryPolicy(
        maxRetries: 3,
        baseDelayMs: 1000,
        backoffFactor: 2.0
      ),
      offlineRetentionDays: 7,
      foregroundServiceNotification: nil
    )
    
    let battery = LocatorBatteryConfig(
      events: [
        LocatorBatteryEvent(
          name: "low_battery",
          min: 0,
          max: 20,
          interval: 3600000,
          charging: false,
          powerMode: [.NORMAL]
        )
      ]
    )
    
    let motion = LocatorMotionConfig(
      sensitivity: 0
    )
    
    let collect = LocatorCollectConfig(
      collectIntervalMillis: 0,
      sendIntervalMillis: 0,
      minDisplacementMeters: 0,
      maxTravelDistanceMeters: 0,
      highAccuracy: true,
      maxBatchSize: 0,
      sosAudioRecordsCount: 0,
      sosAudioDurationSeconds: 0,
      sosAudioRetryCount: 0
    )
    
    return LocatorConfig(
      license: license,
      sdkVersion: "1.0.0",
      osPlatform: "ios",
      api: initialApiConfig,
      mqtt: initialMqttConfig,
      process: process,
      battery: battery,
      motion: motion,
      collect: collect,
      revision: 1,
      createdAt: Date.miliseconds,
      updatedAt: Date.miliseconds
    )
  }

  func startSdk() async {
    do {
      locatorServiceSdk.setConfig(createSdkConfig())
      try await locatorServiceSdk.start()
    } catch let error {
      guard let sdkError = error as? LocatorServiceSdkError else { return }
      
      if sdkError.permissions.contains(.LOCATION) || sdkError.permissions.contains(.BACKGROUND_LOCATION) {
        openAlert(text: "Falta permissão de localização")
        return
      }
      
      if sdkError.permissions.contains(.MICROPHONE_ACESS) {
        openAlert(text: "Falta permissão de áudio")
        return
      }
      
      if sdkError.permissions.contains(.USER_NOTIFICATIONS) {
        openAlert(text: "Falta permissão de notificações")
        return
      }
    }
  }
}
```

### 3. Initialization with integrator

You can initialize the SDK with a custom integrator. To do this, you need to create a class that implements the `LocatorIntegration` protocol and pass that class to the `registerIntegration(integration: any LocatorIntegration)` method.

```swift
import AppLocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
  func  application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    Task {
      startSdk()
    }
    
    return true
  }

  func startSdk() async {
    do {
      let integrator = MyClassLocatorIntegration()
      locatorServiceSdk.registerIntegration(integration: integrator)
      locatorServiceSdk.setConfig(createSdkConfig())
      try await locatorServiceSdk.start()
    } catch let error {
      guard let sdkError = error as? LocatorServiceSdkError else { return }
      
      if sdkError.permissions.contains(.LOCATION) || sdkError.permissions.contains(.BACKGROUND_LOCATION) {
        openAlert(text: "Falta permissão de localização")
        return
      }
      
      if sdkError.permissions.contains(.MICROPHONE_ACESS) {
        openAlert(text: "Falta permissão de áudio")
        return
      }
      
      if sdkError.permissions.contains(.USER_NOTIFICATIONS) {
        openAlert(text: "Falta permissão de notificações")
        return
      }
    }
  }

  class MyClassLocatorIntegration: LocatorIntegration {
    func getApiToken() async -> Result<LocatorResponseApiToken, any Error> {
        return try await yourApiService.getApiToken()
    }
    
    func getCert() async -> Result<LocatorResponseApiCert, any Error> {
        return try await yourApiService.getCert()
    }
    
    func getConfig() async -> Result<LocatorResponseApiConfig, any Error> {
        return try await yourApiService.getCert()
    }
    
    func getFeatures() async -> Result<LocatorResponseApiFeatures, any Error> {
        return try await yourApiService.getFeatures()
    }
    
    func getGeofences() async -> Result<LocatorResponseApiGeofences, any Error> {
        return try await yourApiService.getGeofences()
    }
    
    func getGroups() async -> Result<LocatorResponseApiGroups, any Error> {
        return try await yourApiService.getGroups()
    }
    
    func getMqttToken() async -> Result<LocatorResponseApiToken, any Error> {
        return try await yourApiService.getMqttToken()
    }
    
    func getScopes() async -> Result<LocatorResponseApiScopes, any Error> {
        return try await yourApiService.getScopes()
    }
    
    func getWssToken() async -> Result<LocatorResponseApiToken, any Error> {
        return try await yourApiService.getWssToken()
    }
  }
}
```

### 4. Examples of functions

The SDK has several functions available for configuring and retrieving data. Below we will list and explain each of them, with simple examples using the `MyClass` class.

### Function `destroy`

Used to delete collected records that are persisted on the device and reset the SDK to its default mode.

```swift
public func destroy() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsDestroy() async {
    do {
      try await LocatorServiceSdk.shared.destroy()
    } catch {
      print("Failed to destroy SDK data: \(error.localizedDescription)")
    }
  }
}
```

### Function `execute`

Used to execute a specific command.

```swift
public func execute(_ command: LocatorCommand) async throws -> LocatorCommandResult?
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsExecute() async {
    let command = LocatorCommand()
    
    do {
      let result = try await LocatorServiceSdk.shared.execute(command)
      print("Command result: \(String(describing: result))")
    } catch {
      print("Failed to execute command: \(error.localizedDescription)")
    }
  }
}
```

### Function `getConfig`

Used to retrieve the current SDK configuration.

```swift
public func getConfig() -> LocatorConfig?
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetConfig() {
    let configs = LocatorServiceSdk.shared.getConfig()
    print("Current config: \(String(describing: configs))")
  }
}
```

### Function `getFeatures`

Used to retrieve the list of available SDK features.

```swift
public func getFeatures() -> LocatorFeatures
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetFeatures() {
    let features = LocatorServiceSdk.shared.getFeatures()
    print("Features: \(features.features)")
  }
}
```

### Function `getGroups`

Used to retrieve the groups configured in the SDK.

```swift
public func getGroups() -> LocatorGroups
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetGroups() {
    let groups = LocatorServiceSdk.shared.getGroups()
    print("Groups: \(groups.all)")
  }
}
```

### Function `getJwtToken`

Used to retrieve the JWT token used for communication via WebSocket (WSS).

```swift
public func getJwtToken() -> String
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetJwtToken() {
    let token = LocatorServiceSdk.shared.getJwtToken()
    print("JWT Token: \(token)")
  }
}
```

### Function `getSdkMode`

Used to retrieve the current SDK operating mode.

```swift
public func getSdkMode() -> LocatorSdkMode
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetSdkMode() {
    let mode = LocatorServiceSdk.shared.getSdkMode()
    print("SDK Mode: \(mode)")
  }
}
```

### Function `getSession`

Used to retrieve information about the current SDK session.

```swift
public func getSession() -> LocatorSession
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetSession() {
    let session = LocatorServiceSdk.shared.getSession()
    print("Session id: \(session.id)")
    print("Session start: \(session.startAt)")
    print("Session end: \(String(describing: session.endAt))")
  }
}
```

### Function `getState`

Used to retrieve the current SDK state.

```swift
public func getState() -> LocatorState
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetState() {
    let state = LocatorServiceSdk.shared.getState()
    print("SDK State: \(state)")
  }
}
```

### Function `getVersion`

Used to retrieve the current SDK version in use.

```swift
public func getVersion() -> String
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetVersion() {
    let version = LocatorServiceSdk.shared.getVersion()
    print("SDK Version: \(version)")
  }
}
```

### Function `pendingPermissions`

Used to retrieve the list of permissions that still need to be granted by the user.

```swift
public func pendingPermissions() -> [LocatorPermission]
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsCheckPendingPermissions() {
    let permissions = LocatorServiceSdk.shared.pendingPermissions()
    
    if permissions.isEmpty {
      print("No pending permissions.")
    } else {
      print("Pending permissions: \(permissions)")
    }
  }
}
```

### Function `registerIntegration`

Used to register or replace the integration used by the SDK.

```swift
public func registerIntegration(integration: any LocatorIntegration)
```
Example usage:

```swift
import AppLocatorSDK

class MyIntegration: LocatorIntegration {
  // Implement integration methods here
}

class MyClass {
  func  didUserNeedsRegisterIntegration() {
    let integration = MyIntegration()
    LocatorServiceSdk.shared.registerIntegration(integration: integration)
  }
}
```

### Function `setConfig`

Used to save and apply a new SDK configuration.

```swift
public func setConfig(_ config: LocatorConfig)
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSetConfig() {
    let config = LocatorConfig(
      // Configure your fields here
    )
    
    LocatorServiceSdk.shared.setConfig(config)
  }
}
```

### Function `setFeatures`

Used to define or update the available SDK features.

```swift
public func setFeatures(_ features: LocatorFeatures)
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSetFeatures() {
    let features = LocatorFeatures(
      features: ["fall_detection", "background_location"],
      revision: "1",
      createdAt: nil,
      updatedAt: nil
    )
    
    LocatorServiceSdk.shared.setFeatures(features)
  }
}
```

### Function `setGeofences`

Used to configure the geofences that will be monitored by the SDK.

```swift
public func setGeofences(_ geofences: LocatorGeofences) async
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSetGeofences() async {
    let geofences = LocatorGeofences(
      // Configure your geofences here
    )
    
    await LocatorServiceSdk.shared.setGeofences(geofences)
  }
}
```

### Function `setGroups`

Used to save the groups that will be used by the SDK and update the groups in MQTT.

```swift
public func setGroups(_ groups: LocatorGroups)
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSetGroups() {
    let groups = LocatorGroups(
      all: ["group_a", "group_b"]
    )
    
    LocatorServiceSdk.shared.setGroups(groups)
  }
}
```

### Function `setMutableLicense`

Used to define or update the license used by the SDK.

```swift
public func setMutableLicense(license: String)
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSetLicense() {
    let license = "your-license-key"
    LocatorServiceSdk.shared.setMutableLicense(license: license)
  }
}
```

### Function `setSdkMode`

Used to start the SDK in a specific mode.

```swift
public func setSdkMode(_ mode: LocatorSdkMode)
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSetSdkMode() {
    LocatorServiceSdk.shared.setSdkMode(.COLLECTING)
  }
}
```

### Function `setState`

Used to change the internal SDK state.

```swift
public func setState(_ state: LocatorState)
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsChangeStateToPause() {
    LocatorServiceSdk.shared.setState(.PAUSED)
  }
  
  func  didUserNeedsChangeStateToCollecting() {
    LocatorServiceSdk.shared.setState(.COLLECTING)
  }
}
```

### Function `sendEvents`

Used to send a package of custom events to the backend.

```swift
public func sendEvents(_ data: LocatorEventPackage) async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSendEvents() async {
    let events = LocatorEventPackage(
      // Configure your events here
    )
    
    do {
      try await LocatorServiceSdk.shared.sendEvents(events)
    } catch {
      print("Failed to send events: \(error.localizedDescription)")
    }
  }
}
```

### Function `sendLocations` (sem parâmetros)

Used to send collected locations that are stored locally.

```swift
public func sendLocations() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSendStoredLocations() async {
    do {
      try await LocatorServiceSdk.shared.sendLocations()
    } catch {
      print("Failed to send stored locations: \(error.localizedDescription)")
    }
  }
}
```

### Function `sendLocations` (com parâmetro)

Used to send a specific package of collected location data to the backend.

```swift
public func sendLocations(_ data: LocatorCollectPackage) async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSendLocationsPackage() async {
    let collectPackage = LocatorCollectPackage(
      // Configure your collected locations here
    )
    
    do {
      try await LocatorServiceSdk.shared.sendLocations(collectPackage)
    } catch {
      print("Failed to send locations package: \(error.localizedDescription)")
    }
  }
}
```

### Function `start`

Used to fully start the SDK, performing the entire required initialization flow.

```swift
public func start() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsStartSdk() async {
    do {
      try await LocatorServiceSdk.shared.start()
    } catch {
      print("Failed to start SDK: \(error.localizedDescription)")
    }
  }
}
```

### Function `stop`

Used to stop the SDK.

```swift
public func stop() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsStopSdk() async {
    do {
      try await LocatorServiceSdk.shared.stop()
    } catch {
      print("Failed to stop SDK: \(error.localizedDescription)")
    }
  }
}
```

### Function `syncAll`

Used to synchronize all relevant SDK data with the backend.

```swift
public func syncAll() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSyncAll() async {
    do {
      try await LocatorServiceSdk.shared.syncAll()
    } catch {
      print("Failed to sync all: \(error.localizedDescription)")
    }
  }
}
```

### Function `syncConfig`

Used to synchronize only the SDK configuration with the backend.

```swift
public func syncConfig() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSyncConfig() async {
    do {
      try await LocatorServiceSdk.shared.syncConfig()
    } catch {
      print("Failed to sync config: \(error.localizedDescription)")
    }
  }
}
```

### Function `syncFeatures`

Used to synchronize the available features with the backend.

```swift
public func syncFeatures() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSyncFeatures() async {
    do {
      try await LocatorServiceSdk.shared.syncFeatures()
    } catch {
      print("Failed to sync features: \(error.localizedDescription)")
    }
  }
}
```

### Function `syncGeofences`

Used to synchronize only the geofences with the backend.

```swift
public func syncGeofences() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSyncGeofences() async {
    do {
      try await LocatorServiceSdk.shared.syncGeofences()
    } catch {
      print("Failed to sync geofences: \(error.localizedDescription)")
    }
  }
}
```

### Function `syncGroups`

Used to synchronize groups with the backend and update the groups used by MQTT.

```swift
public func syncGroups() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSyncGroups() async {
    do {
      try await LocatorServiceSdk.shared.syncGroups()
    } catch {
      print("Failed to sync groups: \(error.localizedDescription)")
    }
  }
}
```

### Function `syncScopes`

Used to synchronize additional scopes with the backend.

```swift
public func syncScopes() async throws
```
Example usage:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSyncScopes() async {
    do {
      try await LocatorServiceSdk.shared.syncScopes()
    } catch {
      print("Failed to sync scopes: \(error.localizedDescription)")
    }
  }
}
```