import {Component} from './Component'
import {List} from './List'
import {Completer} from './Completer'
import {DocumentEditor} from './DocumentEditor'
import {Document} from './Document'


export var pldm = {
    Component: Component,
    List: List,
    Completer: Completer,
    Document: Document,
    DocumentEditor: DocumentEditor
};

window.pldm = pldm;

$(function(){
    window.AceRange = ace.require('ace/range').Range;
});
