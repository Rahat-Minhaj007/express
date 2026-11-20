import type { NextFunction, Request, Response } from "express";
import fs from "fs";
import geoip from "geoip-lite";

const getClientIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  let ip =
    (typeof forwarded === "string"
      ? forwarded?.split(",")[0]?.trim()
      : undefined) ||
    req.ip ||
    req.socket.remoteAddress ||
    "unknown";

  // Convert IPv6-mapped IPv4 (::ffff:1.2.3.4) to plain IPv4
  if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");
  // Localhost
  if (ip === "::1") ip = "127.0.0.1";

  return ip;
};
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req);
  const geo = geoip.lookup(ip); // null for localhost/private IPs

  const location = geo
    ? `${geo.city || "Unknown city"}, ${geo.region || "-"}, ${geo.country}`
    : "Unknown (local/private IP)";

  const log =
    `\nMETHOD: ${req.method} | URL: ${req.originalUrl} | IP: ${ip} | LOCATION: ${location}` +
    ` | UA: ${req.headers["user-agent"] || "-"} | TIME: ${new Date().toISOString()}\n`;

  fs.appendFile("logger.log", log, (err) => {
    if (err) console.error("Log write failed:", err); // only log on error
  });

  next();
};

export default loggerMiddleware;
