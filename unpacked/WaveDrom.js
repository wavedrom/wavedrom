/*jslint browser: true, windows: true, passfail: false, evil: true, sloppy: false, white: true, indent: 4, maxerr: 1000 */

var JsonML;
if (undefined === JsonML) { JsonML = {}; }

(function () {
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
		EVTS = (function (/*string[]*/ names) {
			var evts = {}, evt;
			while (names.length) {
				evt = names.shift();
				evts["on" + evt.toLowerCase()] = evt;
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
				var alt = document.createElement("<" + elem.tagName + " name='" + attr.name + "'>");
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
						elem.setAttribute(name, value);
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
					var tBody = elem.tBodies.length > 0 ? elem.tBodies[elem.tBodies.length - 1] : null;
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
		return document.createTextNode("[" + ex + "]");
	}

	/* override this to perform custom error handling during binding */
	JsonML.onerror = null;

	/*DOM*/ function patch(/*DOM*/ elem, /*JsonML*/ jml, /*function*/ filter) {

		for (var i = 1; i < jml.length; i++) {
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

	/*DOM*/ JsonML.parse = function (/*JsonML*/ jml, /*function*/ filter) {
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
				for (var i = 1; i < jml.length; i++) {
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
				return document.createTextNode("[" + ex2 + "]");
			}
		}
	};

	/*bool*/ JsonML.isElement = function (/*JsonML*/ jml) {
		return (jml instanceof Array) && ("string" === typeof jml[0]);
	};

})();

var WaveDrom = {
	version: "2013.04.23",
	timer: 0,
	lane: {
		xs     : 20,    // tmpgraphlane0.width
		ys     : 20,    // tmpgraphlane0.height
		xg     : 120,   // tmpgraphlane0.x
//		yg     : 0,     // head gap
		yh0    : 0,     // head gap title
		yh1    : 0,     // head gap 
		yf0    : 0,     // foot gap
		yf1    : 0,     // foot gap
		y0     : 5,    // tmpgraphlane0.y
		yo     : 30,    // tmpgraphlane1.y - y0;
		tgo    : -10,   // tmptextlane0.x - xg;
		ym     : 15,    // tmptextlane0.y - y0
		xlabel : 6,     // tmptextlabel.x - xg;
		xmax   : 1,
		scale  : 1,
		head   : {},
		foot   : {}
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
	genFirstWaveBrick: function (text, extra, times) {
		"use strict";
		var i, tmp = [];
		switch (text) {
			case 'p': tmp = this.genBrick(['pclk', '111', 'nclk', '000'], extra, times); break;
			case 'n': tmp = this.genBrick(['nclk', '000', 'pclk', '111'], extra, times); break;
			case 'P': tmp = this.genBrick(['Pclk', '111', 'nclk', '000'], extra, times); break;
			case 'N': tmp = this.genBrick(['Nclk', '000', 'pclk', '111'], extra, times); break;
			case '0': tmp = this.genBrick(['000'], extra, times); break;
			case '1': tmp = this.genBrick(['111'], extra, times); break;
			case '=': tmp = this.genBrick(['vvv-2'], extra, times); break;
			case '2': tmp = this.genBrick(['vvv-2'], extra, times); break;
			case '3': tmp = this.genBrick(['vvv-3'], extra, times); break;
			case '4': tmp = this.genBrick(['vvv-4'], extra, times); break;
			case '5': tmp = this.genBrick(['vvv-5'], extra, times); break;
			case 'd': tmp = this.genBrick(['ddd'], extra, times); break;
			case 'u': tmp = this.genBrick(['uuu'], extra, times); break;
			case 'z': tmp = this.genBrick(['zzz'], extra, times); break;
			default:  tmp = this.genBrick(['xxx'], extra, times); break;
		}
		return tmp;
	},
	genWaveBrick: function (text, extra, times) {
		"use strict";
		var v, H = {
			'pp': ['pclk', '111', 'nclk', '000'], 'pn': ['nclk', '000', 'pclk', '111'], 'pP': ['Pclk', '111', 'nclk', '000'], 'pN': ['Nclk', '000', 'pclk', '111'],     'p0': ['000',   '000'], 'p1': ['0m1',   '111'], 'px': ['0mx',   'xxx'], 'pd': ['0md',   'ddd'], 'pu': ['0mu',   'uuu'], 'pz': ['0mz',   'zzz'],     'p=': ['0mv-2',   'vvv-2'], 'p2': ['0mv-2',   'vvv-2'], 'p3': ['0mv-3',   'vvv-3'], 'p4': ['0mv-4',   'vvv-4'], 'p5': ['0mv-5',   'vvv-5'],
			'np': ['pclk', '111', 'nclk', '000'], 'nn': ['nclk', '000', 'pclk', '111'], 'nP': ['Pclk', '111', 'nclk', '000'], 'nN': ['Nclk', '000', 'pclk', '111'],     'n0': ['1m0',   '000'], 'n1': ['111',   '111'], 'nx': ['1mx',   'xxx'], 'nd': ['1md',   'ddd'], 'nu': ['1mu',   'uuu'], 'nz': ['1mz',   'zzz'],     'n=': ['1mv-2',   'vvv-2'], 'n2': ['1mv-2',   'vvv-2'], 'n3': ['1mv-3',   'vvv-3'], 'n4': ['1mv-4',   'vvv-4'], 'n5': ['1mv-5',   'vvv-5'],
			'Pp': ['pclk', '111', 'nclk', '000'], 'Pn': ['nclk', '000', 'pclk', '111'], 'PP': ['Pclk', '111', 'nclk', '000'], 'PN': ['Nclk', '000', 'pclk', '111'],     'P0': ['000',   '000'], 'P1': ['0m1',   '111'], 'Px': ['0mx',   'xxx'], 'Pd': ['0md',   'ddd'], 'Pu': ['0mu',   'uuu'], 'Pz': ['0mz',   'zzz'],     'P=': ['0mv-2',   'vvv-2'], 'P2': ['0mv-2',   'vvv-2'], 'P3': ['0mv-3',   'vvv-3'], 'P4': ['0mv-4',   'vvv-4'], 'P5': ['0mv-5',   'vvv-5'],
			'Np': ['pclk', '111', 'nclk', '000'], 'Nn': ['nclk', '000', 'pclk', '111'], 'NP': ['Pclk', '111', 'nclk', '000'], 'NN': ['Nclk', '000', 'pclk', '111'],     'N0': ['1m0',   '000'], 'N1': ['111',   '111'], 'Nx': ['1mx',   'xxx'], 'Nd': ['1md',   'ddd'], 'Nu': ['1mu',   'uuu'], 'Nz': ['1mz',   'zzz'],     'N=': ['1mv-2',   'vvv-2'], 'N2': ['1mv-2',   'vvv-2'], 'N3': ['1mv-3',   'vvv-3'], 'N4': ['1mv-4',   'vvv-4'], 'N5': ['1mv-5',   'vvv-5'],

			'0p': ['pclk', '111', 'nclk', '000'], '0n': ['nclk', '000', 'pclk', '111'], '0P': ['Pclk', '111', 'nclk', '000'], '0N': ['Nclk', '000', 'pclk', '111'],     '00': ['0m0',   '000'], '01': ['0m1',   '111'], '0x': ['0mx',   'xxx'], '0d': ['0md',   'ddd'], '0u': ['0mu',   'uuu'], '0z': ['0mz',   'zzz'],     '0=': ['0mv-2',   'vvv-2'], '02': ['0mv-2',   'vvv-2'], '03': ['0mv-3',   'vvv-3'], '04': ['0mv-4',   'vvv-4'], '05': ['0mv-5',   'vvv-5'],
			'1p': ['pclk', '111', 'nclk', '000'], '1n': ['nclk', '000', 'pclk', '111'], '1P': ['Pclk', '111', 'nclk', '000'], '1N': ['Nclk', '000', 'pclk', '111'],     '10': ['1m0',   '000'], '11': ['1m1',   '111'], '1x': ['1mx',   'xxx'], '1d': ['1md',   'ddd'], '1u': ['1mu',   'uuu'], '1z': ['1mz',   'zzz'],     '1=': ['1mv-2',   'vvv-2'], '12': ['1mv-2',   'vvv-2'], '13': ['1mv-3',   'vvv-3'], '14': ['1mv-4',   'vvv-4'], '15': ['1mv-5',   'vvv-5'],
			'xp': ['pclk', '111', 'nclk', '000'], 'xn': ['nclk', '000', 'pclk', '111'], 'xP': ['Pclk', '111', 'nclk', '000'], 'xN': ['Nclk', '000', 'pclk', '111'],     'x0': ['xm0',   '000'], 'x1': ['xm1',   '111'], 'xx': ['xmx',   'xxx'], 'xd': ['xmd',   'ddd'], 'xu': ['xmu',   'uuu'], 'xz': ['xmz',   'zzz'],     'x=': ['xmv-2',   'vvv-2'], 'x2': ['xmv-2',   'vvv-2'], 'x3': ['xmv-3',   'vvv-3'], 'x4': ['xmv-4',   'vvv-4'], 'x5': ['xmv-5',   'vvv-5'],
			'.p': ['pclk', '111', 'nclk', '000'], '.n': ['nclk', '000', 'pclk', '111'], '.P': ['Pclk', '111', 'nclk', '000'], '.N': ['Nclk', '000', 'pclk', '111'],     '.0': ['xm0',   '000'], '.1': ['xm1',   '111'], '.x': ['xmx',   'xxx'], '.d': ['xmd',   'ddd'], '.u': ['xmu',   'uuu'], '.z': ['xmz',   'zzz'],     '.=': ['xmv-2',   'vvv-2'], '.2': ['xmv-2',   'vvv-2'], '.3': ['xmv-3',   'vvv-3'], '.4': ['xmv-4',   'vvv-4'], '.5': ['xmv-5',   'vvv-5'],
			'dp': ['pclk', '111', 'nclk', '000'], 'dn': ['nclk', '000', 'pclk', '111'], 'dP': ['Pclk', '111', 'nclk', '000'], 'dN': ['Nclk', '000', 'pclk', '111'],     'd0': ['dm0',   '000'], 'd1': ['dm1',   '111'], 'dx': ['dmx',   'xxx'], 'dd': ['dmd',   'ddd'], 'du': ['dmu',   'uuu'], 'dz': ['dmz',   'zzz'],     'd=': ['dmv-2',   'vvv-2'], 'd2': ['dmv-2',   'vvv-2'], 'd3': ['dmv-3',   'vvv-3'], 'd4': ['dmv-4',   'vvv-4'], 'd5': ['dmv-5',   'vvv-5'],
			'up': ['pclk', '111', 'nclk', '000'], 'un': ['nclk', '000', 'pclk', '111'], 'uP': ['Pclk', '111', 'nclk', '000'], 'uN': ['Nclk', '000', 'pclk', '111'],     'u0': ['um0',   '000'], 'u1': ['um1',   '111'], 'ux': ['umx',   'xxx'], 'ud': ['umd',   'ddd'], 'uu': ['umu',   'uuu'], 'uz': ['umz',   'zzz'],     'u=': ['umv-2',   'vvv-2'], 'u2': ['umv-2',   'vvv-2'], 'u3': ['umv-3',   'vvv-3'], 'u4': ['umv-4',   'vvv-4'], 'u5': ['umv-5',   'vvv-5'],
			'zp': ['pclk', '111', 'nclk', '000'], 'zn': ['nclk', '000', 'pclk', '111'], 'zP': ['Pclk', '111', 'nclk', '000'], 'zN': ['Nclk', '000', 'pclk', '111'],     'z0': ['zm0',   '000'], 'z1': ['zm1',   '111'], 'zx': ['zmx',   'xxx'], 'zd': ['zmd',   'ddd'], 'zu': ['zmu',   'uuu'], 'zz': ['zmz',   'zzz'],     'z=': ['zmv-2',   'vvv-2'], 'z2': ['zmv-2',   'vvv-2'], 'z3': ['zmv-3',   'vvv-3'], 'z4': ['zmv-4',   'vvv-4'], 'z5': ['zmv-5',   'vvv-5'],

			'=p': ['pclk', '111', 'nclk', '000'], '=n': ['nclk', '000', 'pclk', '111'], '=P': ['Pclk', '111', 'nclk', '000'], '=N': ['Nclk', '000', 'pclk', '111'],     '=0': ['vm0-2', '000'], '=1': ['vm1-2', '111'], '=x': ['vmx-2', 'xxx'], '=d': ['vmd-2', 'ddd'], '=u': ['vmu-2', 'uuu'], '=z': ['vmz-2', 'zzz'],     '==': ['vmv-2-2', 'vvv-2'], '=2': ['vmv-2-2', 'vvv-2'], '=3': ['vmv-2-3', 'vvv-3'], '=4': ['vmv-2-4', 'vvv-4'], '=5': ['vmv-2-5', 'vvv-5'],
			'2p': ['pclk', '111', 'nclk', '000'], '2n': ['nclk', '000', 'pclk', '111'], '2P': ['Pclk', '111', 'nclk', '000'], '2N': ['Nclk', '000', 'pclk', '111'],     '20': ['vm0-2', '000'], '21': ['vm1-2', '111'], '2x': ['vmx-2', 'xxx'], '2d': ['vmd-2', 'ddd'], '2u': ['vmu-2', 'uuu'], '2z': ['vmz-2', 'zzz'],     '2=': ['vmv-2-2', 'vvv-2'], '22': ['vmv-2-2', 'vvv-2'], '23': ['vmv-2-3', 'vvv-3'], '24': ['vmv-2-4', 'vvv-4'], '25': ['vmv-2-5', 'vvv-5'],
			'3p': ['pclk', '111', 'nclk', '000'], '3n': ['nclk', '000', 'pclk', '111'], '3P': ['Pclk', '111', 'nclk', '000'], '3N': ['Nclk', '000', 'pclk', '111'],     '30': ['vm0-3', '000'], '31': ['vm1-3', '111'], '3x': ['vmx-3', 'xxx'], '3d': ['vmd-3', 'ddd'], '3u': ['vmu-3', 'uuu'], '3z': ['vmz-3', 'zzz'],     '3=': ['vmv-3-2', 'vvv-2'], '32': ['vmv-3-2', 'vvv-2'], '33': ['vmv-3-3', 'vvv-3'], '34': ['vmv-3-4', 'vvv-4'], '35': ['vmv-3-5', 'vvv-5'],
			'4p': ['pclk', '111', 'nclk', '000'], '4n': ['nclk', '000', 'pclk', '111'], '4P': ['Pclk', '111', 'nclk', '000'], '4N': ['Nclk', '000', 'pclk', '111'],     '40': ['vm0-4', '000'], '41': ['vm1-4', '111'], '4x': ['vmx-4', 'xxx'], '4d': ['vmd-4', 'ddd'], '4u': ['vmu-4', 'uuu'], '4z': ['vmz-4', 'zzz'],     '4=': ['vmv-4-2', 'vvv-2'], '42': ['vmv-4-2', 'vvv-2'], '43': ['vmv-4-3', 'vvv-3'], '44': ['vmv-4-4', 'vvv-4'], '45': ['vmv-4-5', 'vvv-5'],
			'5p': ['pclk', '111', 'nclk', '000'], '5n': ['nclk', '000', 'pclk', '111'], '5P': ['Pclk', '111', 'nclk', '000'], '5N': ['Nclk', '000', 'pclk', '111'],     '50': ['vm0-5', '000'], '51': ['vm1-5', '111'], '5x': ['vmx-5', 'xxx'], '5d': ['vmd-5', 'ddd'], '5u': ['vmu-5', 'uuu'], '5z': ['vmz-5', 'zzz'],     '5=': ['vmv-5-2', 'vvv-2'], '52': ['vmv-5-2', 'vvv-2'], '53': ['vmv-5-3', 'vvv-3'], '54': ['vmv-5-4', 'vvv-4'], '55': ['vmv-5-5', 'vvv-5']
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
		var Repeats, Top, Next, Stack = [], R = [], i;

		Stack = text.split('');
		Next  = Stack.shift();

		Repeats = 1;
		while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
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
		for (i = 0; i < this.lane.phase; i += 1) {
			R.shift();
		}
		return R;
	}
};

WaveDrom.ViewSVG = function (label) {
	"use strict";
	var f, ser, str;

	f   = document.getElementById(label);
	ser = new XMLSerializer();
	str = '<?xml version="1.0" standalone="no"?>\n' +
	'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
	'<!-- Created with WaveDrom -->\n' +
	ser.serializeToString(f);
	window.open('data:image/svg+xml;base64,' + window.btoa(str), '_blank');
};

WaveDrom.ViewSourceSVG = function (label) {
	"use strict";
	var f, ser, str;

	f   = document.getElementById(label);
	ser = new XMLSerializer();
	str = '<?xml version="1.0" standalone="no"?>\n' +
	'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
	'<!-- Created with WaveDrom -->\n' +
	ser.serializeToString(f);
	window.open('view-source:data:image/svg+xml;base64,' + window.btoa(str), '_blank');
};

WaveDrom.parseWaveLanes = function (sig) {
	"use strict";
	function data_extract (e) {
		"use strict";
		var tmp = e.data;
		if (tmp === undefined) { return null };
		if (typeof (tmp) === 'string') { return tmp.split(' ') };
		return tmp;
	};
	var x, sigx, content = [], tmp0 = [];
	for (x in sig) {
		sigx = sig[x];
		this.lane.period = sigx.period ? sigx.period    : 1;
		this.lane.phase  = sigx.phase  ? sigx.phase * 2 : 0;
		content.push([]);
		tmp0[0] = sigx.name  || ' ';
		tmp0[1] = sigx.phase || 0;
		content[content.length - 1][0] = tmp0.slice(0);
		content[content.length - 1][1] = sigx.wave ? this.parseWaveLane(sigx.wave, this.lane.period * this.lane.hscale - 1) : null;
		content[content.length - 1][2] = data_extract(sigx);
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
	xmax     = 0,
	xgmax    = 0,
	glengths = [],
	svgns    = 'http://www.w3.org/2000/svg',
	xlinkns  = 'http://www.w3.org/1999/xlink',
	xmlns    = 'http://www.w3.org/XML/1998/namespace';

	for (j = 0; j < content.length; j += 1) {
		if (content[j][0][0]) { // check name
			g = JsonML.parse(
				['g',
					{
						id: ("wavelane_" + j + "_" + index),
						transform: ('translate(0,' + ((this.lane.y0) + j * this.lane.yo) + ')')
					}
				]
			);
			root.insertBefore(g, null);

			title = JsonML.parse(
				['text',
					{
						x: this.lane.tgo,
						y: this.lane.ym,
						fill: '#0041c4', // Pantone 288C
						'text-anchor': 'end'
					},
					(content[j][0][0] + '') // name
				]
			);
			title.setAttributeNS(xmlns, "xml:space", "preserve");
			g.insertBefore(title, null);

			scale = this.lane.xs * (this.lane.hscale) * 2;
			glengths.push(title.getBBox().width);

			var xoffset;
			xoffset = content[j][0][1];
			xoffset = (xoffset > 0) ? (Math.ceil(2 * xoffset) - 2 * xoffset) :
			(-2 * xoffset);
			gg = JsonML.parse(
				['g',
					{
						id: ("wavelane_draw_" + j + "_" + index),
						transform: ('translate(' + (xoffset * this.lane.xs) + ', 0)')
					}
				]
			);
			g.insertBefore(gg, null);

			if (content[j][1]) {
				for (i = 0; i < content[j][1].length; i += 1) {
					b    = document.createElementNS(svgns, "use");
					b.id = "use_" + i + "_" + j + "_" + index;
					b.setAttributeNS(xlinkns, 'xlink:href', '#' + content[j][1][i]);
//					b.setAttribute('transform', 'translate(' + (i * this.lane.xs) + ')');
					b.setAttribute('transform', 'translate(' + (i * this.lane.xs) + ')');
					gg.insertBefore(b, null);
				}
				if (content[j][2] && content[j][2].length) {
					labels = this.FindLaneMarkers(content[j][1]);

					if (labels.length !== 0) {
						for (k in labels) {
							if (content[j][2] && content[j][2][k]) {
								title = JsonML.parse(
									['text',
										{
											x: ((labels[k] * this.lane.xs) + this.lane.xlabel),
											y: this.lane.ym,
											'text-anchor': 'middle'
										},
										(content[j][2][k] + '')
									]
								);
								title.setAttributeNS(xmlns, "xml:space", "preserve");
								gg.insertBefore(title, null);
							}
						}
					}
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
	var i, offset, g, marks, mstep, mmstep, gmark, tmark, labeltext, gy, margin,
	svgns = 'http://www.w3.org/2000/svg',
	xmlns = 'http://www.w3.org/XML/1998/namespace';

	mstep  = 2 * (this.lane.hscale);
	mmstep = mstep * this.lane.xs;
	marks  = this.lane.xmax / mstep;
	margin = 5;
//	gy     = content.length * this.lane.yo + this.lane.y0 + this.lane.ys;
	gy     = content.length * this.lane.yo; //  + this.lane.y0 + this.lane.ys;

	g = JsonML.parse(['g', {id: ("gmarks_" + index)}]);
	root.insertBefore(g, root.firstChild);

	for (i = 0; i < (marks + 1); i += 1) {
		g.insertBefore(
			JsonML.parse(
				['path',
					{
						id:    ("gmark_" + i + "_" + index),
//						d:     ('m ' + (i * mmstep) + ',' + 5 + ' 0,' + (gy - 2 * margin)),
						d:     ('m ' + (i * mmstep) + ',' + 0 + ' 0,' + gy),
						style: 'stroke:#888888;stroke-width:0.5;stroke-dasharray:1, 3'
					}
				]
			),
			null
		);
	}
	if (this.lane.head && this.lane.head.text) {
			tmark = JsonML.parse(
			['text', {
				x: (this.lane.xmax * this.lane.xs / 2),
				y: (this.lane.yh0 ? -23 : -3),
				'text-anchor': 'middle',
				fill: '#000'
			}, this.lane.head.text]);
			tmark.setAttributeNS(xmlns, "xml:space", "preserve");
			g.insertBefore(tmark, null);
	}
	if (this.lane.head && (this.lane.head.tick || this.lane.head.tick == 0)) {
		offset = Number(this.lane.head.tick);
		for (i = 0; i < (marks + 1); i += 1) {
			tmark = JsonML.parse(['text', {x: (i * mmstep), y: -5, 'text-anchor': 'middle', fill: '#AAAAAA'}, ((i + offset) + '')]);
			tmark.setAttributeNS(xmlns, "xml:space", "preserve");
			g.insertBefore(tmark, null);
		}
	}
	if (this.lane.head && (this.lane.head.tock || this.lane.head.tock == 0)) {
		offset = Number(this.lane.head.tock);
		for (i = 0; i < marks; i += 1) {
			tmark = JsonML.parse(['text', {x: (i * mmstep + mmstep / 2), y: -5, 'text-anchor': 'middle', fill: '#AAAAAA'}, ((i + offset) + '')]);
			tmark.setAttributeNS(xmlns, "xml:space", "preserve");
			g.insertBefore(tmark, null);
		}
	}
	if (this.lane.foot && this.lane.foot.text) {
			tmark = JsonML.parse(
			['text', {
				x: (this.lane.xmax * this.lane.xs / 2),
				y: gy + (this.lane.yf0 ? 35 : 15),
				'text-anchor': 'middle',
				fill: '#000'
			}, this.lane.foot.text]);
			tmark.setAttributeNS(xmlns, "xml:space", "preserve");
			g.insertBefore(tmark, null);
	}
	if (this.lane.foot && (this.lane.foot.tick || this.lane.foot.tick == 0)) {
		offset = Number(this.lane.foot.tick);
		for (i = 0; i < (marks + 1); i += 1) {
			tmark = JsonML.parse(['text', {x: (i * mmstep), y: (gy + 15), 'text-anchor': 'middle', fill: '#AAAAAA'}, ((i + offset) + '')]);
			tmark.setAttributeNS(xmlns, "xml:space", "preserve");
			g.insertBefore(tmark, null);
		}
	}
	if (this.lane.foot && (this.lane.foot.tock || this.lane.foot.tock == 0)) {
		offset = Number(this.lane.foot.tock);
		for (i = 0; i < marks; i += 1) {
			tmark = JsonML.parse(['text', {x: (i * mmstep + mmstep / 2), y: (gy + 15), 'text-anchor': 'middle', fill: '#AAAAAA'}, ((i + offset) + '')]);
			tmark.setAttributeNS(xmlns, "xml:space", "preserve");
			g.insertBefore(tmark, null);
		}
	}
};

WaveDrom.RenderGroups = function (root, groups, index) {
	"use strict";
	var g, i, group, grouplabel, label, x, y,
		svgns = 'http://www.w3.org/2000/svg',
		xmlns = 'http://www.w3.org/XML/1998/namespace';
	
	for (i in groups) {
		group = document.createElementNS(svgns, "path");
		group.id = ("group_" + i + "_" + index);
		group.setAttribute('d', 'm ' + (groups[i].x + 0.5) + ',' + (groups[i].y * this.lane.yo + 3.5 + this.lane.yh0 + this.lane.yh1) + ' c -3,0 -5,2 -5,5 l 0,' + (groups[i].height * this.lane.yo - 16) + ' c 0,3 2,5 5,5');
		group.setAttribute('style', 'stroke:#0041c4;stroke-width:1;fill:none');
		root.insertBefore(group, null);

		if (typeof groups[i].name === 'string') {
			grouplabel = document.createTextNode(groups[i].name);
			label = document.createElementNS(svgns, "text");
			x = (groups[i].x - 10);
			y = (this.lane.yo * (groups[i].y + (groups[i].height / 2)) + this.lane.yh0 + this.lane.yh1);
			label.setAttribute("x", x);
			label.setAttribute("y", y);
			label.setAttribute("text-anchor", "middle");
			label.setAttribute("fill", "#0041c4");
			label.setAttribute("transform", "rotate(270," + x + "," + y + ")");
			label.setAttributeNS(xmlns, "xml:space", "preserve");
			label.appendChild(grouplabel);
			root.insertBefore(label, null);
		}
	}
};

WaveDrom.RenderGaps = function (root, source, index) {
	"use strict";
	var i, gg, g, b, pos, Stack = [], text,
		svgns   = 'http://www.w3.org/2000/svg',
		xlinkns = 'http://www.w3.org/1999/xlink';

	if (source) {

		gg = document.createElementNS(svgns, 'g');
		gg.id = "wavegaps_" + index;
		//gg.setAttribute('transform', 'translate(' + this.lane.xg + ')');
		root.insertBefore(gg, null);

		for (i in source) {
			this.lane.period = source[i].period ? source[i].period    : 1;
			this.lane.phase  = source[i].phase  ? source[i].phase * 2 : 0;
			g = document.createElementNS(svgns, 'g');
			g.id = "wavegap_" + i + "_" + index;
			g.setAttribute('transform', 'translate(0,' + (this.lane.y0 + i * this.lane.yo) + ')');
			gg.insertBefore(g, null);

			text = source[i].wave;
			if (text) {
				Stack = text.split('');
				pos = 0;
				while (Stack.length) {
					if (Stack.shift() === '|') {
						b    = document.createElementNS(svgns, "use");
						b.id = "guse_" + pos + "_" + i + "_" + index;
						b.setAttributeNS(xlinkns, 'xlink:href', '#gap');
						b.setAttribute('transform', 'translate(' + (this.lane.xs * ((2 * pos + 1) * this.lane.period * this.lane.hscale - this.lane.phase)) + ')');
						g.insertBefore(b, null);
					}
					pos += 1;
				}
			}
		}
	}
};

WaveDrom.RenderArcs = function (root, source, index, top) {
	"use strict";
	var gg, i, k, text, Stack = [], Edge = {words: [], from: 0, shape: '', to: 0, label: ''}, Events = {}, pos, eventname, labeltext, label, underlabel, from, to, gmark, lwidth,
		svgns = 'http://www.w3.org/2000/svg',
		xmlns = 'http://www.w3.org/XML/1998/namespace';
	function t1 () {
		gmark = document.createElementNS(svgns, "path");
		gmark.id = ("gmark_" + Edge.from + "_" + Edge.to);
		gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + to.x   + ',' + to.y);
		gmark.setAttribute('style', 'fill:none;stroke:#0000FF;stroke-width:1');
		gg.insertBefore(gmark, null);
	}

	if (source) {
		for (i in source) {
			this.lane.period = source[i].period ? source[i].period    : 1;
			this.lane.phase  = source[i].phase  ? source[i].phase * 2 : 0;
			text = source[i].node;
			if (text) {
				Stack = text.split('');
				pos = 0;
				while (Stack.length) {
					eventname = Stack.shift();
					if (eventname !== '.') {
						Events[eventname] = {
							'x' : this.lane.xs * (2 * pos * this.lane.period * this.lane.hscale - this.lane.phase) + this.lane.xlabel,
							'y' : i * this.lane.yo + this.lane.y0 + this.lane.ys * 0.5
						};
					}
					pos += 1;
				}
			}
		}
		gg = document.createElementNS(svgns, 'g');
		gg.id = "wavearcs_" + index;
		root.insertBefore(gg, null);
		if (top.edge) {
			for (i in top.edge) {
				Edge.words = top.edge[i].split(' ');
				Edge.label = top.edge[i].substring(Edge.words[0].length);
				Edge.label = Edge.label.substring(1);
				Edge.from  = Edge.words[0].substr(0, 1);
				Edge.to    = Edge.words[0].substr(-1, 1);
				Edge.shape = Edge.words[0].slice(1, -1);
				from  = Events[Edge.from];
				to    = Events[Edge.to];
				t1();
				if (Edge.label) {
					label = JsonML.parse(['text', {style: 'font-size:10px;', 'text-anchor': 'middle'}, (Edge.label + '')]);
					label.setAttributeNS(xmlns, "xml:space", "preserve");
					underlabel = JsonML.parse(['rect', {height: 9, style: 'fill:#FFFFFF;'}]);
					gg.insertBefore(underlabel, null);
					gg.insertBefore(label, null);
					lwidth = label.getBBox().width;
					underlabel.setAttribute('width', lwidth);
				}
				var dx = to.x - from.x;
				var dy = to.y - from.y;
				var lx = ((from.x + to.x) / 2);
				var ly = ((from.y + to.y) / 2);
				switch (Edge.shape) {
					case '-'  : {
						break;
					}
					case '~'  : {
						gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' c ' + (0.7 * dx) + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
						break;
					}
					case '-~' : {
						gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' c ' + (0.7 * dx) + ', 0 ' +         dx + ', ' + dy + ' ' + dx + ', ' + dy);
						if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
						break;
					}
					case '~-' : {
						gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' c ' + 0          + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
						if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.25); }
						break;
					}
					case '-|' : {
						gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + dx + ',0 0,' + dy);
						if (Edge.label) { lx = to.x; }
						break;
					}
					case '|-' : {
						gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' 0,' + dy + ' ' + dx + ',0');
						if (Edge.label) { lx = from.x; }
						break;
					}
					case '-|-': {
						gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0');
						break;
					}
					case '->' : {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#00ff00;stroke-width:1;fill:none');
						break;
					}
					case '~>' : {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' + 0.3*dx + ', ' + dy + ' ' + dx + ', ' + dy);
						break;
					}
					case '-~>': {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' +     dx + ', ' + dy + ' ' + dx + ', ' + dy);
						if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
						break;
					}
					case '~->': {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + 0      + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
						if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.25); }
						break;
					}
					case '-|>' : {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + dx + ',0 0,' + dy);
						if (Edge.label) { lx = to.x; }
						break;
					}
					case '|->' : {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' 0,' + dy + ' ' + dx + ',0');
						if (Edge.label) { lx = from.x; }
						break;
					}
					case '-|->': {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0');
						break;
					}
					case '<->' : {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#00ff00;stroke-width:1;fill:none');
						break;
					}
					case '<~>' : {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
						break;
					}
					case '<-~>': {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' +     dx + ', ' + dy + ' ' + dx + ', ' + dy);
						if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
						break;
					}
					case '<-|>' : {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + dx + ',0 0,' + dy);
						if (Edge.label) { lx = to.x; }
						break;
					}
					case '<-|->': {
						gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#00ff00;stroke-width:1;fill:none');
						gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0');
						break;
					}
					default   : { gmark.setAttribute('style', 'fill:none;stroke:#FF0000;stroke-width:1'); }
				}
				if (Edge.label) {
					label.setAttribute('x', lx);
					label.setAttribute('y', ly + 3);
					underlabel.setAttribute('x', lx - lwidth / 2);
					underlabel.setAttribute('y', ly - 5);
				}
			}
		}
		for (k in Events) {
			if (k == k.toLowerCase()) {
				if (Events[k].x > 0) {
					underlabel = JsonML.parse(['rect', {'y': (Events[k].y - 4), height: 8, style: 'fill:#FFFFFF;'}]);
					gg.insertBefore(underlabel, null);
					label = JsonML.parse(['text', {style: 'font-size:8px;', x: Events[k].x, y: (Events[k].y + 2), 'text-anchor': 'middle'}, (k + '')]);
					gg.insertBefore(label, null);
					lwidth = label.getBBox().width + 2;
					underlabel.setAttribute('x', Events[k].x - lwidth / 2);
					underlabel.setAttribute('width', lwidth);
				}
			}
		}
	}
};

