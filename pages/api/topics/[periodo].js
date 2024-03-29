// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const {
    query: { periodo },
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
        const listTopicos = [];
        const query = `from(bucket: "${bucket}")
                        |> range(start: -${periodo})
                        |> filter(fn: (r) => exists r["topic"])
                        |> aggregateWindow(every: ${periodo}, fn: last)
                        |> last()
                        |> group(columns: ["topic"])
                        |> sort(columns: ["topic"])`;
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            listTopicos.push({ topic: o.topic });
          },
          error(error) {
            console.error(error);
            console.log('Finished ERROR');
            resolve();
            res.status(500).end();
          },
          complete() {
            resolve();
            res
              .status(200)
              .json(
                JSON.stringify(
                  listTopicos.map((item) => item.topic).filter((item, pos, self) => self.indexOf(item) === pos)
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
