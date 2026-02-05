# Enums

[< Voltar](../README.md)

> Esta documentação descreve todas as _enumerations_ públicas do Locator SDK.
> Os enums são usados tanto pelo app host quanto pelo backend para interpretar corretamente o comportamento do SDK, eventos, comandos e telemetria.

---

## 1. `LocatorTokenType`

Enum que define **o tipo de token JWT** solicitado/fornecido pela API de integração.

```ts
export enum LocatorTokenType {
  JWT_API = "jwt_api",
  JWT_MQTT = "jwt_mqtt",
  JWT_WSS = "jwt_wss",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorTokenType(val value: String) {
    JWT_API("jwt_api"),
    JWT_MQTT("jwt_mqtt"),
    JWT_WSS("jwt_wss");

    companion object {
        fun getTypeFrom(value: String): LocatorTokenType? =
            LocatorTokenType.entries.firstOrNull { it.value == value }

        fun getStringFrom(value: LocatorTokenType): String? =
            LocatorTokenType.entries.firstOrNull { it == value }?.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorTokenType: String {
    case jwtApi = "jwt_api"
    case jwtMqtt = "jwt_mqtt"
    case jwtWss = "jwt_wss"
}
```

| Valor      | String     | Descrição                                                                                      |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------- |
| `JWT_API`  | `jwt_api`  | Token JWT usado para chamadas HTTP/HTTPS da API (config, scopes, grupos, etc.).                |
| `JWT_MQTT` | `jwt_mqtt` | Token JWT usado para autenticação no broker MQTT.                                              |
| `JWT_WSS`  | `jwt_wss`  | Token JWT usado para conexões WebSocket seguras (WSS), caso o SDK use canal WSS de telemetria. |

---

## 2. `LocatorPriority`

Prioridade de execução de eventos e comandos.

```ts
export enum LocatorPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  CRITICAL = "critical",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorPriority(val value: String) {
    LOW("low"),
    NORMAL("normal"),
    HIGH("high"),
    CRITICAL("critical");

    companion object {
        fun getTypeFrom(value: String): LocatorPriority? =
            LocatorPriority.entries.firstOrNull { it.value == value }

        fun getStringFrom(value: LocatorPriority): String? =
            LocatorPriority.entries.firstOrNull { it == value }?.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorPriority: String {
    case low = "low"
    case normal = "normal"
    case high = "high"
    case critical = "critical"
}
```

| Valor      | String     | Descrição                                                                            |
| ---------- | ---------- | ------------------------------------------------------------------------------------ |
| `LOW`      | `low`      | Execução com baixa prioridade. Pode ser postergado sem impacto crítico.              |
| `NORMAL`   | `normal`   | Prioridade padrão para comandos/eventos comuns.                                      |
| `HIGH`     | `high`     | Deve ser executado assim que possível, respeitando restrições de bateria/rede.       |
| `CRITICAL` | `critical` | Máxima prioridade. Usado para cenários de emergência, como SOS ou mudanças urgentes. |

---

## 3. `LocatorEventType`

Enum que identifica o **tipo de evento** gerado pelo SDK ou pela aplicação.

```ts
export enum LocatorEventType {
  BATTERY_EVENT = "battery.event",
  MOTION_ACCELERATION = "motion.acceleration",
  MOTION_BRAKING = "motion.braking",
  MOTION_SHARP_TURN = "motion.sharp_turn",
  ALERT_SOS = "alert.sos",
  GEOFENCE_ENTER = "geofence.enter",
  GEOFENCE_EXIT = "geofence.exit",
  GEOFENCES_SYNCED = "geofences.synced",
  CONFIGS_SYNCED = "configs.synced",
  CERT_SYNCED = "cert.synced",
  GROUPS_SYNCED = "groups.synced",
  FEATURES_SYNCED = "features.synced",
  SCOPES_SYNCED = "scopes.synced",
  POWERMODE_CHANGED = "powermode.changed",
  SDKMODE_CHANGED = "sdkmode.changed",
  SDKSTATE_CHANGED = "sdkstate.changed",
  COMMAND_RESULT = "command.result",
  PERMISSION_ERROR = "permission.error",
  CONNECTIVITY_CHANGED = "connectivity.changed",
  LOCATION_SEND_SUCCESS = "location.send_success",
  LOCATION_SEND_FAILED = "location.send_failed",
  LOCATION_QUEUED = "location.queued",
  LOCATION_DROPPED = "location.dropped",
  EXCEPTION = "exception",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorEventType(val value: String) {
    BATTERY_EVENT("battery.event"),
    MOTION_ACCELERATION("motion.acceleration"),
    MOTION_BRAKING("motion.braking"),
    MOTION_SHARP_TURN("motion.sharp_turn"),
    ALERT_SOS("alert.sos"),
    GEOFENCE_ENTER("geofence.enter"),
    GEOFENCE_EXIT("geofence.exit"),
    GEOFENCE_SYNCED("geofence.synced"),
    CONFIGS_SYNCED("configs.synced"),
    CERT_SYNCED("cert.synced"),
    GROUP_SYNCED("group.synced"),
    FEATURES_SYNCED("features.synced"),
    SCOPES_SYNCED("scopes.synced"),
    POWERMODE_CHANGED("powermode.changed"),
    SDKMODE_CHANGED("sdkmode.changed"),
    SDKSTATE_CHANGED("sdkstate.changed"),
    COMMAND_RESULT("command.result"),
    PERMISSION_ERROR("permission.error"),
    CONNECTIVITY_CHANGED("connectivity.changed"),
    LOCATION_SEND_SUCCESS("location.send_success"),
    LOCATION_SEND_FAILED("location.send_failed"),
    LOCATION_QUEUED("location.queued"),
    LOCATION_DROPPED("location.dropped"),
    EXCEPTION("exception");

    companion object {
        fun getTypeFrom(value: String): LocatorEventType? =
            LocatorEventType.entries.firstOrNull { it.value == value }

        fun getStringFrom(value: LocatorEventType): String? =
            LocatorEventType.entries.firstOrNull { it == value }?.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorEventType: String {
    case batteryEvent = "battery.event"
    case motionAcceleration = "motion.acceleration"
    case motionBraking = "motion.braking"
    case motionSharpTurn = "motion.sharp_turn"
    case alertSos = "alert.sos"
    case geofenceEnter = "geofence.enter"
    case geofenceExit = "geofence.exit"
    case geofenceSynced = "geofence.synced"
    case configsSynced = "configs.synced"
    case certSynced = "cert.synced"
    case groupSynced = "group.synced"
    case featuresSynced = "features.synced"
    case scopesSynced = "scopes.synced"
    case powermodeChanged = "powermode.changed"
    case sdkmodeChanged = "sdkmode.changed"
    case sdkstateChanged = "sdkstate.changed"
    case commandResult = "command.result"
    case permissionError = "permission.error"
    case connectivityChanged = "connectivity.changed"
    case locationSendSuccess = "location.send_success"
    case locationSendFailed = "location.send_failed"
    case locationQueued = "location.queued"
    case locationDropped = "location.dropped"
    case exception = "exception"
}
```

