import Foundation

// MARK: - JSONValue utilitário para payloads dinâmicos (string/number/bool/objeto/array/null)

public enum JSONValue: Codable, Equatable {
    case string(String)
    case int(Int)
    case double(Double)
    case bool(Bool)
    case object([String: JSONValue])
    case array([JSONValue])
    case null

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if container.decodeNil() { self = .null; return }
        if let b = try? container.decode(Bool.self) { self = .bool(b); return }
        if let i = try? container.decode(Int.self) { self = .int(i); return }
        if let d = try? container.decode(Double.self) { self = .double(d); return }
        if let s = try? container.decode(String.self) { self = .string(s); return }
        if let arr = try? container.decode([JSONValue].self) { self = .array(arr); return }
        if let obj = try? container.decode([String: JSONValue].self) { self = .object(obj); return }
        throw DecodingError.typeMismatch(JSONValue.self, .init(codingPath: decoder.codingPath, debugDescription: "Unsupported JSON"))
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch self {
        case .string(let s): try container.encode(s)
        case .int(let i): try container.encode(i)
        case .double(let d): try container.encode(d)
        case .bool(let b): try container.encode(b)
        case .object(let o): try container.encode(o)
        case .array(let a): try container.encode(a)
        case .null: try container.encodeNil()
        }
    }
}

// MARK: - Enums

public enum LocatorTokenType: String, Codable, CaseIterable {
    case JWT_API = "jwt_api"
    case JWT_MQTT = "jwt_mqtt"
    case JWT_WSS = "jwt_wss"
}

public enum LocatorPriority: String, Codable, CaseIterable {
    case LOW = "low", NORMAL = "normal", HIGH = "high", CRITICAL = "critical"
}

public enum LocatorEventType: String, Codable, CaseIterable {
    case BATTERY_EVENT = "battery.event"
    case MOTION_ACCELERATION = "motion.acceleration"
    case MOTION_BRAKING = "motion.braking"
    case MOTION_SHARP_TURN = "motion.sharp_turn"
    case ALERT_SOS = "alert.sos"
    case GEOFENCE_ENTER = "geofence.enter"
    case GEOFENCE_EXIT = "geofence.exit"
    case GEOFENCES_SYNCED = "geofences.synced"
    case CONFIGS_SYNCED = "configs.synced"
    case CERT_SYNCED = "cert.synced"
    case GROUPS_SYNCED = "groups.synced"
    case FEATURES_SYNCED = "features.synced"
    case SCOPES_SYNCED = "scopes.synced"
    case POWERMODE_CHANGED = "powermode.changed"
    case SDKMODE_CHANGED = "sdkmode.changed"
    case SDKSTATE_CHANGED = "sdkstate.changed"
    case COMMAND_RESULT = "command.result"
    case PERMISSION_ERROR = "permission.error"
    case CONNECTIVITY_CHANGED = "connectivity.changed"
    case LOCATION_SEND_SUCCESS = "location.send_success"
    case LOCATION_SEND_FAILED = "location.send_failed"
    case LOCATION_QUEUED = "location.queued"
    case LOCATION_DROPPED = "location.dropped"
    case EXCEPTION = "exception"
}

public enum LocatorEventSource: String, Codable, CaseIterable { case SDK="sdk", APP="app", SERVER="server", VIEW="view" }
public enum LocatorEventLevel: String, Codable, CaseIterable { case INFO="info", WARNING="warning", ERROR="error" }

public enum LocatorState: String, Codable, CaseIterable {
    case DEFAULT="default", IDLE="idle", COLLECTING="collecting", PAUSED="paused", STOPPED="stopped"
}

public enum LocatorSdkMode: String, Codable, CaseIterable {
    case DEFAULT="default", OBSERVED="observed", SOS="sos", ALERT="alert"
}

public enum LocatorPowerMode: String, Codable, CaseIterable {
    case NORMAL="normal", POWER_SAVER="power_saver", SUPER_SAVER="super_saver"
}

public enum LocatorErrorCode: String, Codable, CaseIterable {
    case NETWORK_TIMEOUT="network_timeout", AUTH_INVALID="auth_invalid", RATE_LIMIT="rate_limit", EXCEPTION="exception", UNKNOWN="unknown"
}

public enum LocatorPermission: String, Codable, CaseIterable {
    case LOCATION_FINE="location_fine", LOCATION_COARSE="location_coarse", LOCATION_BACKGROUND="location_background",
         ACTIVITY_RECOGNITION="activity_recognition", BODY_SENSORS="body_sensors", BATTERY_OPTIMIZATION="battery_optimization"
}

