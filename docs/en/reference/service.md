# LocatorService

[< Voltar](../README.md)

`LocatorService` é a **interface principal** do SDK Locator exposta para o APP e para bridges de WebView.
Tudo que o APP precisa fazer com o SDK passa, direta ou indiretamente, por aqui.

---

## 4.1 Visão Geral

O `LocatorService` encapsula:

- Ciclo de vida do SDK (start, stop, destroy)
- Estado interno (modo, sessão, configuração atual)
- Sincronização com backend (config, grupos, features, cercas, scopes)
- Envio de dados (localizações e eventos)
- Execução de comandos (recebidos de APP, servidor, FCM, MQTT)
- Gerenciamento de permissões (o SDK sabe o que está pendente)

Fluxo macro esperado:

1. App cria/obtém uma instância concreta do SDK (`LocatorService`).
2. App registra uma implementação de `LocatorIntegration`.
3. App configura o SDK (license, URLs, etc) usando `setConfig`.
4. App chama `start()` para iniciar o SDK.
5. SDK sincroniza tudo (`syncAll` ou métodos de sync específicos).
6. SDK começa a coletar localizações, enviar dados e processar comandos.

---

## 4.2 Interface Completa

```ts
export interface LocatorService {
  // Integração
  registerIntegration(integration: LocatorIntegration): void;

  // Consultas (somente leitura)
  getConfig(): LocatorConfig;
  getGroups(): LocatorGroups;
  getFeatures(): LocatorFeatures;
  getGeofences(): LocatorGeofences;
  getState(): LocatorState;
  getSdkMode(): LocatorSdkMode;
  getSession(): LocatorSession;
  getVersion(): string;
  getJwtToken(): string;
  pendingPermissions(): LocatorPermission[];

  // Ciclo de vida
  start(): Promise<void>;
  stop(): Promise<void>;
  destroy(): Promise<void>;

  // Mutação de estado/configuração
  setConfig(config: LocatorConfig): void;
  setState(state: LocatorState): void;
  setSdkMode(mode: LocatorSdkMode): void;
  setGroups(groups: LocatorGroups): void;
  setFeatures(features: LocatorFeatures): void;
  setGeofences(geofences: LocatorGeofences): void;

  // Sincronização com backend
  syncConfig(): Promise<void>;
  syncScopes(): Promise<void>;
  syncGroups(): Promise<void>;
  syncFeatures(): Promise<void>;
  syncGeofences(): Promise<void>;
  syncAll(): Promise<void>;

  // Envio de dados & comandos
  sendEvents(data: LocatorEventPackage): Promise<void>;
  sendLocations(data: LocatorCollectPackage): Promise<void>;
  execute(command: LocatorCommand): Promise<LocatorCommandResult>;
}
```

#### 🟩 **Kotlin (Android)**
```kotlin
interface LocatorService {

    // Integração
    fun registerIntegration(integration: LocatorIntegration)

    // Consultas (somente leitura)
    fun getConfig(): LocatorConfig
    fun getGroup(): LocatorGroups
    fun getFeatures(): LocatorFeatures
    fun getGeofences(): LocatorGeofences
    fun getState(): LocatorState
    fun getSdkMode(): LocatorSdkMode
    fun getVersion(): String
    fun getSession(): LocatorSession
    fun getJwtToken(): String
    fun pendingPermissions(): List<LocatorPermission>

    // Ciclo de vida
    fun start()
    fun stop()
    fun destroy()

    // Sincronização com backend
    fun syncConfig()
    fun syncScopes()
    fun syncGroup()
    fun syncFeatures()
    fun syncGeofences()
    fun syncAll()

    // Mutação de estado/configuração
    fun setConfig(config: LocatorConfig)
    fun setState(state: LocatorState)
    fun setSdkMode(mode: LocatorSdkMode)
    fun setGroup(groups: LocatorGroups)
    fun setFeatures(features: LocatorFeatures)
    fun setGeofences(geofences: LocatorGeofences)

    // Envio de dados & comandos
    fun sendEvents(data: LocatorEventPackage)
    fun sendLocations(data: LocatorCollectPackage)
    fun execute(command: LocatorCommand): LocatorCommandResult
}
```

