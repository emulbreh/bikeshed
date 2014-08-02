import {Application} from './framework/Application'
import {API} from './framework/API'
import {Resource} from './framework/Resource'
import {Model} from './framework/Model'
import {Collection} from './Collection'

import {Document} from './Document'
import {EditorPage} from './EditorPage'
import {ViewerPage} from './ViewerPage'
import {BoardPage} from './BoardPage'
import {IndexPage} from './IndexPage'
import {ListPage} from './ListPage'
import {LoginPage} from './LoginPage'


class BikeshedAPI extends API{
    setSessionKey(sessionKey){
        this.setDefaultHeader('Authorization', 'session ' + sessionKey);
    }
    
    removeSessionKey(){
        this.removeDefaultHeader('Authorization');
    }
}


class BikeshedApp extends Application{
    constructor(options={}){
        super.constructor(options);
        this.api = options.api;
        this.user = null;
        this.api.on('unauthorizedRequest', this.logout.bind(this));
        this.root.addAction('logout', this.logout.bind(this));
        this.initializeSession();
    }
    
    initializeSession(){
        var userId = this.session.get('userId');
        if(userId){
            this.user = new Document({uid: userId});
        }
        this.api.setSessionKey(this.session.get('sessionKey'));
    }

    login(sessionKey, user){
        this.user = user;
        this.api.setSessionKey(sessionKey);
        this.session.set('sessionKey', sessionKey);
        this.session.set('userId', user.uid);
        this.emit('login', user);
        this.visit('/');
    }
    
    logout(){
        this.api.removeSessionKey();
        this.user = null;
        this.emit('logout');
        this.visit('/login/');
    }
}


export function main(){
    var api = new BikeshedAPI({
        baseUrl: '/api'
    });

    var documents = new Resource(api, '/documents/', bikeshed.Document, {
    });
    
    /*
    var ws = new WebSocket('ws://127.0.0.1:7001/events');
    ws.onmessage = function(msg){
        console.log(msg.data);
    };
    ws.onopen = function(){
        ws.send('{"foo":42}');
    };
    */
    
    var app = new BikeshedApp({
        api: api,
        element: '#body',
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
            }),
            '/board/:uid/': new BoardPage({
                resource: documents
            })
        }
    });
        
    app.start();
}
