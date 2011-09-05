=====
hashBangBoom!
=====
 
A jQuery plugin to load page content asynchronously
 - allows progressively-enhanced one-page sites.
 - load content by selector to load page content from your CMS
 - makes tabbed content easy
 
Original Author: Robin Marshall <robin@mdigital.co.nz>

Dependencies
-------
For compatibility with older browsers you'll want the hashchange event: https://github.com/cowboy/jquery-hashchange

Usage
--------

Quickstart: ::

    $('div#content a').hashBangBoom({'selector':'div#content'});

With options: ::

    $('div#content a').hashBangBoom({
        'selector': 'div#content', // content to replace
        'filter': '#content', // filter for content returned
        'ignore': 'contact', // link pattern to ignore
        'urlPattern': /buzz\//, // link pattern to trigger on
        'loaded': afterLoad, // callback after content loads but before animation 
        'complete': finished, // callback after load and animation is complete
        'click': clicked, // callback when the link is clicked
        'afterAnimation': fadeIn, // callback after the animation is completed
        'transitionIn': transition1, // callback to transition the content in
        'transitionOut': transition2 // callback to transition the content out
    });