| Valor                   | String                  | Descrição                                                                          |
| ----------------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `BATTERY_EVENT`         | `battery.event`         | Evento disparado ao atingir faixas de bateria configuradas.                        |
| `MOTION_ACCELERATION`   | `motion.acceleration`   | Detecção de aceleração brusca (ex.: arrancadas).                                   |
| `MOTION_BRAKING`        | `motion.braking`        | Detecção de frenagens bruscas.                                                     |
| `MOTION_SHARP_TURN`     | `motion.sharp_turn`     | Detecção de curvas fechadas/agressivas.                                            |
| `ALERT_SOS`             | `alert.sos`             | Evento de alerta SOS (usuário ou sistema disparando emergência).                   |
| `GEOFENCE_ENTER`        | `geofence.enter`        | Entrada em uma geofence configurada.                                               |
| `GEOFENCE_EXIT`         | `geofence.exit`         | Saída de uma geofence configurada.                                                 |
| `GEOFENCES_SYNCED`      | `geofences.synced`      | Indica que as geofences foram sincronizadas com sucesso.                           |
| `CONFIGS_SYNCED`        | `configs.synced`        | Indica que configurações gerais foram sincronizadas com sucesso.                   |
| `CERT_SYNCED`           | `cert.synced`           | Indica que o certificado do SDK foi obtido/renovado com sucesso.                   |
| `GROUPS_SYNCED`         | `groups.synced`         | Indica que os grupos foram sincronizados com sucesso.                              |
| `FEATURES_SYNCED`       | `features.synced`       | Indica que as features disponíveis foram sincronizadas com sucesso.                |
| `SCOPES_SYNCED`         | `scopes.synced`         | Indica que os scopes foram sincronizados com sucesso.                              |
| `POWERMODE_CHANGED`     | `powermode.changed`     | Evento informando mudança de `LocatorPowerMode`.                                   |
| `SDKMODE_CHANGED`       | `sdkmode.changed`       | Evento informando mudança de `LocatorSdkMode`.                                     |
| `SDKSTATE_CHANGED`      | `sdkstate.changed`      | Evento informando mudança de `LocatorState`.                                       |
| `COMMAND_RESULT`        | `command.result`        | Resultado da execução de um comando (`LocatorCommandResult`).                      |
| `PERMISSION_ERROR`      | `permission.error`      | Erro relacionado a permissões do sistema operacional (ex.: localização negada).    |
| `CONNECTIVITY_CHANGED`  | `connectivity.changed`  | Indica alteração de conectividade/rede (mudança de Wi-Fi, celular, offline, etc.). |
| `LOCATION_SEND_SUCCESS` | `location.send_success` | Localizações enviadas com sucesso para o backend.                                  |
| `LOCATION_SEND_FAILED`  | `location.send_failed`  | Falha ao enviar localizações (erro de rede, autenticação, etc.).                   |
| `LOCATION_QUEUED`       | `location.queued`       | Localizações enfileiradas para envio posterior.                                    |
| `LOCATION_DROPPED`      | `location.dropped`      | Localizações descartadas pelo SDK (ex.: retenção máxima ou dados inválidos).       |
| `EXCEPTION`             | `exception`             | Exceção interna do SDK (erro inesperado, falha em integração, etc.).               |

---

## 4. `LocatorEventSource`

Origem do evento gerado.

```ts
export enum LocatorEventSource {
  SDK = "sdk",
  APP = "app",
  SERVER = "server",
  VIEW = "view",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorEventSource(val value: String) {
    SDK("sdk"),
    VIEW("view"),
    APP("app"),
    SERVER("server");

    companion object {
        fun getTypeFrom(value: String): LocatorEventSource? =
            LocatorEventSource.entries.firstOrNull { it.value == value }

        fun getStringFrom(value: LocatorEventSource): String? =
            LocatorEventSource.entries.firstOrNull { it == value }?.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorEventSource: String {
    case sdk = "sdk"
    case view = "view"
    case app = "app"
    case server = "server"
}
```

| Valor    | String   | Descrição                                                                         |
| -------- | -------- | --------------------------------------------------------------------------------- |
| `SDK`    | `sdk`    | Evento gerado internamente pelo SDK (coleta, bateria, geofence, etc.).            |
| `APP`    | `app`    | Evento disparado pelo aplicativo host (ex.: ação do usuário na UI).               |
| `SERVER` | `server` | Evento originado no backend (ex.: comando recebido do servidor).                  |
| `VIEW`   | `view`   | Evento originado em uma WebView/bridge (ex.: painel web consumindo dados do SDK). |

---

## 5. `LocatorEventLevel`

Nível de severidade/informação do evento.

```ts
export enum LocatorEventLevel {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorEventLevel(val value: String) {
    INFO("info"),
    WARNING("warning"),
    ERROR("error");

    companion object {
        fun getTypeFrom(value: String): LocatorEventLevel? =
            LocatorEventLevel.entries.firstOrNull { it.value == value }

        fun getStringFrom(value: LocatorEventLevel): String? =
            LocatorEventLevel.entries.firstOrNull { it == value }?.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorEventLevel: String {
    case info = "info"
    case warning = "warning"
    case error = "error"
}
```

| Valor     | String    | Descrição                                                          |
| --------- | --------- | ------------------------------------------------------------------ |
| `INFO`    | `info`    | Evento informativo, fluxo esperado de operação.                    |
| `WARNING` | `warning` | Evento de alerta, comportamento não ideal porém ainda recuperável. |
| `ERROR`   | `error`   | Erro de execução, falha de operação ou condição inesperada.        |

---

## 6. `LocatorState`

Estado interno do SDK em relação à coleta.

```ts
export enum LocatorState {
  DEFAULT = "default",
  IDLE = "idle",
  COLLECTING = "collecting",
  PAUSED = "paused",
  STOPPED = "stopped",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorState(val value: String) {
    DEFAULT("default"),
    IDLE("idle"),
    COLLECTING("collecting"),
    PAUSED("paused"),
    STOPPED("stopped");

    companion object {
        fun getTypeFrom(value: String): LocatorState =
            LocatorState.entries.firstOrNull { it.value == value } ?: DEFAULT

        fun getStringFrom(value: LocatorState): String =
            LocatorState.entries.firstOrNull { it == value }?.value ?: DEFAULT.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorState: String {
    case standart = "default" // Usando standard pois 'default' é uma palavra reservada em Swift
    case idle = "idle"
    case collecting = "collecting"
    case paused = "paused"
    case stopped = "stopped"
}
```

