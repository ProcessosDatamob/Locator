# Exemplos iOS

[< Voltar](../README.md)

Este documento contém exemplos práticos de uso do Locator SDK para iOS.

## Exemplo Completo de Inicialização e Configuração

Este exemplo mostra o fluxo completo de inicialização, configuração e início da SDK Locator.

### 1. Inicialização Básica

A inicialização básica da SDK é feita no `AppDelegate`:

```swift
import LocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Inicialização básica
        LocatorSDK.shared.initialize()
        return true
    }
}
```

### 2. Inicialização com Configuração

Alternativamente, você pode inicializar a SDK passando a configuração diretamente no método `initialize`:

```swift
import LocatorSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Criar a configuração antes da inicialização
        let config = createLocatorConfig()
        
        // Inicializar com configuração
        LocatorSDK.shared.initialize(config: config)
        
        return true
    }
    
    private func createLocatorConfig() -> LocatorConfig {
        return LocatorConfig(
            license: "SUA_LICENCA_AQUI",
            sdkVersion: "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                clientId: "ios-client-\(UUID().uuidString)",
                broker: "mqtt.example.com",
                port: "8883",
                username: "mqtt-user"
            ),
            api: LocatorApiConfig(
                token: "JWT_TOKEN_TEMPORARIO",
                certUrl: "https://api.example.com/cert",
                scopesUrl: "https://api.example.com/scopes",
                tokenUrl: "https://api.example.com/token",
                configUrl: "https://api.example.com/config",
                groupsUrl: "https://api.example.com/groups",
                featuresUrl: "https://api.example.com/features",
                geofencesUrl: "https://api.example.com/geofences"
            ),
            process: LocatorProcessConfig(
                retryPolicy: LocatorRetryPolicy(
                    maxRetries: 3,
                    baseDelayMs: 1000,
                    backoffFactor: 2.0
                ),
                offlineRetentionDays: 7,
                foregroundServiceNotification: nil // iOS não requer foreground service notification
            ),
            battery: LocatorBatteryConfig(
                events: [
                    LocatorBatteryEvent(
                        name: "low_battery",
                        min: 0,
                        max: 20,
                        interval: 3600000, // 1 hora em milissegundos
                        charging: false,
                        powerMode: [.normal]
                    )
                ]
            ),
            motion: LocatorMotionConfig(
                sensitivity: 0.5
            ),
            collect: LocatorCollectConfig(
                collectIntervalMillis: 30000, // 30 segundos
                sendIntervalMillis: 60000, // 1 minuto
                minDisplacementMeters: 10.0,
                maxTravelDistanceMeters: 1000.0,
                highAccuracy: true,
                maxBatchSize: 50
            )
        )
    }
}
```

### 3. Fluxo Completo: Obter Instância, Configurar e Iniciar

Exemplo completo mostrando todo o fluxo de configuração:

