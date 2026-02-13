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

### Plugins no `settings.gradle` de projeto

No arquivo `settings.gradle.kts` (raiz do projeto), adicione as configurações da Azure:

```kotlin
// ...

dependencyResolutionManagement {
 // ...

  repositories {
    // ...
     maven {
        url = uri("https://pkgs.dev.azure.com/datamob/_packaging/datamob/maven/v1")
        name = "Azure"
        
        credentials {
            username = "AZURE_ARTIFACTS"
            // Token pessoal Azure gerado no menu de User Settings
            // Adicione ou configure onde fizer mais sentido
            // para o projeto, Ex:
            // Variável de ambiente, arquivo 
            // gradle.properties ou secrets
            password = "{AZURE_PERSONA_ACCESS_TOKEN}"
        }
    }
  }
}
```

### Dependências da SDK (módulo app)

No `build.gradle.kts` do módulo da aplicação (por exemplo, `app`), adicione as dependências da SDK usando o catálogo:

```kotlin
dependencies {
    // Adicionar implementation da SDK Locator
    implementation(libs.locator)

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
coreKtx = "1.12.0"
workRuntimeKtx = "2.11.0"
playServicesLocation = "21.0.1"
datastoreVer = "1.2.0"
securityCryptoVersion = "1.1.0"
kotlinxSerializationJson = "1.9.0"
roomVersion = "2.8.4"
hiveVersion = "1.3.12"
okhttpVersion = "5.3.2"
okioVersion = "3.16.4"
locatorVersion = "{Locator_SDK_Version}"

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
locator = { module = "br.net.datamob:locator", version.ref = "locatorVersion" }

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
 * Exemplo de função para inicialização do SDK para ser usada via WebViewBridge.
 * 
 * @param config Configuração da SDK (LocatorConfig)
 */
fun setupLocatorSDK(
    config: LocatorConfig
): Boolean {
    // 1. Garantir que a SDK está inicializada
    // Observação: Inserir o contexto da aplicação aqui (Camada nativa Novum)
    LocatorSDK.initialize(initContext = context)
    
    // 2. Obter a instância da SDK
    LocatorSDK.getInstance()
        .onSuccess { sdk ->
            // 3. Configurar a SDK com o LocatorConfig
            sdk.setConfig(config = config)
            
            // 4. Iniciar a SDK (se solicitado)
            return try {
                // 4.1 Necessário setState LocatorState.IDLE para SDK entender que pode sair do estado parada.
                sdk.setState(state = LocatorState.IDLE)
                sdk.start()
                true
            } catch (e: LocatorSDKMissingPermissionsException) {
                 // Sugestão: Caso caia nessa excp, pegue as permissões faltando, usando getPendingPermission(), e pode mostrar na tela 
                Log.e("LocatorSDK", "Permissões faltando: ${e.message}")
                false
            } catch (e: LocatorSDKNoConfigSetException) {
                // Sugestão: Retornar um erro para tentar novamente mais tarde.
                Log.e("LocatorSDK", "Configuração não definida: ${e.message}")
                false
            }
        }
        .onFailure { exception ->
            Log.e("LocatorSDK", "Erro ao obter instância: ${exception.message}")
            // Sugestão: Retornar um erro para tentar novamente mais tarde.
            false
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
            ),
            audioRecord = LocatorAudioRecord(
                // Configurações da gravação de áudio
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

### Passo 3: Iniciar Modo Observável

Para a SDK Locator entrar no modo observável, coleta e envio em tempo real utilizando o parâmetro `collectObservedModeIntervalMillis` do objeto `LocatorConfig` como referência de intervalo de coleta.

```kotlin
// Após obter a instância da SDK Locator
sdk.setSdkMode(mode = LocatorSdkMode.OBSERVED)
```


## Estrutura do LocatorConfig

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

## Integrador (LocatorIntegration)

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

## Exceções

```kotlin
class LocatorSDKNotInitializedException :
    IllegalStateException("LocatorSDK not initialized. Call initialize() first.")

class LocatorSDKNoConfigSetException :
    IllegalStateException("LocatorSDK configuration not passed. Call setConfig()/syncConfig() first.")

