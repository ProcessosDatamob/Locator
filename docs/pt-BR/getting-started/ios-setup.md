# iOS Setup

[< Voltar](../README.md)

Bem-vindo à documentação oficial de **Como implementar a SDK Locator iOS**.

---

## Adicionar SDK

Para adicionar o pacote do SDK, primeiramente você deve gerar um token de autenticação dentro do `Azure Devops`. No painel do Azure Devops, acesse `User settings`, após acessar o user settings acessar a  seção de `Personal access tokens`.

Agora clique em `+ New Token` para criar um novo token. Ao criar o novo token certifique-se que ele tenha a permissão de `Read` dentro de seção `Code`. 

Após criar o `Token`, para adicionar o pacote do SDK, deve-se ir no `xcode -> File -> Add Package Dependencies...`.

Ao abrir o dialog do Package Manager, deve ser ir no input de `Search or Enter Package URL`, e buscar pelo SDK com o seguinte formato de URL abaixo:

`https://automator:AZURE_TOKEN@dev.azure.com/datamob/DTB-VIVO-LOCATOR/_git/dtb-vivo-locator-ios`

Preferencialmente, selecionar como `Dependency Rule`, `Up to Next Major Version`

---

## Pemissões

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

## Inicialização

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

## Push Notification

Para que os `Push Notifications` executem os comandos recebebidos basta implementar o código abaixo dentro do método `func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void)` no `AppDelegate` do seu aplicativo.

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