WaveDrom.parseConfig = function (source) {
	"use strict";
	function ToNumber(x) {
		return x > 0 ? Math.round(x) : 1;
	}
	this.lane.hscale = 1;
	if (this.lane.hscale0) {
		this.lane.hscale = this.lane.hscale0;
	}
	if (source && source.config && source.config.hscale) {
		this.lane.hscale = ToNumber(source.config.hscale);
	}
	this.lane.yh0 = 0;
	this.lane.yh1 = 0;
	this.lane.head = source.head;
	if (source && source.head) {
		if (source.head.tick || source.head.tick == 0) { this.lane.yh0 = 20; }
		if (source.head.tock || source.head.tock == 0) { this.lane.yh0 = 20; }
		if (source.head.text) { this.lane.yh1 = 20; this.lane.head.text = source.head.text; }
	}
	this.lane.yf0 = 0;
	this.lane.yf1 = 0;
	this.lane.foot = source.foot;
	if (source && source.foot) {
		if (source.foot.tick || source.foot.tick == 0) { this.lane.yf0 = 20; }
		if (source.foot.tock || source.foot.tock == 0) { this.lane.yf0 = 20; }
		if (source.foot.text) { this.lane.yf1 = 20; this.lane.foot.text = source.foot.text; }
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
	for (i = 0; i < tmp.length; i++) {
		if (typeof tmp[i] === 'object') {
			if (Object.prototype.toString.call(tmp[i]) === '[object Array]') {
				old.y = state.y;
				state = this.rec(tmp[i], state);
				state.groups.push({"x":state.xx, "y":old.y, "height":(state.y - old.y), "name":state.name});
			} else {
				state.lanes.push(tmp[i]);
				state.width.push(state.x);
				state.y += 1;
			}
		}
	}
	state.xx = state.x;
	state.x -= delta.x;
	state.name = name;
	return state;
};

WaveDrom.InsertSVGTemplate = function (index, parent, source) {
	"use strict";
	var node, first, e;

	// cleanup
	while (parent.childNodes.length) {
		parent.removeChild(parent.childNodes[0]);
	}

	for (first in WaveSkin) { break; }
	e = WaveSkin['default'] || WaveSkin[first];
	if (source && source.config && source.config.skin && WaveSkin[source.config.skin]) {
		e = WaveSkin[source.config.skin];
	}
	if (index === 0) {
		this.lane.xs     = Number(e[3][1][2][1].width);
		this.lane.ys     = Number(e[3][1][2][1].height);
		this.lane.xlabel = Number(e[3][1][2][1].x);
		this.lane.ym     = Number(e[3][1][2][1].y);
	} else {
		e = ["svg",{"id":"svg","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","height":"0"},["g",{"id":"waves"},["g",{"id":"lanes"}],["g",{"id":"groups"}]]];
	}

	e[e.length - 1][1].id    = "waves_"  + index;
	e[e.length - 1][2][1].id = "lanes_"  + index;
	e[e.length - 1][3][1].id = "groups_" + index;
	e[1].id = "svgcontent_" + index;
	e[1].height = 0;

	node = JsonML.parse(e);
	parent.insertBefore(node, null);
};

WaveDrom.RenderWaveForm = function (index) {
	"use strict";
	var TheTextBox, source, ret,
	root, groups, svgcontent, content, width, height, uwidth, uheight,
	glengths, xmax = 0, i;

	TheTextBox = document.getElementById("InputJSON_" + index);

	if (TheTextBox.type && TheTextBox.type == 'textarea') {
		try { source = eval('(' + TheTextBox.value + ')') } catch (err) { source = {signal:[{name:err}]}; };
	} else {
		try { source = eval('(' + TheTextBox.innerHTML + ')') } catch (err) { source = {signal:[{name:err}]}; };
	}
	if (Object.prototype.toString.call(source) !== '[object Object]') {
		source = {signal:[{name:"SemanticError: The root has to be an Object: '{signal:[...]}'"}]};
	} else if (!source.signal) {
		source = {signal:[{name:"SemanticError: 'signal:[...]' property is missing inside the root Object"}]};
	} else if (Object.prototype.toString.call(source.signal) !== '[object Array]') {
		source = {signal:[{name:"SemanticError: 'signal' object has to be an Array 'signal:[]'"}]};
	}

	WaveDrom.InsertSVGTemplate(index, document.getElementById('WaveDrom_Display_' + index), source);

	this.parseConfig (source);

	ret = this.rec(source.signal, {'x':0, 'y':0, 'xmax':0, 'width':[], 'lanes':[], 'groups':[]});

	root          = document.getElementById("lanes_" + index);
	groups        = document.getElementById("groups_" + index);

	content  = this.parseWaveLanes(ret.lanes);
	glengths = this.RenderWaveLane(root, content, index);
	for (i in glengths) {
		xmax = Math.max(xmax, (glengths[i] + ret.width[i]));
	}
	this.RenderMarks(root, content, index);
	this.RenderArcs(root, ret.lanes, index, source);
	this.RenderGaps(root, ret.lanes, index);
	this.RenderGroups(groups, ret.groups, index);
	this.lane.xg = Math.ceil((xmax - this.lane.tgo) / this.lane.xs) * this.lane.xs;

	width  = (this.lane.xg + (this.lane.xs * (this.lane.xmax + 1)));
	height = (content.length * this.lane.yo +
		this.lane.yh0 + this.lane.yh1 + this.lane.yf0 + this.lane.yf1);

//	if (this.lane.scale === 3) {
//		uwidth  = '100%';
//		uwidth  = (window.innerWidth - 15);
//		uheight = '100%';
//		uheight = (window.innerHeight - (10+7+16+7+(WaveDrom.panela.ys)+7+16+7+16+7));
//	} else {
//		uwidth  = this.lane.scale * width;
//		uheight = this.lane.scale * height;
//	}
	// ???
	uwidth  = width;
	uheight = height;

	svgcontent = document.getElementById("svgcontent_" + index);
	svgcontent.setAttribute('viewBox', "0 0 " + width + " " + height);
	svgcontent.setAttribute('width', uwidth);
	svgcontent.setAttribute('height', uheight);
	svgcontent.setAttribute('overflow', 'hidden');
	root.setAttribute('transform', 'translate(' + (this.lane.xg + 0.5) + ', ' + ((this.lane.yh0 + this.lane.yh1) + 0.5) + ')');
};

WaveDrom.ProcessAll = function () {
	"use strict";
	var points, i, index, node0,
		node1;

	// first pass
	index = 0; // actual number of valid anchor
	points = document.getElementsByTagName('SCRIPT');
	for (i = 0; i < points.length; i++) {
		if (points.item(i).type && points.item(i).type === 'WaveDrom') {
			points.item(i).setAttribute('id', 'InputJSON_' + index);

			node0 = document.createElement('div');
//			node0.className += "WaveDrom_Display_" + index;
			node0.id = "WaveDrom_Display_" + index;
			points.item(i).parentNode.insertBefore(node0, points.item(i));
//			WaveDrom.InsertSVGTemplate(i, node0);
			index += 1;
		}
	}
	// second pass
	for (i = 0; i < index; i += 1) {
		WaveDrom.RenderWaveForm(i);
	}
};

WaveDrom.resize = function () {
	"use strict";
	document.getElementById('PanelB').style.height = (window.innerHeight - (10+7+16+7+(WaveDrom.panela.ys)+7+16+7+16+7)) + 'px';
	document.getElementById('PanelA').style.height = WaveDrom.panela.ys + 'px';
};

WaveDrom.ClearWaveLane = function (index) {
	"use strict";
	var root;
    root = document.getElementById('lanes_' + index);
	while (root.childNodes.length) {
		root.removeChild(root.childNodes[0]);
	}
	root = document.getElementById('groups_' + index);
	while (root.childNodes.length) {
		root.removeChild(root.childNodes[0]);
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
					clearTimeout(WaveDrom.timer);
				}
				WaveDrom.timer = setTimeout("WaveDrom.EditorRefresh()", 750);
				return;
			}
		}
		if (WaveDrom.timer) {
			clearTimeout (WaveDrom.timer);
			WaveDrom.timer = setTimeout("WaveDrom.EditorRefresh()", 750);
		}
	}
