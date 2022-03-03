// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const { InfluxDB } = require("@influxdata/influxdb-client");
  const token =
    "wsCGjok61f5UJGKmY3YYL2b3rNnyg69deuhQ5hDXQNIYyi19RM6RCP4gctAV8b51Kk6ptwgy9zoGeK3R6K7N1w==";
  const org = "lucasvbt@trt3.jus.br";
  const bucket = "lucasvbt's Bucket";
  const client = new InfluxDB({
    url: "https://us-east-1-1.aws.cloud2.influxdata.com",
    token: token,
  });
  const topico = req.query.topic;
  const medida = req.query.medida;
  const queryApi = client.getQueryApi(org);
  const listaItens = [];
  const query = `from(bucket: "${bucket}")
                 |> range(start: -24h)
                 |> filter(fn: (r) => r["topic"] == "${topico}")
                 |> filter(fn: (r) => r["_measurement"] == "${medida}")
                 |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
                 |> yield(name: "mean")`;
  queryApi.queryRows(query, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      listaItens.push({ topico: o.topic, medida: o._measurement, time: o._time, field: o._field, valor: o._value });
    },
    error(error) {
      console.error(error);
      console.log("Finished ERROR");
      res.status(500);
    },
    complete() {
      res
        .status(200)
        .json(
          JSON.stringify(
            listaItens
          )
        );
    },
  });
}
