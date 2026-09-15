import { unzlibSync, zlibSync } from "fflate";
import {
  FONT_ATLAS_B64,
  FONT_CELL_H,
  FONT_CELL_W,
  FONT_CHARS,
  FONT_COLS,
} from "./watermark-font.server";

let atlasCache: Uint8Array | null = null;

function atlas(): Uint8Array {
  if (!atlasCache) {
    const binary = atob(FONT_ATLAS_B64);
    const packed = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) packed[i] = binary.charCodeAt(i);
    atlasCache = unzlibSync(packed);
  }
  return atlasCache;
}

const ATLAS_WIDTH = FONT_COLS * FONT_CELL_W;

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i += 1) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

function encodePng(rgba: Uint8Array, width: number, height: number): Uint8Array {
  const stride = width * 4;
  const raw = new Uint8Array((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;
    raw.set(rgba.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }
  const ihdr = new Uint8Array(13);
  const view = new DataView(ihdr.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const parts = [
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlibSync(raw, { level: 6 })),
    chunk("IEND", new Uint8Array(0)),
  ];
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const png = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    png.set(part, offset);
    offset += part.length;
  }
  return png;
}

export type RgbColor = [number, number, number];

/**
 * Rasterizes lines of text into an RGBA PNG using an embedded bitmap font.
 * The result is pure pixels: it carries no font, no text layer and therefore
 * nothing that can be extracted or parsed back into characters.
 */
export function renderTextPng(
  lines: string[],
  color: RgbColor,
  opacity: number,
): { png: Uint8Array; width: number; height: number } {
  const columns = Math.max(1, ...lines.map((line) => line.length));
  const width = columns * FONT_CELL_W;
  const height = Math.max(1, lines.length) * FONT_CELL_H;
  const rgba = new Uint8Array(width * height * 4);
  const source = atlas();

  lines.forEach((line, lineIndex) => {
    const indent = Math.floor((columns - line.length) / 2);
    for (let charIndex = 0; charIndex < line.length; charIndex += 1) {
      const character = line[charIndex];
      let glyph = FONT_CHARS.indexOf(character);
      if (glyph < 0) glyph = FONT_CHARS.indexOf("?");
      if (glyph < 0) continue;
      const glyphX = (glyph % FONT_COLS) * FONT_CELL_W;
      const glyphY = Math.floor(glyph / FONT_COLS) * FONT_CELL_H;
      const destX = (indent + charIndex) * FONT_CELL_W;
      const destY = lineIndex * FONT_CELL_H;
      for (let y = 0; y < FONT_CELL_H; y += 1) {
        for (let x = 0; x < FONT_CELL_W; x += 1) {
          const alpha = source[(glyphY + y) * ATLAS_WIDTH + glyphX + x];
          if (!alpha) continue;
          const target = ((destY + y) * width + destX + x) * 4;
          rgba[target] = color[0];
          rgba[target + 1] = color[1];
          rgba[target + 2] = color[2];
          rgba[target + 3] = Math.round(alpha * opacity);
        }
      }
    }
  });

  return { png: encodePng(rgba, width, height), width, height };
}
