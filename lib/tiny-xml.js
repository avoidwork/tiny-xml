/**
 * Tiny XML utility for Client and Server
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2018
 * @license BSD-3-Clause
 * @link http://avoidwork.github.io/tiny-xml
 * @version 2.0.0
 */
(function (global) {
	const DOMParser = global.DOMParser || require("xmldom").DOMParser;
	const XMLSerializer = global.XMLSerializer || require("xmldom").XMLSerializer;

	const cdata = /\&|<|>|\"|\'|\t|\r|\n|\@|\$/,
		boolean_number_string = /boolean|number|string/;

	function iterate (obj, fn, ctx = obj) {
		Object.keys(obj).forEach(i => {
			fn.call(ctx, obj[i], i);
		});
	}

	function parse (arg) {
		return new DOMParser().parseFromString(arg, "text/xml");
	}

	function node (arg = "", value) {
		const name = arg.replace(/\s/g, "");

		let start = "",
			end = "";

		if (name !== "") {
			start = `<${name}>`;
			end = `</${name}>`;
		}

		return start + (cdata.test(value) ? "<![CDATA[" + value + "]]>" : value) + end;
	}

	function serialize (arg, key = "xml", wrap = true, top = true) {
		let x = wrap ? `<${key}>` : "",
			larg = arg;

		if (larg !== null && larg.xml) {
			larg = larg.xml;
		}

		if (typeof Document !== "undefined" && larg instanceof Document) {
			larg = new XMLSerializer().serializeToString(larg);
		}

		if (boolean_number_string.test(typeof larg)) {
			x += node(isNaN(key) ? key : "item", larg);
		} else if (larg === null || larg === undefined) {
			x += "null";
		} else if (larg instanceof Array) {
			larg.forEach(function (v) {
				x += serialize(v, "item", boolean_number_string.test(typeof v) ? false : true, false);
			});
		} else if (larg instanceof Object) {
			iterate(larg, function (v, k) {
				x += boolean_number_string.test(typeof v) ? node(k, v) : serialize(v, k, top, false);
			});
		}

		x += wrap ? "</" + key + ">" : "";

		if (top) {
			x = "<?xml version=\"1.0\" encoding=\"UTF8\"?>" + x;
		}

		return x;
	}

	function valid (arg) {
		return parse(arg).getElementsByTagName("parsererror").length === 0;
	}

	const xml = {
		parse: parse,
		serialize: serialize,
		valid: valid,
		version: "{{VERSION}}"
	};

	// Node, AMD & window supported
	if (typeof exports !== "undefined") {
		module.exports = xml;
	} else if (typeof define === "function" && define.amd !== void 0) {
		define(function () {
			return xml;
		});
	} else {
		global.xml = xml;
	}
}(typeof window !== "undefined" ? window : global));
