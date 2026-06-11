import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "editor-config.json");
const assetsDir = path.join(__dirname, "assets");
const port = Number(process.env.PORT || 4312);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

await fs.mkdir(assetsDir, { recursive: true });

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function json(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload, null, 2));
}

function sanitizeName(input) {
  return input.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
}

async function handleConfigGet(res) {
  try {
    const contents = await fs.readFile(configPath, "utf8");
    json(res, 200, JSON.parse(contents));
  } catch {
    json(res, 200, { version: 1, sections: {}, diagrams: {} });
  }
}

async function handleConfigPost(req, res) {
  try {
    const body = await readBody(req);
    const payload = JSON.parse(body);
    await fs.writeFile(configPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    json(res, 200, { ok: true, path: path.basename(configPath) });
  } catch (error) {
    json(res, 500, { ok: false, error: String(error) });
  }
}

async function handleUploadPost(req, res) {
  try {
    const body = await readBody(req);
    const payload = JSON.parse(body);
    const { sectionKey, originalName, dataUrl } = payload;

    if (!sectionKey || !originalName || !dataUrl) {
      json(res, 400, { ok: false, error: "Missing upload payload" });
      return;
    }

    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      json(res, 400, { ok: false, error: "Invalid data URL" });
      return;
    }

    const ext = path.extname(originalName) || ".png";
    const fileName = `${sanitizeName(sectionKey)}-${Date.now()}${ext}`;
    const filePath = path.join(assetsDir, fileName);
    await fs.writeFile(filePath, Buffer.from(match[2], "base64"));
    json(res, 200, { ok: true, path: `assets/${fileName}` });
  } catch (error) {
    json(res, 500, { ok: false, error: String(error) });
  }
}

async function serveStatic(reqPath, res) {
  const safePath = reqPath === "/" ? "/index.html" : reqPath;
  const filePath = path.join(__dirname, safePath.replace(/^\/+/, ""));

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error("Not a file");
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/config") {
    await handleConfigGet(res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/config") {
    await handleConfigPost(req, res);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/upload-image") {
    await handleUploadPost(req, res);
    return;
  }

  await serveStatic(url.pathname, res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`SSL/DNS slide editor running at http://127.0.0.1:${port}`);
});