public enum LocatorCommandType: String, Codable, CaseIterable {
    case SET_SDK_MODE="set_sdk_mode", SET_POWER_MODE="set_power_mode", START_SDK="start_sdk", STOP_SDK="stop_sdk",
         DISABLE_SDK="disable_sdk", RELOAD_SDK="reload_sdk", PAUSE_COLLECTION="pause_collection", RESUME_COLLECTION="resume_collection",
         SYNC_CERT="sync_cert", SYNC_FEATURES="sync_features", SYNC_SCOPES="sync_scopes", SYNC_CONFIG="sync_config",
         SYNC_GROUPS="sync_groups", SYNC_GEOFENCES="sync_geofences", KEEP_ALIVE="keep_alive"
}

public enum LocatorCommandStatus: String, Codable, CaseIterable { case SUCCESS="success", FAILED="failed", ERROR="error" }

public enum LocatorCollectSource: String, Codable, CaseIterable {
    case UNKNOWN="unknown", GPS="gps", NETWORK="network", FUSED="fused", BLUETOOTH="bluetooth", MANUAL="manual", LAST_KNOWN="last_known"
}

public enum LocatorAccuracyProvider: String, Codable, CaseIterable {
    case GPS_ULTRA="gps_ultra", GPS_HIGH="gps_high", GPS_MEDIUM="gps_medium", GPS_LOW="gps_low",
         GNSS="gnss", NETWORK_LOW="network_low", NETWORK_HIGH="network_high", FUSED_BALANCED="fused_balanced"
}

public enum LocatorConnectivityType: String, Codable, CaseIterable {
    case UNKNOWN="unknown", WIFI="wifi", CELLULAR="cellular", BLUETOOTH="bluetooth", ETHERNET="ethernet", VPN="vpn", NONE="none"
}

public enum LocatorNetworkType: String, Codable, CaseIterable {
    // Geral
    case UNKNOWN="unknown", NONE="none"

    // Wi‑Fi
    case WIFI="wifi", WIFI_4="wifi4", WIFI_5="wifi5", WIFI_6="wifi6", WIFI_6E="wifi6e", WIFI_7="wifi7"

    // Bluetooth
    case BT="bt", BT_CLASSIC="bt_classic", BT_LE="bt_le", BT_5="bt5", BT_5_1="bt51", BT_5_2="bt52"

    // Ethernet
    case ETH="eth", ETH_100="eth100", ETH_1G="eth1g", ETH_10G="eth10g"

    // VPN
    case VPN="vpn", VPN_IPSEC="vpn_ipsec", VPN_OPENVPN="vpn_ovpn", VPN_WIREGUARD="vpn_wg", VPN_SSL="vpn_ssl"

    // Celular (macro)
    case CELL="cell"

    // 2G
    case G2="2g", G2_GPRS="2g_gprs", G2_EDGE="2g_edge"

    // 3G
    case G3="3g", G3_UMTS="3g_umts", G3_HSPA="3g_hspa", G3_HSPA_PLUS="3g_hspa_plus"

    // 4G
    case G4="4g", G4_LTE="4g_lte", G4_LTE_A="4g_lte_a"

    // 5G
    case G5="5g", G5_NSA="5g_nsa", G5_SA="5g_sa", G5_NR="5g_nr"
}

// MARK: - Modelos / Configs

public struct LocatorPackage<T: Codable>: Codable {
    public let id: String
    public let sequence: Int64?
    public let license: String
    public let sessionId: String?
    public let connectivity: LocatorConnectivityType
    public let network: LocatorNetworkType
    public let osPlatform: String
    public let sdkVersion: String
    public let data: [T]
    public let timestamp: Int64
}

public struct LocatorRetryPolicy: Codable {
    public let maxRetries: Int?
    public let baseDelayMs: Int64?
    public let backoffFactor: Double?
}

public struct LocatorApiConfig: Codable {
    public let token: String
    public let certUrl: String?
    public let scopesUrl: String?
    public let tokenUrl: String?
    public let configUrl: String?
    public let groupsUrl: String?
    public let featuresUrl: String?
    public let geofencesUrl: String?
}

public struct LocatorMqttConfig: Codable {
    public let clientId: String?
    public let broker: String?
    public let port: String?
    public let username: String?
}

