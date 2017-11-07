[![Build Status](https://travis-ci.org/drom/wavedrom.svg?branch=master)](https://travis-ci.org/drom/wavedrom)
[![NPM version](https://img.shields.io/npm/v/wavedrom.svg)](https://www.npmjs.org/package/wavedrom)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Analytics](https://ga-beacon.appspot.com/UA-21660728-4/wavedrom/readme)](http://wavedrom.com)
<span class="badge-paypal"><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=J6WR5E7TJGSY2&lc=US&item_name=WaveDrom&item_number=github&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

[EDITOR](http://wavedrom.com/editor.html) | [TUTORIAL](http://wavedrom.com/tutorial.html)

## Introduction

**WaveDrom** is Free and Open Source online digital timing diagram (waveform) rendering engine that uses javascript, HTML5 and SVG to convert [WaveJSON](https://github.com/drom/wavedrom/wiki/WaveJSON) input text description into SVG vector graphics.

[WaveJSON](https://github.com/drom/wavedrom/wiki/WaveJSON) is an application of the [JSON](http://json.org/) format. The purpose of [WaveJSON](https://github.com/drom/wavedrom/wiki/WaveJSON) is to provide a compact exchange format for digital timing diagrams utilized by digital HW / IC engineers.

The engine using [WaveDromSkin](unpacked/README.md) skin mechanism to render complete picture.

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
<script src="http://wavedrom.com/wavedrom.min.js" type="text/javascript"></script>
```
or from CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/1.5.0/skins/default.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/1.5.0/wavedrom.min.js" type="text/javascript"></script>
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

## Standalone WaveDromEditor

### Windows
1. Download latest `wavedrom-editor-v1.5.0-win-{ia32|ia64}.zip` release from here: [releases](https://github.com/wavedrom/wavedrom.github.io/releases)
2. Unzip it into working direactory.
3. run the editor: `wavedrom-editor.exe`

### Linux
1. Download latest `wavedrom-editor-v1.5.0-linux-{ia32|x64}.tar.gz` release from here: [releases](https://github.com/wavedrom/wavedrom.github.io/releases)
2. unzip-untar the package: `tar -xvzf wavedrom-editor-v1.5.0-linux-x64.tar.gz`
3. run the editor: `./WaveDromEditor/linux64/wavedrom-editor`

## OSX
1. Download latest `wavedrom-editor-v1.5.0-osx-x64.zip` release:
2. unzip
3. run

## Community

Please use [WaveDrom user group](http://groups.google.com/group/wavedrom) for discussions, questions, ideas, whatever.

## License

See [LICENSE](https://github.com/drom/wavedrom/blob/master/LICENSE).
