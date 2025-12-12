# Arquitetura SDK

[< Voltar](../README.md)

A arquitetura do Locator SDK é composta por cinco camadas principais:

1. **APP** (sua aplicação)
2. **SDK público** (`LocatorService`)
3. **Integração** (implementada pelo APP: `LocatorIntegration`)
4. **Core interno** (coleta, fila offline, retry, eventos)
5. **Transporte** (HTTP/MTLS + MQTT + WSS)

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
  Int->>API: POST /cert (nonceA + JWT inicial)
  API-->>Int: P12 + nonceB
  Int-->>SDK: Cert (P12, nonceB)
  SDK->>Int: getToken(jwt_api)
  Int->>API: POST /token (mTLS)
  API-->>Int: jwt_api
  Int-->>SDK: jwt_api
  SDK->>Int: getConfig / getGroups / getFeatures / getGeofences (mTLS+JWT)
  Int->>API: POST /configs ... (mTLS+JWT)
  API-->>Int: configs, groups, features, geofences
  Int-->>SDK: dados sincronizados
  SDK->>MQTT: Connect (jwt_mqtt, clientId)
  SDK-->>App: eventos (SDKSTATE_CHANGED, GEOFENCES_SYNCED, ...)
```

### Fila offline e backoff

- **Fila offline**: armazena coletagens e eventos quando sem rede; respeita `offlineRetentionDays` e `maxBatchSize`.
- **Retry**: política configura `maxRetries`, `baseDelayMs`, `backoffFactor`.  
  Fórmula: `delay = baseDelayMs × backoffFactor^(tentativa-1)`.
- **Consistência**: cada pacote (`LocatorPackage`) tem `id` e `sequence` para idempotência.

### Estados e modos

- `LocatorState`: `DEFAULT`, `IDLE`, `COLLECTING`, `PAUSED`, `STOPPED`
- `LocatorSdkMode`: `DEFAULT`, `OBSERVED`, `SOS`, `ALERT`

O **modo** ajusta intervalos de coleta e envio; o **estado** descreve o estágio operacional.

### Redes e conectividade

- `connectivity`: macro (wifi, cellular, bluetooth, ethernet, vpn, none)
- `network`: detalhado (wifi6, 4g_lte, 5g_nsa, bt_le, etc.)

### Eventos e comandos

- Eventos (`LocatorEvent`): telemetria de sistema, erros, mudanças de estado.
- Comandos (`LocatorCommand`): instruções do backend/app para o SDK (ex.: `SET_SDK_MODE`, `SYNC_CONFIG`).

[< Voltar](../README.md)
