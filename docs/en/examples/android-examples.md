# Android Examples

[< Back](../README.md)

This document contains practical examples of using the Locator SDK for Android.

## Complete Initialization and Configuration Example

This example shows the complete flow of initialization, configuration, and starting the Locator SDK.

### 1. Basic Initialization

Basic SDK initialization is done in the `Application`:

```kotlin
class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        // Basic initialization
        LocatorSDK.initialize(initContext = this)
    }
}
```

### 2. Initialization with Configuration

Alternatively, you can initialize the SDK by passing the configuration directly to the `initialize` method:

> **⚠️ IMPORTANT:** Before calling `start()`, it is necessary to set the SDK state using `setState(LocatorState.IDLE)`. See section 3 for the complete example.

```kotlin
class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        
        // Create configuration before initialization
        val config = createLocatorConfig()
        
        // Initialize with configuration
        LocatorSDK.initialize(
            initContext = this,
            config = config
        )
    }
    
    private fun createLocatorConfig(): LocatorConfig {
        return LocatorConfig(
            license = "YOUR_LICENSE_HERE",
            sdkVersion = BuildConfig.LIBRARY_VERSION,
            osPlatform = OS_PLATFORM_ANDROID,
            mqtt = LocatorMqttConfig(
                clientId = "android-client-${UUID.randomUUID()}",
                broker = "mqtt.example.com",
                port = "8883",
                username = "mqtt-user"
            ),
            api = LocatorApiConfig(
                token = "JWT_TEMPORARY_TOKEN",
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
                    title = "Tracking Active",
                    message = "Locator is collecting your location"
                )
            ),
            battery = LocatorBatteryConfig(
                events = listOf(
                    LocatorBatteryEvent(
                        name = "low_battery",
                        min = 0,
                        max = 20,
                        interval = 3600000L, // 1 hour
                        charging = false,
                        powerMode = listOf(LocatorPowerMode.NORMAL)
                    )
                )
            ),
            motion = LocatorMotionConfig(
                sensitivity = 0.5
            ),
            collect = LocatorCollectConfig(
                collectIntervalMillis = 30000L, // 30 seconds
                sendIntervalMillis = 60000L, // 1 minute
                minDisplacementMeters = 10.0,
                maxTravelDistanceMeters = 1000.0,
                highAccuracy = true,
                maxBatchSize = 50
            )
        )
    }
}
```

### 3. Complete Flow: Get Instance, Configure and Start

Complete example showing the entire configuration flow:

> **⚠️ IMPORTANT:** Before initializing the SDK, it is necessary to set the SDK state. To enable SDK functionality for users with the feature, call the `setState` method with `LocatorState.IDLE` value before calling `start()`.

