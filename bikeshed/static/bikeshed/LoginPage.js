import {Page} from './framework/Page'
import {Document} from './Document'


class LoginPage extends Page{
    constructor(options={}){
        _.defaults(options, {
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
            this.app.login(response.session_key, new Document(response.user));
        });
    }

}

export var LoginPage = LoginPage;