```swift
import LocatorSDK
import UIKit

class ViewController: UIViewController {
    var sdk: LocatorSDK?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Configurar e iniciar a SDK
        setupLocatorSDK()
    }
    
    private func setupLocatorSDK() {
        // 1. Obter instância da SDK
        switch LocatorSDK.shared() {
        case .success(let instance):
            self.sdk = instance
            
            // 2. Registrar integrador customizado (opcional)
            registerCustomIntegration()
            
            // 3. Configurar a SDK
            configureSDK()
            
            // 4. Verificar permissões antes de iniciar
            checkPermissionsAndStart()
            
        case .failure(let error):
            if let locatorError = error as? LocatorSDKError, locatorError == .notInitialized {
                print("SDK não inicializada. Inicialize no AppDelegate.")
                // Tentar inicializar aqui se necessário
                LocatorSDK.shared.initialize()
                setupLocatorSDK() // Tentar novamente
            } else {
                print("Erro ao obter instância: \(error.localizedDescription)")
            }
        }
    }
    
    private func registerCustomIntegration() {
        guard let sdk = sdk else { return }
        
        // Registrar integrador customizado (opcional)
        // Se não registrar, será usado o DefaultLocatorSDKIntegrationApiImpl
        sdk.registerIntegration(integration: CustomLocatorIntegration())
    }
    
    // Exemplo de integrador customizado
    class CustomLocatorIntegration: LocatorIntegration {
        func getCert(payload: LocatorRequestApiCert) async throws -> LocatorResponseApiCert {
            // Implementação customizada para obter certificado
            return try await yourApiService.getCert(payload: payload)
        }
        
        func getToken(payload: LocatorRequestApiToken) async throws -> LocatorResponseApiToken {
            // Implementação customizada para obter token
            return try await yourApiService.getToken(payload: payload)
        }
        
        func getScopes(payload: LocatorRequestApiScopes) async throws -> LocatorResponseApiScopes {
            return try await yourApiService.getScopes(payload: payload)
        }
        
        func getFeatures(payload: LocatorRequestApiFeatures) async throws -> LocatorResponseApiFeatures {
            return try await yourApiService.getFeatures(payload: payload)
        }
        
        func getConfig(payload: LocatorRequestApiConfig) async throws -> LocatorResponseApiConfig {
            return try await yourApiService.getConfig(payload: payload)
        }
        
        func getGroups(payload: LocatorRequestApiGroups) async throws -> LocatorResponseApiGroups {
            return try await yourApiService.getGroups(payload: payload)
        }
        
        func getGeofences(payload: LocatorRequestApiGeofences) async throws -> LocatorResponseApiGeofences {
            return try await yourApiService.getGeofences(payload: payload)
        }
    }
    
    private func configureSDK() {
        guard let sdk = sdk else { return }
        
        // Criar configuração completa
        let config = LocatorConfig(
            license: "LICENSE_12345",
            sdkVersion: "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                clientId: "ios-\(Int64(Date().timeIntervalSince1970 * 1000))",
                broker: "mqtt.seuservidor.com",
                port: "8883",
                username: "mqtt-username"
            ),
            api: LocatorApiConfig(
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                certUrl: "https://api.seuservidor.com/v1/cert",
                scopesUrl: "https://api.seuservidor.com/v1/scopes",
                tokenUrl: "https://api.seuservidor.com/v1/token",
                configUrl: "https://api.seuservidor.com/v1/config",
                groupsUrl: "https://api.seuservidor.com/v1/groups",
                featuresUrl: "https://api.seuservidor.com/v1/features",
                geofencesUrl: "https://api.seuservidor.com/v1/geofences"
            ),
            process: LocatorProcessConfig(
                retryPolicy: LocatorRetryPolicy(
                    maxRetries: 5,
                    baseDelayMs: 2000,
                    backoffFactor: 1.5
                ),
                offlineRetentionDays: 10,
                foregroundServiceNotification: nil
            ),
            battery: LocatorBatteryConfig(
                events: [
                    LocatorBatteryEvent(
                        name: "battery_low",
                        min: 0,
                        max: 15,
                        interval: 1800000, // 30 minutos
                        charging: false,
                        powerMode: [.normal, .lowPower]
                    ),
                    LocatorBatteryEvent(
                        name: "battery_charging",
                        min: 80,
                        max: 100,
                        interval: 600000, // 10 minutos
                        charging: true,
                        powerMode: [.normal]
                    )
                ]
            ),
            motion: LocatorMotionConfig(
                sensitivity: 0.7
            ),
            collect: LocatorCollectConfig(
                collectIntervalMillis: 15000, // 15 segundos
                sendIntervalMillis: 30000, // 30 segundos
                minDisplacementMeters: 5.0,
                maxTravelDistanceMeters: 500.0,
                highAccuracy: false,
                maxBatchSize: 100
            )
        )
        
        // Aplicar configuração
        sdk.setConfig(config: config)
    }
    
    private func checkPermissionsAndStart() {
        guard let sdk = sdk else { return }
        
        // Verificar permissões pendentes
        let pendingPermissions = sdk.pendingPermissions()
        
        if pendingPermissions.isEmpty {
            // Todas as permissões concedidas, pode iniciar
            startSDK()
        } else {
            // Solicitar permissões faltantes
            requestPermissions(pendingPermissions)
        }
    }
    
    private func requestPermissions(_ permissions: [String]) {
        // Implementar lógica de solicitação de permissões
        // No iOS, você precisa solicitar permissões de localização usando CLLocationManager
        // Após conceder permissões, chamar startSDK()
        
        let locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        // ou locationManager.requestAlwaysAuthorization() para background
    }
    
    private func startSDK() {
        guard let sdk = sdk else { return }
        
        do {
            try sdk.start()
            print("SDK iniciada com sucesso!")
        } catch let error as LocatorSDKError {
            switch error {
            case .missingPermissions:
                print("Permissões faltando. Solicite permissões novamente.")
                checkPermissionsAndStart()
            case .noConfigSet:
                print("Configuração não definida. Configure novamente.")
                configureSDK()
            default:
                print("Erro ao iniciar SDK: \(error.localizedDescription)")
            }
        } catch {
            print("Erro desconhecido ao iniciar SDK: \(error.localizedDescription)")
        }
    }
}

// MARK: - CLLocationManagerDelegate
extension ViewController: CLLocationManagerDelegate {
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status {
        case .authorizedWhenInUse, .authorizedAlways:
            // Permissões concedidas, iniciar SDK
            startSDK()
        case .denied, .restricted:
            print("Permissões de localização negadas.")
        case .notDetermined:
            break
        @unknown default:
            break
        }
    }
}
```

### 4. Exemplo com Combine (Arquitetura Moderna)

Para uma arquitetura mais moderna usando Combine:

