var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["42"]={path:"/static/music/カラフル/colorful_full.mp3",format:"Sound"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["39"]={path:"/static/music/daydreamCafe/gochiusa.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["40"]={path:"/static/music/level5-judgelight-2/judgelight_OP.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["38"]={path:"/static/music/memoria/memoria_ed.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["37"]={path:"/static/music/oathSign/oath_sign_op.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["43"]={path:"/static/music/onlyMyRailgun/only_my_railgun.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["45"]={path:"/static/music/stapleStable/staple_stable.mp3",format:"Sound"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["44"]={path:"/static/music/君の知らない物語/storiesYouDontKnow_op.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["41"]={path:"/static/music/恋愛サーキュレーション/circulation_op.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.nodes={popup:null,thumbnails:null,imgNode:null,musicNodes:{},};ns.init=function(){ns.nodes.$popup=$("#popup-thumbnail");ns.nodes.$popup.toggle();ns.nodes.$thumbnails=$(".music-thumbnail");ns.nodes.$form=$("#game-form");ns.nodes.$inputId=$("#game-id");console.log(ns.nodes.$thumbnails);ns.nodes.$popup.on("click",function(){ns.doPost(ns.nodes.$form)});ns.nodes.$thumbnails.on("mouseover",function(){console.log("onmouseover event");var musicId=$(this).attr("data-id"),$musicContainer=ns.nodes.musicNodes[musicId];console.log(musicId);ns.nodes.$inputId.attr("value",musicId);if($musicContainer){console.log("Ther is already node");console.log($musicContainer);$musicContainer.show();ns.nodes.$popup.show();return};console.log(ns.musicSrc);console.log(musicId);console.log(ns.nodes.$inputId);console.log(ns.nodes.$form);console.log("new element will be created");var musicInfo=ns.musicSrc[musicId],$musicNode=musicInfo.format==="Video"?$("<video>"):$("<audio>");$musicContainer=$("<div>"),$musicContainer.attr("id","music-container-"+musicId);if(musicInfo.format!=="Video"){var $imgNode=$("<img>");$imgNode.attr("src",$(this).children()[0].getAttribute("src"));$musicContainer.append($imgNode)};var $sourceNode=$("<source>");$sourceNode.attr("src",musicInfo.path);console.log("sourceNode"+$sourceNode);$musicNode.append($sourceNode);$musicContainer.append($musicNode);ns.nodes.musicNodes[musicId]=$musicContainer;ns.nodes.$popup.append($musicContainer);ns.nodes.$popup.show();$musicContainer.on("mouseover",function(){$musicNode.get(0).play()});$musicContainer.on("mouseout",(function(){return function(event){$(this).hide();console.log("this");console.log(this);console.log(this.hidden);console.log(this);$musicNode.get(0).pause();$musicNode.hide();console.log($musicNode)}})())});ns.nodes.$popup.onmouseout=function(){$(this).toggle()}};ns.doPost=function(form){console.log("doPost called");console.log(form);var f=document.forms[form.name];f.submit();return true}})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()}