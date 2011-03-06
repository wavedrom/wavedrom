/*jslint white: true, onevar: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, browser: true, strict: true, evil: true, maxerr: 50, indent: 4 */
var WAVEDROM = {
	version: "0.3",
	lane: {},
	canvas: {},
	genBrick: function (texts, extra, times) {
		"use strict";
		var i, j, R = [];

		if (texts.length === 4) {
			for (j = 0; j < times; j += 1) {
				R.push(texts[0]);
				for (i = 0; i < extra; i += 1) {
					R.push(texts[1]);
				}
				R.push(texts[2]);
				for (i = 0; i < extra; i += 1) {
					R.push(texts[3]);
				}
			}
			return R;
		}
		if (texts.length === 1) {
			texts.push(texts[0]);
		}
		R.push(texts[0]);
		for (i = 0; i < (times * (2 * (extra + 1)) - 1); i += 1) {
			R.push(texts[1]);
		}
		return R;
	},
	genFirstWaveBrick: function (text,  extra, times) {
		"use strict";
		switch (text) {
		case 'p': return this.genBrick(['pclk', 'ooo', 'nclk', 'zzz'], extra, times);
		case 'n': return this.genBrick(['nclk', 'zzz', 'pclk', 'ooo'], extra, times);
		case '=': return this.genBrick(['vvv'], extra, times);
		case '0': return this.genBrick(['zzz'], extra, times);
		case '1': return this.genBrick(['ooo'], extra, times);
		default:  return this.genBrick(['xxx'], extra, times);
		}
	},
	genWaveBrick:      function (text,  extra, times) {
		"use strict";
		var v, H = {
			'00': ['zmz', 'zzz'],
			'01': ['zmo', 'ooo'],
			'0=': ['zmv', 'vvv'],
			'0x': ['zmx', 'xxx'],
			'10': ['omz', 'zzz'],
			'11': ['omo', 'ooo'],
			'1=': ['omv', 'vvv'],
			'1x': ['omx', 'xxx'],
			'=0': ['vmz', 'zzz'],
			'=1': ['vmo', 'ooo'],
			'==': ['vmv', 'vvv'],
			'=x': ['vmx', 'xxx'],
			'x0': ['xmz', 'zzz'],
			'x1': ['xmo', 'ooo'],
			'x=': ['xmv', 'vvv'],
			'xx': ['xmx', 'xxx'],
			'.0': ['xmz', 'zzz'],
			'.1': ['xmo', 'ooo'],
			'.=': ['xmv', 'vvv'],
			'.x': ['xmx', 'xxx']
		};

		for (v in H) {
			if (text === v) {
				return this.genBrick(H[v], extra, times);
			}
		}
		return this.genBrick(['xxx'], extra, times);
	},
	parseWaveLane:     function (text, extra) {
		"use strict";
		var Repeats, Top, Next, Stack = [], R = [];

		Stack = text.split('');
		Next  = Stack.shift();
		if (Next === 'p' || Next === 'n') {
			return this.genFirstWaveBrick(Next, extra, Stack.length + 1);
		}

		Repeats = 1;
		while (Stack[0] === '.') { // repeaters parser
			Stack.shift();
			Repeats += 1;
		}
		R = R.concat(this.genFirstWaveBrick(Next, extra, Repeats));

		while (Stack.length) {
			Top  = Next;
			Next = Stack.shift();
			Repeats = 1;
			while (Stack[0] === '.') { // repeaters parser
				Stack.shift();
				Repeats += 1;
			}
			R = R.concat(this.genWaveBrick((Top + Next), extra, Repeats));
		}
		return R;
	}
};

WAVEDROM.parseWaveLanes = function (source) {
	"use strict";
	var x, content = [];	

	if (source.signal) {
		for (x in source.signal) {
			content.push([]);
			content[content.length - 1][0] = source.signal[x].name;
			if (source.signal[x].wave) {
				content[content.length - 1][1] = WAVEDROM.parseWaveLane(source.signal[x].wave, this.lane.hscale);
			} else {
				content[content.length - 1][1] = null;
			}
			if (source.signal[x].data) {
				content[content.length - 1][2] = source.signal[x].data;
			} else {
				content[content.length - 1][2] = null;
			}
		}
	}
	return content;
};