```kotlin
class MainActivity : ComponentActivity() {
    private lateinit var sdk: LocatorSDK

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Configure and start the SDK
        setupLocatorSDK()
    }
    
    private fun setupLocatorSDK() {
        // 1. Get SDK instance
        LocatorSDK.getInstance()
            .onSuccess { instance ->
                sdk = instance
                
                // 2. Register custom integrator (optional)
                registerCustomIntegration()
                
                // 3. Configure the SDK
                configureSDK()
                
                // 4. Check permissions before starting
                checkPermissionsAndStart()
            }
            .onFailure { exception ->
                when (exception) {
                    is LocatorSDKNotInitializedException -> {
                        Log.e("LocatorSDK", "SDK not initialized. Initialize in Application.")
                        // Try to initialize here if necessary
                        LocatorSDK.initialize(initContext = this)
                    }
                    else -> {
                        Log.e("LocatorSDK", "Error getting instance: ${exception.message}")
                    }
                }
            }
    }
    
    private fun registerCustomIntegration() {
        // Register custom integrator (optional)
        // If not registered, DefaultLocatorSDKIntegrationApiImpl will be used
        sdk.registerIntegration(
            integration = object : LocatorIntegration {
                override suspend fun getCert(payload: LocatorRequestApiCert): LocatorResponseApiCert {
                    // Custom implementation to get certificate
                    return yourApiService.getCert(payload)
                }
                
                override suspend fun getToken(payload: LocatorRequestApiToken): LocatorResponseApiToken {
                    // Custom implementation to get token
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
        // Create complete configuration
        val config = LocatorConfig(
            license = "LICENSE_12345",
            sdkVersion = BuildConfig.LIBRARY_VERSION,
            osPlatform = OS_PLATFORM_ANDROID,
            mqtt = LocatorMqttConfig(
                clientId = "android-${System.currentTimeMillis()}",
                broker = "mqtt.yourserver.com",
                port = "8883",
                username = "mqtt-username"
            ),
            api = LocatorApiConfig(
                token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                certUrl = "https://api.yourserver.com/v1/cert",
                scopesUrl = "https://api.yourserver.com/v1/scopes",
                tokenUrl = "https://api.yourserver.com/v1/token",
                configUrl = "https://api.yourserver.com/v1/config",
                groupsUrl = "https://api.yourserver.com/v1/groups",
                featuresUrl = "https://api.yourserver.com/v1/features",
                geofencesUrl = "https://api.yourserver.com/v1/geofences"
            ),
            process = LocatorProcessConfig(
                retryPolicy = LocatorRetryPolicy(
                    maxRetries = 5,
                    baseDelayMs = 2000L,
                    backoffFactor = 1.5
                ),
                offlineRetentionDays = 10,
                foregroundServiceNotification = ForegroundServiceNotification(
                    title = "Location",
                    message = "Collecting location data"
                )
            ),
            battery = LocatorBatteryConfig(
                events = listOf(
                    LocatorBatteryEvent(
                        name = "battery_low",
                        min = 0,
                        max = 15,
                        interval = 1800000L, // 30 minutes
                        charging = false,
                        powerMode = listOf(LocatorPowerMode.NORMAL, LocatorPowerMode.LOW_POWER)
                    ),
                    LocatorBatteryEvent(
                        name = "battery_charging",
                        min = 80,
                        max = 100,
                        interval = 600000L, // 10 minutes
                        charging = true,
                        powerMode = listOf(LocatorPowerMode.NORMAL)
                    )
                )
            ),
            motion = LocatorMotionConfig(
                sensitivity = 0.7
            ),
            collect = LocatorCollectConfig(
                collectIntervalMillis = 15000L, // 15 seconds
                sendIntervalMillis = 30000L, // 30 seconds
                minDisplacementMeters = 5.0,
                maxTravelDistanceMeters = 500.0,
                highAccuracy = false,
                maxBatchSize = 100
            )
        )
        
        // Apply configuration
        sdk.setConfig(config = config)
    }
    
    private fun checkPermissionsAndStart() {
        // Check pending permissions
        val pendingPermissions = sdk.pendingPermissions()
        
        if (pendingPermissions.isEmpty()) {
            // All permissions granted, can start
            startSDK()
        } else {
            // Request missing permissions
            requestPermissions(pendingPermissions)
        }
    }
    
    private fun requestPermissions(permissions: List<String>) {
        // Implement permission request logic
        // After granting permissions, call startSDK()
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
                Log.w("LocatorSDK", "Permissions denied. SDK cannot start.")
            }
        }
    }
    
    private fun startSDK() {
        try {
            // IMPORTANT: Before initializing the SDK, it is necessary to set the SDK state
            // To enable SDK functionality for users with the feature
            // Call the setState method with LocatorState.IDLE value before calling start()
            sdk.setState(LocatorState.IDLE)
            sdk.start()
            Log.d("LocatorSDK", "SDK started successfully!")
        } catch (e: LocatorSDKMissingPermissionsException) {
            Log.e("LocatorSDK", "Missing permissions: ${e.message}")
            // Request permissions again
            checkPermissionsAndStart()
        } catch (e: LocatorSDKNoConfigSetException) {
            Log.e("LocatorSDK", "Configuration not set: ${e.message}")
            // Configure again
            configureSDK()
        } catch (e: Exception) {
            Log.e("LocatorSDK", "Error starting SDK: ${e.message}")
        }
    }
    
    companion object {
        private const val PERMISSION_REQUEST_CODE = 1001
    }
}
```

### 4. Example with ViewModel (Recommended Architecture)

For a cleaner architecture, you can use ViewModel:

> **⚠️ IMPORTANT:** Remember to call `setState(LocatorState.IDLE)` before `start()` in the `startSDK()` method.

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
                Log.e("LocatorViewModel", "Error: ${exception.message}")
            }
    }
    
    private fun setupSDK(context: Context) {
        sdk?.let { sdkInstance ->
            // Configure integrator
            sdkInstance.registerIntegration(LocatorSDKIntegrationApiImpl())
            
            // Create and apply configuration
            val config = buildLocatorConfig()
            sdkInstance.setConfig(config = config)
            
            // Check permissions
            val pendingPermissions = sdkInstance.pendingPermissions()
            if (pendingPermissions.isEmpty()) {
                startSDK()
            } else {
                // Emit event for Activity/Fragment to request permissions
                _permissionsNeeded.postValue(pendingPermissions)
            }
        }
    }
    
    private fun buildLocatorConfig(): LocatorConfig {
        // Build complete configuration
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
                    title = "Tracking",
                    message = "Collecting location"
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
            // IMPORTANT: Before initializing the SDK, it is necessary to set the SDK state
            // To enable SDK functionality for users with the feature
            // Call the setState method with LocatorState.IDLE value before calling start()
            sdk?.setState(LocatorState.IDLE)
            sdk?.start()
            _sdkStatus.postValue("SDK started successfully")
        } catch (e: Exception) {
            _sdkStatus.postValue("Error: ${e.message}")
        }
    }
    
    private val _permissionsNeeded = MutableLiveData<List<String>>()
    val permissionsNeeded: LiveData<List<String>> = _permissionsNeeded
    
    private val _sdkStatus = MutableLiveData<String>()
    val sdkStatus: LiveData<String> = _sdkStatus
}
```

## Models

To see the complete models in Kotlin, see [Models](../examples/models.md).
