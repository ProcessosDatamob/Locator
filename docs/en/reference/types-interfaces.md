# Tipos e Interfaces

[< Voltar](../README.md)

Esta seção descreve **todos os tipos estruturados**, seus **campos**, **regras**, **validações**, **quando são usados**, **quem consome**, e exemplos reais em **TypeScript, Kotlin e Swift**.

- `LocatorConfig` e sub-estruturas (API, MQTT, Process, Battery, Motion, Collect, AudioRecord)
- Telemetria (`LocatorCollect`, `LocatorEvent`) e pacotes (`LocatorCollectPackage`, `LocatorEventPackage`)
- Identidade/controle (`LocatorSession`, `LocatorToken`, `LocatorCert`)
- Catálogos (`LocatorGroups`, `LocatorFeatures`, `LocatorGeofences`)
- Envelopes de request/response (`LocatorRequestApi*`, `LocatorResponseApi*`)

---

# 🧩 **2.1 `LocatorPackage<T>`**

Estrutura base de envio de dados ao backend via MQTT/WSS.

```ts
export interface LocatorPackage<T = Record<string, any>> {
  id: string;
  sequence?: number;
  license: string;
  sessionId?: string;
  connectivity: LocatorConnectivityType;
  network: LocatorNetworkType;
  osPlatform: string;
  sdkVersion: string;
  data: T[];
  timestamp: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorPackage<T>(
    val id: String,
    val license: String,
    val sequence: Long? = null,
    val sessionId: String? = null,
    val connectivity: LocatorConnectivityType,
    val network: LocatorNetworkType,
    val osPlatform: String,
    val sdkVersion: String,
    val data: List<T>,
    val timestamp: Long
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorPackage<T> {
    let id: String
    let license: String
    let sequence: Int64?
    let sessionId: String?
    let connectivity: LocatorConnectivityType
    let network: LocatorNetworkType
    let osPlatform: String
    let sdkVersion: String
    let data: [T]
    let timestamp: Int64
}
```

## 📌 Descrição dos campos

| Campo          | Tipo                      | Obrigatório | Descrição                                                                        |
| -------------- | ------------------------- | ----------- | -------------------------------------------------------------------------------- |
| `id`           | `string`                  | ✔           | ID único do pacote (UUID). Usado para rastreabilidade e idempotência no backend. |
| `sequence`     | `number`                  | opcional    | Contador incremental para depuração e ordenação lógica.                          |
| `license`      | `string`                  | ✔           | Identificador único do device/usuário.                                           |
| `sessionId`    | `string`                  | opcional    | ID da sessão atual do SDK. Muda a cada `start()`.                                |
| `connectivity` | `LocatorConnectivityType` | ✔           | Tipo de conectividade no momento da criação do pacote.                           |
| `network`      | `LocatorNetworkType`      | ✔           | Detalhamento específico da rede.                                                 |
| `osPlatform`   | `string`                  | ✔           | Ex.: `"android"`, `"ios"`, `"web"`.                                              |
| `sdkVersion`   | `string`                  | ✔           | Versão instalada do SDK.                                                         |
| `data`         | `T[]`                     | ✔           | Lista de objetos (`LocatorCollect`, `LocatorEvent` etc.).                        |
| `timestamp`    | `number`                  | ✔           | Epoch ms da geração do pacote.                                                   |

## 📌 Quando o SDK usa este modelo?

- Para **envio de eventos** → `sendEvents()`
- Para **envio de localizações** → `sendLocations()`
- Para **telemetria interna**

---

# 🧩 **2.2 `LocatorRetryPolicy`**

Define como o SDK deve executar _retry_ de transmissões ou comandos.

```ts
export interface LocatorRetryPolicy {
  maxRetries?: number;
  baseDelayMs?: number;
  backoffFactor?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorRetryPolicy(
    val maxRetries: Int,
    val baseDelayMs: Int,
    val backoffFactor: Int? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorRetryPolicy {
    let maxRetries: Int
    let baseDelayMs: Int
    let backoffFactor: Int?
}
```

### Regras

- O SDK usa **backoff exponencial** quando `backoffFactor` é informado.
  Exemplo: `delay = baseDelayMs × backoffFactor^(attempt-1)`
- O SDK é livre para aplicar políticas próprias quando todos os campos forem omitidos.

---

# 🧩 **2.3 `LocatorApiConfig`**

Configurações das rotas HTTP (API) usadas pelo SDK.

