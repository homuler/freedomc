var fc=fc||{};fc.util=fc.util||{};(function(ns){ns.doPost=function(form){form.submit();return true}})(fc.util=fc.util||{});window.onload=function(){var nodes=document.getElementsByClassName("game-form");console.log(nodes);for(var i=0;i<nodes.length;i++){nodes[i].onclick=function(){fc.util.doPost(nodes[i].parentNode)};console.log(nodes[i].parentNode)}}