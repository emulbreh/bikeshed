import {Page} from './framework/Page'


class LoginPage extends Page{
    constructor(options){
        options = _.defaults(options, {
            cssClass: 'bikeshed-login'
        });
        super.constructor(options);
        this.api = options.api;

        this.$loginForm = $('<form class="bikeshed-login" target="login_target" autocomplete="on" action="/void/" method="POST"/>');
        this.$usernameInput = $('<input type="text" placeholder="Username" name="username"/>');
        this.$passwordInput = $('<input type="password" placeholder="Password" name="password"/>');
        this.$element.append($('<iframe id="login_target" name="login_target" src="javascript:false" style="display:none"/>'))
        this.$loginForm.append(this.$usernameInput, this.$passwordInput);
        this.$element.append(this.$loginForm);
        this.$loginForm.on('keypress', (e) => {
            if(e.keyCode == 13){
                this.submit();
                return false;
            }
        });
    }
    
    open(params){
        return super.open(params).then(() => this.$usernameInput.focus());
    }
    
    submit(){
        var credentials = {
            username: this.$usernameInput.val(),
            password: this.$passwordInput.val()
        };
        this.$loginForm.submit();
        this.api.post('/authenticate/', {
            dataType: 'json',
            data: JSON.stringify(credentials),
        }).then((response) => {
            this.api.setDefaultHeader('Authorization', 'session ' + response.session_key);
            this.app.emit('login', {
                session: response.session_key, 
                username: credentials.username
            });
            this.app.visit('/');
        });
    }

}

export var LoginPage = LoginPage;
