var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {};
    ns.init = function(){
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.musicNodes = document.getElementsByClassName("fc-music");
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
                var musicNode = document.getElementById("music-" + this.getAttribute("data-id"));
                console.log(this.getAttribute("data-id"));
                if(musicNode.childNodes.length === 0){
                    var sourceNode = document.createElement("source");
                    sourceNode.setAttribute("src", musicNode.getAttribute("data-src"));
                    musicNode.appendChild(sourceNode);
                    if(musicNode.nodeName == "AUDIO"){
                        var imgNode = document.createElement("img");
                        imgNode.setAttribute("src", this.getAttribute("src"));
                        musicNode.insertBefore(imgNode);
                    }
                }
                console.log("mouseover event");
                //this.currentTime = 0;
                musicNode.parentNode.hidden = false;
                musicNode.play();
                };
                musicNode.parentNode.onmouseout = (function(){
                    var m = musicNode;
                    return function(){
                        this.hidden = true;
                        m.pause();
                    };
                })();
            };
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
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {};
    ns.init = function(){
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.musicNodes = document.getElementsByClassName("fc-music");
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
                var musicNode = document.getElementById("music-" + this.getAttribute("data-id"));
                console.log(this.getAttribute("data-id"));
                if(musicNode.childNodes.length === 0){
                    var sourceNode = document.createElement("source");
                    sourceNode.setAttribute("src", musicNode.getAttribute("data-src"));
                    musicNode.appendChild(sourceNode);
                    if(musicNode.nodeName == "AUDIO"){
                        var imgNode = document.createElement("img");
                        imgNode.setAttribute("src", this.getAttribute("src"));
                        musicNode.insertBefore(imgNode);
                    }
                }
                console.log("mouseover event");
                //this.currentTime = 0;
                musicNode.parentNode.hidden = false;
                musicNode.play();
                };
                musicNode.parentNode.onmouseout = (function(){
                    var m = musicNode;
                    return function(){
                        this.hidden = true;
                        m.pause();
                    };
                })();
            };
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
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {};
    ns.init = function(){
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.musicNodes = document.getElementsByClassName("fc-music");
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
                var musicNode = document.getElementById("music-" + this.getAttribute("data-id"));
                console.log(this.getAttribute("data-id"));
                if(musicNode.childNodes.length === 0){
                    var sourceNode = document.createElement("source");
                    sourceNode.setAttribute("src", musicNode.getAttribute("data-src"));
                    musicNode.appendChild(sourceNode);
                    if(musicNode.nodeName == "AUDIO"){
                        var imgNode = document.createElement("img");
                        imgNode.setAttribute("src", this.getAttribute("src"));
                        musicNode.insertBefore(imgNode);
                    }
                }
                console.log("mouseover event");
                //this.currentTime = 0;
                musicNode.parentNode.hidden = false;
                musicNode.play();
                };
                musicNode.parentNode.onmouseout = (function(){
                    var m = musicNode;
                    return function(){
                        this.hidden = true;
                        m.pause();
                    };
                })();
            };
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
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {};
    ns.init = function(){
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.musicNodes = document.getElementsByClassName("fc-music");
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
                var musicNode = document.getElementById("music-" + this.getAttribute("data-id"));
                console.log(this.getAttribute("data-id"));
                if(musicNode.childNodes.length === 0){
                    var sourceNode = document.createElement("source");
                    sourceNode.setAttribute("src", musicNode.getAttribute("data-src"));
                    musicNode.appendChild(sourceNode);
                    if(musicNode.nodeName == "AUDIO"){
                        var imgNode = document.createElement("img");
                        imgNode.setAttribute("src", this.getAttribute("src"));
                        musicNode.insertBefore(imgNode);
                    }
                }
                console.log("mouseover event");
                //this.currentTime = 0;
                musicNode.parentNode.hidden = false;
                musicNode.play();
                };
                musicNode.parentNode.onmouseout = (function(){
                    var m = musicNode;
                    return function(){
                        this.hidden = true;
                        m.pause();
                    };
                })();
            };
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
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {};
    ns.init = function(){
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.musicNodes = document.getElementsByClassName("fc-music");
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
                var musicNode = document.getElementById("music-" + this.getAttribute("data-id"));
                console.log(this.getAttribute("data-id"));
                if(musicNode.childNodes.length === 0){
                    var sourceNode = document.createElement("source");
                    sourceNode.setAttribute("src", musicNode.getAttribute("data-src"));
                    musicNode.appendChild(sourceNode);
                    if(musicNode.nodeName == "AUDIO"){
                        var imgNode = document.createElement("img");
                        imgNode.setAttribute("src", this.getAttribute("src"));
                        musicNode.insertBefore(imgNode);
                    }
                }
                console.log("mouseover event");
                //this.currentTime = 0;
                musicNode.parentNode.hidden = false;
                musicNode.play();
                };
                musicNode.parentNode.onmouseout = (function(){
                    var m = musicNode;
                    return function(){
                        this.hidden = true;
                        m.pause();
                    };
                })();
            };
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
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {};
    ns.init = function(){
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.musicNodes = document.getElementsByClassName("fc-music");
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
                var musicNode = document.getElementById("music-" + this.getAttribute("data-id"));
                console.log(this.getAttribute("data-id"));
                if(musicNode.childNodes.length === 0){
                    var sourceNode = document.createElement("source");
                    sourceNode.setAttribute("src", musicNode.getAttribute("data-src"));
                    musicNode.appendChild(sourceNode);
                    if(musicNode.nodeName == "AUDIO"){
                        var imgNode = document.createElement("img");
                        imgNode.setAttribute("src", this.getAttribute("src"));
                        musicNode.insertBefore(imgNode);
                    }
                }
                console.log("mouseover event");
                //this.currentTime = 0;
                musicNode.parentNode.hidden = false;
                musicNode.play();
                };
                musicNode.parentNode.onmouseout = (function(){
                    var m = musicNode;
                    return function(){
                        this.hidden = true;
                        m.pause();
                    };
                })();
            };
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
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {};
    ns.init = function(){
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.musicNodes = document.getElementsByClassName("fc-music");
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
                var musicNode = document.getElementById("music-" + this.getAttribute("data-id"));
                console.log(this.getAttribute("data-id"));
                if(musicNode.childNodes.length === 0){
                    var sourceNode = document.createElement("source");
                    sourceNode.setAttribute("src", musicNode.getAttribute("data-src"));
                    musicNode.appendChild(sourceNode);
                    if(musicNode.nodeName == "AUDIO"){
                        var imgNode = document.createElement("img");
                        imgNode.setAttribute("src", this.getAttribute("src"));
                        musicNode.insertBefore(imgNode);
                    }
                }
                console.log("mouseover event");
                //this.currentTime = 0;
                musicNode.parentNode.hidden = false;
                musicNode.play();
                };
                musicNode.parentNode.onmouseout = (function(){
                    var m = musicNode;
                    return function(){
                        this.hidden = true;
                        m.pause();
                    };
                })();
            };
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
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {};
    ns.init = function(){
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.musicNodes = document.getElementsByClassName("fc-music");
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
                var musicNode = document.getElementById("music-" + this.getAttribute("data-id"));
                console.log(this.getAttribute("data-id"));
                if(musicNode.childNodes.length === 0){
                    var sourceNode = document.createElement("source");
                    sourceNode.setAttribute("src", musicNode.getAttribute("data-src"));
                    musicNode.appendChild(sourceNode);
                    if(musicNode.nodeName == "AUDIO"){
                        var imgNode = document.createElement("img");
                        imgNode.setAttribute("src", this.getAttribute("src"));
                        musicNode.insertBefore(imgNode);
                    }
                }
                console.log("mouseover event");
                //this.currentTime = 0;
                musicNode.parentNode.hidden = false;
                musicNode.play();
                };
                musicNode.parentNode.onmouseout = (function(){
                    var m = musicNode;
                    return function(){
                        this.hidden = true;
                        m.pause();
                    };
                })();
            };
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
var fc = fc || {};
fc.thumbnail = fc.thumbnail || {};

(function(ns){
    ns.nodes = {};
    ns.init = function(){
        ns.nodes.thumbnails = document.getElementsByClassName("music-thumbnail");
        ns.nodes.imgNodes = document.getElementsByClassName("thumbnail");
        ns.nodes.musicNodes = document.getElementsByClassName("fc-music");
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
                var musicNode = document.getElementById("music-" + this.getAttribute("data-id"));
                console.log(this.getAttribute("data-id"));
                if(musicNode.childNodes.length === 0){
                    var sourceNode = document.createElement("source");
                    sourceNode.setAttribute("src", musicNode.getAttribute("data-src"));
                    musicNode.appendChild(sourceNode);
                    if(musicNode.nodeName == "AUDIO"){
                        var imgNode = document.createElement("img");
                        imgNode.setAttribute("src", this.getAttribute("src"));
                        musicNode.insertBefore(imgNode);
                    }
                }
                console.log("mouseover event");
                //this.currentTime = 0;
                musicNode.parentNode.hidden = false;
                musicNode.play();
                };
                musicNode.parentNode.onmouseout = (function(){
                    var m = musicNode;
                    return function(){
                        this.hidden = true;
                        m.pause();
                    };
                })();
            };
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
