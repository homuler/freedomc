var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["42"]={path:"/static/music/カラフル/colorful_full.mp3",format:"Sound"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["39"]={path:"/static/music/daydreamCafe/gochiusa.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["40"]={path:"/static/music/level5-judgelight-2/judgelight_OP.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["38"]={path:"/static/music/memoria/memoria_ed.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["37"]={path:"/static/music/oathSign/oath_sign_op.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["43"]={path:"/static/music/onlyMyRailgun/only_my_railgun.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["45"]={path:"/static/music/stapleStable/staple_stable.mp3",format:"Sound"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["44"]={path:"/static/music/君の知らない物語/storiesYouDontKnow_op.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.musicSrc=ns.musicSrc||{};ns.musicSrc["41"]={path:"/static/music/恋愛サーキュレーション/circulation_op.m4v",format:"Video"};console.log(ns.musicSrc)})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()};var fc=fc||{};fc.thumbnail=fc.thumbnail||{};(function(ns){ns.nodes={popup:null,thumbnails:null,imgNode:null,musicNodes:{},};ns.focusId=-1;ns.init=function(){ns.nodes.$popup=$("#popup-thumbnail");ns.nodes.$popup.hide();ns.nodes.$thumbnails=$(".music-thumbnail");ns.nodes.$form=$("#game-form");ns.nodes.$inputId=$("#game-id");ns.nodes.$playBtn=$("#play-btn");ns.nodes.$cancelBtn=$("#cancel-btn");console.log(ns.nodes.$thumbnails);ns.nodes.$playBtn.on("click",function(){ns.doPost(ns.nodes.$form.attr("name"))});ns.nodes.$cancelBtn.on("click",function(){console.log(ns.focusId);console.log(ns.nodes.musicNodes[ns.focusId]);ns.nodes.musicNodes[ns.focusId].children(".game-sound").get(0).pause();ns.nodes.musicNodes[ns.focusId].hide();ns.focusId=-1;ns.nodes.$popup.hide()});ns.nodes.$thumbnails.on("click",function(){if(ns.focusId>=0){console.log(ns.focusId);return};console.log("onmouseover event");var musicId=$(this).attr("data-id"),$musicContainer=ns.nodes.musicNodes[musicId];ns.focusId=musicId;console.log(musicId);ns.nodes.$inputId.attr("value",musicId);if($musicContainer){console.log("Ther is already node");console.log($musicContainer);$musicContainer.show();console.log($musicContainer.children(".game-sound"));$musicContainer.children(".game-sound").get(0).play();ns.nodes.$popup.show();return};console.log(ns.musicSrc);console.log(musicId);console.log(ns.nodes.$inputId);console.log(ns.nodes.$form);console.log("new element will be created");var musicInfo=ns.musicSrc[musicId],$musicNode=musicInfo.format==="Video"?$("<video>"):$("<audio>");$musicNode.addClass("game-sound");$musicNode.attr("loop",true);$musicContainer=$("<div>"),$musicContainer.attr("id","music-container-"+musicId);if(musicInfo.format!=="Video"){var $imgNode=$("<img>");$imgNode.attr("src",$(this).children()[0].getAttribute("src"));$musicContainer.append($imgNode)};var $sourceNode=$("<source>");$sourceNode.attr("src",musicInfo.path);console.log("sourceNode"+$sourceNode);$musicNode.append($sourceNode);$musicContainer.append($musicNode);ns.nodes.musicNodes[musicId]=$musicContainer;$musicContainer.insertBefore("#game-form");ns.nodes.$popup.show();$musicNode.get(0).play()})};ns.doPost=function(form){console.log("doPost called");console.log(form);var f=document.forms[form];ns.nodes.$inputId.attr("value",ns.focusId);f.submit();return true}})(fc.thumbnail=fc.thumbnail||{});window.onload=function(){fc.thumbnail.init()}