export enum LocatorTokenType {
  JWT_API = "jwt_api",
  JWT_MQTT = "jwt_mqtt",
  JWT_WSS = "jwt_wss",
}

export enum LocatorPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum LocatorEventType {
  BATTERY_EVENT = "battery.event", // quando a bateria chega em alguma das porcentagens configuradas (dentro de x tempo)
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

export enum LocatorEventSource {
  SDK = "sdk",
  APP = "app",
  SERVER = "server",
  VIEW = "view",
}

export enum LocatorEventLevel {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export enum LocatorState {
  DEFAULT = "default",
  IDLE = "idle",
  COLLECTING = "collecting",
  PAUSED = "paused",
  STOPPED = "stopped",
}

export enum LocatorSdkMode {
  DEFAULT = "default",
  OBSERVED = "observed",
  SOS = "sos",
  ALERT = "alert",
}

export enum LocatorPowerMode {
  NORMAL = "normal",
  POWER_SAVER = "power_saver",
  SUPER_SAVER = "super_saver",
}

export enum LocatorErrorCode {
  NETWORK_TIMEOUT = "network_timeout",
  AUTH_INVALID = "auth_invalid",
  RATE_LIMIT = "rate_limit",
  EXCEPTION = "exception",
  UNKNOWN = "unknown",
}

export enum LocatorPermission {
  LOCATION_FINE = "location_fine",
  LOCATION_COARSE = "location_coarse",
  LOCATION_BACKGROUND = "location_background",
  ACTIVITY_RECOGNITION = "activity_recognition",
  BODY_SENSORS = "body_sensors",
  BATTERY_OPTIMIZATION = "battery_optimization",
}

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

export enum LocatorCommandStatus {
  SUCCESS = "success",
  FAILED = "failed",
  ERROR = "error",
}

export enum LocatorCollectSource {
  UNKNOWN = "unknown",
  GPS = "gps",
  NETWORK = "network",
  FUSED = "fused",
  BLUETOOTH = "bluetooth",
  MANUAL = "manual",
  LAST_KNOWN = "last_known",
}

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

export enum LocatorConnectivityType {
  UNKNOWN = "unknown",
  WIFI = "wifi",
  CELLULAR = "cellular",
  BLUETOOTH = "bluetooth",
  ETHERNET = "ethernet",
  VPN = "vpn",
  NONE = "none",
}

export enum LocatorNetworkType {
  // Geral
  UNKNOWN = "unknown",
  NONE = "none",
  // Wi-Fi
  WIFI = "wifi",
  WIFI_4 = "wifi4", // 802.11n
  WIFI_5 = "wifi5", // 802.11ac
  WIFI_6 = "wifi6", // 802.11ax
  WIFI_6E = "wifi6e", // 802.11ax 6GHz
  WIFI_7 = "wifi7", // 802.11be
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

export interface LocatorPackage<T = Record<string, any>> {
  id: string; // id unico do pacote, usado para confirmação de possivel recebimento e telemetria
  sequence?: number; // numero sequencial do pacote, usado para controle de possivel execução e telemetrias
  license: string; // id da licença, para identificação do device/usuario
  sessionId?: string; // sessão do momento da criação do pacote
  connectivity: LocatorConnectivityType; // conectividade disponivel, utilizada no momento da criação do pacote
  network: LocatorNetworkType; // rede disponivel, utilizada no momento da criação do pacote
  osPlatform: string; // sistema operacional do SDK, usado para facilidade de filtro e telemetria
  sdkVersion: string; // versão do SDK no momento da criação do pacote
  data: T[]; // items do pacote a ser enviado ao MQTTS
  timestamp: number; // adicionar timestamp, sendo a data e hora real da criação do pacote
}

export interface LocatorRetryPolicy {
  maxRetries?: number; // quantidade maxima de retry, caso não informado, SDK decide
  baseDelayMs?: number; // base de delay em ms usada para espera entre tentativas
  backoffFactor?: number; // fator usado para definição do tempo de espera entre cada tentativa
}

export interface LocatorApiConfig {
  token: string; // Token JWT temporario para requisição dos ceritificados
  certUrl?: string; // url para obtenção de certificado
  scopesUrl?: string; // url para obtenção de scopes
  tokenUrl?: string; // url para obtenção de token
  configUrl?: string; // url para obtenção de configuração
  groupsUrl?: string; // url para obtenção de grupos
  featuresUrl?: string; // url para obtenção das features habilitadas ao SDK
  geofencesUrl?: string; // url para obtenção das cercas a serem monitoradas pelo SDK
}

export interface LocatorMqttConfig {
  clientId?: string; // clientId do MQTT. ele é unico por conexão, então a conexão via SDK e a conexão via WSS, devem ter clientId diferentes
  broker?: string; // endereço do broker do MQTT
  port?: string; // porta do broker do MQTT
  username?: string; // usuario de serviço para conectar no mqtt. Nesse caso pode ser um unico fixo, usado para telemetria, visto que existe o clientId unico e o token JWT
}

export interface LocatorBatteryEvent {
  name: string; // nome do evento executado, a ser repassao ao MQTT para identificação do backend. O SDK deverá permissão somente um por name
  min: number; // minimo de bateria para acionar o evento
  max: number; // maximo de bateria para acionar o evento
  interval: number; // intervalo para executar novamente o evento, a aprtir da exacução anterior do mesmo (evitar loop)
  charging: boolean; // se deve ser executado carregando ou não (criar mais de ume vento se precisar independente)
  powerMode: LocatorPowerMode[]; // em quais modos de bateria esse comando deve ser executado
}

export interface LocatorBatteryConfig {
  events?: LocatorBatteryEvent[]; // lista de configuyrações de eventos de bateria, para o SDK monitorar e disparars
}

export interface LocatorMotionConfig {
  sensitivity?: number; // sensibilidade do sensor
}

export interface LocatorProcessConfig {
  // opcionais para robustez de envio
  retryPolicy?: LocatorRetryPolicy;
  offlineRetentionDays?: number;