| Valor        | String       | Descrição                                                                     |
| ------------ | ------------ | ----------------------------------------------------------------------------- |
| `DEFAULT`    | `default`    | Estado inicial/padrão antes de o fluxo ser totalmente definido.               |
| `IDLE`       | `idle`       | SDK inicializado, porém sem coleta ativa (aguardando condição ou comando).    |
| `COLLECTING` | `collecting` | Coleta de localizações ativa conforme configuração.                           |
| `PAUSED`     | `paused`     | Coleta temporariamente pausada (pode ser retomada).                           |
| `STOPPED`    | `stopped`    | SDK parado. Requer nova chamada a `start()` para reiniciar o fluxo de coleta. |

---

## 7. `LocatorSdkMode`

Modo lógico de operação do SDK.

```ts
export enum LocatorSdkMode {
  DEFAULT = "default",
  OBSERVED = "observed",
  SOS = "sos",
  ALERT = "alert",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorSdkMode(val value: String) {
    DEFAULT("default"),
    OBSERVED("observed"),
    SOS("sos"),
    ALERT("alert");

    companion object {
        fun getTypeFrom(value: String): LocatorSdkMode =
            LocatorSdkMode.entries.firstOrNull { it.value == value } ?: DEFAULT

        fun getStringFrom(value: LocatorSdkMode): String =
            LocatorSdkMode.entries.firstOrNull { it == value }?.value ?: DEFAULT.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorSdkMode: String {
    case standard = "default" // Usando standard pois 'default' é uma palavra reservada
    case observed = "observed"
    case sos = "sos"
    case alert = "alert"
}
```

| Valor      | String     | Descrição                                                                     |
| ---------- | ---------- | ----------------------------------------------------------------------------- |
| `DEFAULT`  | `default`  | Modo padrão, comportamento normal de coleta e envio.                          |
| `OBSERVED` | `observed` | Modo de observação intensa (ex.: usuário sendo monitorado por outro).         |
| `SOS`      | `sos`      | Modo de emergência. Geralmente implica aumento de frequência de coleta/envio. |
| `ALERT`    | `alert`    | Modo de alerta (pode ser ativado por comando de backend ou app).              |

---

## 8. `LocatorPowerMode`

Política de consumo de bateria aplicada pelo SDK.

```ts
export enum LocatorPowerMode {
  NORMAL = "normal",
  POWER_SAVER = "power_saver",
  SUPER_SAVER = "super_saver",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorPowerMode(val value: String) {
    NORMAL("normal"),
    POWER_SAVER("power_saver"),
    SUPER_SAVER("super_saver");

    companion object {
        fun getTypeFrom(value: String): LocatorPowerMode =
            LocatorPowerMode.entries.firstOrNull { it.value == value } ?: NORMAL

        fun getStringFrom(value: LocatorPowerMode?): String =
            LocatorPowerMode.entries.firstOrNull { it == value }?.value ?: NORMAL.value

        fun getTypeFromPowerMode(isPowerModeOn: Boolean) =
            if (isPowerModeOn) POWER_SAVER else NORMAL
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorPowerMode: String {
    case normal = "normal"
    case powerSaver = "power_saver"
    case superSaver = "super_saver"
}
```

| Valor         | String        | Descrição                                                                                       |
| ------------- | ------------- | ----------------------------------------------------------------------------------------------- |
| `NORMAL`      | `normal`      | Coleta/envio padrão, sem restrições agressivas de bateria.                                      |
| `POWER_SAVER` | `power_saver` | Otimiza consumo: reduz frequência de coleta/envio quando possível.                              |
| `SUPER_SAVER` | `super_saver` | Mínimo consumo possível. Coletas e envios são raros, acionados apenas em condições específicas. |

---

## 9. `LocatorErrorCode`

Códigos padronizados de erro retornados em `LocatorCommandResult` e eventos de erro.

```ts
export enum LocatorErrorCode {
  NETWORK_TIMEOUT = "network_timeout",
  AUTH_INVALID = "auth_invalid",
  RATE_LIMIT = "rate_limit",
  EXCEPTION = "exception",
  UNKNOWN = "unknown",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorErrorCode(val value: String) {
    NETWORK_TIMEOUT("network_timeout"),
    AUTH_INVALID("auth_invalid"),
    RATE_LIMIT("rate_limit"),
    EXCEPTION("exception"),
    UNKNOWN("unknown");

    companion object {
        fun getTypeFrom(value: String): LocatorErrorCode =
            LocatorErrorCode.entries.firstOrNull { it.value == value } ?: UNKNOWN

        fun getStringFrom(value: LocatorErrorCode): String =
            LocatorErrorCode.entries.firstOrNull { it == value }?.value ?: UNKNOWN.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorErrorCode: String {
    case networkTimeout = "network_timeout"
    case authInvalid = "auth_invalid"
    case rateLimit = "rate_limit"
    case exception = "exception"
    case unknown = "unknown"
}
```

| Valor             | String            | Descrição                                                                    |
| ----------------- | ----------------- | ---------------------------------------------------------------------------- |
| `NETWORK_TIMEOUT` | `network_timeout` | Timeout de rede ao executar uma operação (envio de localização, sync, etc.). |
| `AUTH_INVALID`    | `auth_invalid`    | Problema de autenticação (token inválido, expirado ou ausente).              |
| `RATE_LIMIT`      | `rate_limit`      | Limite de requisições atingido (controle de uso imposto pelo backend).       |
| `EXCEPTION`       | `exception`       | Exceção interna não categorizada (erro de código, integração, etc.).         |
| `UNKNOWN`         | `unknown`         | Erro desconhecido ou não mapeado especificamente.                            |

---

## 10. `LocatorPermission`

Permissões que o SDK pode exigir/monitorar no dispositivo.

```ts
export enum LocatorPermission {
  LOCATION_FINE = "location_fine",
  LOCATION_COARSE = "location_coarse",
  LOCATION_BACKGROUND = "location_background",
  ACTIVITY_RECOGNITION = "activity_recognition",
  BODY_SENSORS = "body_sensors",
  BATTERY_OPTIMIZATION = "battery_optimization",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorPermission(val value: String, val permission: String) {
   LOCATION_FINE(
        value = "location_fine",
        permission = "android.permission.ACCESS_FINE_LOCATION"
    ),
    LOCATION_COARSE(
        value = "location_coarse",
        permission = "android.permission.ACCESS_COARSE_LOCATION"
    ),
    LOCATION_BACKGROUND(
        value = "location_background",
        permission = "android.permission.ACCESS_BACKGROUND_LOCATION"
    ),
    FOREGROUND_SERVICE(
        value = "foreground_service",
        permission = "android.permission.FOREGROUND_SERVICE"
    ),
    FOREGROUND_SERVICE_LOCATION(
        value = "foreground_service_location",
        permission = "android.permission.FOREGROUND_SERVICE_LOCATION"
    ),
    FOREGROUND_SERVICE_MICROPHONE(
        value = "foreground_service_microphone",
        permission = "android.permission.FOREGROUND_SERVICE_MICROPHONE"
    ),
    ACTIVITY_RECOGNITION(
        value = "activity_recognition",
        permission = "android.permission.ACTIVITY_RECOGNITION"
    ),
    BATTERY_OPTIMIZATION(
        value = "battery_optimization",
        permission = "android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS"
    ),
    ACCESS_NETWORK_STATE(
        value = "access_network_state",
        permission = "android.permission.ACCESS_NETWORK_STATE"
    ),
    RECORD_AUDIO(
        value = "record_audio",
        permission = "android.permission.RECORD_AUDIO"
    ),
    WAKE_LOCK(
        value = "wake_lock",
        permission = "android.permission.WAKE_LOCK"
    );

    companion object {
        fun getTypeFrom(value: String): LocatorPermission =
            LocatorPermission.entries.firstOrNull { it.value == value } ?: NONE

        fun getStringFrom(value: LocatorPermission): String =
            LocatorPermission.entries.firstOrNull { it == value }?.value ?: NONE.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocationPermission: String{
    case nSLocationWhenInUseUsageDescription = "location_in_use"
    case nSLocationAlwaysAndWhenInUseUsageDescription = "location_background"
    case nSMotionUsageDescription = "motion_usage"
    case nSFallDetectionUsageDescription = "fall_detection" 
    case none = "none" 
}
```

