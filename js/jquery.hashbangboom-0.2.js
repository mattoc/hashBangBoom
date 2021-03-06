/*
 * HashBangBoom - Hashbang Loader jQuery plugin
 *        __   __  ___        
 * |\/|  |  \|/ _ | |  /\ |   
 * |  |  |__/|\__)| | /--\|__ 
 *
 * copyright Robin Marshall, licensed GPL & MIT
 * http://www.mdigital.co.nz
 * http://github.com/mdigital/hashBangBoom
 */

window.hbbSel=[];
if (jQuery) (function($) {
    $.extend($.fn, {
        hashBangBoom: function(options) {
            var xhr;
            var haveContent=false;
            var haveMoved=false;
            var content='';
            var loading=false;

            var o=options;
            o.linkSelector=this;

            $(window).bind('hashchange', function(){
                // check to see if it's a hashbang URL
                if (location.hash.match(/#\!/)) {
                    // check to see if we should ignore it
                    if ( !o.ignore || !location.hash.match(o.ignore)) {
                        // check to see if it matches the URL pattern if there is one
                        if (!o.urlPattern || location.hash.match(o.urlPattern)) {
                            click( location.hash.replace('#!/',''),o );
                        }
                    }
                }
            });

            // trigger a hashchange event for loading first time
            $(window).hashchange();

            // collect up the selectors so we can hashify across instances
            hbbSel.push(o.linkSelector.selector);
            hashify();
        }
    });

    var hashify = function() {
        // hashify links
        $(hbbSel.join(', ')).each(function() {
            var newhref=this.href.replace(window.location.protocol+'//'+window.location.hostname+'/','');
            if (!this.href.match('/#!/')) {
                this.href='/#!/'+newhref;
            }
        });
    };

    var click = function(url,o) {
        loading=true;
        resetContent(o);
        if (url=="") url="/"; //hack for IE9
        // run the click handler
        o.click&&o.click(url);
        //get the content
        xhr=$.post(url,{ajax:1},function(resp) {
            // filter the response if there is a filter defined
            content=o.filter?$(resp).find(o.filter):resp;
            haveContent=true;
            // run the loaded handler
            o.loaded&&o.loaded();
            // check if the content is ready
            checkStatus(o);
            });
        // run the out transition, either user defined or default
        if(o.transitionOut) {
            o.transitionOut(o);
            haveMoved=true;
        } else {
            transitionOut(o);
        }
    };

    var resetContent = function(o) {
        if (xhr) xhr.abort();
        $(o.selector).css('left','0px');
    }

    var transitionOut = function(o) {
        // default slide out transition
        var marginWidth=$(o.selector).offset().left;
        $(o.selector).css('position','relative');
        $(o.selector).animate({left:'-'+($(o.selector).width()+marginWidth+50)+'px'},{ queue:false, duration:1000, easing: 'easeOutExpo', complete: function(o) {haveMoved=true; checkStatus(o);}(o)});
    };

    var transitionIn = function(o) {
        // default slide in transition
        $(o.selector).attr('style','position:relative; left:'+$(o.selector).width()+'px');
        $(o.selector).animate({left:'0px'},{ queue:false, duration:1000, easing: 'easeOutExpo', complete: function(o) {o.afterAnimation&&o.afterAnimation();}(o)});
    };

    var checkStatus = function(o) {
        // check to see if the content has successfully loaded
        if (haveMoved&&haveContent) {
            haveMoved = false;
            haveContent = false;
            // update the content in the container
            $(o.selector).replaceWith(content);
            // run the user defined transition or the default one
            o.transitionIn?o.transitionIn(o):transitionIn(o);
            // run the complete handler
            o.complete && o.complete();
            // hashify all the links ready for the next click
            hashify();
            loading=false;
        }
    };
})(jQuery);