#### 🟧 **Swift (iOS)**
```swift
protocol LocatorService {
    // MARK: - Integração
    func registerIntegration(integration: LocatorIntegration)

    // MARK: - Consultas (somente leitura)
    func getConfig() -> LocatorConfig
    func getGroup() -> LocatorGroups
    func getFeatures() -> LocatorFeatures
    func getGeofences() -> LocatorGeofences
    func getState() -> LocatorState
    func getSdkMode() -> LocatorSdkMode
    func getVersion() -> String
    func getSession() -> LocatorSession
    func getJwtToken() -> String
    func pendingPermissions() -> [LocatorPermission]

    // MARK: - Ciclo de vida
    func start()
    func stop()
    func destroy()

    // MARK: - Sincronização com backend
    func syncConfig()
    func syncScopes()
    func syncGroup()
    func syncFeatures()
    func syncGeofences()
    func syncAll()

    // MARK: - Mutação de estado/configuração
    func setConfig(config: LocatorConfig)
    func setState(state: LocatorState)
    func setSdkMode(mode: LocatorSdkMode)
    func setGroup(groups: LocatorGroups)
    func setFeatures(features: LocatorFeatures)
    func setGeofences(geofences: LocatorGeofences)

    // MARK: - Envio de dados & comandos
    func sendEvents(data: LocatorEventPackage)
    func sendLocations(data: LocatorCollectPackage)
    func execute(command: LocatorCommand) -> LocatorCommandResult
}
```

---

## 4.3 Ciclo de Vida do SDK

### 4.3.1 `registerIntegration(integration: LocatorIntegration): void`

Registra a implementação de `LocatorIntegration` usada pelo SDK para acessar o backend.

- **Quem chama:** APP na inicialização.
- **Quando chamar:** antes de qualquer `start()` ou `sync*()`.

**Comportamento esperado:**

- Substitui qualquer implementação anterior.
- Não dispara chamadas de rede por si só.
- Pode validar minimamente a instância (ex: não aceitar `undefined`).

---

### 4.3.2 `start(): Promise<void>`

Inicia o SDK, incluindo:

- inicialização de sessão (`LocatorSession`)
- validação de permissões mínimas
- configuração de timers/foreground service (Android)
- conexão inicial com MQTT/WSS (conforme config)
- opcionalmente, um `syncAll()` (dependendo da implementação)

**Pré-requisitos recomendados:**

- `registerIntegration()` chamado
- `setConfig()` já configurado com `license`, `api`, `mqtt`, etc
- Permissões mínimas resolvidas (ou o SDK retorna em `pendingPermissions()` o que falta)

**Eventos esperados:**

- Pode disparar `SDKSTATE_CHANGED`
- Pode disparar `SDKMODE_CHANGED` (se modo default definido)
- Pode disparar eventos de erro se algo bloqueante falhar (ex: `PERMISSION_ERROR`)

---

### 4.3.3 `stop(): Promise<void>`

Para a coleta ativa e operações de rede, mas **mantém cache e certificados**.

- Desconecta de MQTT/WSS.
- Cancela timers de coleta / flush.
- Mantém:

  - certificados mTLS
  - tokens (até expirar)
  - configurações / caches locais

---

### 4.3.4 `destroy(): Promise<void>`

Desativa completamente o SDK para a licença corrente:

- Chama internamente um `stop()`.
- Remove:

  - certificados
  - tokens
  - caches de config, grupos, features, cercas
  - sessão ativa

Use quando:

- Usuário faz logout global
- Licença não é mais válida para aquele device
- APP precisa resetar estado

---

## 4.4 Leitura de Estado & Configurações

### 4.4.1 `getConfig(): LocatorConfig`

Retorna a última `LocatorConfig` conhecida pelo SDK.

- Fonte: `setConfig()` ou `syncConfig()`.
- Pode estar **desatualizada** se o app nunca sincronizou.

**Uso típico:**

- Mostre ao desenvolvedor / devtools.
- Para debug: inspecionar intervalos e política de coleta.

---

### 4.4.2 `getGroups(): LocatorGroups`

Retorna:

- `admin[]`: grupos com permissão elevada.
- `all[]`: todos os grupos que impactam visibilidade/coleta.

Fonte: `setGroups()` ou `syncGroups()`.

---

### 4.4.3 `getFeatures(): LocatorFeatures`

Lista de features habilitadas para a licença no dispositivo.

- Cada `LocatorFeature` pode conter `scopes`.
- O SDK **não deve ativar** features que exijam scopes não presentes.

---

### 4.4.4 `getGeofences(): LocatorGeofences`

Retorna todas as cercas conhecidas pelo SDK.

- Não significa que todas estão ativas — depende dos `groups`.
- Atualizado via `setGeofences()` ou `syncGeofences()`.

---

### 4.4.5 `getState(): LocatorState`

Estado atual do SDK:

