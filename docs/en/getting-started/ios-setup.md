# iOS Setup

[< Back](../README.md)

Welcome to the official documentation of ***How to implement the Locator iOS SDK***.

---

## Permissions

The SDK requires that some permissions be requested from the user in order for its features to work properly. To do this, you must add the following keys to your application's `info.plist` file.

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Este aplicativo precisa de acesso à localização para funcionar corretamente.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Este aplicativo precisa de acesso à localização em background para funcionar corretamente.</string>

<key>NSMicrophoneUsageDescription</key>
<string>Este aplicativo precisa de acesso ao microfone.</string>

<key>NSMotionUsageDescription</key>
<string>Este aplicativo precisa acessar os dados do acelerômetro para detectar quedas.</string>
```

---

## Capabilities

The SDK requires that certain capabilities be added to the application. To do this, you must add the following keys to your application's `info.plist` file.

```xml
<key>UIBackgroundModes</key>
<array>
    <string>fetch</string>
    <string>processing</string>
    <string>location</string>
</array>
```

---

## Background Tasks

The SDK requires that the identifiers of the tasks scheduled to run in the background be added. To do this, you must add the following keys to your application's `info.plist` file.

```xml
<key>BGTaskSchedulerPermittedIdentifiers</key>
<array>
    <string>br.net.datamob.locator.background.task.location</string>
</array>
```

---

## Initialization

To start using the SDK, you need to initialize it, we recommend initializing it inside the `application(_:didFinishLaunchingWithOptions:)` method of `AppDelegate`. If you are not using the `AppDelegate` file, initialize the SDK in the class that starts your application.

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

---

## Available Functions

The SDK provides several functions to configure and retrieve data. Below we list and explain each one, with simple examples using the `MyClass` class.

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

