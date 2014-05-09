import {Application} from './framework/Application'
import {API} from './framework/API'
import {Resource} from './framework/Resource'
import {Model} from './framework/Model'
import {Collection} from './Collection'

import {Document} from './Document'
import {EditorPage} from './EditorPage'
import {ViewerPage} from './ViewerPage'
import {IndexPage} from './IndexPage'
import {ListPage} from './ListPage'
import {LoginPage} from './LoginPage'


class BikeshedAPI extends API{
    setSessionKey(sessionKey){
        this.setDefaultHeader('Authorization', 'session ' + sessionKey);
    }
}


function main(){
    var api = new BikeshedAPI({
        baseUrl: '/api'
    });

    var documents = new Resource(api, '/documents/', bikeshed.Document, {
    });
    
    var ws = new WebSocket('ws://127.0.0.1:7001/events');
    ws.onmessage = function(msg){
        console.log(msg.data);
    };
    ws.onopen = function(){
        ws.send('{"foo":42}');
    };

    var app = new Application({
        element: '#viewport',
        splash: '#splash',
        pages: {
            '/': new IndexPage(),
            '/login/': new LoginPage({
                api: api
            }),
            '/search/': new ListPage({
                resource: documents
            }),
            '/new/': new EditorPage({
                resource: documents
            }),
            '/edit/:uid/': new EditorPage({
                resource: documents
            }),
            '/view/:uid/': new ViewerPage({
                resource: documents
            })
        }
    });
    
    api.on('unauthorizedRequest', function(){
        console.log('UNAUTHORIZED');
        app.visit('/login/');
    });
    
    api.setSessionKey(app.session.get('sessionKey'));
    
    app.on('login', function(info){
        ws.send(JSON.stringify({'method': 'identify', 'session': info.session}));
    });
    
    app.start();
}

export var main = main;