- `DEFAULT`, `IDLE`, `COLLECTING`, `PAUSED`, `STOPPED`.

**Diferença chave:**

- `STOPPED`: pós-`stop()`, sem coleta.
- `PAUSED`: SDK ativo, mas coleção inibida temporariamente.
- `COLLECTING`: coleta ativa e agendada.

---

### 4.4.6 `getSdkMode(): LocatorSdkMode`

Modo de operação atual, ex:

- `DEFAULT`: modo normal
- `OBSERVED`: foco em rastreio, mais agressivo
- `SOS`: modo de emergência
- `ALERT`: modo de atenção

O modo afeta:

- Intervalo de coleta e envio
- Política de bateria
- Critérios de retenção offline

---

### 4.4.7 `getSession(): LocatorSession`

Sessão atual do SDK:

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

- `id`: identificador único por ciclo de `start()`.
- `endAt`: preenchido em `stop()`/`destroy()`.

Pode ser usado para:

- Correlacionar eventos/locais no backend.
- Auditoria/telemetria.

---

### 4.4.8 `getVersion(): string`

Versão do SDK em execução.

- Ex: `"1.2.3"` ou `"1.2.3-android"`.

Ideal para:

- Logging no app
- Envio de metadata para ferramentas de crash

---

### 4.4.9 `getJwtToken(): string`

Retorna o **último JWT válido** conhecido pelo SDK.

- Normalmente JWT_API.
- Pode ser usado por WebViews ou módulos externos que precisem do token gerenciado pelo SDK.

⚠️ Cuidados:

- Use apenas se o contrato do produto permitir o compartilhamento.
- Renove token via `LocatorIntegration.getToken()` quando necessário (SDK pode cuidar disso internamente).

---

### 4.4.10 `pendingPermissions(): LocatorPermission[]`

Retorna a lista de permissões **ainda não concedidas**, segundo os requisitos do SDK.

Possíveis valores (sob `LocatorPermission`):

- `location_fine`
- `location_coarse`
- `location_background`
- `activity_recognition`
- `body_sensors`
- `battery_optimization`

#### 🟩 **Kotlin (Android)**
```kotlin
  LOCATION_FINE = "location_fine",
  LOCATION_COARSE = "location_coarse",
  LOCATION_BACKGROUND = "location_background",
  ACTIVITY_RECOGNITION = "activity_recognition",
  BODY_SENSORS = "body_sensors",
  BATTERY_OPTIMIZATION = "battery_optimization",
  FOREGROUND_SERVICE = "foreground_service"
  FOREGROUND_SERVICE_LOCATION = "foreground_service_location"
  ACCESS_NETWORK_STATE = "access_network_state"
```

#### 🟧 **Swift (iOS)**
```swift
CRITICAL_ALERT = "critical_alert"
LOCATION = "location"
LOCATION_BACKGROUND = "location_background"
MICROPHONE_ACCESS = "microphone_access"
POST_NOTIFICATIONS = "post_notifications"
```

**Uso sugerido:**

- Antes de chamar `start()`, pergunte ao SDK.
- Se a lista **não estiver vazia**, o app deve abrir o fluxo de permissão.

---

## 4.5 Mutação de Estado & Configuração

### 4.5.1 `setConfig(config: LocatorConfig): void`

Aplica a configuração do SDK para a licença nesta instância.

**Responsabilidades:**

- Salvar `config` em storage interno.
- Comparar `revision` (se existente) para identificar alteração.
- Reconfigurar:

  - MQTT (broker, clientId, username, etc)
  - Política de coleta (intervalos, batch size)
  - Política de retry

**Momento recomendado de uso:**

- Na ativação, após `getConfig()` via backend.
- Quando backend informar nova `revision`.

---

### 4.5.2 `setState(state: LocatorState): void`

Força mudança de estado operacional do SDK.

Exemplos de uso:

- `IDLE` quando usuário está logado mas sem coleta ativa.
- `PAUSED` quando usuário pausa temporariamente localização.
- `COLLECTING` quando app quer garantir coleta imediata.

---

### 4.5.3 `setSdkMode(mode: LocatorSdkMode): void`

Altera o **modo lógico** do SDK (observed, SOS, alert, etc).

Impactos típicos:

- `SOS`: coleta com intervalos menores, prioridade alta.
- `POWER_SAVER` (via `LocatorPowerMode`) pode combinar com certos modos.

**O SDK deve**:

- Ajustar timers de coleta/envio de acordo com o modo.
- Disparar `LocatorEventType.SDKMODE_CHANGED`.

