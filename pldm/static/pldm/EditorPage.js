import {DocumentPage} from './DocumentPage'
import {Document} from './Document'
import {DocumentEditor} from './DocumentEditor'


class EditorPage extends DocumentPage{
    constructor(options){
        super.constructor(options);
        this.addToSidebar($('<a href="#save">Save</a>'));
        this.addToSidebar($('<a href="#cancel">Cancel</a>'));
        this.editor = new DocumentEditor({});
        this.$element.append(this.editor.$element);

        this.addActions({
            cancel: function(e){
                if(this.doc.uid){
                    this.app.visit(`/view/${this.doc.uid}/`);
                }
                else{
                    this.app.visit('/');
                }
            },
            save: function(e){
                console.log("SAVE");
                this.editor.save();
            }
        });
    }
    
    onDocumentLoaded(doc){
        super.onDocumentLoaded(doc);
        this.editor.setDocument(doc);
        this.editor.focus();
    }
}

export var EditorPage = EditorPage;
