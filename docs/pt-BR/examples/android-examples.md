# Exemplos Android

[< Voltar](../README.md)

Este documento contém exemplos práticos de uso do Locator SDK para Android.

## Exemplo Completo de Inicialização e Configuração

Este exemplo mostra o fluxo completo de inicialização, configuração e início da SDK Locator.

### 1. Inicialização Básica

A inicialização básica da SDK é feita no `Application`:

```kotlin
class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        // Inicialização básica
        LocatorSDK.initialize(initContext = this)
    }
}
```

### 2. Inicialização com Configuração

Alternativamente, você pode inicializar a SDK passando a configuração diretamente no método `initialize`:

> **⚠️ IMPORTANTE:** Antes de chamar `start()`, é necessário setar o estado do SDK usando `setState(LocatorState.IDLE)`. Veja a seção 3 para o exemplo completo.

```kotlin
class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        
        // Criar a configuração antes da inicialização
        val config = createLocatorConfig()
        
        // Inicializar com configuração
        LocatorSDK.initialize(
            initContext = this,
            config = config
        )
    }
    
    private fun createLocatorConfig(): LocatorConfig {
        return LocatorConfig(
            license = "SUA_LICENCA_AQUI",
            sdkVersion = BuildConfig.LIBRARY_VERSION,
            osPlatform = OS_PLATFORM_ANDROID,
            mqtt = LocatorMqttConfig(
                clientId = "android-client-${UUID.randomUUID()}",
                broker = "mqtt.example.com",
                port = "8883",
                username = "mqtt-user"
            ),
            api = LocatorApiConfig(
                token = "JWT_TOKEN_TEMPORARIO",
                certUrl = "https://api.example.com/cert",
                scopesUrl = "https://api.example.com/scopes",
                tokenUrl = "https://api.example.com/token",
                configUrl = "https://api.example.com/config",
                groupsUrl = "https://api.example.com/groups",
                featuresUrl = "https://api.example.com/features",
                geofencesUrl = "https://api.example.com/geofences"
            ),
            process = LocatorProcessConfig(
                retryPolicy = LocatorRetryPolicy(
                    maxRetries = 3,
                    baseDelayMs = 1000L,
                    backoffFactor = 2.0
                ),
                offlineRetentionDays = 7,
                foregroundServiceNotification = ForegroundServiceNotification(
                    title = "Rastreamento Ativo",
                    message = "O Locator está coletando sua localização"
                )
            ),
            battery = LocatorBatteryConfig(
                events = listOf(
                    LocatorBatteryEvent(
                        name = "low_battery",
                        min = 0,
                        max = 20,
                        interval = 3600000L, // 1 hora
                        charging = false,
                        powerMode = listOf(LocatorPowerMode.NORMAL)
                    )
                )
            ),
            motion = LocatorMotionConfig(
                sensitivity = 0.5
            ),
            collect = LocatorCollectConfig(
                collectIntervalMillis = 30000L, // 30 segundos
                sendIntervalMillis = 60000L, // 1 minuto
                minDisplacementMeters = 10.0,
                maxTravelDistanceMeters = 1000.0,
                highAccuracy = true,
                maxBatchSize = 50
            )
        )
    }
}
```

### 3. Fluxo Completo: Obter Instância, Configurar e Iniciar

Exemplo completo mostrando todo o fluxo de configuração:

> **⚠️ IMPORTANTE:** Antes de inicializar o SDK, é necessário setar o estado do SDK. Para habilitar o funcionamento da SDK para usuários com a funcionalidade, chame o método `setState` com valor `LocatorState.IDLE` antes da chamada de `start()`.

