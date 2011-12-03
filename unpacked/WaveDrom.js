/*jslint white: true, onevar: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, browser: true, strict: true, evil: true, maxerr: 500, indent: 4 */

function utf8_encode (argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === "undefined") {
        return "";
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = "",
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}

function base64_encode (data) {
/*
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Rafal Kukawski (http://kukawski.pl)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
*/
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data = this.utf8_encode(data + '');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');
    
    var r = data.length % 3;
    
    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

}

var JsonML; if ("undefined" === typeof JsonML) { JsonML = {}; }

(function() {
	//attribute name mapping
	var ATTRMAP = {
			rowspan : "rowSpan",
			colspan : "colSpan",
			cellpadding : "cellPadding",
			cellspacing : "cellSpacing",
			tabindex : "tabIndex",
			accesskey : "accessKey",
			hidefocus : "hideFocus",
			usemap : "useMap",
			maxlength : "maxLength",
			readonly : "readOnly",
			contenteditable : "contentEditable"
			// can add more attributes here as needed
		},
		// attribute duplicates
		ATTRDUP = {
			enctype : "encoding",
			onscroll : "DOMMouseScroll"
			// can add more attributes here as needed
		},
		// event names
		EVTS = (function(/*string[]*/ names) {
			var evts = {};
			while (names.length) {
				var evt = names.shift();
				evts["on"+evt.toLowerCase()] = evt;
			}
			return evts;
		})("blur,change,click,dblclick,error,focus,keydown,keypress,keyup,load,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit,unload".split(','));

	/*void*/ function addHandler(/*DOM*/ elem, /*string*/ name, /*function*/ handler) {
		if ("string" === typeof handler) {
			/*jslint evil:true */
			handler = new Function("event", handler);
			/*jslint evil:false */
		}

		if ("function" !== typeof handler) {
			return;
		}

		elem[name] = handler;
	}

	/*DOM*/ function addAttributes(/*DOM*/ elem, /*object*/ attr) {
		if (attr.name && document.attachEvent) {
			try {
				// IE fix for not being able to programatically change the name attribute
				var alt = document.createElement("<"+elem.tagName+" name='"+attr.name+"'>");
				// fix for Opera 8.5 and Netscape 7.1 creating malformed elements
				if (elem.tagName === alt.tagName) {
					elem = alt;
				}
			} catch (ex) { }
		}

		// for each attributeName
		for (var name in attr) {
			if (attr.hasOwnProperty(name)) {
				// attributeValue
				var value = attr[name];
				if (name && value !== null && "undefined" !== typeof value) {
					name = ATTRMAP[name.toLowerCase()] || name;
					if (name === "style") {
						if ("undefined" !== typeof elem.style.cssText) {
							elem.style.cssText = value;
						} else {
							elem.style = value;
						}
					} else if (name === "class") {
						elem.className = value;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
						elem.setAttribute (name, value);
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					} else if (EVTS[name]) {
						addHandler(elem, name, value);

						// also set duplicated events
						if (ATTRDUP[name]) {
							addHandler(elem, ATTRDUP[name], value);
						}
					} else if ("string" === typeof value || "number" === typeof value || "boolean" === typeof value) {
						elem.setAttribute(name, value);

						// also set duplicated attributes
						if (ATTRDUP[name]) {
							elem.setAttribute(ATTRDUP[name], value);
						}
					} else {

						// allow direct setting of complex properties
						elem[name] = value;

						// also set duplicated attributes
						if (ATTRDUP[name]) {
							elem[ATTRDUP[name]] = value;
						}
					}
				}
			}
		}
		return elem;
	}

	/*void*/ function appendChild(/*DOM*/ elem, /*DOM*/ child) {
		if (child) {
			if (elem.tagName && elem.tagName.toLowerCase() === "table" && elem.tBodies) {
				if (!child.tagName) {
					// must unwrap documentFragment for tables
					if (child.nodeType === 11) {
						while (child.firstChild) {
							appendChild(elem, child.removeChild(child.firstChild));
						}
					}
					return;
				}
				// in IE must explicitly nest TRs in TBODY
				var childTag = child.tagName.toLowerCase();// child tagName
				if (childTag && childTag !== "tbody" && childTag !== "thead") {
					// insert in last tbody
					var tBody = elem.tBodies.length > 0 ? elem.tBodies[elem.tBodies.length-1] : null;
					if (!tBody) {
						tBody = document.createElement(childTag === "th" ? "thead" : "tbody");
						elem.appendChild(tBody);
					}
					tBody.appendChild(child);
				} else if (elem.canHaveChildren !== false) {
					elem.appendChild(child);
				}
			} else if (elem.tagName && elem.tagName.toLowerCase() === "style" && document.createStyleSheet) {
				// IE requires this interface for styles
				elem.cssText = child;
			} else if (elem.canHaveChildren !== false) {
				elem.appendChild(child);
			} else if (elem.tagName && elem.tagName.toLowerCase() === "object" &&
				child.tagName && child.tagName.toLowerCase() === "param") {
					// IE-only path
					try {
						elem.appendChild(child);
					} catch (ex1) {}
					try {
						if (elem.object) {
							elem.object[child.name] = child.value;
						}
					} catch (ex2) {}
			}
		}
	}

	/*bool*/ function isWhitespace(/*DOM*/ node) {
		return node && (node.nodeType === 3) && (!node.nodeValue || !/\S/.exec(node.nodeValue));
	}

	/*void*/ function trimWhitespace(/*DOM*/ elem) {
		if (elem) {
			while (isWhitespace(elem.firstChild)) {
				// trim leading whitespace text nodes
				elem.removeChild(elem.firstChild);
			}
			while (isWhitespace(elem.lastChild)) {
				// trim trailing whitespace text nodes
				elem.removeChild(elem.lastChild);
			}
		}
	}

	/*DOM*/ function hydrate(/*string*/ value) {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = value;

		// trim extraneous whitespace
		trimWhitespace(wrapper);

		// eliminate wrapper for single nodes
		if (wrapper.childNodes.length === 1) {
			return wrapper.firstChild;
		}

		// create a document fragment to hold elements
		var frag = document.createDocumentFragment ?
			document.createDocumentFragment() :
			document.createElement("");

		while (wrapper.firstChild) {
			frag.appendChild(wrapper.firstChild);
		}
		return frag;
	}

	function Unparsed(/*string*/ value) {
		this.value = value;
	}
	// default error handler
	/*DOM*/ function onError(/*Error*/ ex, /*JsonML*/ jml, /*function*/ filter) {
		return document.createTextNode("["+ex+"]");
	}

	/* override this to perform custom error handling during binding */
	JsonML.onerror = null;

	/*DOM*/ function patch(/*DOM*/ elem, /*JsonML*/ jml, /*function*/ filter) {

	for (var i=1; i<jml.length; i++) {
			if (jml[i] instanceof Array || "string" === typeof jml[i]) {
				// append children
				appendChild(elem, JsonML.parse(jml[i], filter));
			} else if (jml[i] instanceof Unparsed) {
				appendChild(elem, hydrate(jml[i].value));
			} else if ("object" === typeof jml[i] && jml[i] !== null && elem.nodeType === 1) {
				// add attributes
				elem = addAttributes(elem, jml[i]);
			}
		}

		return elem;
	}

	/*DOM*/ JsonML.parse = function(/*JsonML*/ jml, /*function*/ filter) {
		try {
			if (!jml) {
				return null;
			}
			if ("string" === typeof jml) {
				return document.createTextNode(jml);
			}
			if (jml instanceof Unparsed) {
				return hydrate(jml.value);
			}
			if (!JsonML.isElement(jml)) {
				throw new SyntaxError("invalid JsonML");
			}

			var tagName = jml[0]; // tagName
			if (!tagName) {
				// correctly handle a list of JsonML trees
				// create a document fragment to hold elements
				var frag = document.createDocumentFragment ?
					document.createDocumentFragment() :
					document.createElement("");
				for (var i=1; i<jml.length; i++) {
					appendChild(frag, JsonML.parse(jml[i], filter));
				}

				// trim extraneous whitespace
				trimWhitespace(frag);

				// eliminate wrapper for single nodes
				if (frag.childNodes.length === 1) {
					return frag.firstChild;
				}
				return frag;
			}

			if (tagName.toLowerCase() === "style" && document.createStyleSheet) {
				// IE requires this interface for styles
				JsonML.patch(document.createStyleSheet(), jml, filter);
				// in IE styles are effective immediately
				return null;
			}
//!!!!!!!!!!!!!!
			svgns   = 'http://www.w3.org/2000/svg';
			var elem;
//			elem = patch(document.createElement(tagName), jml, filter);
			elem = patch(document.createElementNS(svgns, tagName), jml, filter);
//!!!!!!!!!!!!!!
			// trim extraneous whitespace
			trimWhitespace(elem);
			return (elem && "function" === typeof filter) ? filter(elem) : elem;
		} catch (ex) {
			try {
				// handle error with complete context
				var err = ("function" === typeof JsonML.onerror) ? JsonML.onerror : onError;
				return err(ex, jml, filter);
			} catch (ex2) {
				return document.createTextNode("["+ex2+"]");
			}
		}
	};

	/*bool*/ JsonML.isElement = function(/*JsonML*/ jml) {
		return (jml instanceof Array) && ("string" === typeof jml[0]);
	};

})();

