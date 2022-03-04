export default function handler(req, res) {
  const {
    query: { id, name },
    method,
  } = req;

  switch (method) {
    case "POST":
      const mqtt = require("async-mqtt");

      const options = {
        host: process.env.HOST_MQTT,
        port: process.env.PORT_MQTT,
        protocol: process.env.PROTOCOL_MQTT,
        username: process.env.USER_MQTT,
        password: process.env.PASS_MQTT,
      };
      const client = mqtt.connect(options);

      const topico = req.query.topic;
      const msg = req.query.msg;

      client.on("connect", function () {
        console.log("Connected");
      });
      client.on("error", function (error) {
        res.status(200).json({ msg: "error" });
      });
      client.on("message", function (topic, message) {
        console.log("Received message:", topic, message.toString());
      });

      client.publish(topico, msg);
      res.status(200).json({ id, name: `User ${id}` });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