```ts
export interface LocatorApiConfig {
  token: string;
  certUrl?: string;
  scopesUrl?: string;
  tokenUrl?: string;
  configUrl?: string;
  groupsUrl?: string;
  featuresUrl?: string;
  geofencesUrl?: string;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorApiConfig(
    val token: String? = null,
    val certUrl: String,
    val scopesUrl: String,
    val tokenUrl: String,
    val configUrl: String,
    val groupsUrl: String,
    val featuresUrl: String,
    val geofencesUrl: String,
    val audioUrl: String
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorApiConfig {
    let token: String?
    let certUrl: String?
    let scopesUrl: String?
    let tokenUrl: String?
    let configUrl: String?
    let groupsUrl: String?
    let featuresUrl: String?
    let geofencesUrl: String?
}
```

### Campos

| Campo          | Descrição                                            |
| -------------- | ---------------------------------------------------- |
| `token`        | Token JWT temporário recebido na ativação do SDK.    |
| `certUrl`      | Endpoint que retorna certificado mTLS (P12 + nonce). |
| `scopesUrl`    | Endpoint de sincronização de scopes.                 |
| `tokenUrl`     | Endpoint para solicitar novos tokens (API/MQTT/WSS). |
| `configUrl`    | Endpoint das configurações gerais do SDK.            |
| `groupsUrl`    | Endpoint de grupos administrados/visíveis.           |
| `featuresUrl`  | Endpoint que retorna as features habilitadas.        |
| `geofencesUrl` | Endpoint para sincronizar geofences.                 |
| `audioUrl`     | Endpoint para envio dos áudios gravados em SOS.      |

---

# 🧩 **2.4 `LocatorMqttConfig`**

Configurações para conexão MQTT (telemetria/streaming).

```ts
export interface LocatorMqttConfig {
  clientId?: string;
  broker?: string;
  port?: string;
  username?: string;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorMqttConfig(
    val clientId: String? = null,
    val broker: String? = null,
    val port: String? = null,
    val username: String? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorMqttConfig {
    let clientId: String?
    let broker: String?
    let port: String?
    let username: String?
}
```

### Observações importantes

- **`clientId` deve ser único por conexão**.
  SDK usa clientId separado para WSS e para MQTT nativo.
- `username` normalmente é fixo, porque o token JWT fornece a autenticação real.

---

# 🧩 **2.5 Bateria – `LocatorBatteryEvent` & `LocatorBatteryConfig`**

```ts
export interface LocatorBatteryEvent {
  name: string;
  min: number;
  max: number;
  interval: number;
  charging: boolean;
  powerMode: LocatorPowerMode[];
}

export interface LocatorBatteryConfig {
  events?: LocatorBatteryEvent[];
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorBatteryEvent(
    val name: String,
    val min: Int,
    val max: Int,
    val interval: Long,
    val charging: Boolean,
    val powerMode: List<LocatorPowerMode>
)

data class LocatorBatteryConfig(
    val events: List<LocatorBatteryEvent>
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorBatteryEvent {
    let name: String
    let min: Int
    let max: Int
    let interval: Int64
    let charging: Bool
    let powerMode: [LocatorPowerMode]
}

struct LocatorBatteryConfig {
    let events: [LocatorBatteryEvent]
}
```

### Regras de funcionamento

- O evento é disparado **quando a bateria entra na faixa `[min, max]`**.
- `interval` impede repetição excessiva (ex.: só novo evento após X minutos).
- Se `charging = true`, só dispara quando plugado; se `false`, só quando não está plugado.
- `powerMode` permite definir regras diferentes por modo de economia.

---

# 🧩 **2.6 Movimento – `LocatorMotionConfig`**

```ts
export interface LocatorMotionConfig {
  sensitivity?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorMotionConfig(
    val sensitivity: Int? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorMotionConfig {
    let sensitivity: Int?
}
```

- `sensitivity` controla quão fácil o SDK identifica aceleração/frenagem/curvas.
- Valor recomendado: **entre 1 e 10**.

---

# 🧩 **2.7 Processo – `LocatorProcessConfig`**

```ts
export interface LocatorProcessConfig {
  retryPolicy?: LocatorRetryPolicy;
  offlineRetentionDays?: number;
  foregroundServiceNotification?: {
    title?: string;
    message?: string;
  };
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorProcessConfig(
    val retryPolicy: LocatorRetryPolicy? = null,
    val offlineRetentionDays: Int? = null,
    val foregroundServiceNotification: ForegroundServiceNotification? = null,
    val syncGeofencesIntervalMillis: Long = DEFAULT_GEOFENCES_SYNC_INTERVAL
)

data class ForegroundServiceNotification(
    val title: String? = null,
    val message: String? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct ForegroundServiceNotification {
    let title: String?
    let message: String?
}

struct LocatorProcessConfig {
    let retryPolicy: LocatorRetryPolicy?
    let offlineRetentionDays: Int?
    let foregroundServiceNotification: ForegroundServiceNotification?
}
```