class LocatorSDKMissingPermissionsException :
    IllegalStateException("LocatorSDK needs permissions. Call pendingPermissions() to receive list of missing permissions first.")
```

## Iniciando a Coleta de Localizações

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

        val commandPayload = message.data["command"]
            ?: return  // Não é um comando da SDK Locator

        if (LocatorSDK.isLocatorSDKCommand(notificationMsg = commandPayload)) {
            LocatorSDK.convertLocatorSDKCommand(notificationMsg = commandPayload)
                .onSuccess { command ->
                    sdk.execute(command = command) 
                }
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

## Processo troca de dispositivo SDK

Após confirmação de troca no app, chamar método destroy da SDK para realizar limpeza dos dados, parar processos de coleta, cercas, detecção de queda e envio de dados via MQTT.

```kotlin
// Instância da classe LocatorSDK
sdk.destroy()
```

Notificar novo dispositivo para o mesmo realizar o init da SDK, passar a config inicial, executar o start e chamar o syncAll para realizar a busca de todas as configurações de funcionamento da SDK no novo dispositivo.
Para este processo olhar trecho de código descrito em
[Passo 2: Configuração Completa](#passo-2-configuração-completa), adicionar apenas a chamada de método de sync all após a configuração inicial.


```kotlin
// Instância da classe LocatorSDK
sdk.syncAll()
```


## Tratamento das permissões de start da SDK

Adicionado um tratamento especial para permissões na inicialização da coleta de localizações via método start() da SDK.

Este comportamento consiste em, validar apenas permissões necessárias para a realização de coletas, permissões relacionadas a serviços de geolocalização e foreground services, excluindo deste start() permissões relacionadas a outras funcionalidades, como por exemplo, captura de áudio.

Importante ressaltar que, o método pendingPermissions ainda retorna todas as permissões necessárias para a SDK funcionar em sua plenitude, porém permissões relacionadas com áudio, não terão interferência na coleta de localizações.

O impacto do não aceite destas permissões são: 

* Ao entrar no modo SOS, caso a/as permissão/permissões não sejam concedidas, a SDK irá enviar a entrada no modo SOS e enviará também um evento que não foi possível realizar a captura de áudios por conta da permissão/permissões.

## Funcionamento da gravação de áudio após a inicialização do dispositivo

Devido a restrições do sistema operacional Android é inviável iniciar uma coleta de áudio após a inicialização do dispositivo.

Quando o dispositivo for desligado e o SDK Mode for SOS, o comportamento da SDK é subir o serviço de coleta em tempo real, enviar um evento para o MQTT que o dispositivo entrou em SOS e iniciar a gravação,
entretanto por restrições não será possível iniciar a gravação de áudio, sendo necessário o usuário abrir o app uma vez para termos acesso ao MIC do dispositivo.

Tendo este comportamento, a SDK Locator ao receber do sistema o termino da inicialização, iniciará a coleta de localizações em tempo real, envio do evento para o MQTT e postará uma notificação com ação de abertura do app com dados de deeplink configuráveis no parâmetro `audioRecord` do objeto `LocatorConfig`.

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
    val audioRecord: LocatorAudioRecord? = null,
    val revision: Long? = null,
    val createdAt: Long? = null,
    val updatedAt: Long? = null
)

data class LocatorAudioRecord(
    val recordsCount: Int = 1,
    val durationSeconds: Int = 60,
    val retryCount: Int = 1,
    val intervalSeconds: Int = 60,
    val audioServiceNotification: AudioServiceNotification,
    val bootNotification: AudioServiceNotification
)

data class AudioServiceNotification(
    val title: String? = null,
    val message: String? = null,
    val deeplinkValue: String? = null,
    val deeplinkKey: String? = null
)
```

Uso do deeplinkKey e deeplinkValue

```kotlin

val audioRecord = sdk.getConfig().audioRecord

// intent usada para criação da PendingIntent utilizada na Notification.
val intent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
    putExtra(
        audioRecord?.bootNotification?.deeplinkKey,
        audioRecord?.bootNotification?.deeplinkValue
        )
    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
}
```


[< Voltar](../README.md)
