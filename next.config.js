/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    URL: process.env.URL,
    TOKEN_INFLUX: process.env.TOKEN_INFLUX,
    ORG_INFLUX: process.env.ORG_INFLUX,
    BUCKET_INFLUX: process.env.BUCKET_INFLUX,
    URL_INFLUX: process.env.URL_INFLUX,
    HOST_MQTT: process.env.HOST_MQTT,
    PORT_MQTT: process.env.PORT_MQTT,
    PROTOCOL_MQTT: process.env.PROTOCOL_MQTT,
    USER_MQTT: process.env.USER_MQTT,
    PASS_MQTT: process.env.PASS_MQTT,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    CLIENT_ID_MQTT: process.env.CLIENT_ID_MQTT
  },
};
module.exports = nextConfig;