### Notas importantes

- `offlineRetentionDays`: controla por quanto tempo localizações podem ficar armazenadas offline.
- Em Android, o **foreground notification é obrigatório** para coleta contínua.

---

# 🧩 **2.8 Coleta – `LocatorCollectConfig`**

```ts
export interface LocatorCollectConfig {
  collectIntervalMillis?: number;
  sendIntervalMillis?: number;
  minDisplacementMeters?: number;
  maxTravelDistanceMeters?: number;
  highAccuracy?: boolean;
  maxBatchSize?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorCollectConfig(
    val collectIntervalMillis: Long = DEFAULT_COLLECT_INTERVAL,
    val collectObservedModeIntervalMillis: Long = DEFAULT_REAL_TIME_COLLECT_INTERVAL,
    val sendIntervalMillis: Long = DEFAULT_SEND_INTERVAL,
    val minDisplacementMeters: Float? = null,
    val maxTravelDistanceMeters: Float? = null,
    val highAccuracy: Boolean? = null,
    val maxBatchSize: Long? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorCollectConfig {
    let collectIntervalMillis: Int64
    let sendIntervalMillis: Int64
    let minDisplacementMeters: Float?
    let maxTravelDistanceMeters: Float?
    let highAccuracy: Bool?
    let maxBatchSize: Int64?
}
```

### Comportamento

- `collectIntervalMillis`: frequência de coleta.
- `sendIntervalMillis`: frequência de envio do batch.
- `minDisplacementMeters`: só coleta novamente se o deslocamento mínimo for atingido.
- `maxTravelDistanceMeters`: protege contra distâncias absurdas erradas.
- `highAccuracy`: força GPS quando habilitado.
- `maxBatchSize`: tamanho máximo de buffer antes de enviar.

---

# 🧩 **2.9 `LocatorConfig`**

A configuração principal do SDK.

```ts
export interface LocatorConfig {
  license: string;
  sdkVersion: string;
  osPlatform: string;
  api: LocatorApiConfig;
  mqtt: LocatorMqttConfig;
  process: LocatorProcessConfig;
  battery?: LocatorBatteryConfig;
  motion?: LocatorMotionConfig;
  collect?: LocatorCollectConfig;
  audioRecord?: LocatorAudioRecord;
  revision?: number;
  createdAt?: number;
  updatedAt?: number;
}
```

