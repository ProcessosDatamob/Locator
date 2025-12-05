# Android Setup

[< Back](../README.md)

Welcome to the official documentation for **How to implement the Locator SDK for Android**.

The SDK follows the definition described in [LocatorService](../reference/service.md).

## Initialization

To initialize the SDK, you must call the `initialize` method passing the application `Context` as a parameter. This returns an instance of the `LocatorSDK`.

```kotlin
class Application : Application() {

    override fun onCreate() {
        super.onCreate()
        LocatorSDK.initialize(initContext = this)
    }
}
```

## SDK Instance

To use the SDK, you will need to get an instance of the SDK, which can be done via:
- `fun getInstance(): Result<LocatorSDK>`

```kotlin
class MainActivity : ComponentActivity() {
    lateinit var sdk: LocatorSDK

    override fun onCreate(savedInstanceState: Bundle?) {
        //...
        LocatorSDK.getInstance()
            .onSuccess { 
                sdk = it
                // On success, proceed with configuration
            }
            .onFailure { exception ->
                //TODO handle error and initialize SDK
                //The parameter returned in the failure context is an object of type LocatorSDKNotInitializedException
            }
        //...
    }
}

class LocatorSDKNotInitializedException :
    IllegalStateException("LocatorSDK not initialized. Call initialize() first.")
```

## Configuration

After obtaining the instance, you need to configure the Integrator and LocatorConfig, which will be the SDK's configurator.
By default, the SDK will have a default Integrator (`DefaultLocatorSDKIntegrationApiImpl`), which will be used as default if no new one is configured.

### Integrator (LocatorIntegration)

The Integrator uses the `LocatorIntegration` interface:

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

If you need a new implementation, just implement this interface.
To configure the Integrator, use the method `fun registerIntegration(integration: LocatorIntegration)`.

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

Class used to configure the SDK

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
            //TODO configure all necessary parameters of LocatorConfig
            sdk.setConfig(config = LocatorConfig())
            //...
        }

}
```

### SDK Operation Initialization

If everything is configured, you can call the SDK's `start` method. With this, the SDK will begin collecting locations.

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

## Commands

To validate if a command should be executed by the Locator SDK, use the `isLocatorSDKCommand` method.
If it belongs to the SDK, use `convertLocatorSDKCommand` to convert the message and `execute` for the SDK to run the command.
Both methods belong to the LocatorSDK class as `companion object` methods, so there is no need for an instance to call these methods.

```kotlin
class FirebaseService : FirebaseMessagingService() {

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        //...
        if (LocatorSDK.isLocatorSDKCommand(notificationMsg = message.data)) {
            LocatorSDK.convertLocatorSDKCommand(notificationMsg = "")
                .onSuccess { sdk.execute(command = it) }
                .onFailure { exception -> 
                    // exception is of type LocatorSDKCommandConverterException
                    // indicating that it was not possible to parse the message into a valid command
                }
        }
        //...
    }
}

class LocatorSDKCommandConverterException :
    ClassCastException("Error on cast message to LocatorCommand.")
```

[< Back](../README.md)

