var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.nodes={};ns.init=function(){ns.nodes.thumbnails=document.getElementsByClassName("music-thumbnail");ns.nodes.musicNodes=document.getElementsByClassName("fc-music");for(var i=0;i<ns.nodes.thumbnails.length;i++)ns.nodes.thumbnails[i].onclick=function(){ns.doPost(this.parentNode)};for(var i=0;i<ns.nodes.musicNodes.length;i++){console.log(ns.nodes.musicNodes[i]);ns.nodes.musicNodes[i].onmouseover=function(){console.log("mouseover event");this.play()};ns.nodes.musicNodes[i].onmouseout=function(){this.pause()}};ns.setThumnail()};ns.doPost=function(form){console.log("doPost called");console.log(form);var f=document.forms[form.name];f.submit();return true};ns.setThumnail=function(){for(x in ns.nodes.musicNodes){console.log(ns.nodes.musicNodes[x].currentTime);console.log(ns.nodes.musicNodes[x].duration);console.log(ns.nodes.musicNodes[x]);console.log(ns.nodes.musicNodes[x].readyState);ns.nodes.musicNodes[x].currentTime=ns.nodes.musicNodes[x].duration/2}}})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.nodes={};ns.init=function(){ns.nodes.thumbnails=document.getElementsByClassName("music-thumbnail");ns.nodes.musicNodes=document.getElementsByClassName("fc-music");for(var i=0;i<ns.nodes.thumbnails.length;i++)ns.nodes.thumbnails[i].onclick=function(){ns.doPost(this.parentNode)};for(var i=0;i<ns.nodes.musicNodes.length;i++){console.log(ns.nodes.musicNodes[i]);ns.nodes.musicNodes[i].onmouseover=function(){console.log("mouseover event");this.play()};ns.nodes.musicNodes[i].onmouseout=function(){this.pause()}};ns.setThumnail()};ns.doPost=function(form){console.log("doPost called");console.log(form);var f=document.forms[form.name];f.submit();return true};ns.setThumnail=function(){for(x in ns.nodes.musicNodes){console.log(ns.nodes.musicNodes[x].currentTime);console.log(ns.nodes.musicNodes[x].duration);console.log(ns.nodes.musicNodes[x]);console.log(ns.nodes.musicNodes[x].readyState);ns.nodes.musicNodes[x].currentTime=ns.nodes.musicNodes[x].duration/2}}})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.nodes={};ns.init=function(){ns.nodes.thumbnails=document.getElementsByClassName("music-thumbnail");ns.nodes.musicNodes=document.getElementsByClassName("fc-music");for(var i=0;i<ns.nodes.thumbnails.length;i++)ns.nodes.thumbnails[i].onclick=function(){ns.doPost(this.parentNode)};for(var i=0;i<ns.nodes.musicNodes.length;i++){console.log(ns.nodes.musicNodes[i]);ns.nodes.musicNodes[i].onmouseover=function(){console.log("mouseover event");this.play()};ns.nodes.musicNodes[i].onmouseout=function(){this.pause()}};ns.setThumnail()};ns.doPost=function(form){console.log("doPost called");console.log(form);var f=document.forms[form.name];f.submit();return true};ns.setThumnail=function(){for(x in ns.nodes.musicNodes){console.log(ns.nodes.musicNodes[x].currentTime);console.log(ns.nodes.musicNodes[x].duration);console.log(ns.nodes.musicNodes[x]);console.log(ns.nodes.musicNodes[x].readyState);ns.nodes.musicNodes[x].currentTime=ns.nodes.musicNodes[x].duration/2}}})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()}