//	WaveDrom.EditorRefresh();
};

WaveDrom.EditorRefresh = function () {
	"use strict";
//	WaveDrom.ClearWaveLane(0);
//	WaveDrom.resize();
	WaveDrom.RenderWaveForm(0);
};

WaveDrom.EditorInit = function () {
	"use strict";
//	this.lane.scale = 3;
//	WaveDrom.WaveformLoad();
//	WaveDrom.InsertSVGTemplate(index, document.getElementById('WaveDrom_Display_' + index));
	WaveDrom.EditorRefresh();
//	WaveDrom.ConfigurationLoad();
//	window.onresize = WaveDrom.EditorRefresh;
};

WaveDrom.ExpandInputWindow = function () {
	"use strict";
	if (WaveDrom.panela.ys < (0.707 * window.innerHeight)) {
		WaveDrom.panela.ys += 50;
		WaveDrom.EditorRefresh();
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
		WaveDrom.EditorRefresh();
	}
};

WaveDrom.SetHScale = function (hscale) {
	"use strict";
	WaveDrom.lane.hscale0 = parseFloat(hscale);
	WaveDrom.EditorRefresh();
};

WaveDrom.SetScale = function (scale) {
	"use strict";
	WaveDrom.lane.scale = parseFloat(scale);
	WaveDrom.EditorRefresh();
};

//window.onload = WaveDrom.ProcessAll;
