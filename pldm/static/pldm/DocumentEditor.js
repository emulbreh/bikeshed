import {Component} from './Component'
import {Document} from './Document'
import {Completer} from './Completer'


class DocumentEditor extends Component{
    constructor(options) {
        options = _.defaults(options, {
            'cssClass': 'pldm-editor'
        });
        super.constructor(options);
        this.doc = options.doc || new Document({headers:[], body: '', text: ''});
        var aceWrapper = $('<div style="width:600px"/>');
        this.$element.append(aceWrapper);
        var editor = this.editor = ace.edit(aceWrapper.get(0));
        editor.setOptions({
            maxLines: Infinity
        })
        editor.setTheme("ace/theme/github");
        editor.setHighlightActiveLine(false);
        editor.renderer.setShowGutter(false);
        var session = editor.getSession();
        //.setMode("ace/mode/javascript");
        session.setTabSize(4);
        session.setUseSoftTabs(true);

        var text = options.text || this.doc.text;
        session.setValue(text);
        
        this.completer = new Completer({
            editor: editor,
            url: '/api/documents/'
        });
    }
    
    focus(){
        this.editor.focus();
    }
    
    save(){
        this.doc.setText(this.editor.getValue());
        this.doc.save();
    }
    
    loadDocument(doc){
        this.doc = doc;
    }

}

export var DocumentEditor = DocumentEditor;
