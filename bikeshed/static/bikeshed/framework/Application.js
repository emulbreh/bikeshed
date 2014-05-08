
class Application{
    constructor(options){
        this.$element = $(options.element);
        this.pages = {};
        this.splash = options.splash;
        this.currentPage = null;
        this.helperA = document.createElement('a');
        $('body').on('click', 'a', this.onLinkClick.bind(this));
        $(window).on('popstate', this.onHistoryChange.bind(this));
        this.routes = [];
        this._loading = false;
        _.each(options.pages, function(page, path){
            this.addPage(path, page);
        }, this);
    }
    
    addPage(path, page){
        this.pages[path] = page;
        page.app = this;
        var params = ['__path__'];
        var pattern = path.replace(/:\w+/g, function(match){
            params.push(match.substring(1));
            return '([^/]+)';
        });
        var re = new RegExp(`^${pattern}$`);
        this.routes.push({re, params, page, path});
        this.$element.append(page.$element);
    }
    
    start(){
        this.visit(location.pathname + location.search).then(() => {
            if(this.splash){
                $(this.splash).remove();
            }
        });
    }
    
    get loading(){
        return this._loading;
    }
    
    set loading(load){
        this._loading = load;
        this.$element[load ? 'addClass' : 'removeClass']('loading');
    }

    onHistoryChange(){
        this.visit(location.pathname + location.search, false);
    }
    
    parsePath(url){
        // FIXME: try https://developer.mozilla.org/en-US/docs/Web/API/Window.URL
        this.helperA.href = url;
        var path = this.helperA.pathname
        var querystring = this.helperA.search;
        var params = {};
        if(querystring){
            querystring = querystring.substring(1);
            querystring.split('&').forEach((pair) => {
                var [key, value] = pair.split('=');
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            });
        }
        return {path, params};
    }

    visit(url, pushstate){
        var pathInfo = this.parsePath(url);
        if(pushstate !== false){
            history.pushState(pathInfo.params, null, url);
        }
        var path = pathInfo.path;
        var page = null, params = pathInfo.params;
        for(var route of this.routes){
            var match = route.re.exec(path);
            if(match){
                page = route.page;
                _.extend(params, _.zipObject(route.params, match));
                break;
            }
        }
        if(!page){
            throw new Error(`404: ${path}`);
        }
        if(this.currentPage !== page){
            if(this.currentPage){
                this.currentPage.close();
            }
            this.currentPage = page;
        }
        this.loading = true;
        return page.open(params).then(() => {
            this.loading = false;
        });
    }
    
    onLinkClick(e){
        var url = $(e.target).attr('href');
        if(url.match(/:\/\//)){
            return true;
        }
        if(url == '#'){
            return false;
        }
        e.preventDefault();
        this.visit(url);
    }
}

export var Application = Application;