public struct LocatorBatteryEvent: Codable {
    public let name: String
    public let min: Int
    public let max: Int
    public let interval: Int64
    public let charging: Bool
    public let powerMode: [LocatorPowerMode]
}

public struct LocatorBatteryConfig: Codable {
    public let events: [LocatorBatteryEvent]?
}

public struct LocatorMotionConfig: Codable {
    public let sensitivity: Double?
}

public struct LocatorProcessConfig: Codable {
    public let retryPolicy: LocatorRetryPolicy?
    public let offlineRetentionDays: Int?
    public let foregroundServiceNotification: ForegroundServiceNotification?

    public struct ForegroundServiceNotification: Codable {
        public let title: String?
        public let message: String?
    }
}

public struct LocatorCollectConfig: Codable {
    public let collectIntervalMillis: Int64?
    public let sendIntervalMillis: Int64?
    public let minDisplacementMeters: Double?
    public let maxTravelDistanceMeters: Double?
    public let highAccuracy: Bool?
    public let maxBatchSize: Int?
}

public struct LocatorConfig: Codable {
    public let license: String
    public let sdkVersion: String
    public let osPlatform: String
    public let api: LocatorApiConfig
    public let mqtt: LocatorMqttConfig
    public let process: LocatorProcessConfig
    public let battery: LocatorBatteryConfig?
    public let motion: LocatorMotionConfig?
    public let collect: LocatorCollectConfig?
    public let revision: Int64?
    public let createdAt: Int64?
    public let updatedAt: Int64?
}

public struct LocatorSession: Codable {
    public let id: String
    public let startAt: Int64
    public let endAt: Int64?
}

public struct LocatorCert: Codable {
    public let p12Base64: String
    public let nonce: String
    public let expiresAt: Int64?
}

public struct LocatorToken: Codable {
    public let type: LocatorTokenType
    public let token: String
    public let expiresAt: Int64?
}

public struct LocatorGeofence: Codable {
    public let id: String
    public let groupId: String
    public let latitude: Double
    public let longitude: Double
    public let radiusMeters: Double
    public let revision: Int64?
    public let createdAt: Int64?
    public let updatedAt: Int64?
}

public struct LocatorGeofences: Codable {
    public let geofences: [LocatorGeofence]
    public let revision: Int64?
    public let createdAt: Int64?
    public let updatedAt: Int64?
}

public struct LocatorGroups: Codable {
    public let admin: [String]
    public let all: [String]
    public let revision: Int64?
    public let createdAt: Int64?
    public let updatedAt: Int64?
}

public struct LocatorFeature: Codable {
    public let feature: String
    public let scopes: [String]?
    public let revision: Int64?
    public let createdAt: Int64?
    public let updatedAt: Int64?
}

public struct LocatorFeatures: Codable {
    public let features: [LocatorFeature]
    public let revision: Int64?
    public let createdAt: Int64?
    public let updatedAt: Int64?
}

public struct LocatorCollect: Codable {
    public let id: String
    public let sequence: Int64?
    public let source: LocatorCollectSource?
    public let latitude: Double
    public let longitude: Double
    public let satellitesUsed: Int?
    public let satellitesVisible: Int?
    public let providerAccuracy: LocatorAccuracyProvider?
    public let verticalAccuracy: Double?
    public let horizontalAccuracy: Double?
    public let altitude: Double?
    public let bearing: Double?
    public let speed: Double?
    public let battery: Int
    public let charging: Bool?
    public let connectivity: LocatorConnectivityType
    public let network: LocatorNetworkType
    public let powerMode: LocatorPowerMode?
    public let sdkMode: LocatorSdkMode
    public let timestamp: Int64
}

public struct LocatorEvent: Codable {
    public let id: String
    public let type: LocatorEventType
    public let priority: LocatorPriority?
    public let source: LocatorEventSource?
    public let level: LocatorEventLevel?
    public let payload: [String: JSONValue]?
    public let sequence: Int64?
    public let timestamp: Int64
}

/* Helpers para pacotes específicos */
public typealias LocatorCollectPackage = LocatorPackage<LocatorCollect>
public typealias LocatorEventPackage  = LocatorPackage<LocatorEvent>

// MARK: - Comandos

public struct LocatorCommand: Codable {
    public let id: String
    public let type: LocatorCommandType
    public let requiresInternet: Bool?
    public let requiresWakeUp: Bool?
    public let priority: LocatorPriority?
    public let payload: [String: JSONValue]?
    public let expiresAt: Int64?
    public let timestamp: Int64?
}

