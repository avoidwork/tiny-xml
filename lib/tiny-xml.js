"use strict";

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * Tiny XML utility for Client and Server
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2015
 * @license BSD-3-Clause
 * @link http://avoidwork.github.io/tiny-xml
 * @version 1.0.6
 */
(function (global) {
	var DOMParser = global.DOMParser || require("xmldom").DOMParser;
	var XMLSerializer = global.XMLSerializer || require("xmldom").XMLSerializer;

	var cdata = /\&|<|>|\"|\'|\t|\r|\n|\@|\$/,
	    boolean_number_string = /boolean|number|string/;

	function iterate(obj, fn) {
		var ctx = arguments.length <= 2 || arguments[2] === undefined ? obj : arguments[2];

		Object.keys(obj).forEach(function (i) {
			fn.call(ctx, obj[i], i);
		});
	}

	function parse(arg) {
		return new DOMParser().parseFromString(arg, "text/xml");
	}

	function node() {
		var name = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
		var value = arguments[1];

		var start = "",
		    end = "";

		if (name !== "") {
			start = "<" + name + ">";
			end = "</" + name + ">";
		}

		return start + (cdata.test(value) ? "<![CDATA[" + value + "]]>" : value) + end;
	}

	function serialize(arg) {
		var key = arguments.length <= 1 || arguments[1] === undefined ? "xml" : arguments[1];
		var wrap = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
		var top = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

		var x = wrap ? "<" + key + ">" : "",
		    larg = arg;

		if (larg !== null && larg.xml) {
			larg = larg.xml;
		}

		if (typeof Document !== "undefined" && larg instanceof Document) {
			larg = new XMLSerializer().serializeToString(larg);
		}

		if (boolean_number_string.test(typeof larg === "undefined" ? "undefined" : _typeof(larg))) {
			x += node(isNaN(key) ? key : "item", larg);
		} else if (larg === null || larg === undefined) {
			x += "null";
		} else if (larg instanceof Array) {
			larg.forEach(function (v) {
				x += serialize(v, "item", boolean_number_string.test(typeof v === "undefined" ? "undefined" : _typeof(v)) ? false : true, false);
			});
		} else if (larg instanceof Object) {
			iterate(larg, function (v, k) {
				x += boolean_number_string.test(typeof v === "undefined" ? "undefined" : _typeof(v)) ? node(k, v) : serialize(v, k, top, false);
			});
		}

		x += wrap ? "</" + key + ">" : "";

		if (top) {
			x = "<?xml version=\"1.0\" encoding=\"UTF8\"?>" + x;
		}

		return x;
	}

	function valid(arg) {
		return parse(arg).getElementsByTagName("parsererror").length === 0;
	}

	var xml = {
		parse: parse,
		serialize: serialize,
		valid: valid,
		version: "1.0.6"
	};

	// Node, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = xml;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return xml;
		});
	} else {
		global.xml = xml;
	}
})(typeof window !== "undefined" ? window : global);
