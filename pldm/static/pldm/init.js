import {Component} from './framework/Component'
import {Page} from './framework/Page'
import {Application} from './framework/Application'

import {List} from './List'
import {Completer} from './Completer'
import {DocumentEditor} from './DocumentEditor'
import {Document} from './Document'
import {EditorPage} from './EditorPage'
import {ViewerPage} from './ViewerPage'
import {IndexPage} from './IndexPage'
import {PageWithSidebar} from './PageWithSidebar'
import {ListPage} from './ListPage'
import {SearchForm} from './SearchForm'


export var pldm = { // FIXME
    Application, Component, List, Page,
    Document,
    Completer, SearchForm, DocumentEditor,
    PageWithSidebar, ListPage, IndexPage, EditorPage, ViewerPage
};

window.pldm = pldm;

$(function(){
    window.AceRange = ace.require('ace/range').Range; // FIXME
});
