'use strict';

var renderAny = require('../lib/render-any.js');
var waveSkin = require('../skins/default.js');
var chai = require('chai');
var expect = chai.expect;

describe('signal', function () {
    it('clocks', function (done) {
        expect(renderAny(0,
            { signal: [
                { name: 'pclk', wave: 'p.......' },
                { name: 'Pclk', wave: 'P.......' },
                { name: 'nclk', wave: 'n.......' },
                { name: 'Nclk', wave: 'N.......' },
                {},
                { name: 'clk0', wave: 'phnlPHNL' },
                { name: 'clk1', wave: 'xhlhLHl.' },
                { name: 'clk2', wave: 'hpHplnLn' },
                { name: 'clk3', wave: 'nhNhplPl' },
                { name: 'clk4', wave: 'xlh.L.Hx' }
            ]}, waveSkin
        )).to.be.an('array');
        done();
    });
    it('gaps', function (done) {
        expect(renderAny(1,
            { signal: [
                { name: 'clk',         wave: 'p.....|...' },
                { name: 'Data',        wave: 'x.345x|=.x', data: ['head', 'body', 'tail', 'data'] },
                { name: 'Request',     wave: '0.1..0|1.0' },
                {},
                { name: 'Acknowledge', wave: '1.....|01.' }
            ]}, waveSkin
        )).to.be.an('array');
        done();
    });
    it('bundles', function (done) {
        expect(renderAny(2,
            {signal: [
                {    name: 'clk',   wave: 'p..Pp..P'},
                ['Master',
                    ['ctrl',
                        {name: 'write', wave: '01.0....'},
                        {name: 'read',  wave: '0...1..0'}
                    ],
                    {  name: 'addr',  wave: 'x3.x4..x', data: 'A1 A2'},
                    {  name: 'wdata', wave: 'x3.x....', data: 'D1'   }
                ],
                {},
                ['Slave',
                    ['ctrl',
                        {name: 'ack',   wave: 'x01x0.1x'}
                    ],
                    {  name: 'rdata', wave: 'x.....4x', data: 'Q2'}
                ]
            ]}, waveSkin
        )).to.be.an('array');
        done();
    });
    it('arcs', function (done) {
        expect(renderAny(3,
            { signal: [
                { name: 'A', wave: '01........0....',  node: '.a........j' },
                { name: 'B', wave: '0.1.......0.1..',  node: '..b.......i' },
                { name: 'C', wave: '0..1....0...1..',  node: '...c....h..' },
                { name: 'D', wave: '0...1..0.....1.',  node: '....d..g...' },
                { name: 'E', wave: '0....10.......1',  node: '.....ef....' }
            ],
            edge: [
                'a~b t1', 'c-~a t2', 'c-~>d time 3', 'd~-e',
                'e~>f', 'f->g', 'g-~>h', 'h~>i some text', 'h~->j'
            ]}, waveSkin
        )).to.be.an('array');
        done();
    });
    it('marks', function (done) {
        expect(renderAny(3,
            {
                signal: [
                    {name:'clk',         wave: 'p....' },
                    {name:'Data',        wave: 'x345x', data: 'a b c' },
                    {name:'Request',     wave: '01..0' }
                ],
                head: {
                    text:'WaveDrom example',
                    tick: 0
                },
                foot: {
                    text:'Figure 100',
                    tock: 9
                }
            }, waveSkin
        )).to.be.an('array');
        done();
    });
});
/* eslint-env mocha */
