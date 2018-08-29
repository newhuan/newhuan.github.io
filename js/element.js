/**
 * Created by newhuan on 2018/8/29.
 */

/**
 * <meta charset="utf-8">
    <title>已读</title>
    <meta name="description" content="newhuan">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="renderer" content="webkit">
    <link rel="stylesheet" href="../../../css/app.css">
    <script src="../../../js/app.js"></script>
    <meta name="apple-mobile-web-app-title" content="newhuan">
*/


var root = 'http://www.newhuan.name/';
var nodes = [
    { type: "meta", attributes: { name: "description", content: 'newhuan' } },
    { type: "meta", attributes: { "http-equiv": "X-UA-Compatible", content: 'IE=edge' } },
    { type: "meta", attributes: { name: "viewport", content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' } },
    { type: "meta", attributes: { name: "renderer", content: 'webkit' } },
    { type: "meta", attributes: { name: "apple-mobile-web-app-title", content: 'newhuan' } },
    { type: "link", attributes: { rel: "stylesheet", href: root + 'css/app.css' } },
]
var fragment = document.createDocumentFragment();
for ( var i = 0, len = nodes.length; i < len; ++i  ) {
    var item = nodes[i],
        node = document.createElement( item.type );
    for ( var key in item.attributes ) {
        node.setAttribute( key, item.attributes[ key ] );
    }
    fragment.appendChild( node );
}
document.getElementsByTagName( 'head' )[0].append( fragment );

/**
 * <div class="full-footer">
        <div class="container">
            <div class="copyright">
                © 2017&nbsp;
                <a href="http://www.newhuan.name/note/" target="_blank">newhuan</a>&nbsp;by&nbsp;
            </div>
        </div>
    </div>
*/
/**
 * <div class="full-header">
        <div class="container">
            <div class="logo">
                <a href="http://www.newhuan.name/index.html" title="newhuan" alt="newhuan">首頁</a>
            </div>
            <div class="nav">
            </div>
        </div>
    </div>
*/

/**
 * type： node type
 * attributes: node attributes
 * **text和children互斥
 * text: text node
 * children: children elements
*/
var CHILD_TYPE = {
    TEXT: "text",
    NODE: "node"
}
var $nav = { type: "div", attributes: { "class": "nav" } },
    $a_copyright = { type: "a", attributes: { "href": "http://www.newhuan.name/note/", "target": "_blank" }, text: "newhuan" },
    $a_logo = { type: "a", attributes: { "href": "http://www.newhuan.name/index.html", "title": "newhuan", alt: "newhuan" }, text: "首页" },
    $copyright = {
        type: "div",
        attributes: { "class": "copyright" },
        children: [
            { type: CHILD_TYPE.TEXT, inner: "© 2017 " },
            { type: CHILD_TYPE.NODE, inner: $a_copyright },
            { type: CHILD_TYPE.TEXT, inner: " by " },
        ]
    },
    $logo = {
        type: "div",
        attributes: { "class": "logo" },
        children: [
            { type: CHILD_TYPE.NODE, inner: $a_logo },
        ]
    },
    $container_footer = { type: "div", attributes: { "class": "container" }, children: [ { type: CHILD_TYPE.NODE, inner: $copyright } ] },
    $container_header = { type: "div", attributes: { "class": "container" }, children: [ { type: CHILD_TYPE.NODE, inner: $logo }, { type: CHILD_TYPE.NODE, inner: $nav } ] };

var $header = { type: "div", attributes: { "class": "full-header" }, children: [ { type: CHILD_TYPE.NODE, inner: $container_header } ] },
    $footer = { type: "div", attributes: { "class": "full-footer" }, children: [ { type: CHILD_TYPE.NODE, inner: $container_footer } ] };

function getElement( data ) {
    var node = document.createElement( data.type );
    for ( var key in data.attributes ) {
        node.setAttribute( key, data.attributes[ key ] );
    }
    if ( !!data.children ) {
        var children = data.children;
        for ( var i = 0, len = children.length; i < len; ++i ) {
            var child = children[ i ];
            switch ( child.type ) {
                case CHILD_TYPE.NODE:
                    node.appendChild( getElement( child.inner ) );
                    break;
                case CHILD_TYPE.TEXT:
                    node.appendChild( document.createTextNode( child.inner || "" ) );
                    break;
            }
        }
    } else {
        node.appendChild( document.createTextNode( data.text || "" ) );
    }
    return node;
}

window.onload = function (ev) {
    var $body = document.body;
    $body.className = "body body-article";
    $body.append( getElement( $footer ) );
    $body.prepend( getElement( $header ) );
}