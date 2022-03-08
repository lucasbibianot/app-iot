// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const {
    query: { periodo, topico, medida, ultimo},
    method,
  } = req;

  switch (method) {
    case "GET":
      const { InfluxDB } = require("@influxdata/influxdb-client");
      const token = process.env.TOKEN_INFLUX;
      const org = process.env.ORG_INFLUX;
      const bucket = process.env.BUCKET_INFLUX;
      const client = new InfluxDB({
        url: process.env.URL_INFLUX,
        token: token,
      });
      const queryApi = client.getQueryApi(org);
      const listaItens = [];
      const query = `from(bucket: "${bucket}")
                     |> range(start: -${periodo})
                     |> filter(fn: (r) => r["topic"] == "${topico}")
                     |> filter(fn: (r) => r["_measurement"] == "${medida}")
                     |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
                     |> ${ultimo  ? "yield(name: \"mean\")" : "last()"}`;
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          listaItens.push({
            topico: o.topic,
            medida: o._measurement,
            time: o._time,
            field: o._field,
            topic_subscribe: o.topic_subscribe,
            valor: o._value,
          });
        },
        error(error) {
          console.error(error);
          console.log("Finished ERROR");
          res.status(500);
        },
        complete() {
          res.status(200).json(JSON.stringify(listaItens));
        },
      });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
