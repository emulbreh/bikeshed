import {Component} from './framework/Component'
import {Page} from './framework/Page'
import {Application} from './framework/Application'
import {API} from './framework/API'
import {Resource} from './framework/Resource'
import {Model} from './framework/Model'
import {Session} from './framework/Session'
import {Collection} from './Collection'

import {List} from './List'
import {Completer} from './editor/Completer'
import {DocumentEditor} from './editor/DocumentEditor'
import {Document} from './Document'
import {EditorPage} from './EditorPage'
import {ViewerPage} from './ViewerPage'
import {BoardPage} from './BoardPage'
import {IndexPage} from './IndexPage'
import {PageWithSidebar} from './PageWithSidebar'
import {ListPage} from './ListPage'
import {LoginPage} from './LoginPage'
import {SearchForm} from './SearchForm'
import {Card} from './Card'
import {main} from './main'


var editor = {DocumentEditor, Completer};


export var bikeshed = { // FIXME
    main, editor,
    Application, Component, List, Page, 
    Document,
    SearchForm, Card,
    PageWithSidebar, ListPage, IndexPage, EditorPage, ViewerPage, LoginPage
};

bikeshed.framework = {API, Collection, Model, Resource, Session};

window.bikeshed = bikeshed;

$(function(){
    window.AceRange = ace.require('ace/range').Range; // FIXME
});