---

### 4.5.4 `setGroups(groups: LocatorGroups): void`

Aplica a lista de grupos no SDK, impactando:

- Tópicos MQTT monitorados
- Geofences ativas (somente de grupos presentes)
- Regras de visibilidade

---

### 4.5.5 `setFeatures(features: LocatorFeatures): void`

Aplica features, considerando:

- `feature.feature` (identificador)
- `feature.scopes` (se presentes)

O SDK deve:

- Verificar se os scopes exigidos estão presentes (`getScopes()` / cache interno).
- Ativar/desativar internamente o código associado.

---

### 4.5.6 `setGeofences(geofences: LocatorGeofences): void`

Atualiza a lista de cercas conhecida pelo SDK.

- Deve registrar/desregistrar monitoramento de geofences nativas (OS).
- Considerar `groupId` + `LocatorGroups` para determinar quais cercas ativar.

---

## 4.6 Sincronização com Backend

### 4.6.1 `syncConfig(): Promise<void>`

Fluxo típico:

1. SDK monta `LocatorRequestApiConfig` com:

   - `license`
   - `sessionId`
   - `sdkVersion`
   - `osPlatform`
   - `timestamp`

2. Chama `LocatorIntegration.getConfig`.
3. Recebe `LocatorResponseApiConfig`.
4. Chama internamente `setConfig()`.

---

### 4.6.2 `syncScopes(): Promise<void>`

Assíncrono, mas fundamental para RBAC.

- SDK chama `LocatorIntegration.getScopes`.
- Atualiza cache de scopes.
- Revalida features ativas (`setFeatures` interno).

---

### 4.6.3 `syncGroups(): Promise<void>`

- Atualiza `LocatorGroups` via `getGroups()`.
- Ajusta tópicos MQTT e geofences ativas.

---

### 4.6.4 `syncFeatures(): Promise<void>`

- Chama `getFeatures()`.
- Aplica features novas.
- Desativa features removidas.

---

### 4.6.5 `syncGeofences(): Promise<void>`

- Chama `getGeofences()`.
- Atualiza monitoramento de geofences.

---

### 4.6.6 `syncAll(): Promise<void>`

Sincronização completa em ordem controlada, por exemplo:

1. `syncConfig()`
2. `syncScopes()`
3. `syncGroups()`
4. `syncFeatures()`
5. `syncGeofences()`

Deve:

- Tratar erro parcial.
- Aplicar backoff quando necessário.
- Disparar eventos `*_SYNCED`:

  - `CONFIGS_SYNCED`
  - `SCOPES_SYNCED`
  - `GROUPS_SYNCED`
  - `FEATURES_SYNCED`
  - `GEOFENCES_SYNCED`

---

## 4.7 Envio de Dados

### 4.7.1 `sendEvents(data: LocatorEventPackage): Promise<void>`

Envia um pacote de eventos para o backend via MQTT (ou outro canal interno).

`LocatorEventPackage`:

```ts
export interface LocatorEventPackage extends LocatorPackage<LocatorEvent> {}
```

#### 🟩 **Kotlin (Android)**
```kotlin
TODO
```

#### 🟧 **Swift (iOS)**
```swift
TODO
```

**Responsabilidades do SDK:**

- Garantir preenchimento de:

  - `id` (pacote)
  - `license`
  - `sessionId`
  - `connectivity`
  - `network`
  - `osPlatform`
  - `sdkVersion`
  - `timestamp`

- Enfileirar caso offline (respeitando `offlineRetentionDays`).
- Tratar `retryPolicy`.

---

### 4.7.2 `sendLocations(data: LocatorCollectPackage): Promise<void>`

Semelhante a `sendEvents`, mas para localizações (`LocatorCollect`).

**Idealmente:**

- O APP não chama isso diretamente, é responsabilidade interna do SDK.
- Caso seja exposto, é para casos avançados de manual send / flush forçado.

---

## 4.8 Execução de Comandos

### 4.8.1 `execute(command: LocatorCommand): Promise<LocatorCommandResult>`

Executa um comando enviado por:

- APP (chamada direta)
- FCM (payload interpretado pelo APP → SDK)
- MQTT (comandos recebidos de backend e repassados internamente)

`LocatorCommand`:

- `type`: `LocatorCommandType`
- `requiresInternet`: se `true`, não executa offline
- `priority`: `LocatorPriority`
- `expiresAt`: TTL do comando

**Exemplos de tipos:**

