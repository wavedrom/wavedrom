[![Build Status](https://travis-ci.org/drom/wavedrom.svg?branch=master)](https://travis-ci.org/drom/wavedrom)
[![NPM version](https://img.shields.io/npm/v/wavedrom.svg)](https://www.npmjs.org/package/wavedrom)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Analytics](https://ga-beacon.appspot.com/UA-21660728-4/wavedrom/readme)](http://wavedrom.com)
[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=wavedrom&url=http%3A%2F%2Fwavedrom.com&title=WaveDrom&language=&tags=github&category=software)

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
