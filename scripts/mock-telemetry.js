const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const token =
  "N9znpGZdbw_9Ze9g2N57dptnqvf2jtemWzbN3Znl-JBaX6EUD0pK02vrHY2qDY5Rq4HSnlCogvLTa1zl7u9sag==";

const org = "SUT";
const bucket = "GS";

const client = new InfluxDB({
  url: "http://localhost:8086",
  token: token,
});

const writeApi = client.getWriteApi(org, bucket);

function generateTelemetry() {
  const point = new Point("satellite_metrics")

    .tag("satellite", "cubesat-1")

    .floatField("battery_voltage", 7 + Math.random())

    .floatField("battery_current", 1 + Math.random())

    .floatField("cpu_temp", 30 + Math.random() * 20)

    .floatField("signal_strength", -70 + Math.random() * 10);

  writeApi.writePoint(point);

  console.log("Telemetry Sent");
}

setInterval(generateTelemetry, 1000);