  // Obrigatorio em android
  foregroundServiceNotification?: {
    title?: string;
    message?: string;
  };
}

export interface LocatorCollectConfig {
  collectIntervalMillis?: number;
  sendIntervalMillis?: number;
  minDisplacementMeters?: number;
  maxTravelDistanceMeters?: number;
  highAccuracy?: boolean;
  maxBatchSize?: number;
}

export interface LocatorConfig {
  license: string; // identificaçãod a licença (usado para identificar device/usuario)
  sdkVersion: string; // versão do SDK
  osPlatform: string; // sistema operacional
  api: LocatorApiConfig; // configurações de API
  mqtt: LocatorMqttConfig; // configurações do MQTT (os nomes dos topicos são gerados de acordop comr egra predefinida e fixa)
  process: LocatorProcessConfig; // Configuração de processos em backeground/foreground
  battery?: LocatorBatteryConfig; // Configuração do eventos de bateria
  motion?: LocatorMotionConfig; // configuração do evento de movimentos
  collect?: LocatorCollectConfig; // configuração das coletas
  revision?: number; // Controle de versão
  createdAt?: number; // Controle de data de criação
  updatedAt?: number; // Controle de data de atualização
}

export interface LocatorSession {
  id: string; // id da sessão
  startAt: number; // data e hora da inicialização da sessão
  endAt?: number; // data e hora da finalização da sessão
}

export interface LocatorCert {
  p12Base64: string; // base54 do p12, criptografado com a senha
  nonce: string; // usado no algoritimo para gerar a senha, faz parte da senha do certificado recebido
  expiresAt?: number; // data de expiração do certificado
}

export interface LocatorToken {
  type: LocatorTokenType;
  token: string;
  expiresAt?: number; // data de expiração do token
}

export interface LocatorGeofence {
  id: string; // identificação da cerca
  groupId: string; // id do grupo que pertence a cerca, só aplicar a cerca se o grupo estiver na lista. Caso receber a cerca em sync e não ter o grupo, solicitar syn dos grupos
  latitude: number;
  longitude: number;
  radiusMeters: number;
  revision?: number; // Controle de versão
  createdAt?: number; // Controle de data de criação
  updatedAt?: number; // Controle de data de atualização
}

export interface LocatorGeofences {
  geofences: LocatorGeofence[]; // lista de cercas
  revision?: number; // Controle de versão
  createdAt?: number; // Controle de data de criação
  updatedAt?: number; // Controle de data de atualização
}

export interface LocatorGroups {
  admin: string[]; // grupos que o usuário possui permissão elevada
  all: string[]; // todos os grupos que participam de visibilidade
  revision?: number; // Controle de versão
  createdAt?: number; // Controle de data de criação
  updatedAt?: number; // Controle de data de atualização
}

export interface LocatorFeature {
  feature: string; // identificador da feature, usado no SDK para identificação de algum recurso ou conjunto de recursos
  scopes?: string[]; // Controle RBACK para limitar o uso da cerca, caso existente, deverá ser aplicada somente se o usuario tiver o scope exigido
  revision?: number; // Controle de versão
  createdAt?: number; // Controle de data de criação
  updatedAt?: number; // Controle de data de atualização
}

export interface LocatorFeatures {
  features: LocatorFeature[]; // features habilitadas no SDK
  revision?: number; // Controle de versão
  createdAt?: number; // Controle de data de criação
  updatedAt?: number; // Controle de data de atualização
}

export interface LocatorCollect {
  id: string; // id da coletas
  sequence?: number; // ordenação/idempotência
  source?: LocatorCollectSource;
  latitude: number;
  longitude: number;
  satellitesUsed?: number;
  satellitesVisible?: number;
  providerAccuracy?: LocatorAccuracyProvider;
  verticalAccuracy?: number; // m
  horizontalAccuracy?: number; // m
  altitude?: number; // m
  bearing?: number; // degrees
  speed?: number; // m/s
  battery: number; // 0..100
  charging?: boolean;
  connectivity: LocatorConnectivityType;
  network: LocatorNetworkType; // rede disponivel, utilizada no momento da coleta
  powerMode?: LocatorPowerMode;
  sdkMode: LocatorSdkMode;
  timestamp: number; // adicionar timestamp, sendo a data e hora real da coletas
}

export interface LocatorEvent {
  id: string; // id do evento gerado
  type: LocatorEventType; // usado para identificar o tipo do evento
  priority?: LocatorPriority; // usado para identificar a prioridade da execução, caso tenha muitos comandos a serem executados
  source?: LocatorEventSource; // usado para identificar a origem que acionou o comando
  level?: LocatorEventLevel; // usado para identificar o level do comando
  payload?: Record<string, any>; // payload usado para complementar o evento
  sequence?: number; // usado para identificar a sequencia do evento
  timestamp: number; // adicionar timestamp, sendo a data e hora da geração do evento
}

export interface LocatorCollectPackage extends LocatorPackage<LocatorCollect> {}
export interface LocatorEventPackage extends LocatorPackage<LocatorEvent> {}

export interface LocatorCommand {
  id: string; // id do comando
  type: LocatorCommandType; // tipo do comando
  requiresInternet?: boolean; // informa a obrigação de internet para execução, usado para controle do SDK, caso esteja sem internet, executar comandos da fila
  requiresWakeUp?: boolean; // verifica se o comando gerar outro comando para acordar o device (isso ja controlado na prioridade, porem caso queira forçar)
  priority?: LocatorPriority; // prioridade usada para a execução do comando
  payload?: Record<string, any>; // payload usado para complementar o comando
  expiresAt?: number; // adicionar timestamp, sendo a data e hora maxima para execução do comando
  timestamp?: number; // adicionar timestamp, sendo a data e hora da solicitação do comando
}

export interface LocatorCommandResult {
  id: string; // id da execução do comando
  commandId: string; // id do comando do comando, para uso do consumidor do resultado
  commandType: LocatorCommandType; // tipo de comando do comando, para uso do consumidor do resultado
  status: LocatorCommandStatus; // status da execução do comando, para uso do consumidor do resultado
  errorCode?: LocatorErrorCode; // codigo de erro gerado na execução do comando, para uso do consumidor do resultado
  message?: string | null; // mensagem do comando, para uso do consumidor do resultado
  details?: Record<string, any>; // detalhes genericos da execução de cada comando, para uso do consumidor do resultado
  attempts?: number; // adicionar o numero da tentativa da execução para telemetria
  startAt: number; // adicionar o inicio do processamento para telemetria
  endAt: number; // adicionar o final do processamento para telemetria
  timestamp: number; // adicionar timestamp, sendo a data e hora do envio
}

export interface LocatorRequestApi<T = undefined> {
  id: string; // cada requisição com id, para facilitar o trace das APIs
  license: string; // a licensa pode ser qualquer identificador de instação ou device, será usada para o consumidor identificar o device/usuario
  sessionId?: string; // quando incia uma nova conexão, o SDK gera um id de sessão para toda conexão
  sdkVersion?: string; // versão do SDK, para possivel alteração de payload, tratamento de compatibilidade, telemetria, etc
  osPlatform?: string; // sistema operacional do SDK, para possivel alteração de payload, tratamento de compatibilidade, telemetria, etc
  timestamp: number; // cada requisição com timestamp, para facilitar o trace das APIs
  data?: T; // payload de acordo com o tipo de solicitação
}

export interface LocatorResponseApi<T> {
  id: string; // cada resposta com id, para facilitar o trace das APIs
  requestId: string; // cada resposta com id da requisição, para facilitar o trace das APIs
  timestamp: number; // cada resposta com timestamp, para facilitar o trace das APIs
  data: T; // Retorno esperado para o tipo determinado de solicitação
}

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

// Clase de integração, usada apenas pelo SDK
export interface LocatorIntegration {
  // ---------------------------------------------------------------------------------------------
  // Usados apenas pelo SDK - Exigencia de JWT temporário, passado na ativação
  // ---------------------------------------------------------------------------------------------
  getCert(payload: LocatorRequestApiCert): Promise<LocatorResponseApiCert>; // retorna o certificado P12 em base64 + nonce (usado como parte do algoritimo da senha, que será combinações do nonce enviado na solicitação e configurações + nonce da resposta)

