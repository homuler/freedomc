var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["42"] =
        {
            path: "/static/music/カラフル/colorful_full.mp3",
            format: "Sound"
        };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["39"] =
        {
            path: "/static/music/daydreamCafe/gochiusa.m4v",
            format: "Video"
        };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["40"] =
        {
            path: "/static/music/level5-judgelight-2/judgelight_OP.m4v",
            format: "Video"
        };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["38"] =
        {
            path: "/static/music/memoria/memoria_ed.m4v",
            format: "Video"
        };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["37"] =
        {
            path: "/static/music/oathSign/oath_sign_op.m4v",
            format: "Video"
        };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["43"] =
        {
            path: "/static/music/onlyMyRailgun/only_my_railgun.m4v",
            format: "Video"
        };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["45"] =
        {
            path: "/static/music/stapleStable/staple_stable.mp3",
            format: "Sound"
        };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["44"] =
        {
            path: "/static/music/君の知らない物語/storiesYouDontKnow_op.m4v",
            format: "Video"
        };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["41"] =
        {
            path: "/static/music/恋愛サーキュレーション/circulation_op.m4v",
            format: "Video"
        };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {
        popup: null,
        thumbnails: null,
        imgNode: null,
        musicNodes: {},
    };
    ns.init = function(){
        ns.nodes.popup = document.getElementById("popup-thumbnail");
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.closeBtns = document.getElementsByClassName("close-btn");
        for(var i = 0; i < ns.nodes.thumbnails.length; i++){
            ns.nodes.thumbnails[i].onclick = function(){
                ns.doPost(this.parentNode);
            };
        }

        for(var i = 0; i < ns.nodes.imgNodes.length; i++){
            console.log(i);
            console.log(ns.nodes.imgNodes[i]);
            ns.nodes.imgNodes[i].onmouseover = function(){
                console.log("onmouseover event");
                var musicId = this.getAttribute("data-id"),
                    musicContainer = ns.nodes.musicNodes[musicId];
                if(musicContainer){
                    musicContainer.hidden = false;
                    ns.nodes.popup.hidden = false;
                    return;
                }
                console.log("new element will be created");
                var musicInfo = ns.musicSrc[musicId],
                    musicNode = musicInfo.format === "Video" ?
                    document.createElement("video"):
                    document.createElement("audio");
                musicContainer = document.createElement("div"),
                musicContainer.id = "music-container-" + musicId;
                if(musicInfo.format !== "Video"){
                    var imgNode = document.createElement("img");
                    imgNode.setAttribute("src", this.getAttribute("src"));
                    musicContainer.appendChild(imgNode);
                }
                var sourceNode = document.createElement("source");
                sourceNode.setAttribute("src", musicInfo.path);

                musicNode.appendChild(sourceNode);
                musicContainer.appendChild(musicNode);
                ns.nodes.musicNodes[musicId] = musicContainer;

                ns.nodes.popup.appendChild(musicContainer);
                ns.nodes.popup.hidden = false;

                musicContainer.hidden = true;
                musicNode.onmouseover = function(){
                    this.play();
                };
                musicNode.onmouseout = function(){
                    this.pause();
                };
                musicNode.oncanplaythrough = function(){
                    this.hidden = false;
                };
                musicContainer.onmouseout = (function(){
                    var m = musicNode;
                    return function(event){
                        var e = event.toElement || event.relatedTarget;
                        if(e.parentNode == this || e == this){
                            return;
                        }
                        this.hidden = true;
                        m.pause();
                    };
                };
                console.log(musicContainer.hidden);
                console.log(musicNode.hidden);
                )();
            };
        }
        ns.nodes.popup.onmouseout = function(){
            this.hidden = true;
        }

     //   ns.setThumnail();
    };
    ns.doPost = function(form){
        console.log("doPost called");
        console.log(form);
        var f = document.forms[form.name];
        f.submit();
        return true;
    };
    ns.setThumnail = function(){
        for(x in ns.nodes.musicNodes){
            ns.nodes.musicNodes[x].oncanplaythrough = function(){
                console.log(this.readyState);
                this.currentTime = this.duration / 2;};
        }
    };
})(fc.thumbnail = fc.thumbnail || {});

window.onload = function(){
    fc.thumbnail.init();
};