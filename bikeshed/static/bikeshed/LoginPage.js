import {Page} from './framework/Page'


class LoginPage extends Page{
    constructor(options){
        options = _.defaults(options, {
            cssClass: 'bikeshed-login'
        });
        super.constructor(options);
        this.api = options.api;

        var $loginForm = $('<div class="bikeshed-login"/>');
        this.$usernameInput = $('<input type="text" placeholder="Username"/>');
        this.$passwordInput = $('<input type="password" placeholder="Password"/>');
        $loginForm.append(this.$usernameInput, this.$passwordInput);
        this.$element.append($loginForm);
        this.$passwordInput.on('keypress', (e) => {
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
        this.api.post('/authenticate/', {
            dataType: 'json',
            data: JSON.stringify(credentials),
        }).then((response) => {
            this.api.setDefaultHeader('Authorization', 'session ' + response.session_key);
            this.app.visit('/');
        });
    }

}

export var LoginPage = LoginPage;
