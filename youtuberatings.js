
// ==UserScript==
// @name            Youtube Ratings
// @namespace       youtube.com
// @version         0.7
// @description     enter something useful
// @grant           GM_addStyle
// @include         *youtube.com/*
// @run-at          document-end
// @copyright       2015
// ==/UserScript==

// NOT FOR PUBLIC! Uses private key
// Edit with caret!

var added = 0;

function dataReady(object, request){
     if (request.status >= 200 && request.status < 400){
          var data = JSON.parse(request.responseText);
          console.log(data);
          var node = document.createElement("span");
          var likesCount = data.items[0].statistics.likeCount;
          if (likesCount > 30) likesCount = 30;
          var rating = Math.round((parseInt(data.items[0].statistics.likeCount)/(parseInt(data.items[0].statistics.likeCount) + parseInt(data.items[0].statistics.dislikeCount)) * 100));
          node.innerHTML = ""+new String(" ☆ ☆ ☆ ☆ ☆").substr(0, Math.round((rating/21) * (likesCount/30)) * 2)+" - <b>"+rating+"%</b> ("+data.items[0].statistics.likeCount+" 👍, "+data.items[0].statistics.commentCount+" 💬)<br><span style = 'font-size: 10px'>"+data.items[0].snippet.description+"</span><br><span><img src = 'https://i.ytimg.com/vi/"+data.items[0].id+"/1.jpg'><span><img src = 'https://i.ytimg.com/vi/"+data.items[0].id+"/2.jpg'><img src = 'https://i.ytimg.com/vi/"+data.items[0].id+"/3.jpg'></span>";
          node.style.backgroundColor = "#FAFAFA";
          object.appendChild(node);
     }
     else {} // request failed
}

function requestAPI(object){
     var request = new XMLHttpRequest();
     request.open("GET", "https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id="+object.querySelector("a#video-title").href.split("v=")[object.querySelector("a#video-title").href.split("v=").length - 1]+"&key=??", true);
     request.onload = function(){dataReady(object, request)};
     request.onerror = function(){};
     request.send();
}

function loadXMLDoc(filename){
     var xhttp = new XMLHttpRequest();
     xhttp.open("GET", filename, false);
     xhttp.send();
     return xhttp.responseXML;
}

function onMouseOver(event){
     this.onmouseover = null;
     var node = document.createElement("b");
     // node.style = "background-color: white; padding: 4px; position: absolute; left: 10px; z-index: 1";
     // node.innerHTML = (Math.floor(parseFloat(loadXMLDoc("https://gdata.youtube.com/feeds/api/videos?q="+this.getAttribute("data-context-item-id")).getElementsByTagName("rating")[0].getAttribute("average")) * 10)*2)+"%";
     node.innerHTML = (Math.floor(parseFloat(loadXMLDoc("https://gdata.youtube.com/feeds/api/videos?q="+this.getElementsByClassName("spf-link")[0].href.split("v=")[this.getElementsByClassName("spf-link")[0].href.split("v=").length - 1]).getElementsByTagName("rating")[0].getAttribute("average")) * 10)*2)+"%";
     this.appendChild(node);
}

function onMouseOver2(event){
     this.onmouseover = null;
     requestAPI(this);
}

function tagEvents(){
     // videos = document.getElementsByClassName("spf-link");
     // videos = document.getElementsByClassName("yt-uix-sessionlink");
     if (document.querySelector("video")) document.querySelector("video").loop = true;
     videos2 = document.querySelectorAll("a#video-title");
     /* for (var i = 0; i < videos.length; i++){
          if (videos[i].getAttribute("has-percent") == null){
               added = added + 1;
               videos[i].setAttribute("has-percent", true);
               try {videos[i].offsetParent.offsetParent.onmouseover = onMouseOver} catch(error) {}
          }
     } */
     for (var i = 0; i < videos2.length; i++){
          if (videos2[i].getAttribute("has-percent") == null){
               added++;
               videos2[i].setAttribute("has-percent", true);
               try {
                    videos2[i].offsetParent.onmouseover = onMouseOver2;
               }
               catch(error) {}
          }
     }
     // alert(added+" added!");
     added = 0;
}

try {GM_addStyle(".comment-renderer-text{color: transparent} .comment-renderer-text a{opacity: 0.1} .comment-renderer-text:focus{color: #000000}")} catch(e) {}
tagEvents();
setInterval(tagEvents, 5000);
