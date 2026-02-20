# Exemplos iOS

[< Voltar](../README.md)

Este documento contém exemplos práticos de uso do Locator SDK para iOS.

Para ver os modelos completos em Swift, consulte [Modelos](../examples/models.md).

### 1. Inicialização Básica

Para começar a usar o SDK você precisa inicializar ele, recomendamos que você faça a inicialização no método `application(_:didFinishLaunchingWithOptions:)` do `AppDelegate`. Caso você não faça uso do arquivo `AppDelegate`, inicialize o SDK na classe que inicia o seu aplicativo.

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

### 2. Inicialização com configuração

Você pode inicializar o SDK com uma configuração prévia.

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

### 3. Inicialização com integrador

Você pode inicializar o SDK com um imtegrador personalizado. Para isso você precisa criar uma classe que implemente o protocolo `LocatorIntegration`, e passar essa classe no método  `registerIntegration(integration: any LocatorIntegration)`.

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

### 4. Exemplos de funções

O SDK conta com diversas funções disponíveis para configurar e obter dados. Abaixo vamos listar e explicar cada uma delas, com exemplos simples utilizando a classe `MyClass`.

### Função `destroy`

Utilizado para apagar os registros coletados e que estão persistidos no dispositivo e colocar o parar execução do SDK.

```swift
public func destroy() async throws
```

Exemplo de utilização:

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

Example usage

### Função `execute`

Utilizado para executar um comando específico.

```swift
public func execute(_ command: LocatorCommand) async throws -> LocatorCommandResult?
```

Exemplo de utilização:

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

Example usage

### Função `getConfig`

Utilizado para obter as configurações atuais do SDK.

```swift
public func getConfig() -> LocatorConfig?
```

Exemplo de utilização:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetConfig() {
    let configs = LocatorServiceSdk.shared.getConfig()
    print("Current config: \(String(describing: configs))")
  }
}
```

Example usage

### Função `getFeatures`

Utilizado para obter a lista de funcionalidades disponíveis no SDK.

```swift
public func getFeatures() -> LocatorFeatures
```

Exemplo de utilização:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetFeatures() {
    let features = LocatorServiceSdk.shared.getFeatures()
    print("Features: \(features.features)")
  }
}
```

Example usage

### Função `getGroups`

Utilizado para obter os grupos configurados no SDK.

```swift
public func getGroups() -> LocatorGroups
```

Exemplo de utilização:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetGroups() {
    let groups = LocatorServiceSdk.shared.getGroups()
    print("Groups: \(groups.all)")
  }
}
```

Example usage

### Função `getJwtToken`

Utilizado para obter o token JWT utilizado na comunicação via WebSocket (WSS).

```swift
public func getJwtToken() -> String
```

Exemplo de utilização:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetJwtToken() {
    let token = LocatorServiceSdk.shared.getJwtToken()
    print("JWT Token: \(token)")
  }
}
```

Example usage

### Função `getSdkMode`

Utilizado para obter o modo atual de operação do SDK.

```swift
public func getSdkMode() -> LocatorSdkMode
```

Exemplo de utilização:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetSdkMode() {
    let mode = LocatorServiceSdk.shared.getSdkMode()
    print("SDK Mode: \(mode)")
  }
}
```

Example usage

### Função `getSession`

Utilizado para obter informações da sessão atual do SDK.

```swift
public func getSession() -> LocatorSession
```

Exemplo de utilização:

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

Example usage

### Função `getState`

Utilizado para obter o estado atual do SDK.

```swift
public func getState() -> LocatorState
```

Exemplo de utilização:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetState() {
    let state = LocatorServiceSdk.shared.getState()
    print("SDK State: \(state)")
  }
}
```

Example usage

### Função `getVersion`

Utilizado para obter a versão atual do SDK em uso.

```swift
public func getVersion() -> String
```

