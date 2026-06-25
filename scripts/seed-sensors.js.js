require('dotenv').config()

const { InfluxDB, Point } = require('@influxdata/influxdb-client')

const token =
  "N9znpGZdbw_9Ze9g2N57dptnqvf2jtemWzbN3Znl-JBaX6EUD0pK02vrHY2qDY5Rq4HSnlCogvLTa1zl7u9sag==";

const org = "SUT";
const bucket = "GS";

const client = new InfluxDB({
  url: "http://localhost:8086",
  token: token,
});

const writeApi = client.getWriteApi(org, bucket);

function crc16(hex) {
  let crc = 0xffff

  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16)
    crc ^= byte << 8

    for (let bit = 0; bit < 8; bit++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }

      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function writeSample({
  recordId,
  satellite,
  sampleType,
  tlmId,
  dataHex,
  value,
  x,
  y,
  z,
  unit,
  timestamp,
}) {
  const sync = 'AA55'
  const payloadHex = `${tlmId}${dataHex}`
  const len = payloadHex.length / 2
  const crc = crc16(payloadHex)

  const point = new Point('tlm_samples')
    .tag('recordId', recordId)
    .tag('satellite', satellite)
    .tag('sampleType', sampleType)
    .tag('tlmId', tlmId)
    .stringField('sync', sync)
    .intField('len', len)
    .stringField('payloadHex', payloadHex)
    .stringField('dataHex', dataHex)
    .stringField('crc', crc)
    .stringField('unit', unit)
    .timestamp(timestamp)

  if (value !== undefined) point.floatField('value', value)
  if (x !== undefined) point.floatField('x', x)
  if (y !== undefined) point.floatField('y', y)
  if (z !== undefined) point.floatField('z', z)

  writeApi.writePoint(point)
}

async function main() {
  const now = Date.now()

  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(now - (20 - i) * 1000)

    writeSample({
      recordId: `battery-${i}`,
      satellite: 'cubesat-1',
      sampleType: 'battery',
      tlmId: '10',
      dataHex: '0A2B',
      value: 7.4 + Math.random() * 0.4,
      unit: 'V',
      timestamp,
    })

    writeSample({
      recordId: `temperature-${i}`,
      satellite: 'cubesat-1',
      sampleType: 'temperature',
      tlmId: '11',
      dataHex: '1C2D',
      value: 30 + Math.random() * 15,
      unit: 'C',
      timestamp,
    })

    writeSample({
      recordId: `magnetometer-${i}`,
      satellite: 'cubesat-1',
      sampleType: 'magnetometer',
      tlmId: '20',
      dataHex: '00112233445566778899',
      x: -20 + Math.random() * 40,
      y: -20 + Math.random() * 40,
      z: -20 + Math.random() * 40,
      unit: 'uT',
      timestamp,
    })

    writeSample({
      recordId: `led-${i}`,
      satellite: 'cubesat-1',
      sampleType: 'led',
      tlmId: '30',
      dataHex: i % 2 === 0 ? '01' : '00',
      value: i % 2 === 0 ? 1 : 0,
      unit: 'state',
      timestamp,
    })
  }

  await writeApi.close()

  console.log('Mock CubeSat sensor data inserted into InfluxDB')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})