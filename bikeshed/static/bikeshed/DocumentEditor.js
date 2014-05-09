import {Component} from './framework/Component'
import {Document} from './Document'


class DocumentEditor extends Component{
    constructor(options) {
        options = _.defaults(options, {
            'cssClass': 'bikeshed-editor'
        });
        super.constructor(options);
        this.doc = options.doc || new Document({headers:[], body: '', text: ''});
        var aceWrapper = $('<div/>');
        this.$element.append(aceWrapper);
        var editor = this.editor = ace.edit(aceWrapper.get(0));
        editor.setOptions({
            maxLines: Infinity
        })
        editor.setTheme("ace/theme/github");
        editor.setHighlightActiveLine(false);
        editor.setShowPrintMargin(false);
        editor.renderer.setShowGutter(false);
        var session = editor.getSession();
        //.setMode("ace/mode/javascript");
        session.setTabSize(4);
        session.setUseSoftTabs(true);

        var text = options.text || this.doc.text;
        session.setValue(text);
    }
    
    focus(){
        this.editor.focus();
    }
    
    save(){
        this.doc.setText(this.editor.getValue());
        this.emit('save', this.doc);
    }
    
    setDocument(doc){
        this.doc = doc;
        this.editor.getSession().setValue(doc.text);
    }

}

export var DocumentEditor = DocumentEditor;
