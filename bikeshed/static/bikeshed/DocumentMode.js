var oop = ace.require("ace/lib/oop");
var TextMode = ace.require("ace/mode/text").Mode;
var Tokenizer = ace.require("ace/tokenizer").Tokenizer;

import {DocumentHighlightRules} from './DocumentHighlightRules'

export var DocumentMode = function() {
    this.HighlightRules = DocumentHighlightRules;
};
oop.inherits(DocumentMode, TextMode);

(function() {
    // Extra logic goes here. (see below)
}).call(DocumentMode.prototype);
