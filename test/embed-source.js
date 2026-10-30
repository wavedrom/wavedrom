'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const chai = require('chai');
const json5 = require('json5');
const onml = require('onml');
const {execFileSync} = require('child_process');

const lib = require('../lib');
const es = require('../lib/embed-source.js');
const skin = require('../skins/default.js');

const expect = chai.expect;

const src = '{signal: [\n  {name: \'clk\',   wave: \'p..\'},   // aligned <&> ]]> é\n]}\n';

// minimal 1x1 PNG
const crcOf = (b) => {
    let c = ~0;
    for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) { c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } }
    return ~c >>> 0;
};
const chunk = (type, data) => {
    const b = Buffer.concat([Buffer.from(type), data]);
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crcOf(b));
    return Buffer.concat([len, b, crc]);
};
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(1, 0); ihdr.writeUInt32BE(1, 4); ihdr[8] = 8; ihdr[9] = 2;
const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.from([0, 255, 0, 0]))),
    chunk('IEND', Buffer.alloc(0))
]);

describe('embed-source', () => {
    const svg = onml.stringify(lib.renderAny(0, json5.parse(src), skin));

    it('svg round trip is lossless', () => {
        const out = es.embedSvg(svg, src);
        expect(es.extractSvg(out)).to.equal(src);
        expect(es.extract(out)).to.equal(src);
        expect(es.detect(out)).to.equal('svg');
    });

    it('svg re-embed replaces', () => {
        const out = es.embedSvg(es.embedSvg(svg, 'a'), src);
        expect(out.split('wavedrom-source').length).to.equal(2);
        expect(es.extractSvg(out)).to.equal(src);
    });

    it('svg without source', () => {
        expect(es.extract(svg)).to.equal(undefined);
    });

    it('png round trip is lossless', () => {
        const out = Buffer.from(es.embedPng(png, src));
        expect(es.detect(out)).to.equal('png');
        expect(es.extractPng(out)).to.equal(src);
        expect(es.extract(out)).to.equal(src);
        expect(es.extract(es.embedPng(out, 'x'))).to.equal('x');
        // still a valid PNG: every chunk CRC checks out and IDAT is untouched
        let o = 8;
        const types = [];
        while (o < out.length) {
            const len = out.readUInt32BE(o);
            expect(out.readUInt32BE(o + 8 + len)).to.equal(crcOf(out.subarray(o + 4, o + 8 + len)));
            types.push(out.toString('latin1', o + 4, o + 8));
            o += 12 + len;
        }
        expect(types).to.deep.equal(['IHDR', 'iTXt', 'IDAT', 'IEND']);
    });

    it('png without source', () => {
        expect(es.extract(png)).to.equal(undefined);
    });

    it('exposed on the library and the browser bundle entry', () => {
        expect(lib.embedSource).to.equal(es);
        expect(fs.readFileSync(path.resolve(__dirname, '../lib/wave-drom.js'), 'utf8')).to.contain('embedSource');
    });

    it('plain WaveJSON passes through', () => {
        expect(es.detect(src)).to.equal('text');
        expect(es.extract(Buffer.from(src))).to.equal(src);
    });

    describe('cli', () => {
        const cli = path.resolve(__dirname, '../bin/cli.js');
        const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'wd-'));
        const run = (...a) => execFileSync('node', [cli, ...a]).toString();

        it('--embedded then load back from svg', () => {
            const j = path.join(tmp, 'a.json5');
            const s = path.join(tmp, 'a.svg');
            fs.writeFileSync(j, src);
            const out = run('-i', j, '--embedded');
            expect(es.extractSvg(out)).to.equal(src);
            fs.writeFileSync(s, out);
            expect(run('-i', s, '--embedded')).to.equal(out);
        });

        it('plain output has no source', () => {
            const j = path.join(tmp, 'b.json5');
            fs.writeFileSync(j, src);
            expect(run('-i', j)).to.not.contain('wavedrom-source');
        });

        it('--embedded with --indent', () => {
            const j = path.join(tmp, 'd.json5');
            fs.writeFileSync(j, src);
            const out = run('-i', j, '--embedded', '--indent', '2');
            expect(es.extractSvg(out)).to.equal(src);
        });

        it('--embedded for reg and assign', () => {
            const regSrc = '{reg: [{name: \'a\', bits: 8}]}';
            const assignSrc = '{assign: [[\'out\', [\'&\', \'a\', \'b\']]]}';
            [regSrc, assignSrc].forEach((text, i) => {
                const j = path.join(tmp, 'e' + i + '.json5');
                fs.writeFileSync(j, text);
                expect(es.extractSvg(run('-i', j, '--embedded'))).to.equal(text);
            });
        });

        it('loads source from png', () => {
            const j = path.join(tmp, 'f.json5');
            const p = path.join(tmp, 'f.png');
            fs.writeFileSync(j, src);
            fs.writeFileSync(p, es.embedPng(png, src));
            expect(run('-i', p)).to.equal(run('-i', j));
        });

        it('--embedded with nothing to render fails', () => {
            const j = path.join(tmp, 'g.json5');
            fs.writeFileSync(j, '{}');
            expect(() => execFileSync('node', [cli, '-i', j, '--embedded'], {stdio: 'pipe'})).to.throw();
        });

        it('svg without source fails', () => {
            const s = path.join(tmp, 'c.svg');
            fs.writeFileSync(s, svg);
            expect(() => execFileSync('node', [cli, '-i', s], {stdio: 'pipe'})).to.throw();
        });
    });
});
