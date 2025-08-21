import { Request, Response } from "express";
import fetch from "node-fetch";

export async function proxyMJPEG(req: Request, res: Response) {
  const url = process.env.ESP_MJPEG_URL; // ex.: http://<esp-ip>/stream
  if (!url) return res.status(500).send("ESP_MJPEG_URL not set");
  const r = await fetch(url);
  res.setHeader("Content-Type", r.headers.get("content-type") || "multipart/x-mixed-replace");
  r.body?.pipe(res);
}