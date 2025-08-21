import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { proxyMJPEG } from "./mjpeg-proxy.js";
import { MqttBridge } from "./mqtt-bridge.js";
import { startSignaling } from "./signaling.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));
app.get("/video/mjpeg", proxyMJPEG);

const httpServer = createServer(app);
startSignaling(httpServer);     // WS p/ comandos
MqttBridge.init(httpServer);    // MQTT <-> WS telemetria

const port = process.env.PORT || 8080;
httpServer.listen(port, () => console.log(`Server on :${port}`));