- `SET_SDK_MODE`
- `SET_POWER_MODE`
- `START_SDK`
- `STOP_SDK`
- `SYNC_*`
- `KEEP_ALIVE`

**Responsabilidades do SDK:**

- Validar `expiresAt` (não executar comando expirado).
- Respeitar `requiresInternet`.
- Tratar idempotência se necessário (via `command.id`).
- Retornar `LocatorCommandResult` com:

  - `status`: `SUCCESS | FAILED | ERROR`
  - `errorCode` se aplicável
  - `attempts`, `startAt`, `endAt`, `timestamp`

**Exemplo: comportamento típico de alguns comandos**

- `SET_SDK_MODE` → chama internamente `setSdkMode()`.
- `SYNC_CONFIG` → chama `syncConfig()`.
- `SYNC_ALL` (se existir no futuro) → chama `syncAll()`.

---

## 4.9 Fluxo típico de uso (APP)

### 4.9.1 Ativação da licença

1. APP obtém `license` e JWT inicial.
2. APP cria `LocatorIntegrationImpl`.
3. APP chama `locatorService.registerIntegration(integration)`.
4. APP chama `locatorService.syncAll()` ou:

   - `syncConfig`
   - `syncGroups`
   - `syncFeatures`
   - `syncGeofences`

5. APP chama `locatorService.start()`.

---

## 4.10 Exemplos de Uso — TypeScript (React Native/Web)

```ts
import {
  LocatorService,
  LocatorIntegration,
  LocatorConfig,
  LocatorSdkMode,
} from "./locator-sdk";

const locatorService: LocatorService = createLocatorService(); // implementação concreta

class MyLocatorIntegration implements LocatorIntegration {
  async getCert(p) {
    /* ... */
  }
  async getToken(p) {
    /* ... */
  }
  async getScopes(p) {
    /* ... */
  }
  async getFeatures(p) {
    /* ... */
  }
  async getConfig(p) {
    /* ... */
  }
  async getGroups(p) {
    /* ... */
  }
  async getGeofences(p) {
    /* ... */
  }
}

export async function initLocator() {
  const integration = new MyLocatorIntegration();
  locatorService.registerIntegration(integration);

  // Sync inicial
  await locatorService.syncAll();

  // Start SDK
  await locatorService.start();

  // Verificar permissões
  const pending = locatorService.pendingPermissions();
  if (pending.length > 0) {
    // abrir telas de permissão no app
  }

  // Mudar modo para observado
  locatorService.setSdkMode(LocatorSdkMode.OBSERVED);
}
```

---

## 4.11 Exemplos de Uso — Kotlin (Android)

```kotlin
class AppLocatorManager(
    private val locator: LocatorService,
    private val integration: LocatorIntegration
) {

    suspend fun initialize() {
        locator.registerIntegration(integration)

        // Sincronização inicial
        locator.syncAll()

        val pending = locator.pendingPermissions()
        if (pending.isNotEmpty()) {
            // abrir UI pedindo permissões
        }

        // Start do SDK
        locator.start()
    }

    suspend fun enableSosMode() {
        locator.setSdkMode(LocatorSdkMode.SOS)
    }

    suspend fun pauseTracking() {
        locator.setState(LocatorState.PAUSED)
    }

    suspend fun fullStop() {
        locator.stop()
    }

    suspend fun logoutAndDestroy() {
        locator.destroy()
    }
}
```

---

## 4.12 Exemplos de Uso — Swift (iOS)

```swift
final class LocatorManager {

    private let locator: LocatorService
    private let integration: LocatorIntegration

    init(locator: LocatorService, integration: LocatorIntegration) {
        self.locator = locator
        self.integration = integration
    }

    func initialize() async throws {
        locator.registerIntegration(integration)

        try await locator.syncAll()
        try await locator.start()

        let pending = locator.pendingPermissions()
        if !pending.isEmpty {
            // apresentar telas de permissão
        }
    }

    func setObservedMode() {
        locator.setSdkMode(.OBSERVED)
    }

    func stopSdk() async throws {
        try await locator.stop()
    }

    func destroySdk() async throws {
        try await locator.destroy()
    }
}
```

---

## 4.13 Resumo da Parte 4

Nesta parte documentamos completamente:

- Todos os métodos do `LocatorService`
- Como cada método se relaciona com:

  - ciclo de vida
  - sincronização
  - envio de dados
  - execução de comandos
  - permissões

- Fluxos típicos de uso (ativação, modo SOS, pausa, logout)
- Exemplos em TypeScript, Kotlin e Swift

[< Voltar](../README.md)
