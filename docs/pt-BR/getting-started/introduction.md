# Introdução

[< Voltar](../README.md)

## O que é o Locator SDK?

O **DATAMOB Locator SDK** é um motor de coleta de localização e telemetria para Android e iOS, projetado para cenários de rastreamento contínuo com uso eficiente de bateria.

## Características Principais

- ✅ **Integração Multi-Canal**: API REST, MQTT e WebSocket Seguro (WSS)
- ✅ **Segurança Ponta a Ponta**: mTLS (mutual TLS) + JWT (JSON Web Tokens)
- ✅ **Fila Offline**: Armazena dados quando sem conectividade
- ✅ **Backoff Exponencial**: Retry inteligente para operações de rede
- ✅ **API Pública**: Interface `LocatorService` simples e intuitiva
- ✅ **Desacoplamento**: Interface `LocatorIntegration` separa SDK do backend

## Arquitetura

O SDK é composto por cinco camadas principais:

1. **APP** - Sua aplicação
2. **SDK Público** - `LocatorService` (interface principal)
3. **Integração** - `LocatorIntegration` (implementada pelo APP)
4. **Core Interno** - Coleta, fila offline, retry, eventos
5. **Transporte** - HTTP/mTLS + MQTT + WSS

Para mais detalhes, consulte [Arquitetura](../guides/architecture.md).

## Início Rápido

### Android

1. Inicialize o SDK no `Application`
2. Configure o `LocatorIntegration`
3. Configure o `LocatorConfig`
4. Chame `start()`

Veja o guia completo em [Configuração Android](android-setup.md).

### iOS

1. Inicialize o SDK no `AppDelegate`
2. Configure o `LocatorIntegration`
3. Configure o `LocatorConfig`
4. Chame `start()`

Veja o guia completo em [Configuração iOS](ios-setup.md).

## Próximos Passos

- 📖 [Guia de Arquitetura](../guides/architecture.md)
- 🔐 [Guia de Autenticação](../guides/authentication.md)
- 📚 [Referência da API](../reference/service.md)

