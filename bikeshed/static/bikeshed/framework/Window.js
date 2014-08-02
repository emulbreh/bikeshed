import {Component} from './Component'


export class Window extends Component{
    constructor(options={}) {
        super.constructor(options);
        this.$header = this.appendElement('<header><a href="/">promise less <b>|</b> do more</a><a href="#logout">Logout</a></header>');
        this.$pages = this.appendElement('<div class="pages"/>');
        this.$userInfo = $('<span class="user"/>');
        this.$header.append(this.$userInfo);
        var app = options.app;
        app.on('login', (user) => {
            this.$userInfo.show();
            this.$userInfo.text(user.label);
        });
        app.on('logout', () => {
            this.$userInfo.hide();
            this.$userInfo.text('');
        });
    }
    
    addPage(page){
        this.$pages.append(page.$element);
    }
}
