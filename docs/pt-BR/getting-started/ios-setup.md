
# Configuração iOS

[< Voltar](../README.md)

Bem-vindo à documentação oficial de **Como implementar a SDK Locator iOS**.

A SDK segue a definição descrita em [LocatorService](../reference/service.md).

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

## Inicialização e Configuração

Para utilizar a SDK, é necessário realizar a inicialização, obter a instância e configurá-la. O processo completo pode ser feito através de uma função unificada que recebe um `LocatorConfig` e executa todos os passos sequencialmente.

### Passo 1: Inicialização no AppDelegate

Primeiro, inicialize a SDK no `AppDelegate` da sua aplicação:

```swift
import LocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Inicialização do Singleton da SDK
        // Prepara o ambiente para uso.
        LocatorSDK.shared.initialize()
        return true
    }
    // ...
}
```

### Passo 2: Configuração Completa

Após a inicialização, você pode configurar a SDK de forma unificada. A função abaixo recebe um `LocatorConfig` e opcionalmente um `LocatorIntegration`, executando todos os passos necessários:

```swift
/**
 * Configura a SDK Locator de forma completa e sequencial.
 * 
 * - Parameters:
 *   - config: Configuração da SDK (LocatorConfig)
 *   - integration: Integrador customizado (opcional). Se não fornecido, será usado o DefaultLocatorSDKIntegrationApiImpl
 *   - autoStart: Se true, inicia automaticamente a coleta após a configuração
 * - Returns: Result<LocatorSDK, Error> com a instância configurada ou erro
 */
func setupLocatorSDK(
    config: LocatorConfig,
    integration: LocatorIntegration? = nil,
    autoStart: Bool = false
) -> Result<LocatorSDK, Error> {
    // 1. Garantir que a SDK está inicializada
    LocatorSDK.shared.initialize()
    
    // 2. Obter a instância da SDK
    switch LocatorSDK.shared() {
    case .success(let sdk):
        // 3. Registrar o integrador (se fornecido)
        // Caso contrário, será usado o DefaultLocatorSDKIntegrationApiImpl
        if let integration = integration {
            sdk.registerIntegration(integration: integration)
        }
        
        // 4. Configurar a SDK com o LocatorConfig
        sdk.setConfig(config: config)
        
        // 5. Iniciar a SDK (se solicitado)
        if autoStart {
            do {
                try sdk.start()
            } catch let error as LocatorSDKError {
                print("Erro ao iniciar SDK: \(error.localizedDescription)")
                // Tratar permissões faltando ou configuração não definida
                return .failure(error)
            } catch {
                print("Erro desconhecido ao iniciar SDK: \(error.localizedDescription)")
                return .failure(error)
            }
        }
        
        return .success(sdk)
        
    case .failure(let error):
        print("Erro ao obter instância: \(error.localizedDescription)")
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
        
        // Opcional: Criar integrador customizado
        let customIntegration: LocatorIntegration? = nil // ou sua implementação customizada
        
        // Configurar a SDK de forma unificada
        switch setupLocatorSDK(
            config: locatorConfig,
            integration: customIntegration, // Opcional: nil para usar o padrão
            autoStart: true // Opcional: iniciar automaticamente após configuração
        ) {
        case .success(let sdk):
            print("SDK configurada e iniciada com sucesso")
            // SDK pronta para uso
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
switch LocatorSDK.shared() {
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