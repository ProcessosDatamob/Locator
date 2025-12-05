# 📘 **Integrações de API**

[< Voltar](toc.md)

_A Interface de Comunicação com APIs Externas – Usada Somente pelo SDK_

Esta documentação segue o mesmo padrão profissional da Google/Apple, incluindo:

- Função
- Parâmetros
- Regras de segurança (MTLS, JWT, TTL, erros)
- Fluxos completos
- Exemplos em **TypeScript, Kotlin e Swift**
- Diagramas de sequência
- Comportamento esperado do APP e do servidor

---

# 📘 **3. LocatorIntegration – Visão Geral**

`LocatorIntegration` é a **interface obrigatória** que o APP deve implementar para permitir que o SDK comunique-se com os endpoints protegidos da API Locator.

⚠️ **Importante:**
O SDK nunca acessa servidores diretamente sem passar pela implementação fornecida pelo APP. Isso permite:

- abstrair rede / auth / stack HTTP
- evolução do backend sem alterar o SDK
- controle de erros
- logging e telemetria aplicados pelo próprio app

---

# 📐 **3.1 Responsabilidades do `LocatorIntegration`**

| Responsabilidade            | Descrição                                         |
| --------------------------- | ------------------------------------------------- |
| Obter certificado mTLS      | Necessário para comunicação segura com API + MQTT |
| Obter tokens JWT            | Necessário para API, MQTT e WSS                   |
| Sincronizar dados remotos   | Config, grupos, geofences, scopes, features       |
| Garantir autenticação forte | MTLS obrigatório após certificado baixado         |
| Retornar erros detalhados   | SDK depende disso para tomada de decisão          |

---

# 🔒 **3.2 Segurança**

### ✔ Certificado mTLS

- [Detalhamento do processo de download de certificado](donwload-cert.md)

Chamado somente via:

```
getCert()
```

- SDK envia um `nonce`
- API retorna outro `nonce` + P12
- SDK deriva a senha do P12 combinando ambos

### ✔ JWT

Chamado via:

```
getToken()

```

Tipos de tokens:

| Tipo       | Uso                         |
| ---------- | --------------------------- |
| `jwt_api`  | Chamadas HTTP               |
| `jwt_mqtt` | Conexão MQTT                |
| `jwt_wss`  | Conexão WebSocket sobre TLS |

### ✔ Todas as demais chamadas exigem:

- Certificado mTLS **válido**
- JWT do tipo API

---

# 📘 **3.3 Interface completa**

```ts
export interface LocatorIntegration {
  getCert(payload: LocatorRequestApiCert): Promise<LocatorResponseApiCert>;
  getToken(payload: LocatorRequestApiToken): Promise<LocatorResponseApiToken>;
  getScopes(
    payload: LocatorRequestApiScopes
  ): Promise<LocatorResponseApiScopes>;
  getFeatures(
    payload: LocatorRequestApiFeatures
  ): Promise<LocatorResponseApiFeatures>;
  getConfig(
    payload: LocatorRequestApiConfig
  ): Promise<LocatorResponseApiConfig>;
  getGroups(
    payload: LocatorRequestApiGroups
  ): Promise<LocatorResponseApiGroups>;
  getGeofences(
    payload: LocatorRequestApiGeofenses
  ): Promise<LocatorResponseApiGeofenses>;
}
```

# 🟩 **Kotlin (Android)**
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

# 🟧 **Swift (iOS)**
```swift
protocol LocatorIntegration {
    func getCert(payload: LocatorRequestApiCert) async throws -> LocatorResponseApiCert
    func getToken(payload: LocatorRequestApiToken) async throws -> LocatorResponseApiToken
    func getScopes(payload: LocatorRequestApiScopes) async throws -> LocatorResponseApiScopes
    func getFeatures(payload: LocatorRequestApiFeatures) async throws -> LocatorResponseApiFeatures
    func getConfig(payload: LocatorRequestApiConfig) async throws -> LocatorResponseApiConfig
    func getGroups(payload: LocatorRequestApiGroups) async throws -> LocatorResponseApiGroups
    func getGeofences(payload: LocatorRequestApiGeofences) async throws -> LocatorResponseApiGeofences
}
```

---

# 🚀 **3.4 Métodos (Documentação Completa)**

A seguir, cada método documentado com:

- descrição
- regras de negócio
- erros possíveis
- fluxos
- exemplos (TS / Kotlin / Swift)

---

# 🟦 **3.4.1 `getCert()`**