| Valor                  | String                 | Descrição                                                                                            |
| ---------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `LOCATION_FINE`        | `location_fine`        | Acesso à localização precisa (GPS, GNSS, etc.).                                                      |
| `LOCATION_COARSE`      | `location_coarse`      | Acesso à localização aproximada (rede/Wi-Fi).                                                        |
| `LOCATION_BACKGROUND`  | `location_background`  | Permissão para coletar localização em segundo plano.                                                 |
| `ACTIVITY_RECOGNITION` | `activity_recognition` | Permissão para detectar atividades físicas (caminhando, dirigindo, etc.).                            |
| `BODY_SENSORS`         | `body_sensors`         | Acesso a sensores corporais (dependendo da plataforma).                                              |
| `BATTERY_OPTIMIZATION` | `battery_optimization` | Controle ou exclusão de otimização de bateria para o app/SDK (ex.: “ignorar otimização de bateria”). |

---

## 11. `LocatorCommandType`

Enum que define os **tipos de comandos** que podem ser executados pelo SDK.

```ts
export enum LocatorCommandType {
  SET_SDK_MODE = "set_sdk_mode",
  SET_POWER_MODE = "set_power_mode",
  START_SDK = "start_sdk",
  STOP_SDK = "stop_sdk",
  DISABLE_SDK = "disable_sdk",
  RELOAD_SDK = "reload_sdk",
  PAUSE_COLLECTION = "pause_collection",
  RESUME_COLLECTION = "resume_collection",
  SYNC_CERT = "sync_cert",
  SYNC_FEATURES = "sync_features",
  SYNC_SCOPES = "sync_scopes",
  SYNC_CONFIG = "sync_config",
  SYNC_GROUPS = "sync_groups",
  SYNC_GEOFENCES = "sync_geofences",
  KEEP_ALIVE = "keep_alive",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorCommandType(val value: String) {
    SET_SDK_MODE("set_sdk_mode"),
    SET_POWER_MODE("set_power_mode"),
    START_SDK("start_sdk"),
    STOP_SDK("stop_sdk"),
    DISABLE_SDK("disable_sdk"),
    RELOAD_SDK("reload_sdk"),
    PAUSE_COLLECTION("pause_collection"),
    RESUME_COLLECTION("resume_collection"),
    SYNC_CERT("sync_cert"),
    SYNC_FEATURES("sync_features"),
    SYNC_SCOPES("sync_scopes"),
    SYNC_CONFIG("sync_config"),
    SYNC_GROUPS("sync_groups"),
    SYNC_GEOFENCES("sync_geofences"),
    KEEP_ALIVE("keep_alive");

    companion object {
        fun getTypeFrom(value: String): LocatorCommandType? =
            LocatorCommandType.entries.firstOrNull { it.value == value }

        fun getStringFrom(value: LocatorCommandType): String? =
            LocatorCommandType.entries.firstOrNull { it == value }?.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorCommandType: String {
    case setSdkMode = "set_sdk_mode"
    case setPowerMode = "set_power_mode"
    case startSdk = "start_sdk"
    case stopSdk = "stop_sdk"
    case disableSdk = "disable_sdk"
    case reloadSdk = "reload_sdk"
    case pauseCollection = "pause_collection"
    case resumeCollection = "resume_collection"
    case syncCert = "sync_cert"
    case syncFeatures = "sync_features"
    case syncScopes = "sync_scopes"
    case syncConfig = "sync_config"
    case syncGroups = "sync_groups"
    case syncGeofences = "sync_geofences"
    case keepAlive = "keep_alive"
}
```

| Valor               | String              | Descrição                                                                              |
| ------------------- | ------------------- | -------------------------------------------------------------------------------------- |
| `SET_SDK_MODE`      | `set_sdk_mode`      | Altera o `LocatorSdkMode` atual do SDK (default, observed, sos, alert).                |
| `SET_POWER_MODE`    | `set_power_mode`    | Altera o `LocatorPowerMode` aplicado (normal, power_saver, super_saver).               |
| `START_SDK`         | `start_sdk`         | Inicia o SDK e a coleta de localização, respeitando as configurações.                  |
| `STOP_SDK`          | `stop_sdk`          | Para o SDK e a coleta, preservando dados e certificados.                               |
| `DISABLE_SDK`       | `disable_sdk`       | Desativa completamente o SDK, podendo limpar dados locais dependendo da implementação. |
| `RELOAD_SDK`        | `reload_sdk`        | Recarrega a configuração atual, podendo reinicializar conexões/estado.                 |
| `PAUSE_COLLECTION`  | `pause_collection`  | Pausa temporariamente a coleta de localizações.                                        |
| `RESUME_COLLECTION` | `resume_collection` | Retoma a coleta após um `PAUSE_COLLECTION`.                                            |
| `SYNC_CERT`         | `sync_cert`         | Força sincronização/renovação do certificado.                                          |
| `SYNC_FEATURES`     | `sync_features`     | Força sincronização das features habilitadas.                                          |
| `SYNC_SCOPES`       | `sync_scopes`       | Força sincronização dos scopes.                                                        |
| `SYNC_CONFIG`       | `sync_config`       | Força sincronização da configuração do SDK.                                            |
| `SYNC_GROUPS`       | `sync_groups`       | Força sincronização dos grupos de visibilidade/admin.                                  |
| `SYNC_GEOFENCES`    | `sync_geofences`    | Força sincronização das geofences.                                                     |
| `KEEP_ALIVE`        | `keep_alive`        | Comando de “ping” para manter o SDK ativo ou testar conectividade.                     |

---

## 12. `LocatorCommandStatus`

Status final da execução de um comando.