#### 🟩 **Kotlin (Android)**
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
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorConfig {
    let license: String
    let sdkVersion: String = BuildConfig.LIBRARY_VERSION
    let osPlatform: String = "OS_PLATAFORM_IOS"
    let mqtt: LocatorMqttConfig
    let api: LocatorApiConfig
    let process: LocatorProcessConfig
    let battery: LocatorBatteryConfig?
    let motion: LocatorMotionConfig?
    let collect: LocatorCollectConfig?
    let audioRecord: LocatorAudioRecord?
    let revision: Int64?
    let createdAt: Int64?
    let updatedAt: Int64?
}
```

### Observações

- Configuração é versionada (`revision`, `createdAt`, `updatedAt`).
- O SDK compara revisões para saber se precisa sincronizar.

---

# 🧩 **2.10 `LocatorSession`**

```ts
export interface LocatorSession {
  id: string;
  startAt: number;
  endAt?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorSession(
    val id: String,
    val startAt: Long, // epoch ms
    val endAt: Long? = null // epoch ms
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorSession {
    let id: String
    let startAt: Int64
    let endAt: Int64?
}
```

- `id` muda toda vez que o app chama `start()`.
- A sessão abrange:

  - coletas
  - eventos
  - comandos
  - pacotes enviados

---

# 🧩 **2.11 Certificados – `LocatorCert`**

```ts
export interface LocatorCert {
  p12Base64: string;
  nonce: string;
  expiresAt?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorCert(
    val p12Base64: String,
    val nonce: String,
    val expiresAt: Long? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorCert {
    let p12Base64: String
    let nonce: String
    let expiresAt: Int64?
}
```

### Regras

- O P12 vem **criptografado**; a senha é derivada usando:

  - o `nonce` recebido **+**
  - o `nonce` enviado ao solicitar o certificado
    (dupla derivação, aumenta segurança)

---

# 🧩 **2.12 Tokens – `LocatorToken`**

```ts
export interface LocatorToken {
  type: LocatorTokenType;
  token: string;
  expiresAt?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorToken(
    val type: LocatorTokenType,
    val token: String,
    val expiresAt: Long? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorToken {
    let type: LocatorTokenType
    let token: String
    let expiresAt: Int64?
}
```

- Tokens são temporários.
- SDK usa caching inteligente.

---

# 🧩 **2.13 Geofences – `LocatorGeofence`, `LocatorGeofences`**

```ts
export interface LocatorGeofence {
  id: string;
  groupId: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  revision?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface LocatorGeofences {
  geofences: LocatorGeofence[];
  revision?: number;
  createdAt?: number;
  updatedAt?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorGeofence(
    val id: String,
    val groupId: String,
    val latitude: Double,
    val longitude: Double,
    val radiusMeters: Float,
    val revision: Long? = null,
    val createdAt: Long? = null,
    val updatedAt: Long? = null
)

data class LocatorGeofences(
    val geofences: List<LocatorGeofence>,
    val revision: Long? = null,
    val createdAt: Long? = null,
    val updatedAt: Long? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorGeofence {
    let id: String
    let groupId: String
    let latitude: Double
    let longitude: Double
    let radiusMeters: Float
    let revision: Int64?
    let createdAt: Int64?
    let updatedAt: Int64?
}

struct LocatorGeofences {
    let geofences: [LocatorGeofence]
    let revision: Int64?
    let createdAt: Int64?
    let updatedAt: Int64?
}
```

### Regras importantes

- Geofence só é ativa se o `groupId` estiver presente em `LocatorGroups`.
- Se chegar uma geofence de um grupo desconhecido → **SDK dispara sync automático de grupos**.

---

# 🧩 **2.14 Grupos – `LocatorGroups`**

```ts
export interface LocatorGroups {
  admin: string[];
  all: string[];
  revision?: number;
  createdAt?: number;
  updatedAt?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorGroups(
    val admin: List<String>,
    val all: List<String>,
    val revision: Int? = null,
    val createdAt: Long? = null,
    val updatedAt: Long? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorGroups {
    let admin: [String]
    let all: [String]
    let revision: Int?
    let createdAt: Int64?
    let updatedAt: Int64?
}
```

### Semântica:

- `admin`: grupos em que o usuário tem permissões elevadas (ex.: monitorar outros).
- `all`: grupos visíveis geral.

---

# 🧩 **2.15 Features – `LocatorFeature`, `LocatorFeatures`**

```ts
export interface LocatorFeature {
  feature: string;
  scopes?: string[];
  revision?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface LocatorFeatures {
  features: LocatorFeature[];
  revision?: number;
  createdAt?: number;
  updatedAt?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorFeature(
    val feature: String,
    val scopes: List<String>? = emptyList(),
    val revision: Int? = null,
    val createdAt: Long? = null,
    val updatedAt: Long? = null
)

data class LocatorFeatures(
    val features: List<LocatorFeature>,
    val revision: Int? = null,
    val createdAt: Long? = null,
    val updatedAt: Long? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorFeature {
    let feature: String
    let scopes: [String]? = [] // Tradução de List<String>? = emptyList()
    let revision: Int?
    let createdAt: Int64?
    let updatedAt: Int64?
}

struct LocatorFeatures {
    let features: [LocatorFeature]
    let revision: Int?
    let createdAt: Int64?
    let updatedAt: Int64?
}
```

### Regras

- Features são controladas pelo backend.
- `scopes` são obrigatórios em features com restrição RBAC.

---

# 🧩 **2.16 Coletas – `LocatorCollect`**

```ts
export interface LocatorCollect {
  id: string;
  sequence?: number;
  source?: LocatorCollectSource;
  latitude: number;
  longitude: number;
  satellitesUsed?: number;
  satellitesVisible?: number;
  providerAccuracy?: LocatorAccuracyProvider;
  verticalAccuracy?: number;
  horizontalAccuracy?: number;
  altitude?: number;
  bearing?: number;
  speed?: number;
  battery: number;
  charging?: boolean;
  connectivity: LocatorConnectivityType;
  network: LocatorNetworkType;
  powerMode?: LocatorPowerMode;
  sdkMode: LocatorSdkMode;
  timestamp: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorCollect(
    val id: String,
    val sequence: Int? = null,
    val source: LocatorCollectSource? = null,
    val latitude: Double,
    val longitude: Double,
    val satellitesUsed: Int? = null,
    val satellitesVisible: Int? = null,
    val providerAccuracy: LocatorAccuracyProvider? = null,
    val verticalAccuracy: Float? = null,
    val horizontalAccuracy: Float? = null,
    val altitude: Double? = null,
    val bearing: Float? = null,
    val speed: Float? = null,
    val battery: Int,
    val charging: Boolean? = null,
    val connectivity: LocatorConnectivityType,
    val network: LocatorNetworkType,
    val powerMode: LocatorPowerMode? = null,
    val sdkMode: LocatorSdkMode,
    val timestamp: Long
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorCollect {
    let id: String
    let sequence: Int?
    let source: LocatorCollectSource?
    let latitude: Double
    let longitude: Double
    let satellitesUsed: Int?
    let satellitesVisible: Int?
    let providerAccuracy: LocatorAccuracyProvider?
    let verticalAccuracy: Float?
    let horizontalAccuracy: Float?
    let altitude: Double?
    let bearing: Float?
    let speed: Float?
    let battery: Int
    let charging: Bool?
    let connectivity: LocatorConnectivityType
    let network: LocatorNetworkType
    let powerMode: LocatorPowerMode?
    let sdkMode: LocatorSdkMode
    let timestamp: Int64
}
```

### Notas críticas

- É o modelo **mais importante do SDK**.
- Cada localização pode ter opcionalmente metadados GNSS.
- `sdkMode` e `powerMode` permitem auditoria completa.

---

# 🧩 **2.17 Eventos – `LocatorEvent`**

```ts
export interface LocatorEvent {
  id: string;
  type: LocatorEventType;
  priority?: LocatorPriority;
  source?: LocatorEventSource;
  level?: LocatorEventLevel;
  payload?: Record<string, any>;
  sequence?: number;
  timestamp: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorEvent(
    val id: String,
    val type: LocatorEventType,
    val priority: LocatorPriority? = null,
    val source: LocatorEventSource? = null,
    val level: LocatorEventLevel? = null,
    val payload: JsonObject? = null,
    val sequence: Long? = null, // ordenação/idempotência
    val timestamp: Long
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorEvent {
    let id: String
    let type: LocatorEventType
    let priority: LocatorPriority?
    let source: LocatorEventSource?
    let level: LocatorEventLevel?
    let payload: [String: Any]? // Map<String, Any> é traduzido para [String: Any]? em Swift
    let sequence: Int64?
    let timestamp: Int64
}
```

### Exemplo de payload útil

```json
{
  "type": "connectivity.changed",
  "payload": {
    "from": { "connectivity": "wifi", "network": "wifi5" },
    "to": { "connectivity": "cellular", "network": "5g_nsa" }
  }
}
```

---

# 🧩 **2.18 Pacotes específicos**

```ts
export interface LocatorCollectPackage extends LocatorPackage<LocatorCollect> {}
export interface LocatorEventPackage extends LocatorPackage<LocatorEvent> {}
```

#### 🟩 **Kotlin (Android)**
```kotlin
typealias LocatorCollectPackage = LocatorPackage<LocatorCollect>
typealias LocatorEventPackage = LocatorPackage<LocatorEvent>
```

#### 🟧 **Swift (iOS)**
```swift
typealias LocatorCollectPackage = LocatorPackage<LocatorCollect>
typealias LocatorEventPackage = LocatorPackage<LocatorEvent>
```

- São o formato final enviado ao backend via MQTT.

---

# 🧩 **2.19 Comandos – `LocatorCommand`**

```ts
export interface LocatorCommand {
  id: string;
  type: LocatorCommandType;
  requiresInternet?: boolean;
  requiresWakeUp?: boolean;
  priority?: LocatorPriority;
  payload?: Record<string, any>;
  expiresAt?: number;
  timestamp?: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorCommand(
    val id: String,
    val type: LocatorCommandType,
    val requiresInternet: Boolean? = null,
    val requiresWakeUp: Boolean? = null,
    val priority: LocatorPriority = LocatorPriority.NORMAL,
    val payload: JsonObject? = null,
    val expireAt: Long? = null, // epoch ms
    val timestamp: Long? = null // epoch ms
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorCommand {
    let id: String
    let type: LocatorCommandType
    let requiresInternet: Bool?
    let requiresWakeUp: Bool?
    let priority: LocatorPriority = .normal
    let payload: [String: Any]?
    let expireAt: Int64?
    let timestamp: Int64?
}
```

### Observações

- Comandos podem ser recebidos via:

  - MQTT
  - FCM push
  - App
  - WebView Bridge

- SDK sempre retorna um **LocatorCommandResult**.

---

# 🧩 **2.20 Resultado – `LocatorCommandResult`**

```ts
export interface LocatorCommandResult {
  id: string;
  commandId: string;
  commandType: LocatorCommandType;
  status: LocatorCommandStatus;
  errorCode?: LocatorErrorCode;
  message?: string | null;
  details?: Record<string, any>;
  attempts?: number;
  startAt: number;
  endAt: number;
  timestamp: number;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorCommandResult(
    val id: String,
    val commandId: String,
    val commandType: LocatorCommandType,
    val status: LocatorCommandStatus,
    val errorCode: LocatorErrorCode? = null,
    val message: String? = null,
    val details: JsonObject? = null,
    val attempts: Int? = null,
    val startAt: Long? = null, // epoch ms
    val endAt: Long? = null, // epoch ms
    val timestamp: Long // epoch ms
)
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorCommandResult {
    let id: String
    let commandId: String
    let commandType: LocatorCommandType
    let status: LocatorCommandStatus
    let errorCode: LocatorErrorCode?
    let message: String?
    let details: [String: Any] = [:] 
    let attempts: Int?
    let startAt: Int64?
    let endAt: Int64?
    let timestamp: Int64
}
```

### Campos importantes

- `attempts`: mostra quantas tentativas foram feitas.
- `startAt` e `endAt`: audit log completo.
- `details`: dados específicos do comando executado.

---

# 🧩 **2.21 Estruturas de Request/Response de API**

### Modelo base de request

```ts
export interface LocatorRequestApi<T = undefined> {
  id: string;
  license: string;
  sessionId?: string;
  sdkVersion?: string;
  osPlatform?: string;
  timestamp: number;
  data?: T;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
sealed interface LocatorRequestApi<T> {
    val id: String
    val license: String
    val sessionId: String?
    val sdkVersion: String?
    val osPlatform: String?
    val timestamp: Long
    val data: T?
}
```

#### 🟧 **Swift (iOS)**
```swift
protocol LocatorRequestApi {
    var id: String { get }
    var license: String { get }
    var sessionId: String? { get }
    var sdkVersion: String? { get }
    var osPlatform: String? { get }
    var timestamp: Int64 { get }
    var data: T? { get } 
}
```

### Modelo base de response

```ts
export interface LocatorResponseApi<T> {
  id: string;
  requestId: string;
  timestamp: number;
  data: T;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
sealed class LocatorResponseApi {
    abstract val id: String
    abstract val requestId: String
    abstract val timestamp: Long
}
```

#### 🟧 **Swift (iOS)**
```swift
struct LocatorResponseApi<T> {
    let id: String
    let requestId: String
    let timestamp: Int64
    let data: T
}
```

### Tipos especializados

São apenas wrappers tipados:

```ts
export interface LocatorResponseApiCert
  extends LocatorResponseApi<LocatorCert> {}
export interface LocatorResponseApiToken
  extends LocatorResponseApi<LocatorToken> {}
export interface LocatorResponseApiGroups
  extends LocatorResponseApi<LocatorGroups> {}
export interface LocatorResponseApiScopes
  extends LocatorResponseApi<string[]> {}
export interface LocatorResponseApiFeatures
  extends LocatorResponseApi<LocatorFeatures> {}
export interface LocatorResponseApiConfig
  extends LocatorResponseApi<LocatorConfig> {}
export interface LocatorResponseApiGeofenses
  extends LocatorResponseApi<LocatorGeofences> {}

export interface LocatorRequestApiToken
  extends LocatorRequestApi<{
    type: LocatorTokenType;
    scopes?: string[]; // scopes embutidos dentro do token, usado para RBAC a nivel des backend
  }> {}
export interface LocatorRequestApiCert
  extends LocatorRequestApi<{
    nonce: string; // usado como parte do algoritimo para compor a senha do certificado
  }> {}
export interface LocatorRequestApiGroups extends LocatorRequestApi {}
export interface LocatorRequestApiScopes extends LocatorRequestApi {}
export interface LocatorRequestApiFeatures extends LocatorRequestApi {}
export interface LocatorRequestApiConfig extends LocatorRequestApi {}
export interface LocatorRequestApiGeofenses extends LocatorRequestApi {}
```

#### 🟩 **Kotlin (Android)**
```kotlin
// RESPONSES
data class LocatorResponseApiCert(
    override val id: String,
    override val requestId: String,
    override val timestamp: Long,
    val data: LocatorCert
) : LocatorResponseApi()

data class LocatorResponseApiToken(
    override val id: String,
    override val requestId: String,
    override val timestamp: Long,
    val data: LocatorToken
) : LocatorResponseApi()

data class LocatorResponseApiGroups(
    override val id: String,
    override val requestId: String,
    override val timestamp: Long,
    val data: LocatorGroups
) : LocatorResponseApi()

data class LocatorResponseApiScopes(
    override val id: String,
    override val requestId: String,
    override val timestamp: Long,
    val data: List<String>
) : LocatorResponseApi()

data class LocatorResponseApiFeatures(
    override val id: String,
    override val requestId: String,
    override val timestamp: Long,
    val data: LocatorFeatures
) : LocatorResponseApi()

data class LocatorResponseApiConfig(
    override val id: String,
    override val requestId: String,
    override val timestamp: Long,
    val data: LocatorConfig
) : LocatorResponseApi()

data class LocatorResponseApiGeofenses(
    override val id: String,
    override val requestId: String,
    override val timestamp: Long,
    val data: LocatorGeofences
) : LocatorResponseApi()

data class LocatorResponseApiAudio(
    override val id: String,
    override val requestId: String = "",
    override val timestamp: Long,
    val data: Data
) : LocatorResponseApi() {
    @Serializable
    data class Data(
        val audioId: String,
        val processedAt: Long,
        val status: String,
        val message: String
    )
}

// REQUEST

data class LocatorRequestApiCert(
    override val id: String,
    override val license: String,
    override val sessionId: String?,
    override val sdkVersion: String = BuildConfig.LIBRARY_VERSION,
    override val osPlatform: String = OS_PLATFORM_ANDROID,
    override val timestamp: Long,
    override val data: Data
) : LocatorRequestApi<LocatorRequestApiCert.Data> {
    @Serializable
    data class Data(
        val nonce: String // usado como parte do algoritimo para compor a senha do certificado
    )
}

data class LocatorRequestApiToken(
    override val id: String,
    override val license: String,
    override val sessionId: String?,
    override val sdkVersion: String = BuildConfig.LIBRARY_VERSION,
    override val osPlatform: String = OS_PLATFORM_ANDROID,
    override val timestamp: Long,
    override val data: Data
) : LocatorRequestApi<LocatorRequestApiToken.Data> {
    @Serializable
    data class Data(
        val type: LocatorTokenType,
        val scopes: List<String>? = null // scopes embutidos dentro do token, usado para RBAC a nivel des backend
    )
}

data class LocatorRequestApiGroups(
    override val id: String,
    override val license: String,
    override val sessionId: String?,
    override val sdkVersion: String = BuildConfig.LIBRARY_VERSION,
    override val osPlatform: String = OS_PLATFORM_ANDROID,
    override val timestamp: Long,
    override val data: Unit?
) : LocatorRequestApi<Unit?>

data class LocatorRequestApiScopes(
    override val id: String,
    override val license: String,
    override val sessionId: String?,
    override val sdkVersion: String = BuildConfig.LIBRARY_VERSION,
    override val osPlatform: String = OS_PLATFORM_ANDROID,
    override val timestamp: Long,
    override val data: Unit?
) : LocatorRequestApi<Unit?>

data class LocatorRequestApiFeatures(
    override val id: String,
    override val license: String,
    override val sessionId: String?,
    override val sdkVersion: String = BuildConfig.LIBRARY_VERSION,
    override val osPlatform: String = OS_PLATFORM_ANDROID,
    override val timestamp: Long,
    override val data: Unit?
) : LocatorRequestApi<Unit?>

data class LocatorRequestApiConfig(
    override val id: String,
    override val license: String,
    override val sessionId: String?,
    override val sdkVersion: String = BuildConfig.LIBRARY_VERSION,
    override val osPlatform: String = OS_PLATFORM_ANDROID,
    override val timestamp: Long,
    override val data: Unit?
) : LocatorRequestApi<Unit?>

data class LocatorRequestApiGeofenses(
    override val id: String,
    override val license: String,
    override val sessionId: String?,
    override val sdkVersion: String = BuildConfig.LIBRARY_VERSION,
    override val osPlatform: String = OS_PLATFORM_ANDROID,
    override val timestamp: Long,
    override val data: Data?
) : LocatorRequestApi<LocatorRequestApiGeofenses.Data?> {

    data class Data(
        val latitude: Double,
        val longitude: Double
    )
}

data class LocatorRequestApiAudio(
    override val id: String,
    override val license: String,
    override val sessionId: String?,
    override val sdkVersion: String = BuildConfig.LIBRARY_VERSION,
    override val osPlatform: String = OS_PLATFORM_ANDROID,
    override val timestamp: Long,
    override val data: Data
) : LocatorRequestApi<LocatorRequestApiAudio.Data> {

    data class Data(
        val audioId: String,
        val durationSeconds: Int,
        val format: String,
        val metadata: Map<String, String> = mapOf()
    )
}
```

#### 🟧 **Swift (iOS)**
```swift
typealias LocatorResponseApiCert = LocatorResponseApi<LocatorCert>
typealias LocatorResponseApiToken = LocatorResponseApi<LocatorToken>
typealias LocatorResponseApiGroups = LocatorResponseApi<LocatorGroups>
typealias LocatorResponseApiScopes = LocatorResponseApi<[String]>
typealias LocatorResponseApiFeatures = LocatorResponseApi<LocatorFeatures>
typealias LocatorResponseApiConfig = LocatorResponseApi<LocatorConfig>
typealias LocatorResponseApiGeofenses = LocatorResponseApi<LocatorGeofences>

struct LocatorRequestApiCertData {
    let nonce: String
}

struct LocatorRequestApiTokenData {
    let type: LocatorTokenType
    let scopes: [String]? = nil
}

typealias EmptyRequestData = Void?

// MARK: - Cert

struct LocatorRequestApiCert: LocatorRequestApi {
    typealias Payload = LocatorRequestApiCertData
    
    let id: String
    let license: String
    let sessionId: String?
    let sdkVersion: String?
    let osPlatform: String?
    let timestamp: Int64
    let data: LocatorRequestApiCertData?
}

// MARK: - Token

struct LocatorRequestApiToken: LocatorRequestApi {
    typealias Payload = LocatorRequestApiTokenData
    
    let id: String
    let license: String
    let sessionId: String?
    let sdkVersion: String?
    let osPlatform: String?
    let timestamp: Int64
    let data: LocatorRequestApiTokenData?
}

// MARK: - Sem Payload (Groups, Scopes, Features, Config, Geofences)

struct LocatorRequestApiGroups: LocatorRequestApi {
    typealias Payload = Void
    
    let id: String
    let license: String
    let sessionId: String?
    let sdkVersion: String?
    let osPlatform: String?
    let timestamp: Int64
    let data: Void? // Representa Unit?
}

struct LocatorRequestApiScopes: LocatorRequestApi {
    typealias Payload = Void
    
    let id: String
    let license: String
    let sessionId: String?
    let sdkVersion: String?
    let osPlatform: String?
    let timestamp: Int64
    let data: Void?
}

struct LocatorRequestApiFeatures: LocatorRequestApi {
    typealias Payload = Void
    
    let id: String
    let license: String
    let sessionId: String?
    let sdkVersion: String?
    let osPlatform: String?
    let timestamp: Int64
    let data: Void?
}

struct LocatorRequestApiConfig: LocatorRequestApi {
    typealias Payload = Void
    
    let id: String
    let license: String
    let sessionId: String?
    let sdkVersion: String?
    let osPlatform: String?
    let timestamp: Int64
    let data: Void?
}

struct LocatorRequestApiGeofences: LocatorRequestApi {
    typealias Payload = Void
    
    let id: String
    let license: String
    let sessionId: String?
    let sdkVersion: String?
    let osPlatform: String?
    let timestamp: Int64
    let data: Void?
}
```

# 🧩 **2.22 Áudio – `LocatorAudioRecord`**

```ts
export interface LocatorAudioRecord {
  recordsCount: number;
  durationSeconds: number;
  retryCount: number;
  intervalSeconds: number;
  audioServiceNotification?: {
    title?: string;
    message?: string;
  };
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
data class LocatorAudioRecord(
    val recordsCount: Int = 1,
    val durationSeconds: Int = 60,
    val retryCount: Int = 1,
    val intervalSeconds: Int = 60,
    val audioServiceNotification: AudioServiceNotification,
    val bootNotification: AudioServiceNotification? = null
)

data class AudioServiceNotification(
    val title: String? = null,
    val message: String? = null,
    val deeplinkValue: String? = null,
    val deeplinkKey: String? = null
)
```

#### 🟧 **Swift (iOS)**
```swift
struct AudioServiceNotification {
    let title: String?
    let message: String?
}

struct LocatorAudioRecord {
    let recordsCount: Int,
    let durationSeconds: Int,
    let retryCount: Int,
    let intervalSeconds: Int,
    let audioServiceNotification: AudioServiceNotification?
}
```

### Notas importantes

- `recordsCount`: descreve quantas gravações serão realizadas.
- `durationSeconds`: descreve o tempo de gravação.
- `retryCount`: descreve a quantidade de tentativas de envio.
- `intervalSeconds`: descreve o intervalo entre gravações.
- No Android, o **foreground notification é obrigatório** para coleta contínua, desta forma é necessário o preenchimento do campo `audioServiceNotification` com os dados de `title` e `message`.

---


[< Voltar](../README.md)
