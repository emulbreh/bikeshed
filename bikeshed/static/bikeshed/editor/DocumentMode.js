import {DocumentHighlightRules} from './DocumentHighlightRules'
var TextMode = ace.require("ace/mode/text").Mode;


export class DocumentMode extends TextMode{
    constructor(){
        this.HighlightRules = DocumentHighlightRules;
    }
}
