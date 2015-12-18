const cdata = /\&|<|>|\"|\'|\t|\r|\n|\@|\$/,
	boolean_number_string = /boolean|number|string/;

function iterate (obj, fn, ctx = obj) {
	Object.keys(obj).forEach((i, idx) => {
		fn.call(ctx, i, idx);
	});
}

function parse (arg) {
	return new DOMParser().parseFromString(arg, "text/xml");
}

function node (name, value) {
	return "<" + name + ">" + cdata.test(value) ? "<![CDATA[" + value + "]]>" : value + "</" + name + ">";
}

function serialize (arg, key = "xml", wrap = true, top = true) {
	let x = wrap ? "<" + key + ">" : "",
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
			x += serialize(v, "item", typeof v === "object", false);
		});
	} else if (larg instanceof Object) {
		iterate(larg, function (v, k) {
			x += serialize(v, k, typeof v === "object", false);
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
