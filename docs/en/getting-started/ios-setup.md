# iOS Setup

[< Back](../README.md)

Welcome to the official documentation of ***How to implement the Locator iOS SDK***.

---

## Add SDK

Para adicionar o pacote do SDK, primeiramente você deve gerar um token de autenticação dentro do `Azure Devops`. No painel do Azure Devops, acesse `User settings`, após acessar o user settings acessar a  seção de `Personal access tokens`.

Now click on `+ New Token` to create a new token. When creating the new token, make sure it has `Read` permission within the `Code` section.

After creating the `Token`, to add the SDK package, you must go to `xcode -> File -> Add Package Dependencies...`.

When you open the Package Manager dialog, you should go to the `Search or Enter Package URL` input and search for the SDK using the following URL format below:

`https://automator:AZURE_TOKEN@dev.azure.com/datamob/DTB-VIVO-LOCATOR/_git/dtb-vivo-locator-ios`

Preferably, select `Up to Next Major Version` as the `Dependency Rule`.

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

## Push Notification

For `Push Notifications` to execute received commands, simply implement the code below within the `func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void)` method in your application's `AppDelegate`.

```swift
func userNotificationCenter(
  _ center: UNUserNotificationCenter,
  willPresent notification: UNNotification,
  withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
) {
  if let data = notification.request.content.userInfo["data"] as? [String: Any],
      let payload = data["command"] as? String,
      let json = payload.data(using: .utf8),
      let command = try? JSONDecoder().decode(LocatorCommand.self, from: json) {
    Task {
      try? await LocatorServiceSdk.shared.execute(command)
    }
  }
  
  executeCommand()
  completionHandler([.banner, .badge, .sound])
}
```