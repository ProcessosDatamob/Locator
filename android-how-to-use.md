# Documentação - Android Como Usar - Português (Brasil)

[< Voltar](../README.md)

Bem-vindo à documentação oficial de **Como implementar a SDK Locator Android**.

A SDK segue a definição descrita em **Serviço principal - SDK**.

## Inicialização
Para a inicialização da SDK, deve-se realizar a chamada do método `initialize` passando como paramêtro o `Contexto` da aplicação. 
Este já devolvendo uma instância da SDK `LocatorSDK`.


```kotlin
class Application : Application() {

    override fun onCreate() {
        super.onCreate()
        LocatorSDK.initialize(initContext = this)
    }
}
```

## Instância da SDK
Para utilizar a SDK será necessário um `get` da instância da SDK, isto pode ser feito atrás:
- `fun getInstance(): Result<LocatorSDK>`

```kotlin
class MainActivity : ComponentActivity() {
    lateinit var sdk: LocatorSDK

    override fun onCreate(savedInstanceState: Bundle?) {
        //...
        LocatorSDK.getInstance()
            .onSuccess { 
                sdk = it
                // Em caso de sucesso, seguir com a configuração
            }
            .onFailure { exception ->
                //TODO tratar erro e inicializar a SDK
                //O paramêtro retornado dentro do contexto de falha é um obj do tipo LocatorSDKNotInitializedException
            }
        //...
    }
}

class LocatorSDKNotInitializedException :
    IllegalStateException("LocatorSDK not initialized. Call initialize() first.")
```

## Configuração
Após a aquisição da instância é necessário configurar o Integrador e LocatorConfig que será o configurador da SDK.
Por definição a SDk contará com um Integrador default (`DefaultLocatorSDKIntegrationApiImpl`), 
que ao não ser configurado um novo tomará este como padrão de uso.

### Integrador (LocatorIntegration)
O Integrador faz uso da interface `LocatorIntegration`:

```kotlin
interface LocatorIntegration {
    suspend fun getCert(payload: LocatorRequestApiCert): LocatorResponseApiCert
    suspend fun getToken(payload: LocatorRequestApiToken): LocatorResponseApiToken
    suspend fun getScopes(payload: LocatorRequestApiScopes): LocatorResponseApiScopes
    suspend fun getFeatures(payload: LocatorRequestApiFeatures): LocatorResponseApiFeatures
    suspend fun getConfig(payload: LocatorRequestApiConfig): LocatorResponseApiConfig
    suspend fun getGroups(payload: LocatorRequestApiGroups): LocatorResponseApiGroups
    suspend fun getGeofences(payload: LocatorRequestApiGeofenses): LocatorResponseApiGeofenses
}
```
Caso da necessidade de uma nova implementação, apenas implementar está interface. 
Para configuração do Integrador utilizar o método `fun registerIntegration(integration: LocatorIntegration)`.

```kotlin
fun configureSDK() {
    LocatorSDK.getInstance()
        .onSuccess { 
            sdk = it
            sdk.registerIntegration(integration = LocatorSDKIntegrationApiImpl())
            //...
        }
}
```

### LocatorConfig
Classe utilizada para configurar a SDK

```kotlin
data class LocatorConfig(
    val license: String,
    val sdkVersion: String = BuildConfig.LIBRARY_VERSION,
    val osPlatform: String = OS_PLATFORM_ANDROID,
    val mqtt: LocatorMqttConfig,
    val api: LocatorApiConfig,
    val process: LocatorProcessConfig,
    val battery: LocatorBatteryConfig? = null,
    val motion: LocatorMotionConfig? = null,
    val collect: LocatorCollectConfig? = null,
    val revision: Long? = null,
    val createdAt: Long? = null,
    val updatedAt: Long? = null
)
```

```kotlin
fun configureSDK() {
    LocatorSDK.getInstance()
        .onSuccess { 
            //...
            //TODO configure todos os paramêntros necessários do LocatorConfig
            sdk.setConfig(config = LocatorConfig())
            //...
        }

}
```

### Inicialização do Funcionamento da SDK
Caso tudo esteja configurado, pode-se chamar o método de `start` da sdk. Com isso a SDK começará a coleta das localizações. 

```kotlin
fun configureSDK() {
    LocatorSDK.getInstance()
        .onSuccess { 
            //...
            try {
                sdk.start()
            } catch (e: LocatorSDKMissingPermissionsException) {
                Log.d("LOC_LogsManager", e.message.orEmpty())
            } catch (e: LocatorSDKNoConfigSetException) {
                Log.d("LOC_LogsManager", e.message.orEmpty())
            }
            //...
        }

}

class LocatorSDKNoConfigSetException :
    IllegalStateException("LocatorSDK configuration not passed. Call setConfig()/syncConfig() first.")

class LocatorSDKMissingPermissionsException :
    IllegalStateException("LocatorSDK needs permissions. Call pendingPermissions() to receive list of missing permissions first.")

```

## Comandos
Para validar se um comando deve ser executado pela SDK Locator, faça uso do método `isLocatorSDKCommand`.
Caso seja de propriedade da SDK, utilize `convertLocatorSDKCommand` para converter a mensagem e `execute` para que a SDK rode o comando.
Ambos os métodos são pertencentes a classe LocatorSDK como métodos do `companion object`, sendo assim não há necessidade de uma instância
para realizar a chamada dos métodos. 

```kotlin
class FirebaseService : FirebaseMessagingService() {

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        //...
        if (LocatorSDK.isLocatorSDKCommand(notificationMsg = message.data)) {
            LocatorSDK.convertLocatorSDKCommand(notificationMsg = "")
                .onSuccess { sdk.execute(command = it) }
                .onFailure { exception -> 
                    // exception é do tipo LocatorSDKCommandConverterException
                    // indicando que não foi possível realizar o parse da msg para um comando válido
                }
        }
        //...
    }
}

class LocatorSDKCommandConverterException :
    ClassCastException("Error on cast message to LocatorCommand.")
```

[< Voltar](../README.md)