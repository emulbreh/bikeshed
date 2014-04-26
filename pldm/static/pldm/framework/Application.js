
class Application{
    constructor(options){
        this.$element = $(options.element);
        this.pages = {};
        this.currentPage = null;
        $('body').on('click', 'a', this.onLinkClick.bind(this));
        $(window).on('popstate', this.onHistoryChange.bind(this));
        this.routes = [];
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
        this.visit(location.pathname);
    }
    
    visit(path){
        var page = null, params = null;
        for(var route of this.routes){
            var match = route.re.exec(path);
            if(match){
                page = route.page;
                params = _.zipObject(route.params, match);
                break;
            }
        }
        console.log(page, params);
        if(!page){
            throw new Error(`404: ${path}`);
        }
        if(this.currentPage !== page){
            if(this.currentPage){
                this.currentPage.close();
            }
            this.currentPage = page;
        }
        page.open(params);
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
        console.log("push state");
        history.pushState(null, null, url);
        this.visit(url);
    }
    
    onHistoryChange(){
        this.visit(location.pathname);
    }
}

export var Application = Application;