var WaveDrom = {
	version: "0.6.2",
	timer: 0,
	lane: {
		xs     : 20,    // tmpgraphlane0.width
		ys     : 20,    // tmpgraphlane0.height
		xg     : 120,   // tmpgraphlane0.x
		y0     : 10,    // tmpgraphlane0.y
		yo     : 30,    // tmpgraphlane1.y - y0;
		tgo    : -10,   // tmptextlane0.x - xg;
		ym     : 15,    // tmptextlane0.y - y0
		xlabel : 6,     // tmptextlabel.x - xg;
		xmax   : 1,
		scale  : 1
	},
	canvas: {
		heigth : 85 // tmpview.height;
	},
	panela: {
		ys : 200
	},
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
		case 'p': return this.genBrick(['pclk', '111', 'nclk', '000'], extra, times);
		case 'n': return this.genBrick(['nclk', '000', 'pclk', '111'], extra, times);
		case 'P': return this.genBrick(['Pclk', '111', 'nclk', '000'], extra, times);
		case 'N': return this.genBrick(['Nclk', '000', 'pclk', '111'], extra, times);
		case '0': return this.genBrick(['000'], extra, times);
		case '1': return this.genBrick(['111'], extra, times);
		case '=': return this.genBrick(['vvv-2'], extra, times);
		case '2': return this.genBrick(['vvv-2'], extra, times);
		case '3': return this.genBrick(['vvv-3'], extra, times);
		case '4': return this.genBrick(['vvv-4'], extra, times);
		case '5': return this.genBrick(['vvv-5'], extra, times);
		case 'd': return this.genBrick(['ddd'], extra, times);
		case 'u': return this.genBrick(['uuu'], extra, times);
		case 'z': return this.genBrick(['zzz'], extra, times);
		default:  return this.genBrick(['xxx'], extra, times);
		}
	},
	genWaveBrick: function (text, extra, times) {
		"use strict";
		var v, H = {
			'00': ['0m0',   '000'], '01': ['0m1',   '111'], '0x': ['0mx',   'xxx'], '0d': ['0md',   'ddd'], '0u': ['0mu',   'uuu'], '0z': ['0mz',   'zzz'],     '0=': ['0mv-2',   'vvv-2'], '02': ['0mv-2',   'vvv-2'], '03': ['0mv-3',   'vvv-3'], '04': ['0mv-4',   'vvv-4'], '05': ['0mv-5',   'vvv-5'],
			'10': ['1m0',   '000'], '11': ['1m1',   '111'], '1x': ['1mx',   'xxx'], '1d': ['1md',   'ddd'], '1u': ['1mu',   'uuu'], '1z': ['1mz',   'zzz'],     '1=': ['1mv-2',   'vvv-2'], '12': ['1mv-2',   'vvv-2'], '13': ['1mv-3',   'vvv-3'], '14': ['1mv-4',   'vvv-4'], '15': ['1mv-5',   'vvv-5'],
			'x0': ['xm0',   '000'], 'x1': ['xm1',   '111'], 'xx': ['xmx',   'xxx'], 'xd': ['xmd',   'ddd'], 'xu': ['xmu',   'uuu'], 'xz': ['xmz',   'zzz'],     'x=': ['xmv-2',   'vvv-2'], 'x2': ['xmv-2',   'vvv-2'], 'x3': ['xmv-3',   'vvv-3'], 'x4': ['xmv-4',   'vvv-4'], 'x5': ['xmv-5',   'vvv-5'],
			'.0': ['xm0',   '000'], '.1': ['xm1',   '111'], '.x': ['xmx',   'xxx'], '.d': ['xmd',   'ddd'], '.u': ['xmu',   'uuu'], '.z': ['xmz',   'zzz'],     '.=': ['xmv-2',   'vvv-2'], '.2': ['xmv-2',   'vvv-2'], '.3': ['xmv-3',   'vvv-3'], '.4': ['xmv-4',   'vvv-4'], '.5': ['xmv-5',   'vvv-5'],
			'd0': ['dm0',   '000'], 'd1': ['dm1',   '111'], 'dx': ['dmx',   'xxx'], 'dd': ['dmd',   'ddd'], 'du': ['dmu',   'uuu'], 'dz': ['dmz',   'zzz'],     'd=': ['dmv-2',   'vvv-2'], 'd2': ['dmv-2',   'vvv-2'], 'd3': ['dmv-3',   'vvv-3'], 'd4': ['dmv-4',   'vvv-4'], 'd5': ['dmv-5',   'vvv-5'],
			'u0': ['um0',   '000'], 'u1': ['um1',   '111'], 'ux': ['umx',   'xxx'], 'ud': ['umd',   'ddd'], 'uu': ['umu',   'uuu'], 'uz': ['umz',   'zzz'],     'u=': ['umv-2',   'vvv-2'], 'u2': ['umv-2',   'vvv-2'], 'u3': ['umv-3',   'vvv-3'], 'u4': ['umv-4',   'vvv-4'], 'u5': ['umv-5',   'vvv-5'],
			'z0': ['zm0',   '000'], 'z1': ['zm1',   '111'], 'zx': ['zmx',   'xxx'], 'zd': ['zmd',   'ddd'], 'zu': ['zmu',   'uuu'], 'zz': ['zmz',   'zzz'],     'z=': ['zmv-2',   'vvv-2'], 'z2': ['zmv-2',   'vvv-2'], 'z3': ['zmv-3',   'vvv-3'], 'z4': ['zmv-4',   'vvv-4'], 'z5': ['zmv-5',   'vvv-5'],

			'=0': ['vm0-2', '000'], '=1': ['vm1-2', '111'], '=x': ['vmx-2', 'xxx'], '=d': ['vmd-2', 'ddd'], '=u': ['vmu-2', 'uuu'], '=z': ['vmz-2', 'zzz'],     '==': ['vmv-2-2', 'vvv-2'], '=2': ['vmv-2-2', 'vvv-2'], '=3': ['vmv-2-3', 'vvv-3'], '=4': ['vmv-2-4', 'vvv-4'], '=5': ['vmv-2-5', 'vvv-5'],
			'20': ['vm0-2', '000'], '21': ['vm1-2', '111'], '2x': ['vmx-2', 'xxx'], '2d': ['vmd-2', 'ddd'], '2u': ['vmu-2', 'uuu'], '2z': ['vmz-2', 'zzz'],     '2=': ['vmv-2-2', 'vvv-2'], '22': ['vmv-2-2', 'vvv-2'], '23': ['vmv-2-3', 'vvv-3'], '24': ['vmv-2-4', 'vvv-4'], '25': ['vmv-2-5', 'vvv-5'],
			'30': ['vm0-3', '000'], '31': ['vm1-3', '111'], '3x': ['vmx-3', 'xxx'], '3d': ['vmd-3', 'ddd'], '3u': ['vmu-3', 'uuu'], '3z': ['vmz-3', 'zzz'],     '3=': ['vmv-3-2', 'vvv-2'], '32': ['vmv-3-2', 'vvv-2'], '33': ['vmv-3-3', 'vvv-3'], '34': ['vmv-3-4', 'vvv-4'], '35': ['vmv-3-5', 'vvv-5'],
			'40': ['vm0-4', '000'], '41': ['vm1-4', '111'], '4x': ['vmx-4', 'xxx'], '4d': ['vmd-4', 'ddd'], '4u': ['vmu-4', 'uuu'], '4z': ['vmz-4', 'zzz'],     '4=': ['vmv-4-2', 'vvv-2'], '42': ['vmv-4-2', 'vvv-2'], '43': ['vmv-4-3', 'vvv-3'], '44': ['vmv-4-4', 'vvv-4'], '45': ['vmv-4-5', 'vvv-5'],
			'50': ['vm0-5', '000'], '51': ['vm1-5', '111'], '5x': ['vmx-5', 'xxx'], '5d': ['vmd-5', 'ddd'], '5u': ['vmu-5', 'uuu'], '5z': ['vmz-5', 'zzz'],     '5=': ['vmv-5-2', 'vvv-2'], '52': ['vmv-5-2', 'vvv-2'], '53': ['vmv-5-3', 'vvv-3'], '54': ['vmv-5-4', 'vvv-4'], '55': ['vmv-5-5', 'vvv-5']
		};
		for (v in H) {
			if (text === v) {
				return this.genBrick(H[v], extra, times);
			}
		}
		return this.genBrick(['xxx'], extra, times);
	},
	parseWaveLane: function (text, extra) {
		"use strict";
		var Repeats, Top, Next, Stack = [], R = [];

		Stack = text.split('');
		Next  = Stack.shift();
		if (Next === 'p' || Next === 'n') {
			return this.genFirstWaveBrick(Next, extra, Stack.length + 1);
		}

		Repeats = 1;
		while (Stack[0] === '.' || Stack[0] === '|' ) { // repeaters parser
			Stack.shift();
			Repeats += 1;
		}
		R = R.concat(this.genFirstWaveBrick(Next, extra, Repeats));

		while (Stack.length) {
			Top  = Next;
			Next = Stack.shift();
			Repeats = 1;
			while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
				Stack.shift();
				Repeats += 1;
			}
			R = R.concat(this.genWaveBrick((Top + Next), extra, Repeats));
		}
		return R;
	}
};

