[![Linux](https://github.com/wavedrom/wavedrom/actions/workflows/linux.yml/badge.svg)](https://github.com/wavedrom/wavedrom/actions/workflows/linux.yml)
[![MacOS](https://github.com/wavedrom/wavedrom/actions/workflows/macos.yml/badge.svg)](https://github.com/wavedrom/wavedrom/actions/workflows/macos.yml)
[![Windows](https://github.com/wavedrom/wavedrom/actions/workflows/windows.yml/badge.svg)](https://github.com/wavedrom/wavedrom/actions/workflows/windows.yml)
[![NPM version](https://img.shields.io/npm/v/wavedrom.svg)](https://www.npmjs.org/package/wavedrom)
<span class="badge-paypal"><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=J6WR5E7TJGSY2&lc=US&item_name=WaveDrom&item_number=github&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
[![Coverage Status](https://coveralls.io/repos/github/wavedrom/wavedrom/badge.svg?branch=trunk)](https://coveralls.io/github/wavedrom/wavedrom?branch=trunk)

<!-- [![Dependency Status](https://david-dm.org/wavedrom/wavedrom.svg)](https://david-dm.org/wavedrom/wavedrom) -->
<!-- [![Analytics](https://ga-beacon.appspot.com/UA-21660728-4/wavedrom/readme)](http://wavedrom.com) -->

[EDITOR](http://wavedrom.com/editor.html) | [TUTORIAL](http://wavedrom.com/tutorial.html)

## Introduction

**WaveDrom** is a Free and Open Source online digital timing diagram (waveform) rendering engine that uses javascript, HTML5 and SVG to convert a [WaveJSON](https://github.com/wavedrom/schema/blob/master/WaveJSON.md) input text description into SVG vector graphics.

WaveJSON is an application of the [JSON](http://json.org/) format. The purpose of WaveJSON is to provide a compact exchange format for digital timing diagrams utilized by digital HW / IC engineers.

The engine is using [WaveDromSkin](unpacked/README.md) skin mechanism to render a complete picture.

## Server

svg.wavedrom.com

```
![Alt](https://svg.wavedrom.com/github/<USER>/<REPO>/<BRANCH>/<PATH>/<FILENAME>.json5)
```

```md
![signal step4](https://svg.wavedrom.com/github/wavedrom/wavedrom/trunk/test/signal-step4.json5)
```

![signal step4](https://svg.wavedrom.com/github/wavedrom/wavedrom/trunk/test/signal-step4.json5)


```md
![reg vl](https://svg.wavedrom.com/github/wavedrom/wavedrom/trunk/test/reg-vl.json5)
```

![reg vl](https://svg.wavedrom.com/github/wavedrom/wavedrom/trunk/test/reg-vl.json5)

```
<img src="https://svg.wavedrom.com/{WAVEDROM SOURCE}/>
```

```html
<img src="https://svg.wavedrom.com/{signal:[{name:'clk',wave:'p......'},{name:'bus',wave:'x.34.5x',data:'head body tail'},{name:'wire',wave:'0.1..0.'}]}"/>
```

<img src="https://svg.wavedrom.com/{signal:[{name:'clk',wave:'p......'},{name:'bus',wave:'x.34.5x',data:'head body tail'},{name:'wire',wave:'0.1..0.'}]}"/>

## Web usage

**WaveDrom** timing diagrams can be embedded into the web pages, blogs, and wikis to be rendered by the most of modern browsers.

### HTML pages

There are three steps to insert **WaveDrom** diagrams directly into your page:

1) Put the following line into your HTML page ```<header>``` or ```<body>```:

From a CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/skins/default.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/wavedrom.min.js" type="text/javascript"></script>
```

2) Set the ``onload`` event for the HTML body.

```html
<body onload="WaveDrom.ProcessAll()">
```

3) Insert [WaveJSON](https://github.com/wavedrom/schema/blob/master/WaveJSON.md) source inside HTML ``<body>`` wrapped with the ``<script>`` tag:

```html
<script type="WaveDrom">
{ signal : [
  { name: "clk",  wave: "p......" },
  { name: "bus",  wave: "x.34.5x",   data: "head body tail" },
  { name: "wire", wave: "0.1..0." },
]}
</script>
```

The script will find all ``<script type="WaveDrom">`` instances and insert a timing diagram at that point.


 * [jsbin](http://jsbin.com/uderuw/17)
 * [jsfiddle](http://jsfiddle.net/H7nBn/25)


### impress.js

(http://wavedrom.com/impress.html)


### Blogs & Wikis

ObservableHQ examples: (https://observablehq.com/collection/@drom/wavedrom)

Blogger integration: (http://wavedrom.blogspot.com/2011/08/wavedrom-digital-timing-diagram-in-your.html)

MediaWiki integration: (https://github.com/Martoni/mediawiki_wavedrom)

## Editor

[WaveDromEditor](http://wavedrom.com/editor.html)
is an online real-time editor of digital timing diagrams based on the **WaveDrom** engine and **WaveJSON** format.

## Standalone WaveDromEditor

### Windows
1. Download latest `wavedrom-editor-v2.4.2-win-{ia32|x64}.zip` release from here: [releases](https://github.com/wavedrom/wavedrom.github.io/releases)
2. Unzip it into a working directory.
3. Run the editor: `wavedrom-editor.exe`

### Linux
1. Download the latest `wavedrom-editor-v2.4.2-linux-{ia32|x64}.tar.gz` release from here: [releases](https://github.com/wavedrom/wavedrom.github.io/releases)
2. unzip-untar the package: `tar -xvzf wavedrom-editor-v2.3.2-linux-x64.tar.gz`
3. Run the editor: `./WaveDromEditor/linux64/wavedrom-editor`

## OS X
1. Download the latest `wavedrom-editor-v2.4.2-osx-x64.zip` release from here: [releases](https://github.com/wavedrom/wavedrom.github.io/releases)
2. Unzip
3. Run

## Community

Please use the [WaveDrom user group](http://groups.google.com/group/wavedrom) for discussions, questions, ideas, or whatever.

## Contributing

[Contributing](./.github/CONTRIBUTING.md)

## License

See [LICENSE](https://github.com/wavedrom/wavedrom/blob/trunk/LICENSE).