  // ---------------------------------------------------------------------------------------------
  // Usados apenas pelo SDK - Exigencia de MTLS
  // ---------------------------------------------------------------------------------------------
  getToken(payload: LocatorRequestApiToken): Promise<LocatorResponseApiToken>; // retorna token de acordo com o tipo (JWT_API, JWT_MQTT, JWT_WSS)

  // ---------------------------------------------------------------------------------------------
  // Usados apenas pelo SDK - Exigencia de MTLS + JWT (JWT_API)
  // ---------------------------------------------------------------------------------------------
  getScopes(
    payload: LocatorRequestApiScopes
  ): Promise<LocatorResponseApiScopes>; // retorna os scopes. A API deve exigir MTLS e JWT (JWT_API) para esse endpoints
  getFeatures(
    payload: LocatorRequestApiFeatures
  ): Promise<LocatorResponseApiFeatures>; // retorna as features. A API deve exigir MTLS e JWT (JWT_API) para esse endpoint
  getConfig(
    payload: LocatorRequestApiConfig
  ): Promise<LocatorResponseApiConfig>; // retorna a configuração. A API deve exigir MTLS e JWT (JWT_API) para esse endpoint
  getGroups(
    payload: LocatorRequestApiGroups
  ): Promise<LocatorResponseApiGroups>; // retorna os grupos. A API deve exigir MTLS e JWT (JWT_API) para esse endpointS
  getGeofences(
    payload: LocatorRequestApiGeofenses
  ): Promise<LocatorResponseApiGeofenses>; // retorna as cercas. A API deve exigir MTLS e JWT (JWT_API) para esse endpoint
}

export interface LocatorService {
  // ---------------------------------------------------------------------------------------------
  // Usados apenas pelo APP
  // ---------------------------------------------------------------------------------------------s
  registerIntegration(integration: LocatorIntegration): void; // Usado pelo APP para injetar dependencia de integraçãos