```ts
export enum LocatorCommandStatus {
  SUCCESS = "success",
  FAILED = "failed",
  ERROR = "error",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorCommandStatus(val value: String) {
    SUCCESS("success"),
    FAILED("failed"),
    ERROR("error");

    companion object {
        fun getTypeFrom(value: String): LocatorCommandStatus? =
            LocatorCommandStatus.entries.firstOrNull { it.value == value }

        fun getStringFrom(value: LocatorCommandStatus): String? =
            LocatorCommandStatus.entries.firstOrNull { it == value }?.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorCommandStatus: String {
    case success = "success"
    case failed = "failed"
    case error = "error"
}
```

| Valor     | String    | Descrição                                                                               |
| --------- | --------- | --------------------------------------------------------------------------------------- |
| `SUCCESS` | `success` | Comando executado com sucesso, sem erros.                                               |
| `FAILED`  | `failed`  | Comando executado, porém a condição desejada não foi alcançada (ex.: permissão negada). |
| `ERROR`   | `error`   | Erro inesperado na execução do comando (exceção, timeout, etc.).                        |

---

## 13. `LocatorCollectSource`

Origem da localização coletada.

```ts
export enum LocatorCollectSource {
  UNKNOWN = "unknown",
  GPS = "gps",
  NETWORK = "network",
  FUSED = "fused",
  BLUETOOTH = "bluetooth",
  MANUAL = "manual",
  LAST_KNOWN = "last_known",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorCollectSource(val value: String) {
    LAST_KNOWN("last_known"),
    MANUAL("manual"),
    BLUETOOTH("bluetooth"),
    FUSED("fused"),
    NETWORK("network"),
    GPS("gps"),
    UNKNOWN("unknown");

    companion object {
        fun getTypeFrom(value: String): LocatorCollectSource =
            LocatorCollectSource.entries.firstOrNull { it.value == value } ?: UNKNOWN

        fun getStringFrom(value: LocatorCollectSource?): String =
            LocatorCollectSource.entries.firstOrNull { it == value }?.value ?: UNKNOWN.value

        fun getTypeFromProvider(provider: String): LocatorCollectSource =
            LocatorCollectSource.entries.firstOrNull {
                it.value.contains(
                    provider,
                    ignoreCase = true
                )
            } ?: FUSED
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorCollectSource: String {
    case unknown = "unknown"
    case gps = "gps"
    case network = "network"
    case fused = "fused"
    case bluetooth = "bluetooth"
    case manual = "manual"
    case lastKnown = "last_known"
}
```

| Valor        | String       | Descrição                                                                                    |
| ------------ | ------------ | -------------------------------------------------------------------------------------------- |
| `UNKNOWN`    | `unknown`    | Origem não determinada ou não informada.                                                     |
| `GPS`        | `gps`        | Coleta originada diretamente do provedor GPS/GNSS.                                           |
| `NETWORK`    | `network`    | Coleta baseada em rede (Wi-Fi, estação celular, etc.).                                       |
| `FUSED`      | `fused`      | Coleta de provedor “fused” (combinação de múltiplas fontes, como em Android Fused Location). |
| `BLUETOOTH`  | `bluetooth`  | Coleta aproximada baseada em dispositivos BLE/beacons.                                       |
| `MANUAL`     | `manual`     | Localização inserida manualmente (pelo app/usuário).                                         |
| `LAST_KNOWN` | `last_known` | Última localização conhecida retornada pelo SO/SDK.                                          |

---

## 14. `LocatorAccuracyProvider`

Qualidade/tipo de provider de acurácia usado na coleta.

```ts
export enum LocatorAccuracyProvider {
  GPS_ULTRA = "gps_ultra", // GNSS Dual-band L1+L5
  GPS_HIGH = "gps_high",
  GPS_MEDIUM = "gps_medium",
  GPS_LOW = "gps_low",
  GNSS = "gnss", // iOS & Android general
  NETWORK_LOW = "network_low",
  NETWORK_HIGH = "network_high",
  FUSED_BALANCED = "fused_balanced",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorAccuracyProvider(val value: String) {
    GPS_ULTRA("gps_ultra"), // GNSS Dual-band L1+L5
    GPS_HIGH("gps_high"),
    GPS_MEDIUM("gps_medium"),
    GPS_LOW("gps_low"),
    GNSS("gnss"), // iOS & Android general
    NETWORK_LOW("network_low"),
    NETWORK_HIGH("network_high"),
    FUSED_BALANCED("fused_balanced");

    companion object {
        fun getTypeFrom(value: String): LocatorAccuracyProvider =
            LocatorAccuracyProvider.entries.firstOrNull { it.value == value } ?: FUSED_BALANCED

        fun getStringFrom(value: LocatorAccuracyProvider?): String =
            LocatorAccuracyProvider.entries.firstOrNull { it == value }?.value
                ?: FUSED_BALANCED.value

        fun getTypeFromProvider(provider: String): LocatorAccuracyProvider =
            LocatorAccuracyProvider.entries.firstOrNull {
                it.value.contains(
                    provider,
                    ignoreCase = true
                )
            } ?: FUSED_BALANCED
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorAccuracyProvider: String {
    case gpsUltra = "gps_ultra"
    case gpsHigh = "gps_high"
    case gpsMedium = "gps_medium"
    case gpsLow = "gps_low"
    case gnss = "gnss"
    case networkLow = "network_low"
    case networkHigh = "network_high"
    case fusedBalanced = "fused_balanced"
}
```

| Valor            | String           | Descrição                                                                             |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------- |
| `GPS_ULTRA`      | `gps_ultra`      | Alta precisão baseada em GNSS dual-band (L1+L5) ou equivalente.                       |
| `GPS_HIGH`       | `gps_high`       | Alta precisão de GPS/GNSS convencional.                                               |
| `GPS_MEDIUM`     | `gps_medium`     | Precisão média, geralmente suficiente para navegação urbana.                          |
| `GPS_LOW`        | `gps_low`        | Precisão baixa, porém ainda baseada em GPS (sinal fraco, ambiente fechado, etc.).     |
| `GNSS`           | `gnss`           | Provider genérico GNSS (iOS/Android) sem distinção de banda/qualidade.                |
| `NETWORK_LOW`    | `network_low`    | Precisão baixa baseada apenas em rede (Wi-Fi/celular), útil para economia de bateria. |
| `NETWORK_HIGH`   | `network_high`   | Melhor precisão possível usando rede + heurísticas do sistema.                        |
| `FUSED_BALANCED` | `fused_balanced` | Provider “fused” balanceado entre precisão e consumo de bateria.                      |

---

## 15. `LocatorConnectivityType`

Tipo de **conectividade ativa** em alto nível.

