import { Server as HttpServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { MqttBridge } from "./mqtt-bridge.js";

type Client = WebSocket & { id?: string };

export function startSignaling(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: "/signal" });

  wss.on("connection", (ws: Client) => {
    ws.on("message", (buf: Buffer) => {
      try {
        const msg = JSON.parse(buf.toString());

        // Mantemos compat: se vier {type:"signal",...} apenas ignore
        if (msg.type === "cmd" && msg.deviceId && msg.body) {
          MqttBridge.publishCommand(msg.deviceId, msg.body);
        }
      } catch (e) {
        console.warn("WS parse error:", e);
      }
    });
  });
}