```swift
import LocatorSDK
import Combine
import UIKit

class LocatorManager: ObservableObject {
    @Published var sdkStatus: String = "Não inicializada"
    @Published var permissionsNeeded: [String] = []
    
    private var sdk: LocatorSDK?
    private var cancellables = Set<AnyCancellable>()
    
    func initializeSDK() {
        switch LocatorSDK.shared() {
        case .success(let instance):
            self.sdk = instance
            setupSDK()
        case .failure(let error):
            sdkStatus = "Erro: \(error.localizedDescription)"
        }
    }
    
    private func setupSDK() {
        guard let sdk = sdk else { return }
        
        // Configurar integrador
        sdk.registerIntegration(integration: LocatorSDKIntegrationApiImpl())
        
        // Criar e aplicar configuração
        let config = buildLocatorConfig()
        sdk.setConfig(config: config)
        
        // Verificar permissões
        let pendingPermissions = sdk.pendingPermissions()
        if pendingPermissions.isEmpty {
            startSDK()
        } else {
            permissionsNeeded = pendingPermissions
            sdkStatus = "Aguardando permissões"
        }
    }
    
    private func buildLocatorConfig() -> LocatorConfig {
        return LocatorConfig(
            license: "YOUR_LICENSE",
            sdkVersion: "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                clientId: "client-\(UUID().uuidString)",
                broker: "mqtt.example.com",
                port: "8883"
            ),
            api: LocatorApiConfig(
                token: "YOUR_JWT_TOKEN",
                certUrl: "https://api.example.com/cert",
                scopesUrl: "https://api.example.com/scopes",
                tokenUrl: "https://api.example.com/token",
                configUrl: "https://api.example.com/config",
                groupsUrl: "https://api.example.com/groups",
                featuresUrl: "https://api.example.com/features",
                geofencesUrl: "https://api.example.com/geofences"
            ),
            process: LocatorProcessConfig(
                retryPolicy: LocatorRetryPolicy(
                    maxRetries: 3,
                    baseDelayMs: 1000,
                    backoffFactor: 2.0
                ),
                offlineRetentionDays: 7,
                foregroundServiceNotification: nil
            ),
            collect: LocatorCollectConfig(
                collectIntervalMillis: 30000,
                sendIntervalMillis: 60000,
                minDisplacementMeters: 10.0,
                highAccuracy: true
            )
        )
    }
    
    func startSDK() {
        guard let sdk = sdk else { return }
        
        do {
            try sdk.start()
            sdkStatus = "SDK iniciada com sucesso"
        } catch {
            sdkStatus = "Erro: \(error.localizedDescription)"
        }
    }
}

// Uso no ViewController
class ViewController: UIViewController {
    @ObservedObject private var locatorManager = LocatorManager()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        locatorManager.initializeSDK()
        
        // Observar mudanças de status
        locatorManager.$sdkStatus
            .sink { [weak self] status in
                print("Status da SDK: \(status)")
            }
            .store(in: &cancellables)
    }
}
```

### 5. Exemplo com Async/Await (Swift 5.5+)

Para uma abordagem mais moderna usando async/await:

```swift
import LocatorSDK

class LocatorService {
    private var sdk: LocatorSDK?
    
    func setupAndStart() async throws {
        // 1. Obter instância
        guard case .success(let instance) = LocatorSDK.shared() else {
            throw LocatorSDKError.notInitialized
        }
        
        sdk = instance
        
        // 2. Registrar integrador
        sdk?.registerIntegration(integration: LocatorSDKIntegrationApiImpl())
        
        // 3. Configurar
        let config = await buildConfig()
        sdk?.setConfig(config: config)
        
        // 4. Verificar e solicitar permissões se necessário
        let pendingPermissions = sdk?.pendingPermissions() ?? []
        if !pendingPermissions.isEmpty {
            await requestPermissions(pendingPermissions)
        }
        
        // 5. Iniciar
        try sdk?.start()
    }
    
    private func buildConfig() async -> LocatorConfig {
        // Buscar configuração do servidor se necessário
        return LocatorConfig(
            license: "YOUR_LICENSE",
            sdkVersion: "1.0.0",
            osPlatform: OS_PLATFORM_IOS,
            mqtt: LocatorMqttConfig(
                clientId: UUID().uuidString,
                broker: "mqtt.example.com",
                port: "8883"
            ),
            api: LocatorApiConfig(
                token: "YOUR_JWT_TOKEN",
                certUrl: "https://api.example.com/cert",
                scopesUrl: "https://api.example.com/scopes",
                tokenUrl: "https://api.example.com/token",
                configUrl: "https://api.example.com/config",
                groupsUrl: "https://api.example.com/groups",
                featuresUrl: "https://api.example.com/features",
                geofencesUrl: "https://api.example.com/geofences"
            ),
            process: LocatorProcessConfig(
                retryPolicy: LocatorRetryPolicy(
                    maxRetries: 3,
                    baseDelayMs: 1000,
                    backoffFactor: 2.0
                ),
                offlineRetentionDays: 7,
                foregroundServiceNotification: nil
            ),
            collect: LocatorCollectConfig(
                collectIntervalMillis: 30000,
                sendIntervalMillis: 60000,
                minDisplacementMeters: 10.0,
                highAccuracy: true
            )
        )
    }
    
    private func requestPermissions(_ permissions: [String]) async {
        // Implementar solicitação de permissões
        // Usar continuation para converter callback em async
    }
}

// Uso
Task {
    do {
        try await locatorService.setupAndStart()
        print("SDK configurada e iniciada com sucesso")
    } catch {
        print("Erro: \(error)")
    }
}
```

## Modelos

Para ver os modelos completos em Swift, consulte [Modelos](../examples/models.md).
