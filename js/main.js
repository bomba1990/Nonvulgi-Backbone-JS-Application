var regLink = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*)/ig;
var regUser = /@[0-9a-zA-Z_]+/gim;
var app= {
	homeM : Backbone.Model.extend(),
	homeC : Backbone.Collection.extend({
		//local: true,
		model:this.homeM,
		url:"http://nonvulgi.com/component/k2/itemlist/category/7-movil.json?callback=?",
		//url:"http://localhost/phoapplication2/joomla.json",
		initialize:function(a){
			if(a != undefined){
			if(a.local != undefined)
				this.local=a.local;
			if(a.remote != undefined)
				this.remote=a.remote;
			}
		},
		parse: function(response) {
			return response;
		  },
		parseBeforeLocalSave: function(response) {
			return response.items;
		}
	}),
	homeView: Backbone.View.extend({
		initialize:function () {
			this.model.bind("reset", this.render, this);
		},
		template:'home',
		render:function (eventName) {
			$(this.el).mustache(this.template,{
				home:true,
				items:_.filter(this.model.models,function(m){return m.id!=28 }), 
				item :_.find(this.model.models, function(m){ return m.id==28 }),
				theme: this.options.theme,
				clean : function(){
					return function(html){
						return replace_all_rel_by_abs(html);
					}
				}
			});
			return this;
		}
	}),
	contactenos: Backbone.View.extend({
		events: {
            'submit form': 'submit'
        },
		template:'contactenos',
		render:function (eventName) {
			$(this.el).mustache(this.template);
			return this;
		},
		submit: function(e) {
            e.preventDefault();
			$.mobile.showPageLoadingMsg();
			var array= $('#contactenos form').serializeArray();
			$.ajax({
				url: 'http://nonvulgi.com/component/rsmediagallery/contacto/index.json?callback=?',
				data: array,
				dadaType:'json',
				crossDomain: true,
				type: 'post',
				complete : function(){
					//$.mobile.loading( 'hide' );
					$.mobile.hidePageLoadingMsg();
					alert('Mensaje enviado');
					window.location.href="#";
				}
			});
        }
	}),
	blogM : Backbone.Model.extend(),
	blogC : Backbone.Collection.extend({
		model:this.homeM,
		url:"http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=http%3A%2F%2Fnonvulgi.com%2Fblog.feed&num=5&output=json_xml",
		initialize:function(a){
			if(a != undefined){
			if(a.local != undefined)
				this.local=a.local;
			if(a.remote != undefined)
				this.remote=a.remote;
			}
		},
		parse: function(response) {
			return response;
		  },
		parseBeforeLocalSave: function(response) {
			_.each(response.responseData.feed.entries,function(e){
				var regLink = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!.]*)/ig;
				url=regLink.exec(e.content);
				// Add feed row
				if(url != null){
					e.img = url[0];
				}
				
			});
			return response.responseData.feed.entries;
		}
	}),
	blog: Backbone.View.extend({
		template:'blog',
		render:function (eventName) {
			$(this.el).mustache(this.template,{
				blog:true,
				items:this.model.models, 
				theme: this.options.theme
			});
			return this;
		}
	}),
	blogPost: Backbone.View.extend({
		template:'blogPOST',
		render:function (eventName) {
			$(this.el).mustache(this.template,{
				blog:true,
				item:this.model, 
				theme: this.options.theme
			});
			return this;
		}
	}),
	twitterM : Backbone.Model.extend(),
	twitterC : Backbone.Collection.extend({
		model:this.homeM,
		url:"http://search.twitter.com/search.json?callback=?&count=10&include_rts=true&q=nonvulgi&locale=es",
		initialize:function(a){
			if(a != undefined){
			if(a.local != undefined)
				this.local=a.local;
			if(a.remote != undefined)
				this.remote=a.remote;
			}
		},
		parse: function(response) {
			return response;
		  },
		parseBeforeLocalSave: function(response) {
			return response.results;
		}
	}),
	twitter: Backbone.View.extend({
		initialize:function () {
			this.model.bind("reset", this.render, this);
		},
		template:'twitter',
		render:function (eventName) {
			_.each(this.model.models,function(tweet){
				time = new Date(tweet.attributes.created_at);
				localTime = time.getTime();
				localOffset = time.getTimezoneOffset() * 60000;
				utc = localTime - localOffset;
				d = new Date(utc);
				url=regLink.exec(tweet.attributes.text);
				if(url!= null)
				{
                	tweet.attributes.text=tweet.attributes.text.replace(regLink,"<a target='_blank' href='"+url[0]+"'>"+url[0]+"</a>");
                }
				user=regUser.exec(tweet.attributes.text);
				if(user!= null)
                tweet.attributes.text=tweet.attributes.text.replace(regUser,"<a target='_blank' href='http://twitter.com/#!/"+user[0].replace("@",'')+"'>"+user[0]+"</a>");
			});
			$(this.el).mustache(this.template,{
				twitter:true,
				items:this.model.models, 
				theme: this.options.theme,
				clean : function(){
					return function(html){
						return replace_all_rel_by_abs(html);
					}
				}
			});
			return this;
		}
	}),
	galeriaM : Backbone.Model.extend(),
	galeriaC : Backbone.Collection.extend({
		model:this.homeM,
		url:"http://nonvulgi.com/component/rsmediagallery/rsmediagallery/index.json?callback=?",
		initialize:function(a){
			if(a != undefined){
			if(a.local != undefined)
				this.local=a.local;
			if(a.remote != undefined)
				this.remote=a.remote;
			}
		},
		parse: function(response) {
			return response;
		  },
		parseBeforeLocalSave: function(response) {
			return response.items;
		}
	}),
	galeria: Backbone.View.extend({
		template:'galeria',
		render:function (eventName) {
			$(this.el).mustache(this.template,{
				galeria:true,
				items:this.model.models, 
				theme: this.options.theme
			});
			return this;
		}
	})
}

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"home",
        "contactenos":"contactenos",
        "blog":"blog",
		"blog/:id": "blogPost",
        "twitter":"twitter",
        "galeria":"galeria",
    },

    initialize:function () {
        // Handle back button throughout the application
		
        $('.back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
    },

    home:function () {
        console.log('#home');
		c = new app.homeC({local:true});
		var self = this;
		$.mobile.showPageLoadingMsg();
		c.fetch({success:function(){
			$.mobile.hidePageLoadingMsg();
			view = new app.homeView({model:c,theme:'c'})
			self.changePage(view);
		}});
    },

    contactenos:function () {
        console.log('#contactenos');
        this.changePage(new app.contactenos(),{ch:{transition: "pop",role:'dialog'}});
    },

    blog:function () {
        console.log('#blog');
		this.blog = new app.blogC({local:true});
		var self = this;
		$.mobile.showPageLoadingMsg();
		c = this.blog;
		c.fetch({success:function(){
			$.mobile.hidePageLoadingMsg();
			view = new app.blog({model:c,theme:'c'})
			self.changePage(view);
		}});
    },
	blogPost:function(id){
		console.log('#blogpost');
		var item = this.blog.get(id);
		var self = this;
		view = new app.blogPost({model:item ,theme:'c'});
		self.changePage(view);
	},
	twitter:function () {
        console.log('#twitter');
		c = new app.twitterC({local:true});
		var self = this;
		$.mobile.showPageLoadingMsg();
		c.fetch({success:function(){
			$.mobile.hidePageLoadingMsg();
			view = new app.twitter({model:c,theme:'c'})
			self.changePage(view);
		}});
    },
	galeria:function () {
        console.log('#galeria');
		c = new app.galeriaC({local:true});
		var self = this;
		$.mobile.showPageLoadingMsg();
		c.fetch({success:function(){
			$.mobile.hidePageLoadingMsg();
			view = new app.galeria({model:c,theme:'c'})
			self.changePage(view);
			photoSwipeInstance = $("ul.gallery a").photoSwipe({});
		}});
    },
    changePage:function (page,arreglo) {
		var options = $.extend(true,{
			ch:{
				changeHash:false, 
				transition: 'fade',
			}
		},arreglo);
        $(page.el).attr('data-role', 'page');
		$(page.el).attr('id', page.template);
        page.render();
        $('body').append($(page.el));
        if (this.firstPage) {
            options.ch.transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), options.ch);
    }

});