```ts
export enum LocatorConnectivityType {
  UNKNOWN = "unknown",
  WIFI = "wifi",
  CELLULAR = "cellular",
  BLUETOOTH = "bluetooth",
  ETHERNET = "ethernet",
  VPN = "vpn",
  NONE = "none",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorConnectivityType(val value: String) {
    WIFI("wifi"),
    CELLULAR("cellular"),
    BLUETOOTH("bluetooth"),
    ETHERNET("ethernet"),
    VPN("vpn"),
    NONE("none"),
    UNKNOWN("unknown");

    companion object {
        fun getTypeFrom(value: String): LocatorConnectivityType =
            LocatorConnectivityType.entries.firstOrNull { it.value == value } ?: UNKNOWN

        fun getStringFrom(value: LocatorConnectivityType): String =
            LocatorConnectivityType.entries.firstOrNull { it == value }?.value ?: UNKNOWN.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorConnectivityType: String {
    case unknown = "unknown"
    case wifi = "wifi"
    case cellular = "cellular"
    case bluetooth = "bluetooth"
    case ethernet = "ethernet"
    case vpn = "vpn"
    case none = "none"
}
```

| Valor       | String      | Descrição                                                                                        |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `UNKNOWN`   | `unknown`   | Não foi possível determinar a conectividade.                                                     |
| `WIFI`      | `wifi`      | Dispositivo conectado via Wi-Fi.                                                                 |
| `CELLULAR`  | `cellular`  | Conectado via rede móvel (2G/3G/4G/5G).                                                          |
| `BLUETOOTH` | `bluetooth` | Comunicação via Bluetooth (ex.: gateway local).                                                  |
| `ETHERNET`  | `ethernet`  | Conectado via cabo/ethernet.                                                                     |
| `VPN`       | `vpn`       | Tráfego passando por VPN (pode coexistir com outros tipos físicos, mas é destacado logicamente). |
| `NONE`      | `none`      | Sem conectividade disponível (offline).                                                          |

---

## 16. `LocatorNetworkType`

Detalhamento fino do tipo de rede (inclui Wi-Fi, BT, Ethernet e gerações de rede móvel).

```ts
export enum LocatorNetworkType {
  // Geral
  UNKNOWN = "unknown",
  NONE = "none",
  // Wi-Fi
  WIFI = "wifi",
  WIFI_4 = "wifi4",
  WIFI_5 = "wifi5",
  WIFI_6 = "wifi6",
  WIFI_6E = "wifi6e",
  WIFI_7 = "wifi7",
  // Bluetooth
  BT = "bt",
  BT_CLASSIC = "bt_classic",
  BT_LE = "bt_le",
  BT_5 = "bt5",
  BT_5_1 = "bt51",
  BT_5_2 = "bt52",
  // Ethernet
  ETH = "eth",
  ETH_100 = "eth100",
  ETH_1G = "eth1g",
  ETH_10G = "eth10g",
  // VPN
  VPN = "vpn",
  VPN_IPSEC = "vpn_ipsec",
  VPN_OPENVPN = "vpn_ovpn",
  VPN_WIREGUARD = "vpn_wg",
  VPN_SSL = "vpn_ssl",
  // Celular (macro)
  CELL = "cell",
  // 2G
  G2 = "2g",
  G2_GPRS = "2g_gprs",
  G2_EDGE = "2g_edge",
  // 3G
  G3 = "3g",
  G3_UMTS = "3g_umts",
  G3_HSPA = "3g_hspa",
  G3_HSPA_PLUS = "3g_hspa_plus",
  // 4G
  G4 = "4g",
  G4_LTE = "4g_lte",
  G4_LTE_A = "4g_lte_a",
  // 5G
  G5 = "5g",
  G5_NSA = "5g_nsa",
  G5_SA = "5g_sa",
  G5_NR = "5g_nr",
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
enum class LocatorNetworkType(val value: String) {
    // Geral
    UNKNOWN("unknown"),
    NONE("none"),

    // Wi-Fi
    WIFI("wifi"),
    WIFI_4("wifi4"),
    WIFI_5("wifi5"),
    WIFI_6("wifi6"),
    WIFI_6E("wifi6e"),
    WIFI_7("wifi7"),

    // Bluetooth
    BT("bt"),
    BT_CLASSIC("bt_classic"),
    BT_LE("bt_le"),
    BT_5("bt5"),
    BT_5_1("bt51"),
    BT_5_2("bt52"),

    // Ethernet
    ETH("eth"),
    ETH_100("eth100"),
    ETH_1G("eth1g"),
    ETH_10G("eth10g"),

    // VPN
    VPN("vpn"),
    VPN_IPSEC("vpn_ipsec"),
    VPN_OPENVPN("vpn_ovpn"),
    VPN_WIREGUARD("vpn_wg"),
    VPN_SSL("vpn_ssl"),

    // Celular (macro)
    CELL("cell"),

    // 2G
    G2("2g"),
    G2_GPRS("2g_gprs"),
    G2_EDGE("2g_edge"),

    // 3G
    G3("3g"),
    G3_UMTS("3g_umts"),
    G3_HSPA("3g_hspa"),
    G3_HSPA_PLUS("3g_hspa_plus"),

    // 4G
    G4("4g"),
    G4_LTE("4g_lte"),
    G4_LTE_A("4g_lte_a"),

    // 5G
    G5("5g"),
    G5_NSA("5g_nsa"),
    G5_SA("5g_sa"),
    G5_NR("5g_nr");

    companion object {

        fun getTypeFrom(value: String): LocatorNetworkType =
            LocatorNetworkType.entries.firstOrNull { it.value == value } ?: UNKNOWN

        fun getStringFrom(value: LocatorNetworkType): String =
            LocatorNetworkType.entries.firstOrNull { it == value }?.value ?: UNKNOWN.value
    }
}
```

#### 🟧 **Swift (iOS)**
```swift
enum LocatorNetworkType: String {
    // Geral
    case unknown = "unknown"
    case none = "none"
    
    // Wi-Fi
    case wifi = "wifi"
    case wifi4 = "wifi4"
    case wifi5 = "wifi5"
    case wifi6 = "wifi6"
    case wifi6e = "wifi6e"
    case wifi7 = "wifi7"
    
    // Bluetooth
    case bt = "bt"
    case btClassic = "bt_classic"
    case btLe = "bt_le"
    case bt5 = "bt5"
    case bt51 = "bt51"
    case bt52 = "bt52"
    
    // Ethernet
    case eth = "eth"
    case eth100 = "eth100"
    case eth1G = "eth1g"
    case eth10G = "eth10g"
    
    // VPN
    case vpn = "vpn"
    case vpnIpsec = "vpn_ipsec"
    case vpnOpenvpn = "vpn_ovpn"
    case vpnWireguard = "vpn_wg"
    case vpnSsl = "vpn_ssl"
    
    // Celular (macro)
    case cell = "cell"
    
    // 2G
    case g2 = "2g"
    case g2Gprs = "2g_gprs"
    case g2Edge = "2g_edge"
    
    // 3G
    case g3 = "3g"
    case g3Umts = "3g_umts"
    case g3Hspa = "3g_hspa"
    case g3HspaPlus = "3g_hspa_plus"
    
    // 4G
    case g4 = "4g"
    case g4Lte = "4g_lte"
    case g4LteA = "4g_lte_a"
    
    // 5G
    case g5 = "5g"
    case g5Nsa = "5g_nsa"
    case g5Sa = "5g_sa"
    case g5Nr = "5g_nr"
}
```