WaveDrom.ViewSVG = function (label) {
	"use strict";
	var f, ser, str;

	f   = document.getElementById (label);
	ser = new XMLSerializer();
	str = '<?xml version="1.0" standalone="no"?>\n' +
	'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
	'<!-- Created with WaveDrom -->\n' +
	ser.serializeToString (f);
	window.open ('data:image/svg+xml;base64,' + base64_encode(str), '_blank');
};

WaveDrom.ViewSourceSVG = function (label) {
	"use strict";
	var f, ser, str;

	f   = document.getElementById (label);
	ser = new XMLSerializer();
	str = '<?xml version="1.0" standalone="no"?>\n' +
	'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
	'<!-- Created with WaveDrom -->\n' +
	ser.serializeToString (f);
	window.open ('view-source:data:image/svg+xml;base64,' + base64_encode(str), '_blank');
};

WaveDrom.parseWaveLanes = function (sig) {
	"use strict";
	var x, content = [];
	for (x in sig) {
		content.push([]);
		content[content.length - 1][0] = sig[x].name;
		if (sig[x].wave) {
			content[content.length - 1][1] = this.parseWaveLane(sig[x].wave, this.lane.hscale-1);
		} else {
			content[content.length - 1][1] = null;
		}
		if (sig[x].data) {
			content[content.length - 1][2] = sig[x].data;
		} else {
			content[content.length - 1][2] = null;
		}
	}
	return content;
};