WAVEDROM.CleanGroupTransforms = function (root) { // clean translate attribute of defines
	"use strict";
	var i, nodes = document.getElementById(root).childNodes;
	for (i = 0; i < nodes.length; i += 1) {
		if (nodes[i].nodeName === 'g') {
			nodes[i].setAttribute('transform', 'translate(0,0)');
		}
	}
};

WAVEDROM.CleanNode = function (root) { // clean output SVG to before adding stuff
	"use strict";
	while (root.childNodes.length) {
		root.removeChild(root.childNodes[0]);
	}
};

WAVEDROM.FindLaneMarkers = function (lanetext) {
	"use strict";
	var i, gcount = 0, lcount = 0, ret = [];

	for (i in lanetext) {
		if (lanetext[i] === 'vvv') {
			lcount += 1;
		} else {
			if (lcount !== 0) {
				ret.push(gcount - ((lcount + 1) / 2));
				lcount = 0;
			}
		}
		gcount += 1;
	}
	if (lcount !== 0) {
		ret.push(gcount - ((lcount + 1) / 2));
	}
	
	return ret;
}

WAVEDROM.RenderWaveLane = function (root, content) {
	"use strict";
	var i, j, g, title, b, lanetext, labeltext, labels = [1],
		xmax    = 0,
		svgns   = 'http://www.w3.org/2000/svg',
		xlinkns = 'http://www.w3.org/1999/xlink';

	for (j = 0; j < content.length; j += 1) {
		g = document.createElementNS(svgns, 'g');
// IE		g = document.createElement('g');
		g.id = "wavelane_" + j;
		g.setAttribute('transform', 'translate(0,' + (this.lane.y0 + j * this.lane.yo) + ')');
		root.insertBefore(g, root.firstChild);

		if (content[j][0]) {
			lanetext = document.createTextNode(content[j][0]);
			title = document.createElementNS(svgns, "text");
// IE			title = document.createElement("text");
			title.setAttribute("x", (this.lane.xg - this.lane.tgo));
			title.setAttribute("y", this.lane.ym);
			title.setAttribute("fill", "blue");
			title.setAttribute("text-anchor", "end");
			title.appendChild(lanetext);
			g.insertBefore(title, g.firstChild);

			if (content[j][1]) {
				if (content[j][2] && content[j][2].length) {
					labels = WAVEDROM.FindLaneMarkers(content[j][1]);

					if (labels.length !== 0) {
						for (i in labels) {
							if (content[j][2] && content[j][2][i]) {
								labeltext = document.createTextNode(content[j][2][i]);
								title = document.createElementNS(svgns, "text");
				// IE			title = document.createElement("text");
								title.setAttribute("x", ((labels[i] * this.lane.xs) + this.lane.xlabel));
								title.setAttribute("y", this.lane.ym);
								title.setAttribute("text-anchor", "middle");
								title.appendChild(labeltext);
								g.insertBefore(title, g.firstChild);
							}
						}
					}
				}
				for (i = 0; i < content[j][1].length; i += 1) {
					b    = document.createElementNS(svgns, "use");
	// IE				b    = document.createElement("use");
					b.id = "use_" + i + "_" + j;
					b.setAttributeNS(xlinkns, 'xlink:href', '#' + content[j][1][i]);
	// IE				b.setAttribute( 'xlink:href', '#' + content[j][1][i] );
					b.setAttribute('transform', 'translate(' + (this.lane.xg + i * this.lane.xs) + ',0)');
					g.insertBefore(b, g.firstChild);
				}
					if (content[j][1].length > xmax) {
					xmax = content[j][1].length;
				}
			}
		}
	}
	return xmax;
};