### 16.1 Valores genéricos

| Valor     | String    | Descrição                  |
| --------- | --------- | -------------------------- |
| `UNKNOWN` | `unknown` | Tipo de rede desconhecido. |
| `NONE`    | `none`    | Sem rede disponível.       |

### 16.2 Wi-Fi

| Valor     | String   | Descrição                              |
| --------- | -------- | -------------------------------------- |
| `WIFI`    | `wifi`   | Wi-Fi sem detalhar padrão específico.  |
| `WIFI_4`  | `wifi4`  | Wi-Fi 4 (802.11n).                     |
| `WIFI_5`  | `wifi5`  | Wi-Fi 5 (802.11ac).                    |
| `WIFI_6`  | `wifi6`  | Wi-Fi 6 (802.11ax banda convencional). |
| `WIFI_6E` | `wifi6e` | Wi-Fi 6E (802.11ax banda 6 GHz).       |
| `WIFI_7`  | `wifi7`  | Wi-Fi 7 (802.11be).                    |

### 16.3 Bluetooth

| Valor        | String       | Descrição                                       |
| ------------ | ------------ | ----------------------------------------------- |
| `BT`         | `bt`         | Bluetooth genérico.                             |
| `BT_CLASSIC` | `bt_classic` | Bluetooth clássico (BR/EDR).                    |
| `BT_LE`      | `bt_le`      | Bluetooth Low Energy.                           |
| `BT_5`       | `bt5`        | Bluetooth 5.x genérico.                         |
| `BT_5_1`     | `bt51`       | Bluetooth 5.1 (melhorias de localização, etc.). |
| `BT_5_2`     | `bt52`       | Bluetooth 5.2 (novos recursos de áudio, etc.).  |

### 16.4 Ethernet

| Valor     | String   | Descrição                  |
| --------- | -------- | -------------------------- |
| `ETH`     | `eth`    | Ethernet genérico.         |
| `ETH_100` | `eth100` | Fast Ethernet (100 Mbps).  |
| `ETH_1G`  | `eth1g`  | Gigabit Ethernet (1 Gbps). |
| `ETH_10G` | `eth10g` | 10 Gigabit Ethernet.       |

### 16.5 VPN

| Valor           | String      | Descrição                                 |
| --------------- | ----------- | ----------------------------------------- |
| `VPN`           | `vpn`       | VPN genérica, protocolo não especificado. |
| `VPN_IPSEC`     | `vpn_ipsec` | VPN baseada em IPsec.                     |
| `VPN_OPENVPN`   | `vpn_ovpn`  | VPN baseada em OpenVPN.                   |
| `VPN_WIREGUARD` | `vpn_wg`    | VPN baseada em WireGuard.                 |
| `VPN_SSL`       | `vpn_ssl`   | VPN baseada em SSL/TLS (ex.: SSL VPN).    |

### 16.6 Celular (macro e gerações)

| Valor  | String | Descrição                                         |
| ------ | ------ | ------------------------------------------------- |
| `CELL` | `cell` | Rede celular genérica (sem distinção de geração). |

#### 2G

| Valor     | String    | Descrição    |
| --------- | --------- | ------------ |
| `G2`      | `2g`      | 2G genérico. |
| `G2_GPRS` | `2g_gprs` | 2G GPRS.     |
| `G2_EDGE` | `2g_edge` | 2G EDGE.     |

#### 3G

| Valor          | String         | Descrição    |
| -------------- | -------------- | ------------ |
| `G3`           | `3g`           | 3G genérico. |
| `G3_UMTS`      | `3g_umts`      | 3G UMTS.     |
| `G3_HSPA`      | `3g_hspa`      | 3G HSPA.     |
| `G3_HSPA_PLUS` | `3g_hspa_plus` | 3G HSPA+.    |

#### 4G

| Valor      | String     | Descrição        |
| ---------- | ---------- | ---------------- |
| `G4`       | `4g`       | 4G genérico.     |
| `G4_LTE`   | `4g_lte`   | 4G LTE.          |
| `G4_LTE_A` | `4g_lte_a` | 4G LTE Advanced. |

#### 5G

| Valor    | String   | Descrição                                                     |
| -------- | -------- | ------------------------------------------------------------- |
| `G5`     | `5g`     | 5G genérico.                                                  |
| `G5_NSA` | `5g_nsa` | 5G Non-Standalone (ancorado em 4G).                           |
| `G5_SA`  | `5g_sa`  | 5G Standalone (core totalmente 5G).                           |
| `G5_NR`  | `5g_nr`  | 5G NR (New Radio), referência genérica ao padrão de rádio 5G. |

---

# 17. Exemplos de Uso por Linguagem (Enums)

## 17.1 TypeScript

```ts
import {
  LocatorSdkMode,
  LocatorPowerMode,
  LocatorEventType,
  LocatorConnectivityType,
  LocatorNetworkType,
  LocatorAccuracyProvider,
  LocatorCollectSource,
} from "./locator-sdk-types";

function buildSampleCollect() {
  const collect = {
    id: crypto.randomUUID(),
    sequence: 1,
    source: LocatorCollectSource.GPS,
    latitude: -23.561684,
    longitude: -46.625378,
    satellitesUsed: 18,
    satellitesVisible: 24,
    providerAccuracy: LocatorAccuracyProvider.GPS_HIGH,
    horizontalAccuracy: 5,
    verticalAccuracy: 8,
    altitude: 780,
    bearing: 120,
    speed: 12.3,
    battery: 82,
    charging: false,
    connectivity: LocatorConnectivityType.CELLULAR,
    network: LocatorNetworkType.G5_NSA,
    powerMode: LocatorPowerMode.NORMAL,
    sdkMode: LocatorSdkMode.DEFAULT,
    timestamp: Date.now(),
  };

  return collect;
}

function buildConnectivityChangedEvent() {
  return {
    id: crypto.randomUUID(),
    type: LocatorEventType.CONNECTIVITY_CHANGED,
    source: LocatorEventSource.SDK,
    level: LocatorEventLevel.INFO,
    priority: LocatorPriority.NORMAL,
    payload: {
      from: {
        connectivity: LocatorConnectivityType.WIFI,
        network: LocatorNetworkType.WIFI_5,
      },
      to: {
        connectivity: LocatorConnectivityType.CELLULAR,
        network: LocatorNetworkType.G5_NSA,
      },
    },
    timestamp: Date.now(),
  };
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
fun buildSampleCollect(): LocatorCollect =
    LocatorCollect(
        id = crypto.randomUUID(),
        sequence = 1,
        source = LocatorCollectSource.GPS,
        latitude = -23.561684,
        longitude = -46.625378,
        satellitesUsed = 18,
        satellitesVisible = 24,
        providerAccuracy = LocatorAccuracyProvider.GPS_HIGH,
        horizontalAccuracy = 5F,
        verticalAccuracy = 8F,
        altitude = 780.0,
        bearing = 120F,
        speed = 12.3F,
        battery = 82,
        charging = false,
        connectivity = LocatorConnectivityType.CELLULAR,
        network = LocatorNetworkType.G5_NSA,
        powerMode = LocatorPowerMode.NORMAL,
        sdkMode = LocatorSdkMode.DEFAULT,
        timestamp = System.currentTimeMillis(),
    )
```

