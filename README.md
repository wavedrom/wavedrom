[![Build Status](https://travis-ci.org/drom/wavedrom.svg?branch=master)](https://travis-ci.org/drom/wavedrom)
[![NPM version](https://img.shields.io/npm/v/wavedrom.svg)](https://www.npmjs.org/package/wavedrom)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Analytics](https://ga-beacon.appspot.com/UA-21660728-4/wavedrom/readme)](http://wavedrom.com)
<span class="badge-paypal">
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" />
</form>
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