  // ---------------------------------------------------------------------------------------------
  // Usados para consultas do APP, WebView Bridge e SDK
  // ---------------------------------------------------------------------------------------------
  getConfig(): LocatorConfig; // Retorna as configurações do SDKS
  getGroups(): LocatorGroups; // Retorna os grupos do SDKS
  getFeatures(): LocatorFeatures; // Retorna as features do SDKS
  getGeofences(): LocatorGeofences; // Retorna as cercas do SDKS
  getState(): LocatorState; // Retorna o estado do SDKS
  getSdkMode(): LocatorSdkMode; // Retorna o modo do SDK do SDKS
  getSession(): LocatorSession; // Retorna a sessão do SDKS
  getVersion(): string; // Retorna a versão do SDKS
  getJwtToken(): string; // Usado para pelo APP e WebView Bridge para retornar um token JWT de LocatorIntegration.getToken
  pendingPermissions(): LocatorPermission[]; // Retorna as permissões pendentes de aceitaçõa, exigidas pelo SDK
  start(): Promise<void>; // Inicializa o SDK, obrigatorio na ativação ou após a execução do stop (caso queira ativa-lo novamente)
  stop(): Promise<void>; // Desliga o SDK, mantendo certificados e dados
  destroy(): Promise<void>; // Desativa o SDK e limpa todos os dados, incluindo certificados
  setConfig(config: LocatorConfig): void; // Verifique se mudou a configuração ou se esta iniciando e configure o mqtt de acordo com configurações
  setState(state: LocatorState): void; // Alterar comportamento do SDK de acordo com o state
  setSdkMode(mode: LocatorSdkMode): void; // Alterar comportamento do SDK de acordo com o mode (observado, SOS, alert, etc)
  setGroups(groups: LocatorGroups): void; // Verificar alterações de grupos e configurar topicos do mqtt de acordo com os grupos
  setFeatures(features: LocatorFeatures): void; // Verificar as features habilitadas, dentro de cada featura tem os scopes obrigatorios, verificar os scopes adicioandos ao SDK e habilitar ou desabilitar cada feature
  setGeofences(geofences: LocatorGeofences): void; // Atualizar processamento e monitoramento das cercas
  syncConfig(): Promise<void>; // Sincroniza a configuração do SDK, verifica os campos de controle (revision, createdAt, updatedAt) para saber se precisa atualizar
  syncScopes(): Promise<void>; // Sincroniza os scopes do SDK, verifica os campos de controle (revision, createdAt, updatedAt) para saber se precisa atualizar
  syncGroups(): Promise<void>; // Sincroniza os grupos do SDK, verifica os campos de controle (revision, createdAt, updatedAt) para saber se precisa atualizar
  syncFeatures(): Promise<void>; // Sincroniza as features do SDK, verifica os campos de controle (revision, createdAt, updatedAt) para saber se precisa atualizar
  syncGeofences(): Promise<void>; // Sincroniza as cercas do SDK, verifica os campos de controle (revision, createdAt, updatedAt) para saber se precisa atualizar
  syncAll(): Promise<void>; // Sincroniza o SDK por completo

  // ---------------------------------------------------------------------------------------------
  // Usados apenas pelo APP e SDK
  // ---------------------------------------------------------------------------------------------
  sendEvents(data: LocatorEventPackage): Promise<void>; // Envia um evento ao MQTT
  sendLocations(data: LocatorCollectPackage): Promise<void>; // Envia localizações ao MQTT
  execute(command: LocatorCommand): Promise<LocatorCommandResult>; // Execução de comandos, recebidos via SDK, MQTT, FCM, APP
}
