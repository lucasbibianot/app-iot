export default async function handler(req, res) {
  const { method, body } = req;
  switch (method) {
    case 'POST':
      const mqtt = require('async-mqtt');

      const options = {
        host: process.env.HOST_MQTT,
        port: process.env.PORT_MQTT,
        protocol: process.env.PROTOCOL_MQTT,
        username: process.env.USER_MQTT,
        password: process.env.PASS_MQTT,
        clientId: process.env.CLIENT_ID_MQTT,
      };
      const client = mqtt.connect(options);

      client.on('connect', function () {
        console.log('Connected');
      });
      client.on('error', function (error) {
        res.status(200).json({ msg: 'error' });
      });
      client.on('message', function (topic, message) {
        console.log('Received message:', topic, message.toString());
      });
      await client.publish(body.topico, JSON.stringify(body.msg));
      client.end();
      res.status(200).end();
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
