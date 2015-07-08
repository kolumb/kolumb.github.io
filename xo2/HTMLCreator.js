
window.HTMLCreator = function () {
	this.tags = [];
	this.indentation = 0;
	this.result = '';
	this.indentType = '  '; // '\t';
};

HTMLCreator.prototype.addTag =  function (tag, id, classStr) {
	this.tags.push(tag);
	this.result += '\n' + this.indentType.repeat(this.indentation++);
	this.result += '<' + tag;
	if(id) this.result += ' id="' + id + '"';
	if(classStr) this.result += ' class="' + classStr + '"';
	this.result += '>';
};

HTMLCreator.prototype.addText = function (text) {
	this.result += text;
};

HTMLCreator.prototype.closeTag = function () {
	this.indentation--;
	if(this.result[this.result.length-1] == '>') {
		this.result += '\n' + this.indentType.repeat(this.indentation);
	}
	this.result += '</' + this.tags.pop() + '>';
};

HTMLCreator.prototype.log = function () {
	var outputElement;
	if (outputElement = document.getElementById('output')) {
		outputElement.textContent = this.result;
	}
	console.log(this.result);
};