#### 🟧 **Swift (iOS)**
```swift
func buildSampleCollect() -> LocatorCollect {
    let collect = LocatorCollect(
        id: UUID().uuidString,
        sequence: 1,
        source: .gps,
        latitude: -23.561684,
        longitude: -46.625378,
        satellitesUsed: 18,
        satellitesVisible: 24,
        providerAccuracy: .gpsHigh,
        horizontalAccuracy: 5.0, 
        verticalAccuracy: 8.0,   
        altitude: 780.0,
        bearing: 120.0,
        speed: 12.3,
        battery: 82,
        charging: false,
        connectivity: .cellular,
        network: .g5Nsa,
        powerMode: .normal,
        sdkMode: .default,
        timestamp: Int64(Date().timeIntervalSince1970 * 1000)
    )
    
    return collect
}
```

---

## 17.2 Kotlin (Android)

```kotlin
enum class LocatorSdkMode(val value: String) {
    DEFAULT("default"),
    OBSERVED("observed"),
    SOS("sos"),
    ALERT("alert");
}

enum class LocatorPowerMode(val value: String) {
    NORMAL("normal"),
    POWER_SAVER("power_saver"),
    SUPER_SAVER("super_saver");
}

enum class LocatorConnectivityType(val value: String) {
    UNKNOWN("unknown"),
    WIFI("wifi"),
    CELLULAR("cellular"),
    BLUETOOTH("bluetooth"),
    ETHERNET("ethernet"),
    VPN("vpn"),
    NONE("none");
}

enum class LocatorNetworkType(val value: String) {
    UNKNOWN("unknown"),
    NONE("none"),
    WIFI("wifi"),
    WIFI_4("wifi4"),
    WIFI_5("wifi5"),
    WIFI_6("wifi6"),
    WIFI_6E("wifi6e"),
    WIFI_7("wifi7"),
    BT("bt"),
    BT_CLASSIC("bt_classic"),
    BT_LE("bt_le"),
    BT_5("bt5"),
    BT_5_1("bt51"),
    BT_5_2("bt52"),
    ETH("eth"),
    ETH_100("eth100"),
    ETH_1G("eth1g"),
    ETH_10G("eth10g"),
    VPN("vpn"),
    VPN_IPSEC("vpn_ipsec"),
    VPN_OPENVPN("vpn_ovpn"),
    VPN_WIREGUARD("vpn_wg"),
    VPN_SSL("vpn_ssl"),
    CELL("cell"),
    G2("2g"),
    G2_GPRS("2g_gprs"),
    G2_EDGE("2g_edge"),
    G3("3g"),
    G3_UMTS("3g_umts"),
    G3_HSPA("3g_hspa"),
    G3_HSPA_PLUS("3g_hspa_plus"),
    G4("4g"),
    G4_LTE("4g_lte"),
    G4_LTE_A("4g_lte_a"),
    G5("5g"),
    G5_NSA("5g_nsa"),
    G5_SA("5g_sa"),
    G5_NR("5g_nr");
}
```

Uso em um coletor:

```kotlin
data class LocatorCollect(
    val id: String,
    val sdkMode: LocatorSdkMode,
    val powerMode: LocatorPowerMode? = null,
    val connectivity: LocatorConnectivityType,
    val network: LocatorNetworkType,
    val latitude: Double,
    val longitude: Double,
    val timestamp: Long
)

fun buildCollect(): LocatorCollect {
    return LocatorCollect(
        id = java.util.UUID.randomUUID().toString(),
        sdkMode = LocatorSdkMode.DEFAULT,
        powerMode = LocatorPowerMode.NORMAL,
        connectivity = LocatorConnectivityType.CELLULAR,
        network = LocatorNetworkType.G5_NSA,
        latitude = -23.561684,
        longitude = -46.625378,
        timestamp = System.currentTimeMillis()
    )
}
```

---

## 17.3 Swift (iOS)

```swift
enum LocatorSdkMode: String {
    case `default` = "default"
    case observed = "observed"
    case sos = "sos"
    case alert = "alert"
}

enum LocatorPowerMode: String {
    case normal = "normal"
    case powerSaver = "power_saver"
    case superSaver = "super_saver"
}

enum LocatorConnectivityType: String {
    case unknown = "unknown"
    case wifi = "wifi"
    case cellular = "cellular"
    case bluetooth = "bluetooth"
    case ethernet = "ethernet"
    case vpn = "vpn"
    case none = "none"
}

enum LocatorNetworkType: String {
    case unknown = "unknown"
    case none = "none"
    case wifi = "wifi"
    case wifi4 = "wifi4"
    case wifi5 = "wifi5"
    case wifi6 = "wifi6"
    case wifi6e = "wifi6e"
    case wifi7 = "wifi7"
    case bt = "bt"
    case btClassic = "bt_classic"
    case btLe = "bt_le"
    case bt5 = "bt5"
    case bt51 = "bt51"
    case bt52 = "bt52"
    case eth = "eth"
    case eth100 = "eth100"
    case eth1g = "eth1g"
    case eth10g = "eth10g"
    case vpn = "vpn"
    case vpnIpSec = "vpn_ipsec"
    case vpnOpenVpn = "vpn_ovpn"
    case vpnWireGuard = "vpn_wg"
    case vpnSsl = "vpn_ssl"
    case cell = "cell"
    case g2 = "2g"
    case g2Gprs = "2g_gprs"
    case g2Edge = "2g_edge"
    case g3 = "3g"
    case g3Umts = "3g_umts"
    case g3Hspa = "3g_hspa"
    case g3HspaPlus = "3g_hspa_plus"
    case g4 = "4g"
    case g4Lte = "4g_lte"
    case g4LteA = "4g_lte_a"
    case g5 = "5g"
    case g5Nsa = "5g_nsa"
    case g5Sa = "5g_sa"
    case g5Nr = "5g_nr"
}

struct LocatorCollect: Codable {
    let id: String
    let latitude: Double
    let longitude: Double
    let sdkMode: LocatorSdkMode
    let powerMode: LocatorPowerMode?
    let connectivity: LocatorConnectivityType
    let network: LocatorNetworkType
    let timestamp: Int64
}

func buildCollect() -> LocatorCollect {
    return LocatorCollect(
        id: UUID().uuidString,
        latitude: -23.561684,
        longitude: -46.625378,
        sdkMode: .default,
        powerMode: .normal,
        connectivity: .cellular,
        network: .g5Nsa,
        timestamp: Int64(Date().timeIntervalSince1970 * 1000)
    )
}
```

[< Voltar](../README.md)