### ✔ Função

Solicita o **certificado mTLS** para este dispositivo.

### ✔ Assinatura

```ts
getCert(payload: LocatorRequestApiCert): Promise<LocatorResponseApiCert>;
```

### ✔ Parâmetros

| Campo   | Tipo   | Obrigatório | Descrição                                                |
| ------- | ------ | ----------- | -------------------------------------------------------- |
| `nonce` | string | ✔           | Nonce gerado pelo SDK para compor a senha do certificado |

### ✔ Retorno

| Campo       | Tipo   | Descrição                                 |
| ----------- | ------ | ----------------------------------------- |
| `p12Base64` | string | Certificado P12 criptografado             |
| `nonce`     | string | Segundo nonce usado na derivação da senha |
| `expiresAt` | number | Epoch de expiração do certificado         |

### ✔ Regras de Segurança

- Não requer mTLS (é o único endpoint que não requer)
- Requer **JWT_API** inicial fornecido pelo APP
- API deve ter rate-limit forte
- SDK não repete chamadas sem backoff

### ✔ Fluxo de execução (diagrama)

```
SDK → APP (LocatorIntegration.getCert)
APP → API (HTTP POST)
API → APP (P12 + nonceB)
APP → SDK (response)
SDK: derive password (nonceA + nonceB)
SDK: salva P12 no Keychain/SecureStorage
```

### ✔ Erros possíveis

| Código            | Condição               |
| ----------------- | ---------------------- |
| `auth_invalid`    | token inicial inválido |
| `rate_limit`      | excesso de tentativas  |
| `network_timeout` | instabilidade          |
| `exception`       | erro interno           |
| `unknown`         | fallback               |

---

# 🟦 **3.4.2 `getToken()`**

### ✔ Função

Obtém um token JWT baseado no tipo solicitado:

- `jwt_api`
- `jwt_mqtt`
- `jwt_wss`

### ✔ Assinatura

```ts
getToken(payload: LocatorRequestApiToken): Promise<LocatorResponseApiToken>;
```

### ✔ Parâmetros

| Campo    | Tipo               | Obrigatório | Descrição                   |
| -------- | ------------------ | ----------- | --------------------------- |
| `type`   | `LocatorTokenType` | ✔           | Tipo do token desejado      |
| `scopes` | string[]           | opcional    | Scopes adicionais para RBAC |

### ✔ Regras de Segurança

- Requer **mTLS** (certificado válido)
- Requer **JWT_API** existente (token anterior)

### ✔ Erros

Mesmos erros de rede / auth de qualquer rota protegida.

---

# 🟦 **3.4.3 `getScopes()`**

Sincroniza **todas as permissões habilitadas para o usuário**.

### ✔ Assinatura

```ts
getScopes(payload: LocatorRequestApiScopes): Promise<LocatorResponseApiScopes>;
```

### ✔ Regras

- Requer mTLS + JWT_API
- Deve retornar **lista completa**, não delta
- Controlado por `revision`

---

# 🟦 **3.4.4 `getFeatures()`**

Recupera todas as features habilitadas.

```ts
getFeatures(payload: LocatorRequestApiFeatures): Promise<LocatorResponseApiFeatures>;
```

Observações importantes:

- Features podem depender de scopes
- Uma feature sem `scopes` é pública
- API deve retornar somente features liberadas

---

# 🟦 **3.4.5 `getConfig()`**

Obtém a **configuração principal** do SDK.

```ts
getConfig(payload: LocatorRequestApiConfig): Promise<LocatorResponseApiConfig>;
```

### Inclui:

- intervalos de coleta
- regras de bateria
- retry policy
- URLs
- enable/disable de features

---

# 🟦 **3.4.6 `getGroups()`**

Obtém todos os grupos associados ao usuário:

```ts
getGroups(payload: LocatorRequestApiGroups): Promise<LocatorResponseApiGroups>;
```

### Observações

- Um grupo que desaparece deve ser removido do SDK
- `admin[]` controla recursos avançados
- `all[]` controla visibilidade

---

# 🟦 **3.4.7 `getGeofences()`**

Retorna lista completa de cercas.

```ts
getGeofences(payload: LocatorRequestApiGeofenses): Promise<LocatorResponseApiGeofenses>;
```

### Regras

- Deve retornar **todas** as geofences
- SDK ativa somente as dos grupos presentes em `LocatorGroups`
- Se chegar geofence de grupo desconhecido → SDK força `syncGroups()`

---

