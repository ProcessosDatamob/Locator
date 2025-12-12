# Introduction

[< Back](../README.md)

## What is Locator SDK?

The **DATAMOB Locator SDK** is a location and telemetry collection engine for Android and iOS, designed for continuous tracking scenarios with efficient battery usage.

## Key Features

- ✅ **Multi-Channel Integration**: REST API, MQTT, and Secure WebSocket (WSS)
- ✅ **End-to-End Security**: mTLS (mutual TLS) + JWT (JSON Web Tokens)
- ✅ **Offline Queue**: Stores data when connectivity is unavailable
- ✅ **Exponential Backoff**: Intelligent retry for network operations
- ✅ **Public API**: Simple and intuitive `LocatorService` interface
- ✅ **Decoupling**: `LocatorIntegration` interface separates SDK from backend

## Architecture

The SDK is composed of five main layers:

1. **APP** - Your application
2. **Public SDK** - `LocatorService` (main interface)
3. **Integration** - `LocatorIntegration` (implemented by APP)
4. **Internal Core** - Collection, offline queue, retry, events
5. **Transport** - HTTP/mTLS + MQTT + WSS

For more details, see [Architecture](../guides/architecture.md).

## Quick Start

### Android

1. Initialize the SDK in `Application`
2. Configure `LocatorIntegration`
3. Configure `LocatorConfig`
4. Call `start()`

See the complete guide in [Android Setup](android-setup.md).

### iOS

1. Initialize the SDK in `AppDelegate`
2. Configure `LocatorIntegration`
3. Configure `LocatorConfig`
4. Call `start()`

See the complete guide in [iOS Setup](ios-setup.md).

## Next Steps

- 📖 [Architecture Guide](../guides/architecture.md)
- 🔐 [Authentication Guide](../guides/authentication.md)
- 📚 [API Reference](../reference/service.md)

