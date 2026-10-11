'use strict';

// Embed the WaveJSON / WaveJS source text into SVG (<metadata>) and PNG (iTXt chunk)
// and extract it back. The source is stored verbatim so a round trip is lossless.

const pkg = require('../package.json');

const SVG_ID = 'wavedrom-source';
const PNG_KEY = 'wavedrom-source';
const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const enc = new TextEncoder();
const dec = new TextDecoder('utf-8');

const toBytes = (data) => (typeof data === 'string')
    ? enc.encode(data)
    : new Uint8Array(data.buffer || data, data.byteOffset || 0, data.byteLength);

const isPng = (bytes) => PNG_SIG.every((b, i) => bytes[i] === b);

// SVG

const cdata = (text) => '<![CDATA[' + text.replace(/\]\]>/g, ']]]]><![CDATA[>') + ']]>';

const unescapeXml = (text) => text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
    .replace(/&amp;/g, '&');

const svgRe = new RegExp('<metadata\\b[^>]*\\bid="' + SVG_ID + '"[^>]*>([\\s\\S]*?)</metadata>');

function embedSvg (svg, source) {
    const meta = '<metadata id="' + SVG_ID + '"><!-- WaveDrom ' + pkg.version + ' -->' + cdata(source) + '</metadata>';
    const clean = svg.replace(svgRe, '');
    const m = clean.match(/<svg\b[^>]*?(\/?)>/);
    if (!m) { throw new Error('Not an SVG document'); }
    if (m[1] === '/') {
        const open = m[0].slice(0, -2) + '>';
        return clean.replace(m[0], open + meta + '</svg>');
    }
    return clean.replace(m[0], m[0] + meta);
}

function extractSvg (svg) {
    const m = svg.match(svgRe);
    if (!m) { return undefined; }
    const inner = m[1].replace(/<!--[\s\S]*?-->/g, '');
    if (inner.indexOf('<![CDATA[') < 0) { return unescapeXml(inner); }
    let res = '';
    inner.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, t) => { res += t; return ''; });
    return res;
}

// PNG

const crcTable = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) { c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1); }
        t[n] = c >>> 0;
    }
    return t;
})();

function crc32 (bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) { c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8); }
    return (c ^ 0xffffffff) >>> 0;
}

const u32 = (b, o) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;

function* pngChunks (bytes) {
    let o = PNG_SIG.length;
    while (o + 8 <= bytes.length) {
        const len = u32(bytes, o);
        const type = String.fromCharCode(bytes[o + 4], bytes[o + 5], bytes[o + 6], bytes[o + 7]);
        yield {type, start: o, end: o + 12 + len, data: bytes.subarray(o + 8, o + 8 + len)};
        o += 12 + len;
    }
}

const keyBytes = enc.encode(PNG_KEY);

// iTXt: key\0 compFlag compMethod lang\0 translatedKey\0 text (uncompressed UTF-8)
const isOurs = (c) => c.type === 'iTXt' && keyBytes.every((b, i) => c.data[i] === b) && c.data[keyBytes.length] === 0;

function embedPng (png, source) {
    const bytes = toBytes(png);
    if (!isPng(bytes)) { throw new Error('Not a PNG file'); }
    const text = enc.encode(source);
    const body = new Uint8Array(keyBytes.length + 5 + text.length);
    body.set(keyBytes, 0);
    // zeros: key terminator, compression flag, compression method, empty language, empty translated key
    body.set(text, keyBytes.length + 5);
    const chunk = new Uint8Array(12 + body.length);
    const view = new DataView(chunk.buffer);
    view.setUint32(0, body.length);
    chunk.set(enc.encode('iTXt'), 4);
    chunk.set(body, 8);
    view.setUint32(8 + body.length, crc32(chunk.subarray(4, 8 + body.length)));

    const parts = [];
    let inserted = false;
    parts.push(bytes.subarray(0, PNG_SIG.length));
    for (const c of pngChunks(bytes)) {
        if (isOurs(c)) { continue; }
        parts.push(bytes.subarray(c.start, c.end));
        if (!inserted && c.type === 'IHDR') {
            parts.push(chunk);
            inserted = true;
        }
    }
    if (!inserted) { throw new Error('Invalid PNG: IHDR chunk missing'); }
    const res = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let o = 0;
    for (const p of parts) { res.set(p, o); o += p.length; }
    return res;
}

function extractPng (png) {
    const bytes = toBytes(png);
    if (!isPng(bytes)) { throw new Error('Not a PNG file'); }
    for (const c of pngChunks(bytes)) {
        if (isOurs(c)) {
            if (c.data[keyBytes.length + 1] !== 0) { return undefined; } // compressed: not written by us
            let o = keyBytes.length + 3;
            while (o < c.data.length && c.data[o] !== 0) { o++; } // language
            o++;
            while (o < c.data.length && c.data[o] !== 0) { o++; } // translated key
            return dec.decode(c.data.subarray(o + 1));
        }
    }
    return undefined;
}

// Auto detect

// returns 'png' | 'svg' | 'text'
function detect (data) {
    const bytes = toBytes(data);
    if (isPng(bytes)) { return 'png'; }
    const head = dec.decode(bytes.subarray(0, 4096));
    return /^\s*(<\?xml|<!--|<!DOCTYPE|<svg\b)/i.test(head) ? 'svg' : 'text';
}

// Returns the embedded source for SVG / PNG, the text itself for WaveJSON,
// or undefined when an image has no embedded source.
function extract (data) {
    switch (detect(data)) {
    case 'png': return extractPng(data);
    case 'svg': return extractSvg(typeof data === 'string' ? data : dec.decode(toBytes(data)));
    default: return typeof data === 'string' ? data : dec.decode(toBytes(data));
    }
}

exports.embedSvg = embedSvg;
exports.extractSvg = extractSvg;
exports.embedPng = embedPng;
exports.extractPng = extractPng;
exports.detect = detect;
exports.extract = extract;
