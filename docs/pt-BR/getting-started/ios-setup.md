
# Configuração iOS

[< Voltar](../README.md)

Bem-vindo à documentação oficial de **Como implementar a SDK Locator iOS**.

A SDK segue a definição descrita em [LocatorService](../reference/service.md).

---

## Inicialização

Para a inicialização da SDK, deve-se acessar a instância **compartilhada** (`shared`) da classe principal, garantindo que o ambiente esteja preparado no ciclo de vida da aplicação (geralmente no `AppDelegate`).

  

```swift
import AppLocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func  application(_  application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
		// Inicialização do Singleton da SDK
		// Prepara o ambiente para uso.
		let locatorSdk = LocatorServiceSdk.shared
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
	var sdk: LocatorServiceSdk
	override  func  viewDidLoad() {
		super.viewDidLoad()

		switch LocatorServiceSdk.shared {
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

## Inicialização e Configuração

Para utilizar a SDK, é necessário realizar a inicialização, obter a instância e configurá-la. O processo completo pode ser feito através de uma função unificada que recebe um `LocatorConfig` e executa todos os passos sequencialmente.

### Passo 1: Inicialização no AppDelegate

Primeiro, inicialize a SDK no `AppDelegate` da sua aplicação:

```swift
import AppLocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Inicialização do Singleton da SDK
        // Prepara o ambiente para uso.
        LocatorServiceSdk.shared.initSDK()
        return true
    }
    // ...
}
```

### Passo 2: Configuração Completa

Após a inicialização, você pode configurar a SDK de forma unificada. A função abaixo recebe um `LocatorConfig` e executa todos os passos necessários:

```swift
/**
 * Configura e inicia a SDK Locator de forma sequencial.
 *
 * - Parameter config: Configuração da SDK (LocatorConfig)
 * - Returns: Result<Bool, Error> indicando sucesso ou falha
 */
func setupLocatorSDK(
    config: LocatorConfig
) -> Result<Bool, Error> {

    // 1. Garantir que a SDK está inicializada
    let locatorServiceSdk = LocatorServiceSdk.shared

    // 2. Obter a instância da SDK
    switch locatorServiceSdk {

    case .success(let sdk):

        // 3. Configurar a SDK com o LocatorConfig
        sdk.setConfig(config: config)

        // 4. Iniciar a SDK
        do {
            try sdk.start()
            return .success(true)

        } catch let error as LocatorSDKError {
            print("Erro ao iniciar SDK: \(error.localizedDescription)")
            // Sugestão:
            // - verificar permissões pendentes via getPendingPermissions()
            // - validar se a configuração está completa
            return .failure(error)

        } catch {
            print("Erro desconhecido ao iniciar SDK: \(error.localizedDescription)")
            return .failure(error)
        }

    case .failure(let error):
        // Erro ao obter instância da SDK
        print("Erro ao obter instância da SDK: \(error.localizedDescription)")
        return .failure(error)
    }
}
```

### Exemplo de Uso

```swift
class ViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Criar o LocatorConfig com todas as configurações necessárias
        let locatorConfig = LocatorConfig(
            license: "sua-licenca-aqui",
            sdkVersion: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                // Configurações MQTT
            ),
            api: LocatorApiConfig(
                // Configurações de API
            ),
            process: LocatorProcessConfig(
                // Configurações de processo
            ),
            battery: LocatorBatteryConfig(
                // Configurações de bateria (opcional)
            ),
            motion: LocatorMotionConfig(
                // Configurações de movimento (opcional)
            ),
            collect: LocatorCollectConfig(
                // Configurações de coleta (opcional)
            )
        )
        
        // Configurar a SDK de forma unificada
        switch setupLocatorSDK(config: locatorConfig) {
        case .success(let success):
            if success {
                print("SDK configurada e iniciada com sucesso")
                // SDK pronta para uso
            }
        case .failure(let error):
            print("Erro ao configurar SDK: \(error.localizedDescription)")
            if let locatorError = error as? LocatorSDKError {
                switch locatorError {
                case .notInitialized:
                    // SDK não foi inicializada
                    break
                case .noConfigSet:
                    // Configuração não definida
                    break
                case .missingPermissions:
                    // Permissões faltando
                    break
                default:
                    // Outros erros
                    break
                }
            }
        }
    }
}
```

### Estrutura do LocatorConfig

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

### Integrador (LocatorIntegration)

O Integrador faz uso do protocolo `LocatorIntegration`:

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

Por padrão, a SDK utiliza o `DefaultLocatorSDKIntegrationApiImpl`. Caso precise de uma implementação customizada, apenas implemente o protocolo e passe como parâmetro na função `setupLocatorSDK`.

### Exceções

As exceções da SDK são mapeadas para o enum `LocatorSDKError`:

```swift
enum LocatorSDKError: Error {
    case notInitialized
    case noConfigSet
    case missingPermissions
    // Outros casos de erro
}
```

### Iniciando a Coleta de Localizações

Após a configuração, você pode iniciar a coleta de localizações chamando o método `start()` da SDK. Isso pode ser feito automaticamente através do parâmetro `autoStart = true` na função `setupLocatorSDK`, ou manualmente:

```swift
// Iniciar manualmente após configuração
switch LocatorServiceSdk.shared {
case .success(let sdk):
    do {
        try sdk.start()
        print("Coleta de localizações iniciada")
    } catch let error as LocatorSDKError {
        print("Erro ao iniciar: \(error.localizedDescription)")
        // Verificar permissões pendentes ou configuração faltando
    } catch {
        print("Erro desconhecido: \(error.localizedDescription)")
    }
case .failure(let error):
    print("Erro ao obter instância: \(error.localizedDescription)")
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
    guard case .success(let sdk) = locatorServiceSdk.shared else {
        print("Erro: LocatorSDK não inicializada ou indisponível.")
        return 
    }
    
    // Equivale a 'message.data' no Android
    let notificationMsg = userInfo 

    if LocatorServiceSdk.isLocatorSDKCommand(notificationMsg: notificationMsg) {
        // Chamada ao método de conversão que retorna um Result<LocatorCommand, Error>
        switch LocatorServiceSdk.convertLocatorSDKCommand(notificationMsg: notificationMsg) {
            
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