```kotlin
class MainActivity : ComponentActivity() {
    private lateinit var sdk: LocatorSDK

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Configurar e iniciar a SDK
        setupLocatorSDK()
    }
    
    private fun setupLocatorSDK() {
        // 1. Obter instância da SDK
        LocatorSDK.getInstance()
            .onSuccess { instance ->
                sdk = instance
                
                // 2. Registrar integrador customizado (opcional)
                registerCustomIntegration()
                
                // 3. Configurar a SDK
                configureSDK()
                
                // 4. Verificar permissões antes de iniciar
                checkPermissionsAndStart()
            }
            .onFailure { exception ->
                when (exception) {
                    is LocatorSDKNotInitializedException -> {
                        Log.e("LocatorSDK", "SDK não inicializada. Inicialize no Application.")
                        // Tentar inicializar aqui se necessário
                        LocatorSDK.initialize(initContext = this)
                    }
                    else -> {
                        Log.e("LocatorSDK", "Erro ao obter instância: ${exception.message}")
                    }
                }
            }
    }
    
    private fun registerCustomIntegration() {
        // Registrar integrador customizado (opcional)
        // Se não registrar, será usado o DefaultLocatorSDKIntegrationApiImpl
        sdk.registerIntegration(
            integration = object : LocatorIntegration {
                override suspend fun getCert(payload: LocatorRequestApiCert): LocatorResponseApiCert {
                    // Implementação customizada para obter certificado
                    return yourApiService.getCert(payload)
                }
                
                override suspend fun getToken(payload: LocatorRequestApiToken): LocatorResponseApiToken {
                    // Implementação customizada para obter token
                    return yourApiService.getToken(payload)
                }
                
                override suspend fun getScopes(payload: LocatorRequestApiScopes): LocatorResponseApiScopes {
                    return yourApiService.getScopes(payload)
                }
                
                override suspend fun getFeatures(payload: LocatorRequestApiFeatures): LocatorResponseApiFeatures {
                    return yourApiService.getFeatures(payload)
                }
                
                override suspend fun getConfig(payload: LocatorRequestApiConfig): LocatorResponseApiConfig {
                    return yourApiService.getConfig(payload)
                }
                
                override suspend fun getGroups(payload: LocatorRequestApiGroups): LocatorResponseApiGroups {
                    return yourApiService.getGroups(payload)
                }
                
                override suspend fun getGeofences(payload: LocatorRequestApiGeofenses): LocatorResponseApiGeofenses {
                    return yourApiService.getGeofences(payload)
                }
            }
        )
    }
    
    private fun configureSDK() {
        // Criar configuração completa
        val config = LocatorConfig(
            license = "LICENSE_12345",
            sdkVersion = BuildConfig.LIBRARY_VERSION,
            osPlatform = OS_PLATFORM_ANDROID,
            mqtt = LocatorMqttConfig(
                clientId = "android-${System.currentTimeMillis()}",
                broker = "mqtt.seuservidor.com",
                port = "8883",
                username = "mqtt-username"
            ),
            api = LocatorApiConfig(
                token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                certUrl = "https://api.seuservidor.com/v1/cert",
                scopesUrl = "https://api.seuservidor.com/v1/scopes",
                tokenUrl = "https://api.seuservidor.com/v1/token",
                configUrl = "https://api.seuservidor.com/v1/config",
                groupsUrl = "https://api.seuservidor.com/v1/groups",
                featuresUrl = "https://api.seuservidor.com/v1/features",
                geofencesUrl = "https://api.seuservidor.com/v1/geofences"
            ),
            process = LocatorProcessConfig(
                retryPolicy = LocatorRetryPolicy(
                    maxRetries = 5,
                    baseDelayMs = 2000L,
                    backoffFactor = 1.5
                ),
                offlineRetentionDays = 10,
                foregroundServiceNotification = ForegroundServiceNotification(
                    title = "Localização",
                    message = "Coletando dados de localização"
                )
            ),
            battery = LocatorBatteryConfig(
                events = listOf(
                    LocatorBatteryEvent(
                        name = "battery_low",
                        min = 0,
                        max = 15,
                        interval = 1800000L, // 30 minutos
                        charging = false,
                        powerMode = listOf(LocatorPowerMode.NORMAL, LocatorPowerMode.LOW_POWER)
                    ),
                    LocatorBatteryEvent(
                        name = "battery_charging",
                        min = 80,
                        max = 100,
                        interval = 600000L, // 10 minutos
                        charging = true,
                        powerMode = listOf(LocatorPowerMode.NORMAL)
                    )
                )
            ),
            motion = LocatorMotionConfig(
                sensitivity = 0.7
            ),
            collect = LocatorCollectConfig(
                collectIntervalMillis = 15000L, // 15 segundos
                sendIntervalMillis = 30000L, // 30 segundos
                minDisplacementMeters = 5.0,
                maxTravelDistanceMeters = 500.0,
                highAccuracy = false,
                maxBatchSize = 100
            )
        )
        
        // Aplicar configuração
        sdk.setConfig(config = config)
    }
    
    private fun checkPermissionsAndStart() {
        // Verificar permissões pendentes
        val pendingPermissions = sdk.pendingPermissions()
        
        if (pendingPermissions.isEmpty()) {
            // Todas as permissões concedidas, pode iniciar
            startSDK()
        } else {
            // Solicitar permissões faltantes
            requestPermissions(pendingPermissions)
        }
    }
    
    private fun requestPermissions(permissions: List<String>) {
        // Implementar lógica de solicitação de permissões
        // Após conceder permissões, chamar startSDK()
        ActivityCompat.requestPermissions(
            this,
            permissions.toTypedArray(),
            PERMISSION_REQUEST_CODE
        )
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        
        if (requestCode == PERMISSION_REQUEST_CODE) {
            val allGranted = grantResults.all { it == PackageManager.PERMISSION_GRANTED }
            if (allGranted) {
                startSDK()
            } else {
                Log.w("LocatorSDK", "Permissões negadas. SDK não pode iniciar.")
            }
        }
    }
    
    private fun startSDK() {
        try {
            // IMPORTANTE: Antes de inicializar o SDK, é necessário setar o estado do SDK
            // Para habilitar o funcionamento da SDK para usuários com a funcionalidade
            // Chamar o método setState com valor LocatorState.IDLE antes da chamada de start()
            sdk.setState(LocatorState.IDLE)
            sdk.start()
            Log.d("LocatorSDK", "SDK iniciada com sucesso!")
        } catch (e: LocatorSDKMissingPermissionsException) {
            Log.e("LocatorSDK", "Permissões faltando: ${e.message}")
            // Solicitar permissões novamente
            checkPermissionsAndStart()
        } catch (e: LocatorSDKNoConfigSetException) {
            Log.e("LocatorSDK", "Configuração não definida: ${e.message}")
            // Configurar novamente
            configureSDK()
        } catch (e: Exception) {
            Log.e("LocatorSDK", "Erro ao iniciar SDK: ${e.message}")
        }
    }
    
    companion object {
        private const val PERMISSION_REQUEST_CODE = 1001
    }
}
```

