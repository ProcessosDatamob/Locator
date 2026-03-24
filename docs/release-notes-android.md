# Release Notes Android

[< Voltar](en/getting-started/android-setup.md)

## 2.1.0
* Dynamic fences: added behavior to update geofences periodically, configurable time.
* POST_NOTIFICATIONS has been moved to the SDK due to the audio recording functionality after boot.

## 2.0.0
* Remove Permissions from SDK: READ_PHONE_STATE, HIGH_SAMPLING_RATE_SENSORS, WRITE_EXTERNAL_STORAGE and READ_EXTERNAL_STORAGE.
* Sending alerts for sudden movements and falls, along with raw sensor data.
* Audio recording in SOS mode.
* Groups: saving, updating, and subscribing to MQTT topics by IDs.
* Specific treatment for validating permissions to begin collecting location data.
* Changed the minimum SDK value from 26 to 25.
* Adjustments to external library versions.
* SOS notification after device boot.

## 1.1.4
 - Movendo regras de ProGuard/obfuscação para consumer-rules.pro

## 1.1.3
 - Removendo permissões não utilizadas na versão 1 da SDK

## 1.1.2
* Change the osPlatform parameter from Android to android.

## 1.1.1
* Added MQTT Authorization to connect and subscribe.

## 1.1.0
* Fence setup and fence synchronization methods.
* Fence registration in the system.
* Fence entry and exit events.
* Fence re-registration on device boot.
* Command functionality, push command validation, command conversion, processing, and result sending.
* SOS mode entry and exit notification.
* Synchronization of fence configuration and certificate (via command).

## 1.0.0
* SDK configuration.
* SDK mode set methods, SDK state, SDK configuration, integrator registration.
* Get methods for JWT token, session, version, SDK mode, SDK state, SDK configuration.
* Lifecycle methods: start, stop, and destroy.
* Passive and real-time data collection (observable mode).
* Default integrator.
* Certificate management.
* Data encryption.
* Pending permission validation.

[< Voltar](en/getting-started/android-setup.md)
