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
						elem.setAttribute(name, value);
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
			svgns   = 'http://www.w3.org/2000/svg';
			var elem;
			elem = patch(document.createElementNS(svgns, tagName), jml, filter);
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

var LogiDrom = LogiDrom || {};

LogiDrom.Init = function (label) {

	function render (tree, state) {
		var head, y, i, ilen;
		state.xmax = Math.max(state.xmax, state.x);
		head = tree[0];
		y = state.y;
		ilen = tree.length;
		for (i = 1; i < ilen; i++) {
			if (Object.prototype.toString.call(tree[i]) === '[object Array]') {
				state = render (tree[i], {x:(state.x+1), y:state.y, xmax:state.xmax});
			} else {
				tree[i] = {name:tree[i], x:state.x+1, y:state.y};
				state.y += 2;
			}
		}
		tree[0] = {name:tree[0], x:state.x, y:Math.round((y + (state.y-2))/2)};
		state.x--;
		return state;
	}

	function random_tree (state) {
        function random_type () {
            var uni = 100*Math.random();
			if (10 > uni) { return 'or'   };
			if (20 > uni) { return 'nor'  };
			if (30 > uni) { return 'and'  };
			if (40 > uni) { return 'nand' };
			if (50 > uni) { return 'xor'  };
			if (60 > uni) { return 'nxor' };
			if (70 > uni) { return 'add'  };
			if (80 > uni) { return 'mul'  };
            return 'box';
        };

		function random_gate () {
			var uni = 100*Math.random();
			if (10 > uni) { return ['not', 1]; };
            if (20 > uni) { return ['buf', 1]; };
			if (30 > uni) { return [random_type(), 2]; };
			if (40 > uni) { return [random_type(), 3]; };
			if (45 > uni) { return [random_type(), 4]; };
			if (47 > uni) { return [random_type(), 5]; };
			if (48 > uni) { return [random_type(), 6]; };
			if (49 > uni) { return [random_type(), 7]; };
			if (50 > uni) { return [random_type(), 8]; };
			return ['box', 0];
		};

		var gate, i, ilen, tree = [];
		gate = random_gate ();
		ilen = gate[1];
		if (ilen === 0 || state.idx > 21) {
			tree = 'x'+state.idx;
		} else {
			tree.push(gate[0]);
			for (i = 0; i < ilen; i++) {
				state = random_tree ({idx:(state.idx+1)});
				tree.push(state.tree);
			}
		}
		return {idx:state.idx, tree:tree};
	}

	function draw_body (type, inputs) {
		var e, gates = {
			not:  'm -16,0 4,0 m 0,-6 0,12 10,-6 z m 10,6 c 0,1.104569 0.895431,2 2,2 1.104569,0 2,-0.895431 2,-2 0,-1.104569 -0.895431,-2 -2,-2 -1.104569,0 -2,0.895431 -2,2 z',
			buf:  'm -2,0 2,0 m -12,-6 0,12 10,-6 z m -4,6 4,0',
			and:  'm -16,-10 5,0 c 6,0 11,4 11,10 0,6 -5,10 -11,10 l -5,0 z',
			nand: 'm -16,-10 3,0 c 6,0 11,4 11,10 0,6 -5,10 -11,10 l -3,0 z M 2,0 C 2,1.104569 1.104569,2 0,2 -1.104569,2 -2,1.104569 -2,0 c 0,-1.104569 0.895431,-2 2,-2 1.104569,0 2,0.895431 2,2 z',
			or:   'm -18,-10 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 2.5,-5 2.5,-15 0,-20 z',
			nor:  'M 2,0 C 2,1.10457 1.104569,2 0,2 -1.104569,2 -2,0.745356 -2,0 c 0,-0.745356 0.895431,-2 2,-2 1.104569,0 2,0.89543 2,2 z m -20,-10 2,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -2,0 c 2.5,-5 2.5,-15 0,-20 z',
			xor:  'm -21,-10 c 1,3 2,6 2,10 m 0,0 c 0,4 -1,7 -2,10 m 3,-20 4,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -4,0 c 1,-3 2,-6 2,-10 0,-4 -1,-7 -2,-10 z',
			nxor: 'm -21,-10 c 1,3 2,6 2,10 m 0,0 c 0,4 -1,7 -2,10 M 2,0 C 2,1.10457 1.104569,2 0,2 -1.104569,2 -2,0.745356 -2,0 c 0,-0.745356 0.895431,-2 2,-2 1.104569,0 2,0.89543 2,2 z m -20,-10 2,0 c 6,0 12,5 14,10 -2,5 -8,10 -14,10 l -2,0 c 1,-3 2,-6 2,-10 0,-4 -1,-7 -2,-10 z',
			add:  'm -8,5 0,-10 m -5,5 10,0 m 3,0 c 0,4.418278 -3.581722,8 -8,8 -4.418278,0 -8,-3.581722 -8,-8 0,-4.418278 3.581722,-8 8,-8 4.418278,0 8,3.581722 8,8 z',
			mul:  'm -4,4 -8,-8 m 0,8 8,-8 m 4,4 c 0,4.418278 -3.581722,8 -8,8 -4.418278,0 -8,-3.581722 -8,-8 0,-4.418278 3.581722,-8 8,-8 4.418278,0 8,3.581722 8,8 z',
    	box:  'm -16,-10 16,0 0,20 -16,0 z'
		};
        e = gates[type] || gates.box;
		return ['path', {d: e, style: "color:#000;fill:#ffc;fill-opacity:1;stroke:#000;stroke-width:1;stroke-opacity:1"}];
	};

	function draw_gate (spec) { // ['type', [x,y], [x,y] ... ]
		var i, ilen, ret = ['g'], ys = [];
		ilen = spec.length;
		for (i = 2; i < ilen; i++) {
			ys.push(spec[i][1]);
		};
		ret.push(
			['g',
				{transform:"translate(16,0)"},
				['path', {
					d: 'M  '+spec[2][0]+','+Math.min.apply(null, ys)+' '+spec[2][0]+','+Math.max.apply(null, ys),
					style:'fill:none;stroke:#000;stroke-width:1;stroke-opacity:1'
				}]
			]
		);
		for (i = 2; i < ilen; i++) {
			ret.push(
				['g',
					['path',
						{
							d:'m  '+spec[i][0]+','+spec[i][1]+' 16,0',
							style: "fill:none;stroke:#085;stroke-width:1;stroke-opacity:1"
						}
					]
				]
			);
		};
		ret.push(
			['g',
				{
					transform:'translate('+spec[1][0]+','+spec[1][1]+')'
				},
				['title', spec[0]],
				draw_body(spec[0], ilen-2)
			]
		);
		return ret;
	};

	function draw_boxes (tree, xmax) {
		var ret = ['g'], i, ilen, fx, fy, fname, spec = [];
		if (Object.prototype.toString.call(tree) === '[object Array]') {
			ilen = tree.length;
			spec.push(tree[0].name);
			spec.push([32*(xmax-tree[0].x), 8*tree[0].y]);
			for (i = 1; i < ilen; i++) {
				if (Object.prototype.toString.call(tree[i]) === '[object Array]') {
					spec.push([32*(xmax-tree[i][0].x), 8*tree[i][0].y]);
				} else {
					spec.push([32*(xmax-tree[i].x), 8*tree[i].y]);
				}
			}
			ret.push(draw_gate (spec));
			for (i = 1; i < ilen; i++) {
				ret.push(draw_boxes (tree[i], xmax));
			}		
		} else {
			fname = tree.name;
			fx = 32*(xmax-tree.x);
			fy = 8*tree.y;
			ret.push(
				['g',
					{transform: 'translate('+fx+','+fy+')'},
					['title', fname],
					['path', {d:'M 2,0 a 2,2 0 1 1 -4,0 2,2 0 1 1 4,0 z'}],
					['text',
						['tspan', {x:"-4", y:"4", style:"font-size:12px;font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;text-align:center;text-anchor:end;font-family:Roboto"},
							fname
						]
					]
				]
			);
		}
		return ret;
	}

	var tree, xmax, svg = ['g'];
	tree = random_tree({idx:0,tree:[]}).tree;
	xmax = render (tree, {x:0,y:0,xmax:0}).xmax;
	console.log (JSON.stringify(tree));
	svg = draw_boxes (tree, xmax);
	console.log (JSON.stringify(svg));
	document.getElementById(label).insertBefore(JsonML.parse(svg), null);
}
