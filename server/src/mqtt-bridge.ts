import { Server as HttpServer } from "http";
import mqtt from "mqtt";
import { WebSocketServer } from "ws";

export class MqttBridge {
  static wss: WebSocketServer;
  static client: mqtt.MqttClient;

  static init(server: HttpServer) {
    const url = process.env.MQTT_URL || "wss://broker.hivemq.com:8884/mqtt";
    this.client = mqtt.connect(url);
    const base = process.env.MQTT_TOPIC_BASE || "hydrobot";

    this.client.on("connect", () => {
      this.client.subscribe(`${base}/+/telemetry`);
      this.client.subscribe(`${base}/+/events`);
    });

    this.wss = new WebSocketServer({ server, path: "/ws/telemetry" });
    const broadcast = (msg: any) =>
      this.wss.clients.forEach((c: any) => c.readyState === 1 && c.send(msg));

    this.client.on("message", (_topic, payload) => {
      broadcast(payload.toString());
    });
  }

  static publishCommand(deviceId: string, body: any) {
    const base = process.env.MQTT_TOPIC_BASE || "hydrobot";
    this.client.publish(`${base}/${deviceId}/cmd`, JSON.stringify(body));
  }
}