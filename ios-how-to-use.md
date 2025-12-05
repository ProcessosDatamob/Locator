
# Documentação - iOS Como Usar - Swift

[< Voltar](../README.md)

Bem-vindo à documentação oficial de **Como implementar a SDK Locator iOS**.
A SDK segue a definição descrita em **Serviço principal - SDK**.

---

## Inicialização

Para a inicialização da SDK, deve-se acessar a instância **compartilhada** (`shared`) da classe principal, garantindo que o ambiente esteja preparado no ciclo de vida da aplicação (geralmente no `AppDelegate`).

  

```swift
import LocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func  application(_  application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
		// Inicialização do Singleton da SDK
		// Prepara o ambiente para uso.
		LocatorSDK.shared.initialize()
		return  true
	}
	// ...
}
```
  

## Instância da SDK

Para utilizar a SDK será necessário um get da instância da SDK, isto pode ser feito através do:

  

static  func  shared() -> Result<LocatorSDK, LocatorSDKError>

  

Observação: No Swift, o padrão Result é usado para tratar sucesso ou falha. A exceção em Kotlin é mapeada para um Error específico no Swift.

  

```swift
class ViewController: UIViewController {
	var sdk: LocatorSDK
	override  func  viewDidLoad() {
		super.viewDidLoad()

		switch LocatorSDK.shared() {
			case .success(let instance):
				self.sdk = instance
			case .failure(let error):
				print("Erro ao obter instância da SDK: \(error.localizedDescription)")
				if  let locatorError = error as? LocatorSDKError, locatorError == .notInitialized {
				// Tentar inicializar ou mostrar uma mensagem de erro
				}
		}
	}
}
  ```

---

  
## Configuração

Após a aquisição da instância é necessário configurar o Integrador e `LocatorConfig` que será o configurador da SDK.

Por definição a SDk contará com um Integrador default (`DefaultLocatorSDKIntegrationApiImpl`), que ao não ser configurado um novo tomará este como padrão de uso.

  

### Integrador (LocatorIntegration)

O Integrador faz uso do protocolo `LocatorIntegration`:

  

```swift
protocol  LocatorIntegration {
	func  getCert(payload: LocatorRequestApiCert) async  throws -> LocatorResponseApiCert
	func  getToken(payload: LocatorRequestApiToken) async  throws -> LocatorResponseApiToken
	func  getScopes(payload: LocatorRequestApiScopes) async  throws -> LocatorResponseApiScopes
	func  getFeatures(payload: LocatorRequestApiFeatures) async  throws -> LocatorResponseApiFeatures
	func  getConfig(payload: LocatorRequestApiConfig) async  throws -> LocatorResponseApiConfig
	func  getGroups(payload: LocatorRequestApiGroups) async  throws -> LocatorResponseApiGroups
	func  getGeofences(payload: LocatorRequestApiGeofences) async  throws -> LocatorResponseApiGeofences
}
```
---

Caso da necessidade de uma nova implementação, apenas implementar este protocolo. Para configuração do Integrador utilizar o método `func registerIntegration(integration: LocatorIntegration)`.

```swift
func configureSDK() {
    switch LocatorSDK.shared() {
    case .success(let sdk):
        // ...
        sdk.registerIntegration(integration: LocatorSDKIntegrationApiImpl())
        // ...
    case .failure(_):
        // Tratar erro
        break
    }
}
```


### LocatorConfig

Struct utilizada para configurar a SDK

```swift
struct LocatorConfig {
    let license: String
    let sdkVersion: String // Equivalente a BuildConfig.LIBRARY_VERSION
    let osPlatform: String = OS_PLATFORM_IOS
    let mqtt: LocatorMqttConfig
    let api: LocatorApiConfig
    let process: LocatorProcessConfig
    let battery: LocatorBatteryConfig?
    let motion: LocatorMotionConfig?
    let collect: LocatorCollectConfig?
    let revision: Int? // Tipo Long em Kotlin é Int/Int64 em Swift
    let createdAt: Int?
    let updatedAt: Int?
}
```

```swift
func configureSDK() {
    switch LocatorSDK.shared() {
    case .success(let sdk):
        // ...
        // TODO configure todos os parâmetros necessários do LocatorConfig
        let config = LocatorConfig(
            license: "SUA_LICENCA", 
            sdkVersion: "1.0.0", 
            mqtt: LocatorMqttConfig(/*...*/), 
            api: LocatorApiConfig(/*...*/), 
            process: LocatorProcessConfig(/*...*/)
        )
        
        sdk.setConfig(config: config)
        // ...
    case .failure(_):
        // Tratar erro
        break
    }
}
````
### Inicialização do Funcionamento da SDK

Caso tudo esteja configurado, pode-se chamar o método `start` da sdk. Com isso a SDK começará a coleta das localizações.

```swift
func configureSDK() {
    switch LocatorSDK.shared() {
    case .success(let sdk):
        // ...
        do {
            try sdk.start()
        } catch let error as LocatorSDKError {
            // Tratar as exceções específicas da SDK mapeadas para `LocatorSDKError`
            print("Erro ao iniciar a SDK: \(error.localizedDescription)")
        } catch {
            print("Erro desconhecido ao iniciar a SDK: \(error.localizedDescription)")
        }
        // ...
    case .failure(_):
        // Tratar erro
        break
    }
}
```

### Comandos 
Para validar se um comando deve ser executado pela SDK Locator, faça uso do método `isLocatorSDKCommand`. Caso seja de propriedade da SDK, utilize `convertLocatorSDKCommand` para converter a mensagem e `execute` para que a SDK rode o comando. Ambos os métodos são pertencentes a classe `LocatorSDK` como métodos estáticos/de classe, sendo assim não há necessidade de uma instância para realizar a chamada dos métodos. 

 Observação: A notificação de mensagem remota é tratada no `AppDelegate` no método `application(_:didReceiveRemoteNotification:fetchCompletionHandler:)` ou métodos relacionados em uma classe de serviço, se aplicável.

```swift
import Foundation
import UserNotifications // Necessário se estiver no AppDelegate

// Assumindo que esta função é chamada após a recepção de dados do FCM 
// (e.g., dentro do AppDelegate no método 'application(_:didReceiveRemoteNotification:fetchCompletionHandler:)')
func handleRemoteMessage(userInfo: [AnyHashable: Any]) {
    
    // Obter a instância da SDK. Assumindo que a inicialização ocorreu no AppDelegate.
    guard case .success(let sdk) = LocatorSDK.shared() else {
        print("Erro: LocatorSDK não inicializada ou indisponível.")
        return 
    }
    
    // Equivale a 'message.data' no Android
    let notificationMsg = userInfo 

    if LocatorSDK.isLocatorSDKCommand(notificationMsg: notificationMsg) {
        // Chamada ao método de conversão que retorna um Result<LocatorCommand, Error>
        switch LocatorSDK.convertLocatorSDKCommand(notificationMsg: notificationMsg) {
            
        case .success(let command):
            // Equivale a .onSuccess { sdk.execute(command = it) }
            do {
                try sdk.execute(command: command)
                print("Comando da SDK executado com sucesso.")
            } catch {
                // Tratar erros de execução do comando (se execute for um método throw)
                print("Erro ao executar o comando da SDK: \(error.localizedDescription)")
            }

        case .failure(let exception):
            // Equivale a .onFailure { exception -> ... }
            // exception é do tipo LocatorSDKCommandConverterError (ou similar)
            print("Erro de conversão de comando: \(exception.localizedDescription)")
        }
    }
}