$(document).ready(function () {
    console.log('document ready');
	$.Mustache.addFromDom();
	//localStorage.removeItem("update");
	if(localStorage.update == undefined){
		sync();
	}else{
		var day = 1000*60*60*24;
		var d = new Date();
		console.log('localstorage: '+localStorage.update);
		console.log('dia: '+day);
		console.log('ahora: '+d.getTime());
		if(day+parseInt(localStorage.update) < d.getTime())
			sync();
		else{
			application = new AppRouter();
			Backbone.history.start();
		}
	}
});
function sync(){
	var d = new Date();
	localStorage.update = d.getTime();
	var app2 = _.filter(app, function(o,k){
		if(k.match(/.*[C]{1}$/g) != null)
			return true;
		else
			return false;
	});
	var tC = app2.length -1;
	var n = 0;
	_.each(app2,function(e,i){
		c = new e();
		c.fetch({
		success:function(){
			if( n == tC){
				application = new AppRouter();
				Backbone.history.start();
			}else
				n +=1;
		}
		});
	});
}
function rel_to_abs(url){
    /* Only accept commonly trusted protocols:
     * Only data-image URLs are accepted, Exotic flavours (escaped slash,
     * html-entitied characters) are not supported to keep the function fast */
  if(/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
         return url; //Url is already absolute

    var base_url = "http://nonvulgi.com/";
    if(url.substring(0,2) == "//")
        return location.protocol + url;
    else if(url.charAt(0) == "/")
        return location.protocol + "//" + location.host + url;
    else if(url.substring(0,2) == "./")
        url = "." + url;
    else if(/^\s*$/.test(url))
        return ""; //Empty = Return nothing
    else url = "" + url;

    url = base_url + url;
    var i=0
    while(/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g,"")));

    /* Escape certain characters to prevent XSS */
    url = url.replace(/\.$/,"").replace(/\/\./g,"").replace(/"/g,"%22")
            .replace(/'/g,"%27").replace(/</g,"%3C").replace(/>/g,"%3E");
    return url;
}
function replace_all_rel_by_abs(html){
    /*HTML/XML Attribute may not be prefixed by these characters (common 
       attribute chars.  This list is not complete, but will be sufficient
       for this function (see http://www.w3.org/TR/REC-xml/#NT-NameChar). */
    var att = "[^-a-z0-9:._]";

    var entityEnd = "(?:;|(?!\\d))";
    var ents = {" ":"(?:\\s|&nbsp;?|&#0*32"+entityEnd+"|&#x0*20"+entityEnd+")",
                "(":"(?:\\(|&#0*40"+entityEnd+"|&#x0*28"+entityEnd+")",
                ")":"(?:\\)|&#0*41"+entityEnd+"|&#x0*29"+entityEnd+")",
                ".":"(?:\\.|&#0*46"+entityEnd+"|&#x0*2e"+entityEnd+")"};
                /* Placeholders to filter obfuscations */
    var charMap = {};
    var s = ents[" "]+"*"; //Short-hand for common use
    var any = "(?:[^>\"']*(?:\"[^\"]*\"|'[^']*'))*?[^>]*";
    /* ^ Important: Must be pre- and postfixed by < and >.
     *   This RE should match anything within a tag!  */

    /*
      @name ae
      @description  Converts a given string in a sequence of the original
                      input and the HTML entity
      @param String string  String to convert
      */
    function ae(string){
        var all_chars_lowercase = string.toLowerCase();
        if(ents[string]) return ents[string];
        var all_chars_uppercase = string.toUpperCase();
        var RE_res = "";
        for(var i=0; i<string.length; i++){
            var char_lowercase = all_chars_lowercase.charAt(i);
            if(charMap[char_lowercase]){
                RE_res += charMap[char_lowercase];
                continue;
            }
            var char_uppercase = all_chars_uppercase.charAt(i);
            var RE_sub = [char_lowercase];
            RE_sub.push("&#0*" + char_lowercase.charCodeAt(0) + entityEnd);
            RE_sub.push("&#x0*" + char_lowercase.charCodeAt(0).toString(16) + entityEnd);
            if(char_lowercase != char_uppercase){
                /* Note: RE ignorecase flag has already been activated */
                RE_sub.push("&#0*" + char_uppercase.charCodeAt(0) + entityEnd);   
                RE_sub.push("&#x0*" + char_uppercase.charCodeAt(0).toString(16) + entityEnd);
            }
            RE_sub = "(?:" + RE_sub.join("|") + ")";
            RE_res += (charMap[char_lowercase] = RE_sub);
        }
        return(ents[string] = RE_res);
    }

    /*
      @name by
      @description  2nd argument for replace().
      */
    function by(match, group1, group2, group3){
        /* Note that this function can also be used to remove links:
         * return group1 + "javascript://" + group3; */
        return group1 + rel_to_abs(group2) + group3;
    }
    /*
      @name by2
      @description  2nd argument for replace(). Parses relevant HTML entities
      */
    var slashRE = new RegExp(ae("/"), 'g');
    var dotRE = new RegExp(ae("."), 'g');
    function by2(match, group1, group2, group3){
        /*Note that this function can also be used to remove links:
         * return group1 + "javascript://" + group3; */
        group2 = group2.replace(slashRE, "/").replace(dotRE, ".");
        return group1 + rel_to_abs(group2) + group3;
    }
    /*
      @name cr
      @description            Selects a HTML element and performs a
                                search-and-replace on attributes
      @param String selector  HTML substring to match
      @param String attribute RegExp-escaped; HTML element attribute to match
      @param String marker    Optional RegExp-escaped; marks the prefix
      @param String delimiter Optional RegExp escaped; non-quote delimiters
      @param String end       Optional RegExp-escaped; forces the match to end
                              before an occurence of <end>
     */
    function cr(selector, attribute, marker, delimiter, end){
        if(typeof selector == "string") selector = new RegExp(selector, "gi");
        attribute = att + attribute;
        marker = typeof marker == "string" ? marker : "\\s*=\\s*";
        delimiter = typeof delimiter == "string" ? delimiter : "";
        end = typeof end == "string" ? "?)("+end : ")(";
        var re1 = new RegExp('('+attribute+marker+'")([^"'+delimiter+']+'+end+')', 'gi');
        var re2 = new RegExp("("+attribute+marker+"')([^'"+delimiter+"]+"+end+")", 'gi');
        var re3 = new RegExp('('+attribute+marker+')([^"\'][^\\s>'+delimiter+']*'+end+')', 'gi');
        html = html.replace(selector, function(match){
            return match.replace(re1, by).replace(re2, by).replace(re3, by);
        });
    }
    /* 
      @name cri
      @description            Selects an attribute of a HTML element, and
                                performs a search-and-replace on certain values
      @param String selector  HTML element to match
      @param String attribute RegExp-escaped; HTML element attribute to match
      @param String front     RegExp-escaped; attribute value, prefix to match
      @param String flags     Optional RegExp flags, default "gi"
      @param String delimiter Optional RegExp-escaped; non-quote delimiters
      @param String end       Optional RegExp-escaped; forces the match to end
                                before an occurence of <end>
     */
    function cri(selector, attribute, front, flags, delimiter, end){
        if(typeof selector == "string") selector = new RegExp(selector, "gi");
        attribute = att + attribute;
        flags = typeof flags == "string" ? flags : "gi";
        var re1 = new RegExp('('+attribute+'\\s*=\\s*")([^"]*)', 'gi');
        var re2 = new RegExp("("+attribute+"\\s*=\\s*')([^']+)", 'gi');
        var at1 = new RegExp('('+front+')([^"]+)(")', flags);
        var at2 = new RegExp("("+front+")([^']+)(')", flags);
        if(typeof delimiter == "string"){
            end = typeof end == "string" ? end : "";
            var at3 = new RegExp("("+front+")([^\"'][^"+delimiter+"]*" + (end?"?)("+end+")":")()"), flags);
            var handleAttr = function(match, g1, g2){return g1+g2.replace(at1, by2).replace(at2, by2).replace(at3, by2)};
        } else {
            var handleAttr = function(match, g1, g2){return g1+g2.replace(at1, by2).replace(at2, by2)};
    }
        html = html.replace(selector, function(match){
             return match.replace(re1, handleAttr).replace(re2, handleAttr);
        });
    }

    /* <meta http-equiv=refresh content="  ; url= " > */
    cri("<meta"+any+att+"http-equiv\\s*=\\s*(?:\""+ae("refresh")+"\""+any+">|'"+ae("refresh")+"'"+any+">|"+ae("refresh")+"(?:"+ae(" ")+any+">|>))", "content", ae("url")+s+ae("=")+s, "i");

    cr("<"+any+att+"href\\s*="+any+">", "href"); /* Linked elements */
    cr("<"+any+att+"src\\s*="+any+">", "src"); /* Embedded elements */

    cr("<object"+any+att+"data\\s*="+any+">", "data"); /* <object data= > */
    cr("<applet"+any+att+"codebase\\s*="+any+">", "codebase"); /* <applet codebase= > */

    /* <param name=movie value= >*/
    cr("<param"+any+att+"name\\s*=\\s*(?:\""+ae("movie")+"\""+any+">|'"+ae("movie")+"'"+any+">|"+ae("movie")+"(?:"+ae(" ")+any+">|>))", "value");

    cr(/<style[^>]*>(?:[^"']*(?:"[^"]*"|'[^']*'))*?[^'"]*(?:<\/style|$)/gi, "url", "\\s*\\(\\s*", "", "\\s*\\)"); /* <style> */
    cri("<"+any+att+"style\\s*="+any+">", "style", ae("url")+s+ae("(")+s, 0, s+ae(")"), ae(")")); /*< style=" url(...) " > */
    return html;
}