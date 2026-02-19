# Exemplos iOS

[< Back](../README.md)

This document contains practical examples of using the Locator SDK for iOS.

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

## Models

To view the complete Swift templates, see [Templates](../examples/models.md).
