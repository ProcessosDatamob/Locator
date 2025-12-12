# Download de Certificado

[< Voltar](../README.md)

Este documento descreve, de forma clara e objetiva, como o processo de criação da senha do certificado cliente (P12) funciona no SDK de localização.

---

# 1. Entrada enviada pelo SDK

Antes de solicitar o certificado P12, o SDK gera localmente um valor aleatório:

```
nonce_app
```

Esse valor é enviado no corpo da requisição:

```json
{
  "id": "req_7b31e0c4f8c9431db99a8c87e990abcd",
  "license": "LIC-1234567890",
  "sessionId": "SESSION-55667788",
  "sdkVersion": "2.0.1",
  "osPlatform": "android",
  "timestamp": 1710087513123,
  "data": {
    "nonce": "c3a19e28fdb745cd88b31e109f01d2a7"
  }
}
```

### Valores usados na senha:

| Campo          | Descrição                                  |
| -------------- | ------------------------------------------ |
| **nonce_app**  | Gerado pelo SDK a cada solicitação         |
| **license**    | Identificador único do dispositivo/usuário |
| **sessionId**  | ID da sessão ativa do SDK                  |
| **sdkVersion** | Versão atual do SDK                        |
| **osPlatform** | Plataforma (`android`/`ios`)               |
| **timestamp**  | Timestamp do momento da requisição         |

---

# 2. Retorno da API (com nonce gerado no servidor)

Ao receber o `nonce_app`, a API gera um valor aleatório próprio:

```
nonce_server
```

E responde:

```json
{
  "id": "resp_9f2c1c7a4e5b42caa1e1dbe8fab12345",
  "requestId": "req_7b31e0c4f8c9431db99a8c87e990abcd",
  "timestamp": 1710091113123,
  "data": {
    "p12Base64": "MIIK...BASE64_DO_CERTIFICADO...AB",
    "nonce": "48d1e93c85e442ba8f86fb91c96fd28b",
    "expiresAt": 1712693113123
  }
}
```

Esse `nonce_server` serve como **a segunda parte necessária** para gerar a senha do arquivo P12.

---

# 3. Construção da senha do certificado P12

A senha **NÃO É transmitida**, nem enviada pelo servidor.

A senha é derivada **exclusivamente dentro do dispositivo**, combinando:

- `nonce_app`
- `nonce_server`
- `license`
- `sdkVersion`
- `osPlatform`
- `sessionId`
- `timestamp`

Todos esses valores são concatenados e utilizados como insumo para o algoritmo de deriva de chave (exemplo conceitual):

```
password_input =
    nonce_app +
    nonce_server +
    license +
    sdkVersion +
    osPlatform +
    sessionId +
    timestamp
```

A senha resulta de:

```
password = PBKDF2(
    SHA-256(password_input),
    salt = nonce_app + nonce_server,
    iterations = 20000,
    keyLength = 32
)
```

> **Observação importante:**
> Acima é apenas a _representação conceitual_ do processo.
> Não expomos detalhes exatos de implementação para evitar engenharia reversa do SDK.

---

# 4. Por que esse método é seguro?

### ✔ O servidor **não consegue gerar a senha sozinho**

Porque depende do `nonce_app`, gerado exclusivamente no dispositivo.

### ✔ O SDK **não consegue gerar a senha sem o servidor**

Porque o algoritmo depende também do `nonce_server`.

### ✔ Cada certificado gerado tem uma senha totalmente distinta

Mesmo que seja:

- o mesmo usuário
- no mesmo device
- na mesma licença

O nonce muda, e o `timestamp` também muda.

### ✔ A senha envolve informações únicas e contextuais:

- A **licença** (uma identidade do dispositivo/usuário)
- O **sistema operacional**
- A **versão do SDK**
- A **sessão** atual
- O **timestamp** enviado na requisição

Isso garante que a senha seja:

- não reutilizável
- impossível de prever
- impossível de reproduzir externamente

---

# 5. O que trafega pela rede?

Apenas:

- nonce_app (cliente → servidor)
- nonce_server (servidor → cliente)
- parâmetros públicos da requisição

**A senha nunca trafega pela rede.**

---
