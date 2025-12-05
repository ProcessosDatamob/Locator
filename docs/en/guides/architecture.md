# SDK Architecture

[< Back](../README.md)

The Locator SDK architecture is composed of five main layers:

1. **APP** (your application)
2. **Public SDK** (`LocatorService`)
3. **Integration** (implemented by APP: `LocatorIntegration`)
4. **Internal Core** (collection, offline queue, retry, events)
5. **Transport** (HTTP/mTLS + MQTT + WSS)

```mermaid
sequenceDiagram
  autonumber
  participant App
  participant SDK as LocatorService
  participant Int as LocatorIntegration
  participant API
  participant MQTT

  App->>SDK: registerIntegration(Int)
  App->>SDK: setConfig(config)
  App->>SDK: start()
  SDK->>Int: getCert(nonceA)
  Int->>API: POST /cert (nonceA + initial JWT)
  API-->>Int: P12 + nonceB
  Int-->>SDK: Cert (P12, nonceB)
  SDK->>Int: getToken(jwt_api)
  Int->>API: POST /token (mTLS)
  API-->>Int: jwt_api
  Int-->>SDK: jwt_api
  SDK->>Int: getConfig / getGroups / getFeatures / getGeofences (mTLS+JWT)
  Int->>API: POST /configs ... (mTLS+JWT)
  API-->>Int: configs, groups, features, geofences
  Int-->>SDK: synchronized data
  SDK->>MQTT: Connect (jwt_mqtt, clientId)
  SDK-->>App: events (SDKSTATE_CHANGED, GEOFENCES_SYNCED, ...)
```

### Offline queue and backoff

- **Offline queue**: stores collections and events when offline; respects `offlineRetentionDays` and `maxBatchSize`.
- **Retry**: policy configures `maxRetries`, `baseDelayMs`, `backoffFactor`.  
  Formula: `delay = baseDelayMs × backoffFactor^(attempt-1)`.
- **Consistency**: each package (`LocatorPackage`) has `id` and `sequence` for idempotency.

### States and modes

- `LocatorState`: `DEFAULT`, `IDLE`, `COLLECTING`, `PAUSED`, `STOPPED`
- `LocatorSdkMode`: `DEFAULT`, `OBSERVED`, `SOS`, `ALERT`

The **mode** adjusts collection and send intervals; the **state** describes the operational stage.

### Networks and connectivity

- `connectivity`: macro (wifi, cellular, bluetooth, ethernet, vpn, none)
- `network`: detailed (wifi6, 4g_lte, 5g_nsa, bt_le, etc.)

### Events and commands

- Events (`LocatorEvent`): system telemetry, errors, state changes.
- Commands (`LocatorCommand`): instructions from backend/app to SDK (e.g., `SET_SDK_MODE`, `SYNC_CONFIG`).

[< Back](../README.md)