WaveDrom.FindLaneMarkers = function (lanetext) {
	"use strict";
	var i, gcount = 0, lcount = 0, ret = [];

	for (i in lanetext) {
		if (lanetext[i] === 'vvv-2' | lanetext[i] === 'vvv-3' | lanetext[i] === 'vvv-4' | lanetext[i] === 'vvv-5') {
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
};

WaveDrom.RenderWaveLane = function (root, content, index) {
	"use strict";
	var i, j, k, g, gg, title, b, lanetext, labeltext, labels = [1], nxt_xgmax, scale,
	xmax    = 0,
	xgmax   = 0,
	glengths = [],
	svgns   = 'http://www.w3.org/2000/svg',
	xlinkns = 'http://www.w3.org/1999/xlink';

	for (j = 0; j < content.length; j += 1) {
		if (content[j][0]) {
			g    = document.createElementNS (svgns, 'g');
			g.id = "wavelane_" + j + "_" + index;
			g.setAttribute ('transform', 'translate(0,' + (this.lane.y0 + j * this.lane.yo) + ')');
			root.insertBefore (g, root.firstChild);

			lanetext = document.createTextNode (content[j][0]);
			title = document.createElementNS (svgns, "text");
			title.setAttribute ("x", this.lane.tgo);
			title.setAttribute ("y", this.lane.ym);
			title.setAttribute ("fill", "#0041c4"); // Pantone 288C
			title.setAttribute ("text-anchor", "end");
			title.appendChild (lanetext);
			g.insertBefore (title, g.firstChild);

			scale = this.lane.xs * (this.lane.hscale) * 2;
			glengths.push (title.getBBox().width);

			gg = document.createElementNS(svgns, 'g');
			gg.id = "wavelane_draw_" + j + "_" + index;
//			gg.setAttribute('transform', 'translate(' + this.lane.xg + ')');
			g.insertBefore(gg, g.firstChild);

			if (content[j][1]) {
				if (content[j][2] && content[j][2].length) {
					labels = this.FindLaneMarkers (content[j][1]);

					if (labels.length !== 0) {
						for (k in labels) {
							if (content[j][2] && content[j][2][k]) {
								labeltext = document.createTextNode (content[j][2][k]);
								title = document.createElementNS (svgns, "text");
								title.setAttribute ("x", ((labels[k] * this.lane.xs) + this.lane.xlabel));
								title.setAttribute ("y", this.lane.ym);
								title.setAttribute ("text-anchor", "middle");
								title.appendChild (labeltext);
								gg.insertBefore (title, gg.firstChild);
							}
						}
					}
				}
				for (i = 0; i < content[j][1].length; i += 1) {
					b    = document.createElementNS(svgns, "use");
					b.id = "use_" + i + "_" + j + "_" + index;
					b.setAttributeNS(xlinkns, 'xlink:href', '#' + content[j][1][i]);
					b.setAttribute('transform', 'translate(' + (i * this.lane.xs) + ')');
					gg.insertBefore(b, gg.firstChild);
				}
					if (content[j][1].length > xmax) {
					xmax = content[j][1].length;
				}
			}
		}
	}
	this.lane.xmax = xmax;
	this.lane.xg = xgmax + 20;
	return glengths;
};

WaveDrom.RenderMarks = function (root, content, index) {
	"use strict";
	var i, g, marks, mstep, mmstep, gmark, tmark, labeltext, gy, margin,
	svgns   = 'http://www.w3.org/2000/svg';

	mstep  = 2 * (this.lane.hscale);
	mmstep = mstep * this.lane.xs;
	marks  = this.lane.xmax / mstep + 1;
	margin = 5;
	gy     = content.length * this.lane.yo + this.lane.y0 + this.lane.ys;

	g = document.createElementNS (svgns, 'g');
	g.id = "gmarks_" + index;
	root.insertBefore (g, root.firstChild);

	for (i = 0; i < marks; i += 1) {
		gmark = document.createElementNS (svgns, "path");
		gmark.id = ("gmark_" + i + "_" + index);
		gmark.setAttribute ('d', 'm ' + (i * mmstep) + ',5 0,' + (gy - 2 * margin));
		gmark.setAttribute ('style', 'stroke:#888888;stroke-width:0.5;stroke-dasharray:2, 2');
		g.insertBefore (gmark, g.firstChild);
	}
	for (i = 1; i < marks; i += 1) {
		labeltext = document.createTextNode (i);
		tmark = document.createElementNS (svgns, "text");
		tmark.setAttribute ("x", i * mmstep - mmstep / 2);
		tmark.setAttribute ("y", gy - margin);
		tmark.setAttribute ("text-anchor", "middle");
		tmark.setAttribute ("fill", "#AAAAAA");
		tmark.appendChild (labeltext);
		g.insertBefore (tmark, g.firstChild);
	}
};

WaveDrom.RenderGroups = function (root, groups, index) {
	"use strict";
	var svgns, g, i, group, grouplabel, label, x, y;
	
	svgns = 'http://www.w3.org/2000/svg';
	
	for (i in groups) {
		group = document.createElementNS (svgns, "path");
		group.id = ("group_" + i + "_" + index);
		group.setAttribute ('d', 'm '+(groups[i].x)+','+(groups[i].y * this.lane.yo + 8)+' c -3,0 -5,2 -5,5 l 0,'+(groups[i].height * this.lane.yo - 16)+' c 0,3 2,5 5,5');
		group.setAttribute ('style', 'stroke:#0041c4;stroke-width:1;fill:none');
		root.insertBefore (group, root.firstChild);

		if (typeof groups[i].name === 'string') {
			grouplabel = document.createTextNode (groups[i].name);
			label = document.createElementNS (svgns, "text");
			x = (groups[i].x - 10);
			y = (this.lane.yo * (groups[i].y + (groups[i].height / 2)) + 5);
			label.setAttribute ("x", x);
			label.setAttribute ("y", y);
			label.setAttribute ("text-anchor", "middle");
			label.setAttribute ("fill", "#0041c4");
			label.setAttribute ("transform", "rotate(270,"+x+","+y+")");
			label.appendChild (grouplabel);
			root.insertBefore (label, root.firstChild);
		}
	}
}

WaveDrom.RenderGaps = function (root, source, index) {
	"use strict";
	var i, gg, g, b, pos, Stack = [], text,
		svgns   = 'http://www.w3.org/2000/svg',
		xlinkns = 'http://www.w3.org/1999/xlink';

	if (source) {

		gg = document.createElementNS (svgns, 'g');
		gg.id = "wavegaps_" + index;
		//gg.setAttribute ('transform', 'translate(' + this.lane.xg + ')');
		root.insertBefore (gg, root.firstChild);

		for (i in source) {
			g = document.createElementNS (svgns, 'g');
			g.id = "wavegap_" + i + "_" + index;
			g.setAttribute ('transform', 'translate(0,' + (this.lane.y0 + i * this.lane.yo) + ')');
			gg.insertBefore (g, gg.firstChild);

			text = source[i].wave;
			if (text) {
				Stack = text.split ('');
				pos = 0;
				while (Stack.length) {
					if (Stack.shift() === '|') {
						b    = document.createElementNS (svgns, "use");
						b.id = "guse_" + pos + "_" + i + "_" + index;
						b.setAttributeNS (xlinkns, 'xlink:href', '#gap');
						b.setAttribute ('transform', 'translate(' + ((2 * pos + 1) * (this.lane.hscale) * this.lane.xs) + ')');
						g.insertBefore (b, g.firstChild);
					}
					pos += 1;
				}
			}
		}
	}
};

WaveDrom.parseConfig = function (source) {
	"use strict";
	var x, content = [];

	this.lane.hscale = 1;
	if (this.lane.hscale0) {
		this.lane.hscale = this.lane.hscale0;
	}
	if (source.config) {
		if (source.config.hscale) {
			this.lane.hscale = source.config.hscale;
		}
	}
};

WaveDrom.rec = function (tmp, state) {
	"use strict";
	var i, name, old = {}, delta = {"x":10};
	if (typeof tmp[0] === 'string') {
		name = tmp[0];
		delta.x = 25;
	}
	state.x += delta.x;
	for (i in tmp) {
		if (typeof tmp[i] === 'object') {
			if (Object.prototype.toString.call (tmp[i]) === '[object Array]') {
				old.y = state.y;
				state = this.rec (tmp[i], state);
				state.groups.push ({"x":state.xx, "y":old.y, "height":(state.y - old.y), "name":state.name});
			} else {
				state.lanes.push (tmp[i]);
				state.width.push (state.x);
				state.y += 1;
			}
		}
	}
	state.xx = state.x;
	state.x -= delta.x;
	state.name = name;
	return state;
};

WaveDrom.RenderWaveForm = function (index) {
	"use strict";
	var root, groups, svgcontent, TheTextBox, content, source, width, height, uwidth, uheight, ret, glengths, xmax = 0, i;

	root          = document.getElementById ("lanes_" + index);
	groups        = document.getElementById ("groups_" + index);
	svgcontent    = document.getElementById ("svgcontent_" + index);
	TheTextBox    = document.getElementById ("InputJSON_" + index);
	if (TheTextBox.type && TheTextBox.type == 'textarea') {
		source = eval ('(' + TheTextBox.value + ')');
	} else {
		source = eval ('(' + TheTextBox.innerHTML + ')');
	}

	this.parseConfig (source);

	if (source.signal) {
		ret = this.rec (source.signal, {'x':0, 'y':0, 'xmax':0, 'width':[], 'lanes':[], 'groups':[]});
		this.RenderGaps (root, ret.lanes, index);
		this.RenderGroups (groups, ret.groups, index);
		content  = this.parseWaveLanes (ret.lanes);
		glengths = this.RenderWaveLane (root, content, index);
		for (i in glengths) {
			xmax = Math.max (xmax, (glengths[i] + ret.width[i]));
		}
		this.RenderMarks (root, content, index);
		this.lane.xg = Math.ceil ((xmax - this.lane.tgo) / this.lane.xs) * this.lane.xs;
	}

	width  = (this.lane.xg + (this.lane.xs * (this.lane.xmax + 1)));
	height = (content.length * this.lane.yo + this.lane.y0 + this.lane.ys);

	if (this.lane.scale === 3) {
//		uwidth  = '100%';
		uwidth  = (window.innerWidth - 15);
//		uheight = '100%';
		uheight = (window.innerHeight - (10+7+16+7+(WaveDrom.panela.ys)+7+16+7+16+7));
	} else {
		uwidth  = this.lane.scale * width;
		uheight = this.lane.scale * height;
	}
	
	svgcontent.setAttribute('viewBox', "0 0 " + width + " " + height);
	svgcontent.setAttribute('width', uwidth);
	svgcontent.setAttribute('height', uheight);

	root.setAttribute ('transform', 'translate(' + this.lane.xg + ')');
};

WaveDrom.InsertSVGTemplate = function (index, parent) {
	"use strict";
	var node0, node1;

	node1 = JsonML.parse(WaveSkin);
	node1.id = "svgcontent_" + index;
	node1.setAttribute ('height', '0');
	parent.insertBefore (node1, parent.firstChild);

	node0 = document.getElementById('waves');
	node0.id = "waves_" + index;

	node0 = document.getElementById('groups');
	node0.id = "groups_" + index;

	node0 = document.getElementById('lanes');
	node0.id = "lanes_" + index;
};

WaveDrom.ProcessAll = function () {
	"use strict";
	var index, points, i, node0, node1;

	// backward markup
	index = 0;
	points = document.getElementsByTagName ('SCRIPT');
	for (i = points.length-1; i > 0; i -= 1) {
		if (points.item(i).type && points.item(i).type == 'WaveDrom') {
			points.item(i).setAttribute ('id', 'InputJSON_' + index);

			node0 = document.createElement('div');
			node0.className += "WaveDrom_Display_" + index;
			points.item(i).parentNode.insertBefore (node0, points.item(i));

			WaveDrom.InsertSVGTemplate (index, node0);

			index += 1;
		}
	}
	// forward markup
	for (i = 0; i < index; i += 1) {
		WaveDrom.RenderWaveForm (i);
	}
};

WaveDrom.resize = function () {
	"use strict";
	document.getElementById('PanelB').style.height = (window.innerHeight - (10+7+16+7+(WaveDrom.panela.ys)+7+16+7+16+7)) + 'px';
	document.getElementById('PanelA').style.height = WaveDrom.panela.ys + 'px';
};

WaveDrom.ClearWaveLane = function (index) {
	"use strict";
	var root = document.getElementById ('lanes_' + index);
	while (root.childNodes.length) {
		root.removeChild (root.childNodes[0]);
	}
	var root = document.getElementById ('groups_' + index);
	while (root.childNodes.length) {
		root.removeChild (root.childNodes[0]);
	}
};

WaveDrom.EditorKeyUp = function (event) {
	"use strict";
	if (event) {
		switch (event.keyCode) {
			case 16: break; // Shift
			case 17: break; // Ctrl
			case 18: break; // Alt

			case 33: break; // Page Up
			case 34: break; // Page Down
			case 35: break; // End
			case 36: break; // Home
			case 37: break; // Arrow Left
			case 38: break; // Arrow Up
			case 39: break; // Arrow Right
			case 40: break; // Arrow Down

			case 91: break; // Windows
			case 93: break; // Right Click
			default: {
				if (WaveDrom.timer) {
					clearTimeout (WaveDrom.timer);
				}
				WaveDrom.timer = setTimeout ("WaveDrom.EditorRefresh()", 750);
				return;
			}
		}
		if (WaveDrom.timer) {
			clearTimeout (WaveDrom.timer);
			WaveDrom.timer = setTimeout ("WaveDrom.EditorRefresh()", 750);
		}
	}
//	WaveDrom.EditorRefresh();
};

WaveDrom.EditorRefresh = function () {
	"use strict";
	WaveDrom.ClearWaveLane (0);
	WaveDrom.resize ();
	WaveDrom.RenderWaveForm (0);
};

WaveDrom.EditorInit = function () {
	"use strict";
	var index, points, i, node0, node1;
	this.lane.scale = 3;
	index = 0;
	WaveDrom.WaveformLoad ();
	WaveDrom.InsertSVGTemplate (index, document.getElementById ('WaveDrom_Display_' + index));
	WaveDrom.EditorRefresh ();
	WaveDrom.ConfigurationLoad ();
	window.onresize = WaveDrom.EditorRefresh;
};

WaveDrom.ExpandInputWindow = function () {
	"use strict";
	if (WaveDrom.panela.ys < (0.707 * window.innerHeight)) {
		WaveDrom.panela.ys += 50;
		WaveDrom.EditorRefresh ();
	}
};

WaveDrom.ConfigurationLoad = function () {

  var favorite = localStorage["color"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("color");
  if(!select) {
	return;
  }
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }

  //document.getElementById("InputJSON_0").value = localStorage["input"];
  //document.getElementById("color").firstChild.nodeValue = localStorage["color"];
};

WaveDrom.ConfigurationSave = function () {

  var select = document.getElementById("color");
  var color = select.children[select.selectedIndex].value;
  localStorage["color"] = color;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

WaveDrom.WaveformLoad = function() {
	var waveform = localStorage["waveform"];

	if(waveform)
		document.getElementById("InputJSON_0").value = waveform;
}

WaveDrom.WaveformSave = function() {
	var waveform = document.getElementById("InputJSON_0").value;

	if(waveform)
		WaveDrom.ConfigurationSaveWaveform(waveform);
}

WaveDrom.ConfigurationSaveWaveform = function(waveform) {
	localStorage["waveform"] = waveform;
}

WaveDrom.CollapseInputWindow = function () {
	"use strict";
	if (WaveDrom.panela.ys > 100) {
		WaveDrom.panela.ys -= 50;
		WaveDrom.EditorRefresh ();
	}
};

WaveDrom.SetHScale = function (hscale) {
	"use strict";
	WaveDrom.lane.hscale0 = parseFloat(hscale);
	WaveDrom.EditorRefresh ();
};

WaveDrom.SetScale = function (scale) {
	"use strict";
	WaveDrom.lane.scale = parseFloat(scale);
	WaveDrom.EditorRefresh ();
};

window.onload = WaveDrom.ProcessAll;