Exemplo de utilização:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsGetVersion() {
    let version = LocatorServiceSdk.shared.getVersion()
    print("SDK Version: \(version)")
  }
}
```

Example usage

### Função `pendingPermissions`

Utilizado para obter a lista de permissões que ainda precisam ser concedidas pelo usuário.

```swift
public func pendingPermissions() -> [LocatorPermission]
```

Exemplo de utilização:

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

Example usage

### Função `registerIntegration`

Utilizado para registrar ou substituir a integração utilizada pelo SDK.

```swift
public func registerIntegration(integration: any LocatorIntegration)
```

Exemplo de utilização:

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

Example usage

### Função `setConfig`

Utilizado para salvar e aplicar uma nova configuração do SDK.

```swift
public func setConfig(_ config: LocatorConfig)
```

Exemplo de utilização:

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

Example usage

### Função `setFeatures`

Utilizado para definir ou atualizar as funcionalidades disponíveis no SDK.

```swift
public func setFeatures(_ features: LocatorFeatures)
```

Exemplo de utilização:

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

Example usage

### Função `setGeofences`

Utilizado para configurar as geofences que serão monitoradas pelo SDK.

```swift
public func setGeofences(_ geofences: LocatorGeofences) async
```

Exemplo de utilização:

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

Example usage

### Função `setGroups`

Utilizado para salvar os grupos que serão utilizados pelo SDK e atualizar os grupos no MQTT.

```swift
public func setGroups(_ groups: LocatorGroups)
```

Exemplo de utilização:

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

Example usage

### Função `setMutableLicense`

Utilizado para definir ou atualizar a licença utilizada pelo SDK.

```swift
public func setMutableLicense(license: String)
```

Exemplo de utilização:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSetLicense() {
    let license = "your-license-key"
    LocatorServiceSdk.shared.setMutableLicense(license: license)
  }
}
```

Example usage

### Função `setSdkMode`

Utilizado para iniciar o SDK em um modo específico.

```swift
public func setSdkMode(_ mode: LocatorSdkMode)
```

Exemplo de utilização:

```swift
import AppLocatorSDK

class MyClass {
  func  didUserNeedsSetSdkMode() {
    LocatorServiceSdk.shared.setSdkMode(.COLLECTING)
  }
}
```

Example usage

### Função `setState`

Utilizado para alterar o estado interno do SDK.

```swift
public func setState(_ state: LocatorState)
```

Exemplo de utilização:

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

Example usage

### Função `sendEvents`

Utilizado para enviar um pacote de eventos personalizados ao backend.

```swift
public func sendEvents(_ data: LocatorEventPackage) async throws
```

Exemplo de utilização:

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

Example usage

### Função `sendLocations` (sem parâmetros)

Utilizado para enviar as localizações coletadas que estão armazenadas localmente.

```swift
public func sendLocations() async throws
```

Exemplo de utilização:

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

Example usage

### Função `sendLocations` (com parâmetro)

Utilizado para enviar um pacote de coletas de localização específico para o backend.

```swift
public func sendLocations(_ data: LocatorCollectPackage) async throws
```

Exemplo de utilização:

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

Example usage

### Função `start`

Utilizado para iniciar o SDK por completo, realizando todo o fluxo de inicialização necessário.

```swift
public func start() async throws
```

Exemplo de utilização:

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

Example usage

### Função `stop`

Utilizado para parar o SDK.

```swift
public func stop() async throws
```

Exemplo de utilização:

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

Example usage

### Função `syncAll`

Utilizado para sincronizar todos os dados relevantes do SDK com o backend.

```swift
public func syncAll() async throws
```

Exemplo de utilização:

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

Example usage

### Função `syncConfig`

Utilizado para sincronizar apenas as configurações do SDK com o backend.

```swift
public func syncConfig() async throws
```

Exemplo de utilização:

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

Example usage

### Função `syncFeatures`

Utilizado para sincronizar as funcionalidades disponíveis com o backend.

```swift
public func syncFeatures() async throws
```

Exemplo de utilização:

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

Example usage

### Função `syncGeofences`

Utilizado para sincronizar apenas as geofences com o backend.

```swift
public func syncGeofences() async throws
```

Exemplo de utilização:

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

Example usage

### Função `syncGroups`

Utilizado para sincronizar os grupos com o backend e atualizar os grupos utilizados pelo MQTT.

```swift
public func syncGroups() async throws
```

Exemplo de utilização:

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

Example usage

### Função `syncScopes`

Utilizado para sincronizar escopos adicionais com o backend.

```swift
public func syncScopes() async throws
```

Exemplo de utilização:

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