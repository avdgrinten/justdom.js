
(function() {

function Selection() {

}
// --------------- selection methods ---------------
Selection.prototype.first = function(selector) {
	var node = this.exposeSingle().querySelector(selector);
	if(!node)
		throw new Error("No node found for selector '" + selector + "'");
	return single(node);
};
Selection.prototype.unique = function(selector) {
	var nodes = this.exposeSingle().querySelectorAll(selector);
	if(nodes.length == 0)
		throw new Error("No node found for selector '" + selector + "'");
	if(nodes.length > 1)
		throw new Error("Too many nodes found for selector '" + selector + "'");
	return single(nodes[0]);
};
// --------------- mutation methods ---------------
Selection.prototype.append = function(other) {
	var elements = other.exposeAll();
	for(var i = 0; i < elements.length; i++)
		this.exposeSingle().appendChild(elements[i]);
	return this;
};
Selection.prototype.appendText = function(string) {
	var node = this.exposeSingle().ownerDocument.createTextNode(string);
	this.exposeSingle().appendChild(node);
	return this;
};
Selection.prototype.addClass = function(name) {
	this.exposeSingle().classList.add(name);
	return this;
};
Selection.prototype.toggleClass = function(name, predicate) {
	this.exposeSingle().classList.toggle(name, predicate);
	return this;
};
Selection.prototype.setAttr = function(name, value) {
	this.exposeSingle().setAttribute(name, value);
	return this;
};
Selection.prototype.setText = function(string) {
	this.exposeSingle().textContent = string;
	return this;
};
Selection.prototype.setHtml = function(html) {
	this.exposeSingle().innerHtml = html;
	return this;
};
// --------------- special methods ---------------
Selection.prototype.tag = function(name) {
	var doc = this.exposeSingle();
	return new SingleSelection(doc.createElement(name));
};

function SingleSelection(node) {
	this._node = node;
}
SingleSelection.prototype = Object.create(Selection.prototype);
SingleSelection.prototype.exposeSingle = function() {
	return this._node;
};
SingleSelection.prototype.exposeAll = function() {
	return [ this._node ];
};

function Builder(doc) {
	var root = doc.createDocumentFragment();
	this._stack = [ root ];
}
Builder.prototype = Object.create(Selection.prototype);
Builder.prototype.exposeSingle = function() {
	return this._stack[this._stack.length - 1];
};
Builder.prototype.exposeAll = function() {
	return [ this._stack[this._stack.length - 1] ];
};
Builder.prototype.begin = function(tag) {
	var top = this._stack[this._stack.length - 1];
	var element = top.ownerDocument.createElement(tag);
	top.appendChild(element);
	this._stack.push(element);
	return this;
};
Builder.prototype.end = function() {
	this._stack.pop();
	return this;
};

function single(node) {
	return new SingleSelection(node);
}

function first(selector, doc) {
	if(!doc)
		doc = document;
	return single(doc).first(selector);
}
function unique(selector, doc) {
	if(!doc)
		doc = document;
	return single(doc).unique(selector);
}

function tag(name, doc) {
	if(!doc)
		doc = document;
	return single(doc).tag(name);
}

function build(doc) {
	if(!doc)
		doc = document;
	return new Builder(doc);
}

var exports;
if(typeof module !== 'undefined') {
	exports = module.exports;
}else if(typeof window !== 'undefined') {
	exports = { };
	window.$ = exports;
}else throw new Error("Unexpected execution environment");

exports.Selection = Selection;
exports.SingleSelection = SingleSelection;
exports.Builder = Builder;

exports.single = single;
exports.first = first;
exports.unique = unique;
exports.build = build;
exports.tag = tag;

})();

