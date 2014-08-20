var fc = fc || {};
var fc.util = fc.util = {};

(function(ns){
    ns.doPost = function(formName){
        var f = document.forms[formName];
        f.submit();
        return true;
    };
})(fc.util = fc.util || {});

window.onload = function(){
    var nodes = document.getElementsByClassName("game-form");
    for(var i = 0; i < nodes.length; i++){
        nodes[i].onclick = fc.util.doPost(nodes[i].name);
    }
};
