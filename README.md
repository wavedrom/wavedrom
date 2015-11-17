[![Build Status](https://travis-ci.org/drom/wavedrom.svg?branch=master)](https://travis-ci.org/drom/wavedrom)
[![NPM version](https://img.shields.io/npm/v/wavedrom.svg)](https://www.npmjs.org/package/wavedrom)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Analytics](https://ga-beacon.appspot.com/UA-21660728-4/wavedrom/readme)](http://wavedrom.com)

<span class="badge-paypal">
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;encrypted=-----BEGIN PKCS7-----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-----END PKCS7-----
    " title="Donate to this project using Paypal">
<img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" />
</a>
</span>

[EDITOR](http://wavedrom.com/editor.html) | [TUTORIAL](http://wavedrom.com/tutorial.html)

## Introduction

**WaveDrom** is Free and Open Source online digital timing diagram (waveform) rendering engine that uses javascript, HTML5 and SVG to convert [WaveJSON](https://github.com/drom/wavedrom/wiki/WaveJSON) input text description into SVG vector graphics.

[WaveJSON](https://github.com/drom/wavedrom/wiki/WaveJSON) is an application of the [JSON](http://json.org/) format. The purpose of [WaveJSON](https://github.com/drom/wavedrom/wiki/WaveJSON) is to provide a compact exchange format for digital timing diagrams utilized by digital HW / IC engineers.

The engine using [WaveDromSkin](https://github.com/drom/wavedrom/wiki/WaveDromSkin) skin mechanism to render complete picture.

## Screenshot

![alt text](http://wavedrom.com/images/screenshot.png "screenshot")

## Web usage

**WaveDrom** timing diagrams can be embedded into the web pages, blogs, wikis to be rendered by the most of modern browsers:

![alt text](http://wavedrom.com/images/firefox_22.gif "firefox") 4+
![alt text](http://wavedrom.com/images/chrome_22.gif "chrome") 10+
![alt text](http://wavedrom.com/images/safari_22.gif "safari") 5.1+
![alt text](http://wavedrom.com/images/opera_22.gif "opera") 12+
![alt text](http://wavedrom.com/images/ie_22.gif "ie") 11

### HTML pages

There are 3 steps to insert **WaveDrom** diagrams directly into your page:

1) Put following line into your HTML page ```<header>``` or ```<body>```:

```html
<script src="http://wavedrom.com/skins/default.js" type="text/javascript"></script>
<script src="http://wavedrom.com/WaveDrom.js" type="text/javascript"></script>
```

2) Set ``onload`` event for HTML body.

```html
<body onload="WaveDrom.ProcessAll()">
```

3) Insert [WaveJSON](https://github.com/drom/wavedrom/wiki/WaveJSON) source inside HTML ``<body>`` wrapped with ``<script>`` tag:

```html
<script type="WaveDrom">
{ signal : [
  { name: "clk",  wave: "p......" },
  { name: "bus",  wave: "x.34.5x",   data: "head body tail" },
  { name: "wire", wave: "0.1..0." },
]}
</script>
```

Script will find all ``<script type="WaveDrom">`` instances and insert timing diagram at that point.


 * [jsbin](http://jsbin.com/uderuw/17)
 * [jsfiddle](http://jsfiddle.net/H7nBn/25)


### impress.js

(http://wavedrom.com/impress.html)


### Blogs & Wikis

Blogger integration: (http://wavedrom.blogspot.com/2011/08/wavedrom-digital-timing-diagram-in-your.html)

## Editor

[WaveDromEditor](http://wavedrom.com/editor.html)
is online real-time editor of digital timing diagrams based on **WaveDrom** engine and **WaveJSON** format.

## Community

Please use [WaveDrom user group](http://groups.google.com/group/wavedrom) for discussions, questions, ideas, whatever.

## License

See [LICENSE](https://github.com/drom/wavedrom/blob/master/LICENSE).