# 🖥️ **3.5 Exemplos Completos**

---

# 🔷 **TypeScript** (React Native / Capacitor / Web)

```ts
export class LocatorIntegrationImpl implements LocatorIntegration {
  private http = axios.create({
    timeout: 8000,
  });

  async getCert(payload: LocatorRequestApiCert) {
    const r = await this.http.post("/cert", payload, {
      headers: {
        Authorization: `Bearer ${this.initialJwt}`,
      },
    });
    return r.data;
  }

  async getToken(payload: LocatorRequestApiToken) {
    return (await this.http.post("/token", payload)).data;
  }

  async getScopes(p: LocatorRequestApiScopes) {
    return (await this.http.post("/scopes", p)).data;
  }

  async getFeatures(p: LocatorRequestApiFeatures) {
    return (await this.http.post("/features", p)).data;
  }

  async getConfig(p: LocatorRequestApiConfig) {
    return (await this.http.post("/config", p)).data;
  }

  async getGroups(p: LocatorRequestApiGroups) {
    return (await this.http.post("/groups", p)).data;
  }

  async getGeofences(p: LocatorRequestApiGeofenses) {
    return (await this.http.post("/geofences", p)).data;
  }
}
```

---

# 🟩 **Kotlin (Android)**

```kotlin
class LocatorIntegrationImpl(
    private val client: OkHttpClient
) : LocatorIntegration {

    override suspend fun getCert(
        payload: LocatorRequestApiCert
    ): LocatorResponseApiCert {
        return post("/cert", payload)
    }

    override suspend fun getToken(
        payload: LocatorRequestApiToken
    ): LocatorResponseApiToken {
        return post("/token", payload)
    }

    override suspend fun getScopes(
        payload: LocatorRequestApiScopes
    ): LocatorResponseApiScopes {
        return post("/scopes", payload)
    }

    override suspend fun getFeatures(
        payload: LocatorRequestApiFeatures
    ): LocatorResponseApiFeatures {
        return post("/features", payload)
    }

    override suspend fun getConfig(
        payload: LocatorRequestApiConfig
    ): LocatorResponseApiConfig {
        return post("/config", payload)
    }

    override suspend fun getGroups(
        payload: LocatorRequestApiGroups
    ): LocatorResponseApiGroups {
        return post("/groups", payload)
    }

    override suspend fun getGeofences(
        payload: LocatorRequestApiGeofenses
    ): LocatorResponseApiGeofenses {
        return post("/geofences", payload)
    }

    private inline fun <reified T> post(
        path: String,
        body: Any
    ): T {
        val req = Request.Builder()
            .url(BASE_URL + path)
            .post(json(body))
            .build()

        client.newCall(req).execute().use { res ->
            return parse(res.body!!.string())
        }
    }
}
```

---

# 🟧 **Swift (iOS)**

```swift
class LocatorIntegrationImpl: LocatorIntegration {

    func getCert(
        _ payload: LocatorRequestApiCert
    ) async throws -> LocatorResponseApiCert {
        try await post("/cert", payload)
    }

    func getToken(
        _ payload: LocatorRequestApiToken
    ) async throws -> LocatorResponseApiToken {
        try await post("/token", payload)
    }

    func getScopes(
        _ payload: LocatorRequestApiScopes
    ) async throws -> LocatorResponseApiScopes {
        try await post("/scopes", payload)
    }

    func getFeatures(
        _ payload: LocatorRequestApiFeatures
    ) async throws -> LocatorResponseApiFeatures {
        try await post("/features", payload)
    }

    func getConfig(
        _ payload: LocatorRequestApiConfig
    ) async throws -> LocatorResponseApiConfig {
        try await post("/config", payload)
    }

    func getGroups(
        _ payload: LocatorRequestApiGroups
    ) async throws -> LocatorResponseApiGroups {
        try await post("/groups", payload)
    }

    func getGeofences(
        _ payload: LocatorRequestApiGeofenses
    ) async throws -> LocatorResponseApiGeofenses {
        try await post("/geofences", payload)
    }

    private func post<T: Decodable>(
        _ path: String,
        _ payload: Encodable
    ) async throws -> T {
        var req = URLRequest(url: URL(string: BASE_URL + path)!)
        req.httpMethod = "POST"
        req.httpBody = try JSONEncoder().encode(payload)
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let (data, _) = try await URLSession.shared.data(for: req)
        return try JSONDecoder().decode(T.self, from: data)
    }
}
```

[< Voltar](toc.md)