public struct LocatorCommandResult: Codable {
    public let id: String
    public let commandId: String
    public let commandType: LocatorCommandType
    public let status: LocatorCommandStatus
    public let errorCode: LocatorErrorCode?
    public let message: String?
    public let details: [String: JSONValue]?
    public let attempts: Int?
    public let startAt: Int64
    public let endAt: Int64
    public let timestamp: Int64
}

// MARK: - Requests / Responses

public struct LocatorRequestApi<T: Codable>: Codable {
    public let id: String
    public let license: String
    public let sessionId: String?
    public let sdkVersion: String?
    public let osPlatform: String?
    public let timestamp: Int64
    public let data: T?
}

public struct LocatorResponseApi<T: Codable>: Codable {
    public let id: String
    public let requestId: String
    public let timestamp: Int64
    public let data: T
}

/* Typealiases para respostas específicas */
public typealias LocatorResponseApiCert      = LocatorResponseApi<LocatorCert>
public typealias LocatorResponseApiToken     = LocatorResponseApi<LocatorToken>
public typealias LocatorResponseApiGroups    = LocatorResponseApi<LocatorGroups>
public typealias LocatorResponseApiScopes    = LocatorResponseApi<[String]>
public typealias LocatorResponseApiFeatures  = LocatorResponseApi<LocatorFeatures>
public typealias LocatorResponseApiConfig    = LocatorResponseApi<LocatorConfig>
public typealias LocatorResponseApiGeofenses = LocatorResponseApi<LocatorGeofences>

/* Payloads de requests (data) */
public struct LocatorRequestApiTokenData: Codable {
    public let type: LocatorTokenType
    public let scopes: [String]?
}
public struct LocatorRequestApiCertData: Codable {
    public let nonce: String
}
public struct EmptyPayload: Codable {}


// MARK: - Contratos

/// Integração com backend (rede). Use Swift Concurrency.
public protocol LocatorIntegration {
    func getCert(_ payload: LocatorRequestApi<LocatorRequestApiCertData>) async throws -> LocatorResponseApiCert
    func getToken(_ payload: LocatorRequestApi<LocatorRequestApiTokenData>) async throws -> LocatorResponseApiToken
    func getScopes(_ payload: LocatorRequestApi<EmptyPayload>) async throws -> LocatorResponseApiScopes
    func getFeatures(_ payload: LocatorRequestApi<EmptyPayload>) async throws -> LocatorResponseApiFeatures
    func getConfig(_ payload: LocatorRequestApi<EmptyPayload>) async throws -> LocatorResponseApiConfig
    func getGroups(_ payload: LocatorRequestApi<EmptyPayload>) async throws -> LocatorResponseApiGroups
    func getGeofences(_ payload: LocatorRequestApi<EmptyPayload>) async throws -> LocatorResponseApiGeofenses
}

/// API principal do SDK exposta ao app/bridge.
public protocol LocatorService {
    // Injeção
    func registerIntegration(_ integration: LocatorIntegration)

    // Leitura/estado
    func getConfig() -> LocatorConfig
    func getGroups() -> LocatorGroups
    func getFeatures() -> LocatorFeatures
    func getGeofences() -> LocatorGeofences
    func getState() -> LocatorState
    func getSdkMode() -> LocatorSdkMode
    func getSession() -> LocatorSession
    func getVersion() -> String
    func getJwtToken() -> String
    func pendingPermissions() -> [LocatorPermission]

    // Ciclo de vida
    func start() async throws
    func stop() async throws
    func destroy() async throws

    // Mutação
    func setConfig(_ config: LocatorConfig)
    func setState(_ state: LocatorState)
    func setSdkMode(_ mode: LocatorSdkMode)
    func setGroups(_ groups: LocatorGroups)
    func setFeatures(_ features: LocatorFeatures)
    func setGeofences(_ geofences: LocatorGeofences)

    // Syncs
    func syncConfig() async throws
    func syncScopes() async throws
    func syncGroups() async throws
    func syncFeatures() async throws
    func syncGeofences() async throws
    func syncAll() async throws

    // Telemetria/Comandos
    func sendEvents(_ data: LocatorEventPackage) async throws
    func sendLocations(_ data: LocatorCollectPackage) async throws
    func execute(_ command: LocatorCommand) async throws -> LocatorCommandResult
}
