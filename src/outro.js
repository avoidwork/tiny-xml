// Node, AMD & window supported
if (typeof exports !== "undefined") {
	module.exports = xml;
} else if (typeof define === "function" && define.amd) {
	define(function () {
		return xml;
	});
} else {
	global.xml = xml;
}}(typeof window !== "undefined" ? window : global));