### 4. Exemplo com ViewModel (Arquitetura Recomendada)

Para uma arquitetura mais limpa, você pode usar ViewModel:

> **⚠️ IMPORTANTE:** Lembre-se de chamar `setState(LocatorState.IDLE)` antes de `start()` no método `startSDK()`.

```kotlin
class LocatorViewModel : ViewModel() {
    private var sdk: LocatorSDK? = null
    
    fun initializeSDK(context: Context) {
        LocatorSDK.getInstance()
            .onSuccess { instance ->
                sdk = instance
                setupSDK(context)
            }
            .onFailure { exception ->
                Log.e("LocatorViewModel", "Erro: ${exception.message}")
            }
    }
    
    private fun setupSDK(context: Context) {
        sdk?.let { sdkInstance ->
            // Configurar integrador
            sdkInstance.registerIntegration(LocatorSDKIntegrationApiImpl())
            
            // Criar e aplicar configuração
            val config = buildLocatorConfig()
            sdkInstance.setConfig(config = config)
            
            // Verificar permissões
            val pendingPermissions = sdkInstance.pendingPermissions()
            if (pendingPermissions.isEmpty()) {
                startSDK()
            } else {
                // Emitir evento para Activity/Fragment solicitar permissões
                _permissionsNeeded.postValue(pendingPermissions)
            }
        }
    }
    
    private fun buildLocatorConfig(): LocatorConfig {
        // Construir configuração completa
        return LocatorConfig(
            license = "YOUR_LICENSE",
            sdkVersion = BuildConfig.LIBRARY_VERSION,
            osPlatform = OS_PLATFORM_ANDROID,
            mqtt = LocatorMqttConfig(
                clientId = "client-${UUID.randomUUID()}",
                broker = "mqtt.example.com",
                port = "8883"
            ),
            api = LocatorApiConfig(
                token = "YOUR_JWT_TOKEN",
                certUrl = "https://api.example.com/cert",
                scopesUrl = "https://api.example.com/scopes",
                tokenUrl = "https://api.example.com/token",
                configUrl = "https://api.example.com/config",
                groupsUrl = "https://api.example.com/groups",
                featuresUrl = "https://api.example.com/features",
                geofencesUrl = "https://api.example.com/geofences"
            ),
            process = LocatorProcessConfig(
                retryPolicy = LocatorRetryPolicy(
                    maxRetries = 3,
                    baseDelayMs = 1000L,
                    backoffFactor = 2.0
                ),
                offlineRetentionDays = 7,
                foregroundServiceNotification = ForegroundServiceNotification(
                    title = "Rastreamento",
                    message = "Coletando localização"
                )
            ),
            collect = LocatorCollectConfig(
                collectIntervalMillis = 30000L,
                sendIntervalMillis = 60000L,
                minDisplacementMeters = 10.0,
                highAccuracy = true
            )
        )
    }
    
    fun startSDK() {
        try {
            // IMPORTANTE: Antes de inicializar o SDK, é necessário setar o estado do SDK
            // Para habilitar o funcionamento da SDK para usuários com a funcionalidade
            // Chamar o método setState com valor LocatorState.IDLE antes da chamada de start()
            sdk?.setState(LocatorState.IDLE)
            sdk?.start()
            _sdkStatus.postValue("SDK iniciada com sucesso")
        } catch (e: Exception) {
            _sdkStatus.postValue("Erro: ${e.message}")
        }
    }
    
    private val _permissionsNeeded = MutableLiveData<List<String>>()
    val permissionsNeeded: LiveData<List<String>> = _permissionsNeeded
    
    private val _sdkStatus = MutableLiveData<String>()
    val sdkStatus: LiveData<String> = _sdkStatus
}
```

## Modelos

Para ver os modelos completos em Kotlin, consulte [Modelos](../examples/models.md).
