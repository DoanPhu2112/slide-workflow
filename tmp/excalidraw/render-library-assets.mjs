import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();

const targets = [
  {
    source: "tmp/excalidraw/stick-figures.excalidrawlib",
    itemName: "Stick man",
    output: "slides/http-response-types/assets/stick-man.svg"
  },
  {
    source: "tmp/excalidraw/architecture.excalidrawlib",
    itemName: "Server",
    output: "slides/http-response-types/assets/server.svg"
  },
  {
    source: "tmp/excalidraw/systems.excalidrawlib",
    itemName: "Cloud",
    output: "slides/http-response-types/assets/cloud.svg"
  }
];

const ensureDir = async (filePath) => {
  await fs.mkdir(path.dirname(path.join(cwd, filePath)), { recursive: true });
};

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const colorOrNone = (value) =>
  !value || value === "transparent" ? "none" : value;

const getLineBounds = (element) => {
  const xs = [element.x];
  const ys = [element.y];
  for (const point of element.points || []) {
    xs.push(element.x + point[0]);
    ys.push(element.y + point[1]);
  }
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys)
  };
};

const getElementBounds = (element) => {
  if (element.type === "line") {
    return getLineBounds(element);
  }

  return {
    minX: element.x,
    minY: element.y,
    maxX: element.x + (element.width || 0),
    maxY: element.y + (element.height || 0)
  };
};

const getBounds = (elements) => {
  const boxes = elements.map(getElementBounds);
  const padding = 10;
  return {
    minX: Math.min(...boxes.map((box) => box.minX)) - padding,
    minY: Math.min(...boxes.map((box) => box.minY)) - padding,
    maxX: Math.max(...boxes.map((box) => box.maxX)) + padding,
    maxY: Math.max(...boxes.map((box) => box.maxY)) + padding
  };
};

const renderLine = (element, offsetX, offsetY) => {
  const points = (element.points || []).map((point, index) => {
    const x = element.x - offsetX + point[0];
    const y = element.y - offsetY + point[1];
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  });

  return `<path d="${points.join(" ")}" fill="none" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth || 1}" stroke-linecap="round" stroke-linejoin="round" opacity="${(element.opacity || 100) / 100}" />`;
};

const renderEllipse = (element, offsetX, offsetY) => {
  const cx = element.x - offsetX + element.width / 2;
  const cy = element.y - offsetY + element.height / 2;
  const rx = element.width / 2;
  const ry = element.height / 2;

  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${colorOrNone(element.backgroundColor)}" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth || 1}" opacity="${(element.opacity || 100) / 100}" />`;
};

const renderRectangle = (element, offsetX, offsetY) => {
  const x = element.x - offsetX;
  const y = element.y - offsetY;

  return `<rect x="${x}" y="${y}" width="${element.width}" height="${element.height}" rx="8" ry="8" fill="${colorOrNone(element.backgroundColor)}" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth || 1}" opacity="${(element.opacity || 100) / 100}" />`;
};

const renderText = (element, offsetX, offsetY) => {
  const x = element.x - offsetX;
  const y = element.y - offsetY + (element.baseline || element.fontSize || 16);
  const fontSize = element.fontSize || 16;
  const anchor = element.textAlign === "center" ? "middle" : "start";

  return `<text x="${x}" y="${y}" font-family="DM Sans, Arial, sans-serif" font-size="${fontSize}" fill="${element.strokeColor}" text-anchor="${anchor}">${escapeXml(element.text)}</text>`;
};

const renderElement = (element, offsetX, offsetY) => {
  switch (element.type) {
    case "line":
      return renderLine(element, offsetX, offsetY);
    case "ellipse":
      return renderEllipse(element, offsetX, offsetY);
    case "rectangle":
      return renderRectangle(element, offsetX, offsetY);
    case "text":
      return renderText(element, offsetX, offsetY);
    default:
      return "";
  }
};

for (const target of targets) {
  const libraryPath = path.join(cwd, target.source);
  const raw = await fs.readFile(libraryPath, "utf8");
  const library = JSON.parse(raw);
  const item = library.libraryItems.find((entry) => entry.name === target.itemName);

  if (!item) {
    throw new Error(`Missing library item: ${target.itemName}`);
  }

  const bounds = getBounds(item.elements);
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const content = item.elements
    .map((element) => renderElement(element, bounds.minX, bounds.minY))
    .join("\n  ");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="${escapeXml(target.itemName)}">
  ${content}
</svg>
`;

  await ensureDir(target.output);
  await fs.writeFile(path.join(cwd, target.output), svg, "utf8");
}
