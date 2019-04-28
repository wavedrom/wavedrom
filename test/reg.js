'use strict';

var renderAny = require('../lib/render-any.js');
var waveSkin = require('../skins/default.js');
var chai = require('chai');
var expect = chai.expect;

describe('reg', function () {
    it('basic', function (done) {
        expect(renderAny(0,
            {reg: [
                {name: 'a', bits: 8},
                {name: 'b', bits: 8},
                {name: 'c', bits: 1}
            ]}, waveSkin
        )).to.be.an('array');
        done();
    });
});
/* eslint-env mocha */