WAVEDROM.RenderMarks = function (root, content, xmax) {
	"use strict";
	var i, marks, mstep, mmstep, gmark, tmark, labeltext, gy, ty, margin,
			svgns   = 'http://www.w3.org/2000/svg',
		xlinkns = 'http://www.w3.org/1999/xlink';

	mstep  = 2 * (this.lane.hscale + 1);
	mmstep = mstep * this.lane.xs;
	marks  = xmax / mstep + 1;
	margin = 5;
	gy     = content.length * this.lane.yo + this.lane.y0 + this.lane.ys;

	for (i = 0; i < marks; i += 1) {
		gmark = document.createElementNS(svgns, "path");
		gmark.id = ("gmark_" + i);
		gmark.setAttribute('d', 'm ' + (this.lane.xg + i * mmstep) +',5 0,' + (gy - 2 * margin));
		gmark.setAttribute('style', 'fill:none;stroke:#888888;stroke-width:0.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:2, 2');
		root.insertBefore(gmark, root.firstChild);
	}
	for (i = 1; i < marks; i += 1) {
		labeltext = document.createTextNode(i);
		tmark = document.createElementNS(svgns, "text");
		tmark.setAttribute("x", (this.lane.xg + (i * mmstep) - mmstep/2));
		tmark.setAttribute("y", gy - margin);
		tmark.setAttribute("text-anchor", "middle");
		tmark.setAttribute("fill", "#AAAAAA");
		tmark.appendChild(labeltext);
		root.insertBefore(tmark, root.firstChild);
	}
};


WAVEDROM.RenderWaveForm = function () {
	"use strict";
	var xmax,
		root          = document.getElementById("lanes"),
		svgcontent    = document.getElementById("svgcontent"),
		TheTextBox    = document.getElementById("InputJSON"),
		content       = WAVEDROM.parseWaveLanes(eval('(' + TheTextBox.value + ')'));

	WAVEDROM.CleanNode(root);

	xmax = WAVEDROM.RenderWaveLane(root, content);
	WAVEDROM.RenderMarks(root, content, xmax);

	svgcontent.setAttribute('viewBox', "0 0 " + (this.lane.xg + (this.lane.xs * (xmax + 1))) + " " + (content.length * this.lane.yo + this.lane.y0 + this.lane.ys));
};

WAVEDROM.SetHScale = function (hscale) {
	WAVEDROM.lane.hscale = parseFloat(hscale);
	WAVEDROM.RenderWaveForm();
};

WAVEDROM.resize = function () {
	document.getElementById('PanelB').style.height = (window.innerHeight - (7+16+7+200+7+16+7+16+7)) + 'px';
};

WAVEDROM.Init = function () {
	"use strict";
	var i,
		tmpgraphlane0 = document.getElementById("tmpgraphlane0"),
		tmpgraphlane1 = document.getElementById("tmpgraphlane1"),
		tmptextlane0  = document.getElementById("tmptextlane0"),
		tmptextlabel  = document.getElementById("tmptextlabel"),
		tmpview       = document.getElementById("tmpview");

	this.lane.xs       = parseFloat(tmpgraphlane0.getAttribute("width"));
	this.lane.ys       = parseFloat(tmpgraphlane0.getAttribute("height"));
	this.lane.xg       = parseFloat(tmpgraphlane0.getAttribute("x"));
	this.lane.y0       = parseFloat(tmpgraphlane0.getAttribute("y"));
	this.lane.yo       = parseFloat(tmpgraphlane1.getAttribute("y")) - this.lane.y0;
	this.lane.tgo      = this.lane.xg - parseFloat(tmptextlane0.getAttribute("x"));
	this.lane.ym       = parseFloat(tmptextlane0.getAttribute("y")) - this.lane.y0;
	this.lane.xlabel   = parseFloat(tmptextlabel.getAttribute("x"));
	this.canvas.heigth = parseFloat(tmpview.getAttribute("height"));

	if (navigator.appName === 'Microsoft Internet Explorer') {
		alert("Don't work with Microsoft Internet Explorer\nSorry :(\nUse Chrome or Firefox 4 instead.");
	}
// alert(navigator.appCodeName + "\n" + navigator.appName + "\n" + navigator.appVersion + "\n" + navigator.cookieEnabled + "\n" + navigator.platform + "\n" + navigator.userAgent);

	WAVEDROM.SetHScale('1');
	WAVEDROM.CleanGroupTransforms("wavetemps");
	WAVEDROM.RenderWaveForm();
	WAVEDROM.resize();
};

window.onresize = WAVEDROM.resize;
