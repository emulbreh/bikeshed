import {List} from './List'
import {Popup} from './framework/Popup'
import {Picker} from './Picker'


function positionEqual(a, b){
    return a && b && a.row == b.row & a.column == b.column;
}


export class Completer{
    constructor(options){
        this.lookup = options.lookup || 'Number';
        this.resource = options.resource;

        var editor = this.editor = options.editor;
        this.lookups = {
            '@': 'Name',
            '#': 'Number'
        };
        var lookupChars = _.keys(this.lookups).join('');
        this.pattern = `([^\\w]|^)([${lookupChars}]\\w*)`;
        this.editorOnCommandKey = editor.keyBinding.onCommandKey;
        this.boundEditorOnCommandKey = this.editorOnCommandKey.bind(editor.keyBinding);
        this.hijackedOnCommandKey = this.onCommandKey.bind(this);
        this.focusedToken = null;
        this.active = false;
        this.activeStart = null;
        this.dropdownList = new List({
            cssClass: 'bikeshed-autocomplete',
            resource: this.resource
        });
        for(var i=0;i<5;i++){
            this.dropdownList.appendItem({
                label: `#${i}1 Ticket`
            });
        }
        this.dropdownList.on('select', (function(doc){
            this.complete(doc);
            this.editor.focus();
        }).bind(this));
        editor.container.ownerDocument.body.appendChild(this.dropdownList.element);
        editor.on('blur', this.deactivate.bind(this));
        this.install();
    }

    install(){
        var session = this.editor.getSession();
        session.selection.on('changeCursor', () => {
            setTimeout(this.onCursorChange.bind(this), 1);
        });
    }

    onCursorChange(){
        var session = this.editor.getSession();
        var cursor = this.editor.selection.getCursor();
        var line = session.getLine(cursor.row);
        var match = null, col = cursor.column;
        var re = new RegExp(this.pattern, 'g');
        while(match = re.exec(line)){
            var token = match[2];
            var index = match.index + match[1].length;
            if(col >= index && col <= index + token.length){
                var range = new AceRange(cursor.row, index, cursor.row, index + token.length);
                this.focusedToken = {
                    token: token,
                    range: range,
                    cursor: cursor
                };
                this.activate();
                return;
            }
        }
        this.focusToken = null;
        this.deactivate();
    }

    getLineHeight(){
        return 23;
    }

    deactivate(){
        this.dropdownList.hide();
        this.dropdownList.clear();
        this.hijackCommandKeyEvents(false);
        this.activeStart = null;
    }

    activate(){
        var start = this.focusedToken.range.start;
        if(!positionEqual(this.activeStart, start)){
            var coords = this.editor.renderer.textToScreenCoordinates(start.row, start.column);
            this.dropdownList.$element.css({
                left: coords.pageX - 4 + 'px', 
                top: coords.pageY + this.getLineHeight() + 'px'
            }).show();
            this.hijackCommandKeyEvents(true);
            this.activeStart = start;
        }
        var token = this.focusedToken.token;
        var lookup = this.lookups[token[0]];
        var q = token.length > 1 ? `${lookup}:${token.substring(1)}*` : '';
        this.dropdownList.load({data: {q}});
    }

    hijackCommandKeyEvents(hijack){
        this.editor.keyBinding.onCommandKey = hijack !== false ? this.hijackedOnCommandKey : this.editorOnCommandKey;
    }
    
    complete(doc){
        var session = this.editor.getSession();
        session.replace(this.focusedToken.range, doc.label);
        this.deactivate();
    }
    
    onCommandKey(e, hashId, keyCode){
        if(!this.focusedToken){
            // FIXME: we should never get here
            return this.boundEditorOnCommandKey(e, hashId, keyCode);
        }
        switch(keyCode){
            case 9: // TAB
                var s = this.dropdownList.getSelection();
                if(s){
                    this.complete(s);
                }
                else{
                    var picker = new Picker({resource: this.resource});
                    var popup = new Popup({
                        title: 'Pick a document',
                        width: '600px',
                        content: picker
                    });
                    popup.show();
                    this.editor.blur();
                    picker.focus();
                    picker.on('select', (doc) => {
                        this.complete(doc);
                        popup.dispose();
                    });
                    popup.on('dispose', () => {
                        this.editor.focus();
                    });
                }
                break;
            case 13: // ENTER
                var doc = this.dropdownList.getSelection();
                if(!doc){
                    this.deactivate();
                    return this.boundEditorOnCommandKey(e, hashId, keyCode);
                }
                this.complete(doc);
                break;
            case 27: // ESCAPE
                this.deactivate();
                return;
            case 38: // UP
                this.dropdownList.selectPreviousItem();
                break;
            case 40: // DOWN
                this.dropdownList.selectNextItem();
                break;
            default:
                return this.boundEditorOnCommandKey(e, hashId, keyCode);
        }
        e.preventDefault();
    }
}
