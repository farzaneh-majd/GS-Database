# 🛰️ CubeSat Ground Station Database

This repository contains the database layer for the CubeSat Ground Station project.

The database is built around **InfluxDB 2.x**, a high-performance time-series database designed for storing telemetry, sensor readings, spacecraft health data, and other mission-related information.

The repository also includes Docker configuration and scripts for generating mock telemetry data during development.

---

# Features

- 📦 InfluxDB 2.x
- 🐳 Docker deployment
- 📊 Time-series telemetry storage
- 🛰️ CubeSat telemetry data model
- 🧪 Mock telemetry generator
- ⚡ Ready for integration with Next.js backend
- 🔄 Designed for real-time telemetry ingestion

---

# Project Structure

```
cubesat-groundstation/

├── scripts/
│   ├── seed-sensors.js
│   └── ...
│
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

---

# Technology Stack

- InfluxDB 2.x
- Docker
- Docker Compose
- Node.js
- JavaScript

---

# Telemetry Packet Format

Incoming packets are expected to follow the structure:

```
[SYNC][LEN][PAYLOAD][CRC]
```

where

```
SYNC
```

Packet synchronization bytes.

```
LEN
```

Payload length.

```
PAYLOAD
```

Telemetry payload.

```
CRC
```

CRC checksum.

The payload is structured as

```
[tlmId][DATA]
```

Example

```
SYNC        AA55
LEN         11
PAYLOAD     2000112233445566778899
CRC         1234
```

---

# Database Structure

## Organization

```
cubesat
```

## Bucket

```
telemetry
```

## Measurement

```
tlm_samples
```

---

# Stored Fields

Current telemetry samples may include

| Field | Description |
|--------|-------------|
| recordId | Unique telemetry identifier |
| satellite | Satellite name |
| sampleType | Telemetry type |
| tlmId | Telemetry ID |
| sync | Packet sync bytes |
| len | Payload length |
| payloadHex | Payload in hexadecimal |
| dataHex | Raw data |
| crc | CRC checksum |
| value | Sensor value |
| x | Magnetometer X |
| y | Magnetometer Y |
| z | Magnetometer Z |
| unit | Measurement unit |
| timestamp | Sample timestamp |

---

# Current Mock Telemetry

The mock generator currently produces

- Battery Voltage
- CPU Temperature
- Magnetometer
- LED State

These values are periodically written into InfluxDB for frontend development and testing.

---

# Getting Started

## Requirements

- Docker
- Docker Compose
- Node.js

---

## Install dependencies

```bash
npm install
```

---

## Start InfluxDB

```bash
docker compose up -d
```

Verify that the container is running

```bash
docker ps
```

---

## Seed Mock Telemetry

```bash
node scripts/seed-sensors.js
```

After execution, the database will contain mock telemetry samples.

---

# Development Workflow

```
Telemetry Generator
        │
        ▼
InfluxDB
        │
        ▼
Next.js Backend
        │
        ▼
Ground Station Dashboard
```

---

# Future Development

The database is intended to support

- Real satellite telemetry
- Telecommand logging
- Packet archive
- Event logging
- Mission timeline
- Housekeeping telemetry
- Payload telemetry
- Multi-satellite support
- Automatic retention policies

---

# Repository Purpose

This repository serves as the telemetry storage backend for the CubeSat Ground Station ecosystem.

The frontend dashboard communicates with this database through a dedicated REST API implemented in the backend project.

---

# License

This project is intended for educational and research purposes related to CubeSat ground segment software.
