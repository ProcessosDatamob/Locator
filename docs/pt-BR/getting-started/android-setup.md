# Configuração Android

[< Voltar](../README.md)

Bem-vindo à documentação oficial de **Como implementar a SDK Locator Android**.

A SDK segue a definição descrita em [LocatorService](../reference/service.md).

## Configuração do projeto (Gradle)

Antes de utilizar a SDK, é necessário configurar o projeto Android com os plugins e dependências corretos.

### Versões e plugins (libs.versions.toml)

No catálogo de versões (`libs.versions.toml`), adicione (ou ajuste) as seguintes entradas:

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

### Plugins no `build.gradle` de projeto

No arquivo `build.gradle.kts` (raiz do projeto), registre os plugins:

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

### Dependências da SDK (módulo app)

No `build.gradle.kts` do módulo da aplicação (por exemplo, `app`), adicione as dependências da SDK usando o catálogo:

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

Garanta também que as versões e mapeamentos das bibliotecas estejam definidos em `libs.versions.toml`:

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

### Plugins e configurações no `build.gradle` do app

No `build.gradle.kts` do módulo da aplicação, aplique os plugins necessários:

```kotlin
plugins {
    // ...
    alias(libs.plugins.jetbrains.kotlin.serialization)
    alias(libs.plugins.google.services)
    alias(libs.plugins.ksp)
    // ...
}
```

E configure o bloco `android` com as opções exigidas pela SDK:

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

## Inicialização e Configuração

Para utilizar a SDK, é necessário realizar a inicialização, obter a instância e configurá-la. O processo completo pode ser feito através de uma função unificada que recebe um `LocatorConfig` e executa todos os passos sequencialmente.

### Passo 1: Inicialização no Application

Primeiro, inicialize a SDK no `Application` da sua aplicação:

```kotlin
class Application : Application() {

    override fun onCreate() {
        super.onCreate()
        LocatorSDK.initialize(initContext = this)
    }
}
```

### Passo 2: Configuração Completa

Após a inicialização, você pode configurar a SDK de forma unificada. A função abaixo recebe um `LocatorConfig` e opcionalmente um `LocatorIntegration`, executando todos os passos necessários:

```kotlin
/**
 * Configura a SDK Locator de forma completa e sequencial.
 * 
 * @param context Contexto da aplicação
 * @param config Configuração da SDK (LocatorConfig)
 * @param integration Integrador customizado (opcional). Se não fornecido, será usado o DefaultLocatorSDKIntegrationApiImpl
 * @param autoStart Se true, inicia automaticamente a coleta após a configuração
 * @return Result<LocatorSDK> com a instância configurada ou erro
 */
fun setupLocatorSDK(
    context: Context,
    config: LocatorConfig,
    integration: LocatorIntegration? = null,
    autoStart: Boolean = false
): Result<LocatorSDK> {
    // 1. Garantir que a SDK está inicializada
    LocatorSDK.initialize(initContext = context)
    
    // 2. Obter a instância da SDK
    return LocatorSDK.getInstance()
        .onSuccess { sdk ->
            // 3. Registrar o integrador (se fornecido)
            // Caso contrário, será usado o DefaultLocatorSDKIntegrationApiImpl
            integration?.let { sdk.registerIntegration(integration = it) }
            
            // 4. Configurar a SDK com o LocatorConfig
            sdk.setConfig(config = config)
            
            // 5. Iniciar a SDK (se solicitado)
            if (autoStart) {
                try {
                    sdk.start()
                } catch (e: LocatorSDKMissingPermissionsException) {
                    Log.e("LocatorSDK", "Permissões faltando: ${e.message}")
                    // Tratar permissões faltando
                } catch (e: LocatorSDKNoConfigSetException) {
                    Log.e("LocatorSDK", "Configuração não definida: ${e.message}")
                }
            }
            
            Result.success(sdk)
        }
        .onFailure { exception ->
            Log.e("LocatorSDK", "Erro ao obter instância: ${exception.message}")
            Result.failure(exception)
        }
}
```

### Exemplo de Uso

```kotlin
class MainActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Criar o LocatorConfig com todas as configurações necessárias
        val locatorConfig = LocatorConfig(
            license = "sua-licenca-aqui",
            sdkVersion = BuildConfig.LIBRARY_VERSION,
            osPlatform = OS_PLATFORM_ANDROID,
            mqtt = LocatorMqttConfig(
                // Configurações MQTT
            ),
            api = LocatorApiConfig(
                // Configurações de API
            ),
            process = LocatorProcessConfig(
                // Configurações de processo
            ),
            battery = LocatorBatteryConfig(
                // Configurações de bateria (opcional)
            ),
            motion = LocatorMotionConfig(
                // Configurações de movimento (opcional)
            ),
            collect = LocatorCollectConfig(
                // Configurações de coleta (opcional)
            )
        )
        
        // Opcional: Criar integrador customizado
        val customIntegration = object : LocatorIntegration {
            // Implementar métodos da interface
        }
        
        // Configurar a SDK de forma unificada
        setupLocatorSDK(
            context = this,
            config = locatorConfig,
            integration = customIntegration, // Opcional: null para usar o padrão
            autoStart = true // Opcional: iniciar automaticamente após configuração
        ).onSuccess { sdk ->
            Log.d("LocatorSDK", "SDK configurada e iniciada com sucesso")
            // SDK pronta para uso
        }.onFailure { exception ->
            Log.e("LocatorSDK", "Erro ao configurar SDK: ${exception.message}")
            when (exception) {
                is LocatorSDKNotInitializedException -> {
                    // SDK não foi inicializada
                }
                else -> {
                    // Outros erros
                }
            }
        }
    }
}
```

### Estrutura do LocatorConfig

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

Por padrão, a SDK utiliza o `DefaultLocatorSDKIntegrationApiImpl`. Caso precise de uma implementação customizada, apenas implemente a interface e passe como parâmetro na função `setupLocatorSDK`.

### Exceções

```kotlin
class LocatorSDKNotInitializedException :
    IllegalStateException("LocatorSDK not initialized. Call initialize() first.")

class LocatorSDKNoConfigSetException :
    IllegalStateException("LocatorSDK configuration not passed. Call setConfig()/syncConfig() first.")

class LocatorSDKMissingPermissionsException :
    IllegalStateException("LocatorSDK needs permissions. Call pendingPermissions() to receive list of missing permissions first.")
```

### Iniciando a Coleta de Localizações

Após a configuração, você pode iniciar a coleta de localizações chamando o método `start()` da SDK. Isso pode ser feito automaticamente através do parâmetro `autoStart = true` na função `setupLocatorSDK`, ou manualmente:

```kotlin
// Iniciar manualmente após configuração
LocatorSDK.getInstance()
    .onSuccess { sdk ->
        try {
            sdk.start()
            Log.d("LocatorSDK", "Coleta de localizações iniciada")
        } catch (e: LocatorSDKMissingPermissionsException) {
            Log.e("LocatorSDK", "Permissões faltando: ${e.message}")
            // Verificar permissões pendentes com sdk.pendingPermissions()
        } catch (e: LocatorSDKNoConfigSetException) {
            Log.e("LocatorSDK", "Configuração não definida: ${e.message}")
        }
    }
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