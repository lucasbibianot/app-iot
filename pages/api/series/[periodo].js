// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const {
    query: { periodo, topico, medida, ultimo, timeseries },
    method,
  } = req;
  return new Promise((resolve, reject) => {
    switch (method) {
      case 'GET':
        const { InfluxDB } = require('@influxdata/influxdb-client');
        const token = process.env.TOKEN_INFLUX;
        const org = process.env.ORG_INFLUX;
        const bucket = process.env.BUCKET_INFLUX;
        const client = new InfluxDB({
          url: process.env.URL_INFLUX,
          token: token,
        });
        const queryApi = client.getQueryApi(org);
        const agora = new Date().getTime();
        const threshouldOnline = 30000;
        const listaItens = [];
        const query = `from(bucket: "${bucket}")
                     |> range(start: -${periodo})
                     |> filter(fn: (r) => r["topic"] == "${topico}")
                     ${medida !== undefined ? '|> filter(fn: (r) => r["_measurement"] == "' + medida + '")' : ''}
                     |> ${
                       ultimo ? 'aggregateWindow(every: ' + periodo + ', fn: last) |> last()' : 'yield(name: "mean")'
                     }
                     ${!timeseries ? '|> sort(columns: ["topic", "_measurement"])' : ''}`;
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            const timeInMilli = new Date(o._time).getTime();
            if (timeseries === undefined) {
              listaItens.push({
                topico: o.topic,
                medida: o._measurement,
                time: o._time,
                field: o._field,
                topic_subscribe: o.topic_subscribe,
                valor: o._value,
                online: agora - timeInMilli <= threshouldOnline,
              });
            } else {
              listaItens.push([timeInMilli, o._value]);
            }
          },
          error(error) {
            console.error(error);
            console.log('Finished ERROR');
            resolve();
            res.status(500).end();
          },
          complete() {
            resolve();
            res.status(200).json(
              JSON.stringify(
                timeseries === undefined
                  ? listaItens
                  : {
                      name: medida,
                      columns: ['time', medida],
                      points: listaItens,
                    }
              )
            );
          },
        });
        break;
      default:
        res.setHeader('Allow', ['GET']);
        resolve();
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  });
}
