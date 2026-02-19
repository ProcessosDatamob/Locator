# iOS Setup

[< Voltar](../README.md)

Bem-vindo à documentação oficial de **Como implementar a SDK Locator iOS**.

---

## Permissions

O SDK necessita que sejam solicitadas algumas permissões ao usuário para que as funcionalidades possam funcionar. Para isso você precisa adicionar as seguintes chaves abaixo no arquivo `info.plist` do seu aplicativo.

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

O SDK necessita que sejam adicionadas algumas capabilities ao aplicativo. Para isso você precisa adicionar as seguintes chaves abaixo no arquivo `info.plist` do seu aplicativo.

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

O SDK necessita que sejam adicionados os identificadores das tarefas que serão agendadas para serem executadas em background. Para isso você precisa adicionar as seguintes chaves abaixo no arquivo `info.plist` do seu aplicativo.

```xml
<key>BGTaskSchedulerPermittedIdentifiers</key>
<array>
    <string>br.net.datamob.locator.background.task.location</string>
</array>
```

---

## Initialization

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

---

## Funções Disponíveis

O SDK conta com diversas funções disponíveis para configurar e obter dados. Abaixo vamos listar e explicar cada uma delas, com exemplos simples utilizando a classe `MyClass`.

### Função `destroy`

Utilizado para apagar os registros coletados e que estão persistidos no dispositivo e colocar o SDK em modo default.

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

