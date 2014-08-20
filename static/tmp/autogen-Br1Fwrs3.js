var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.musicSrc = ns.musicSrc || {};
    ns.musicSrc["42"] =
        {
            path: "/static/music/カラフル/colorful_full.mp3",
            format: "Sound"
        };
    console.log(ns.musicSrc);
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
    console.log(ns.musicSrc);
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
    console.log(ns.musicSrc);
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
    console.log(ns.musicSrc);
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
    console.log(ns.musicSrc);
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
    console.log(ns.musicSrc);
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
    console.log(ns.musicSrc);
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
    console.log(ns.musicSrc);
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
    console.log(ns.musicSrc);
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
        ns.nodes.form = document.getElementById("game-form");
        ns.nodes.inputId = document.getElementById("game-id");
        ns.nodes.popup.onclick = function(){
            ns.doPost(ns.nodes.form);
        };
        for(var i = 0; i < ns.nodes.thumbnails.length; i++){
            ns.nodes.thumbnails[i].onmouseover = function(){
                console.log("onmouseover event");
                var musicId = this.getAttribute("data-id"),
                    musicContainer = ns.nodes.musicNodes[musicId];
                ns.nodes.inputId.value = musicId;
                if(musicContainer){
                    musicContainer.hidden = false;
                    ns.nodes.popup.hidden = false;
                    return;
                }
                console.log(ns.musicSrc);
                console.log(musicId);
                console.log(ns.nodes.inputId);
                console.log(ns.nodes.form);
                console.log("new element will be created");
                var musicInfo = ns.musicSrc[musicId],
                    musicNode = musicInfo.format === "Video" ?
                    document.createElement("video"):
                    document.createElement("audio");
                musicContainer = document.createElement("div"),
                musicContainer.id = "music-container-" + musicId;
                if(musicInfo.format !== "Video"){
                    var imgNode = document.createElement("img");
                    imgNode.setAttribute("src", this.childNodes[0].getAttribute("src"));
                    musicContainer.appendChild(imgNode);
                }
                var sourceNode = document.createElement("source");
                sourceNode.setAttribute("src", musicInfo.path);

                musicNode.appendChild(sourceNode);
                musicContainer.appendChild(musicNode);
                ns.nodes.musicNodes[musicId] = musicContainer;

                ns.nodes.popup.appendChild(musicContainer);
                ns.nodes.popup.hidden = false;

                musicContainer.hidden = false;
                musicContainer.onmouseover = function(){
                    musicNode.play();
                };
                musicContainer.onmouseout = (function(){
                    return function(){
                        musicNode.pause();
                    };
                })();
                musicNode.oncanplaythrough = function(){
                    this.hidden = false;
                };
                musicContainer.onmouseout = (function(){
                    var m = musicNode;
                    return function(event){
                        /*var e = event.toElement || event.relatedTarget;
                        if(e.parentNode == this || e == this){
                            return;
                        }*
                        this.hidden = true;
                        m.pause();
                    };
                })();
                console.log(musicContainer.hidden);
                console.log(musicNode.hidden);
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