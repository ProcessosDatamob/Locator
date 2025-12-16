# Android Setup

[< Back](../README.md)

Welcome to the official documentation for **How to implement the Locator SDK for Android**.

The SDK follows the definition described in [LocatorService](../reference/service.md).

## Project configuration (Gradle)

Before using the SDK, you must configure the Android project with the required plugins and dependencies.

### Versions and plugins (`libs.versions.toml`)

In your version catalog (`libs.versions.toml`), add (or adjust) the following entries:

```toml
[plugins]
android-library = { id = "com.android.library", version.ref = "agp" }
jetbrains-kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "kspVersion" }
google-services = { id = "com.google.gms.google-services", version.ref = "googleSvc" }

[versions]
agp = "8.13.1"
kotlin = "2.2.21"
kspVersion = "2.3.1"
googleSvc = "4.4.4"
```

### Plugins in the project `build.gradle`

In the root `build.gradle.kts` file, register the plugins:

```kotlin
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    // ...
    alias(libs.plugins.android.library) apply false
    alias(libs.plugins.ksp) apply false
    alias(libs.plugins.google.services) apply false
    // ...
}
```

### SDK dependencies (app module)

In the `build.gradle.kts` of the application module (for example, `app`), add the SDK dependencies using the catalog:

```kotlin
dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.work.runtime.ktx)
    implementation(libs.play.services.location)
    implementation(libs.datastore.preferences)
    implementation(libs.datastore.core)
    implementation(libs.security.crypto)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.hivemq.mqtt.client)
    implementation(libs.squareup.okio)
    implementation(libs.squareup.okhttp)
}
```

Also make sure the library versions and mappings are defined in `libs.versions.toml`:

```toml
[versions]
coreKtx = "1.17.0"
workRuntimeKtx = "2.11.0"
playServicesLocation = "21.3.0"
datastoreVer = "1.2.0"
securityCryptoVersion = "1.1.0"
kotlinxSerializationJson = "1.9.0"
roomVersion = "2.8.4"
hiveVersion = "1.3.10"
okhttpVersion = "5.3.2"
okioVersion = "3.16.4"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-work-runtime-ktx = { group = "androidx.work", name = "work-runtime-ktx", version.ref = "workRuntimeKtx" }
play-services-location = { group = "com.google.android.gms", name = "play-services-location", version.ref = "playServicesLocation" }
datastore-preferences = { module = "androidx.datastore:datastore-preferences", version.ref = "datastoreVer" }
datastore-core = { module = "androidx.datastore:datastore-core", version.ref = "datastoreVer" }
security-crypto = { module = "androidx.security:security-crypto", version.ref = "securityCryptoVersion" }
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinxSerializationJson" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "roomVersion" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "roomVersion" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "roomVersion" }
hivemq-mqtt-client = { module = "com.hivemq:hivemq-mqtt-client", version.ref = "hiveVersion" }
squareup-okhttp = { module = "com.squareup.okhttp3:okhttp", version.ref = "okhttpVersion" }
squareup-okio = { module = "com.squareup.okio:okio", version.ref = "okioVersion" }
```

### Plugins and configuration in the app `build.gradle`

In the application module `build.gradle.kts`, apply the required plugins:

```kotlin
plugins {
    // ...
    alias(libs.plugins.jetbrains.kotlin.serialization)
    alias(libs.plugins.google.services)
    alias(libs.plugins.ksp)
    // ...
}
```

And configure the `android` block with the options required by the SDK:

```kotlin
android {
    // ...

    defaultConfig {
        // ...
        javaCompileOptions.annotationProcessorOptions.arguments.put(
            "room.schemaLocation",
            "$projectDir/schemas"
        )
        // ...
    }

    // ...

    packaging {
        resources {
            excludes.add("META-INF/INDEX.LIST")
            excludes.add("META-INF/io.netty.versions.properties")
        }
    }
}

ksp {
    arg("room.schemaLocation", "$projectDir/schemas")
    arg("room.incremental", "true")
    arg("room.expandProjection", "true")
}
```

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

