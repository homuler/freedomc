var fc=fc||{};fc.util=fc.util||{};(function(ns){ns.nodes=null;ns.init=function(){ns.nodes=document.getElementsByTagName("video");console.log(ns.nodes);for(var i=0;i<ns.nodes.length;i++){console.log(ns.nodes[i]+" click");ns.nodes[i].onclick=ns.doPost(ns.nodes[i].parentNode);console.log(ns.nodes[i].parentNode)}};ns.doPost=function(form){console.log("doPost called");console.log(form);var f=document.forms[form.name];f.submit();return true}})(fc.util=fc.util||{});window.onload=function(){fc.util.init()}