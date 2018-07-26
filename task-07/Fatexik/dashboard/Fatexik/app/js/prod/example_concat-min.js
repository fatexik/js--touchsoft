var dataBaseClass=function(){var e,t={url:"https://touchsoft-fatexik.firebaseio.com/"};function n(e,n,a,o,i){var c=new XMLHttpRequest;return c.open(e,t.url.concat("users").concat(n).concat(a).concat(o).concat(".json")),c.setRequestHeader("Content-Type","application/json"),c.send(JSON.stringify(i)),c}function a(){}return a.prototype.sendMsg=function(e,t){return new Promise(function(a){n("POST",e,"/messages","",t).onreadystatechange=function(){200===this.status&&4===this.readyState&&a(!0)}})},a.prototype.sendCommand=function(e,t){return new Promise(function(a){n("POST","/".concat(e),"/commands","",t).onreadystatechange=function(){200===this.status&&4===this.readyState&&a(!0)}})},a.prototype.getMessages=function(e){var n=new XMLHttpRequest;return n.open("GET",t.url.concat("users").concat(e).concat("/messages.json")),n.setRequestHeader("Accept","text/event-stream"),n.send(),n},a.prototype.getCommands=function(e){var n=new XMLHttpRequest;return n.open("GET",t.url.concat("users").concat(e).concat("/commands.json")),n.setRequestHeader("Accept","text/event-stream"),n.send(),n},a.prototype.setMessageRead=function(e){return new Promise(function(t){n("PUT","/".concat(e),"/unreadMessage","",!1).onreadystatechange=function(){200===this.status&&4===this.readyState&&t(!0)}})},a.prototype.getUserChatConfig=function(e){var t={};return new Promise(function(a){n("GET","/".concat(e),"/chatConfig","").onreadystatechange=function(){200===this.status&&4===this.readyState&&(t=JSON.parse(this.response),a(t))}})},a.prototype.getListUsers=function(){var e=new XMLHttpRequest;return e.open("GET","https://touchsoft-fatexik.firebaseio.com/users.json",!0),e.setRequestHeader("Accept","text/event-stream"),e.send(),e},{usersList:(e=new a).getListUsers,sendMsg:e.sendMsg,getUserMessages:e.getMessages,getUserConfig:e.getUserChatConfig,setMessageRead:e.setMessageRead,sendCmd:e.sendCommand,getCommands:e.getCommands}}(),dashboardUpdateList=function(e){var t,n,a,o,i,c,s,d,r,l,u=6e4,m=200;function v(){}function g(){var e=document.getElementById("workPlace"),t=document.getElementById("adminChatContent"),n=document.createElement("div");n.className="workContentImg",n.id="workContentImg",e.replaceChild(n,t),clearInterval(o),clearInterval(l)}function h(){var e=document.getElementById("workPlace"),t=document.createElement("div"),n=document.getElementById("workContentImg");t.className="adminChatContent",t.id="adminChatContent",t.innerHTML='       <span>            <div class="adminChat">\n                <div class="close" id="close">X</div>\n                <div class ="chatName">CHAT</div>\n                <textarea class="chatHistory" id="chatHistory"></textarea>\n                <textarea class="messagePlace" id="messagePlace"></textarea>\n                <input type="button" class="sendMessageButton" id="sendMessageButton" value="Send Message">\n            </div>\n            <div class="adminConfigPlace">                <select id="selectCommand">\n                    <option>Get Ip</option>\n                    <option>Set Color</option>\n                </select>                <input id = "chatColor">'+"                <input type='button' value='send command' id='sendCommand'>                <p class='titleLog'>Log</p>                <textarea id = 'commandLog' disabled></textarea>            </div>       </span>",e.replaceChild(t,n),document.getElementById("close").addEventListener("click",g)}function p(e){var t=e;return t<10&&(t="0".concat(e)),t}function f(){var t,n=document.getElementById("messagePlace"),o=new Date,i=p(o.getMinutes()),c=p(o.getHours());e.setMessageRead(a),e.getUserConfig(a).then(function(o){t=o.showTime?"\n".concat([c,i].join(":").concat(" ".concat("ADMIN").concat(" ").concat(n.value))):"\n".concat(" ".concat("ADMIN").concat(" ").concat(n.value)),n.value="",e.sendMsg("/".concat(a),t)})}function y(e,t){return e.name>t.name?1:e.name<t.name?-1:0}function E(e,t){return e.online?-1:t.online?1:0}function C(){var e,t=document.getElementsByClassName("clientBlock"),n=document.getElementById("clientSearch"),a=n.value.length;for(e=0;e<t.length;e++)n.value!==t[e].textContent.substring(0,a)?t[e].style.display="none":t[e].style.display="block"}function w(){var e,t=document.getElementsByClassName("clientBlock"),n=document.getElementById("clientSort").value,a=t.length;for("online"===n?d.sort(E):d.sort(y),e=0;e<a;e++)t[0].remove();Object.keys(d).forEach(function(e){var t,n,a;t=d[e],n=document.getElementById("usersList"),(a=document.createElement("div")).className="clientBlock",a.id=t.id,a.innerText=t.name,t.online&&(a.style.backgroundColor="green"),t.unreadMessage&&(a.innerText+="✉"),n.appendChild(a),a.addEventListener("click",B)}),C()}function b(t){var n,a,o=document.getElementById("commandLog");r&&r.abort(),o.value="",(r=e.getCommands("/".concat(t))).onreadystatechange=function(){this.status===m&&(n=this.responseText.replace(a,""),a=this.responseText,function(e,t){var n,a;e&&(n=e.data)&&("message"in n?(a=n.message+" status "+n.status+"\n",t.value=t.value.concat(a)):(a=Object.keys(e.data).map(function(e){return n[e].message+" status "+n[e].status+"\n"}),t.value=a.join("")))}(JSON.parse(n.match(/\{.+\}/)),o))}}function I(t){var n,a,o,i,s=!0,d=document.getElementById("chatHistory");c&&c.abort(),(c=e.getUserMessages("/".concat(t))).onreadystatechange=function(){this.status===m&&(n=this.responseText.replace(i,""),i=this.responseText,(o=JSON.parse(n.match(/\{.+\}/)))&&o.data&&(a=Object.keys(o.data).map(function(e){return o.data[e]}),s?(d.value=a.join(""),s=!1):d.value=d.value.concat(a.join(""))))}}function L(){var t=document.getElementById("selectCommand"),n=document.getElementById("chatColor"),o={};"Get Ip"===t.value?o.message="$$".concat(t.value).concat("$$"):o.message="$$".concat(t.value).concat("$$?").concat(n.value).concat("?"),o.status="sent",e.sendCmd(a,o),n.value=""}function B(){var t=arguments[0],i=!0;a=t.target.id,e.setMessageRead(a),document.getElementById("adminChatContent")||(h(),i=!1),function(e,t){var a=document.getElementById("chatHistory"),i=document.getElementById("clientSearch"),c=document.getElementById("sendMessageButton"),s=document.getElementById("sendCommand");t&&(a.value=""),clearInterval(o),clearInterval(l),I(e),b(e),o=setInterval(function(){I(e)},u),l=setInterval(function(){b(e)},u),t&&c.removeEventListener("click",n),n=f,c.addEventListener("click",n),i.addEventListener("change",w),s.addEventListener("click",L)}(a,i)}function k(){var t,n,a,o,i=(new Date).getTime();s&&s.abort(),(s=e.usersList()).onreadystatechange=function(){var e,c,s;200===this.status&&(t=this.responseText.replace(n,""),n=this.responseText,(e=JSON.parse(t.match(/\{.+\}/)))&&((c=e.path.split("/")).includes("messages")||c.includes("commands")||(s=e.data,c.some(function(e){return e})?function(e,t,n){var a=t,o=!0,i=e.filter(function(e){return e}),c=0;do{i[c]in a?a=a[i[c]]:(Object.defineProperty(a,i[c],{value:n,writable:!0,enumerable:!0,configurable:!0}),o=!1),c++}while(c<i.length-1&&o);o&&Object.defineProperty(a,i[i.length-1],{value:n,writable:!0,enumerable:!0,configurable:!0})}(c,a,s):a=s,o=Object.keys(a).map(function(e){return{name:"You"!==a[e].chatConfig.userName&&""!==a[e].chatConfig.userName?a[e].chatConfig.userName:"no name",id:e,online:i-a[e].activityTime<12e4,unreadMessage:a[e].unreadMessage}}),d=o,w())))}}return v.prototype.createList=function(){var e=document.getElementById("clientSearch"),t=document.getElementById("clientSort");e.addEventListener("change",C),t.addEventListener("change",w),k(),i=setInterval(k,u)},v.prototype.closeAllConnection=function(){clearInterval(i),clearInterval(o),clearInterval(l),s&&s.abort(),c&&c.abort(),r&&r.abort()},v.prototype.createDashboard=function(){var e=document.createElement("div");return e.id="createdElem",e.innerHTML='<div class="rootChatManager"><span><div class="filterUser"><input type="search" id="clientSearch"><select name="sort" class="clientSort" id="clientSort"><option disabled="disabled">Sort By</option><option selected="selected" value="online">Online</option><option value="userName">Имя</option></select><div class="usersList" id="usersList"></div></div><div class="workPlace" id="workPlace"><div class="workContentImg" id="workContentImg"></div></div></span></div>',e},{updateUserList:(t=new v).createList,closeConnection:t.closeAllConnection,createDashboard:t.createDashboard}}(dataBaseClass),chatConfig=function(){var e={chatTitle:"Chat",botName:"Bot",chatUrl:"https://touchsoft-fatexik.firebaseio.com/",chatClass:"../CSS/styles.css",chatPosition:!1,allowMinimize:!1,drag:!1,requireName:!1,showTime:!1,network:"XHR",updates:"longPooling"};function t(){return document.getElementById("generate_code").innerText='<script type="text/javascript" src="Chat.js"><\/script>\n<script type="text/javascript">setConfig({\n    title: "'+e.chatTitle+'",\n    name: "'+e.botName+'",\n    url: "'+e.chatUrl+'",\n    CSS: "'+e.chatClass+'",\n    positionLeft:'+e.chatPosition+",\n    allowMinimize:"+e.allowMinimize+",\n    drag: "+e.drag+",\n    requireName: "+e.requireName+",\n    showTime: "+e.showTime+',\n    network: "'+e.network+'",\n    userName: "",\n    collapsed: true,\n    updates:"'+e.updates+'"\n}<\/script>',this}return{setFunctionalConfig:function(){var n=document.getElementById("chatTitle"),a=document.getElementById("botName"),o=document.getElementById("chatUrl"),i=document.getElementById("chatClass"),c=document.getElementById("chatPositionSelect"),s=document.getElementById("allowMinimize"),d=document.getElementById("allowDrag"),r=document.getElementById("requireName"),l=document.getElementById("showTime"),u=document.getElementById("networkRadioXHR"),m=document.getElementById("networkRadioFetch"),v=document.getElementById("refetch"),g=document.getElementById("longPooling");return u.addEventListener("change",function(){e.network=u.value,t()}),m.addEventListener("change",function(){e.network=m.value,t()}),n.addEventListener("change",function(){e.chatTitle=n.value,t()}),a.addEventListener("change",function(){e.botName=a.value,t()}),o.addEventListener("change",function(){e.chatUrl=o.value,t()}),i.addEventListener("change",function(){e.chatClass=i.value,t()}),c.addEventListener("change",function(){var n=c.value;e.chatPosition="Left"===n,t()}),s.addEventListener("change",function(){e.allowMinimize=s.checked,t()}),d.addEventListener("change",function(){e.drag=d.checked,t()}),r.addEventListener("change",function(){e.requireName=r.checked,t()}),l.addEventListener("change",function(){e.showTime=l.checked,t()}),g.addEventListener("change",function(){e.updates=g.value,e.network="XHR",u.click()}),v.addEventListener("change",function(){e.updates=v.value,t()}),this},updateConfig:t,createConfig:function(){var e=document.createElement("div");return e.id="createdElem",e.innerHTML='<div><div><div>Chat Title</div><input type="text" id="chatTitle"></div><div><div>Bot Name</div><input type="text" id="botName"></div><div><div>Chat URL</div><input type="text" id="chatUrl" value="https://touchsoftchatproject.firebaseio.com"></div><div><div>CSS class</div><input type="text" id="chatClass"></div><div><div>Position</div><select id="chatPositionSelect"><option>Right</option><option>Left</option></select></div><div><div>Allow to minimize</div><div><input type="checkbox" id="allowMinimize"></div><div>Allow drag</div><div><input type="checkbox" id="allowDrag"></div><div>Require name</div><div><input type="checkbox" id="requireName"></div><div>Show data/time</div><div><input type="checkbox" id="showTime"></div></div><form action=""><div>XHR</div><input type="radio" name="contact" value="XHR" id="networkRadioXHR"><div>fetch</div><input type="radio" name="contact" value="fetch" id="networkRadioFetch"></form><form action=""><div>Long Pooling</div><input type="radio" name="contact" value="longPooling" id="longPooling"><div>refetch</div><input type="radio" name="contact" value="refetch" id="refetch"></form></div><container><div id="generate_code"></div></container>',e}}}(),aboutMe=function(){return{createAbout:function(){var e=document.createElement("div");return e.id="createdElem",e.innerHTML="<div><h1>Fatexik</h1><h2>Contact us anytime you need: support@example.com</h2></div>",e}}}();function handlerUrl(e,t){var n,a,o=document.getElementById("workSpace");e.includes("dashboard")&&(a=document.getElementById("createdElem"),n=dashboardUpdateList.createDashboard(),o.replaceChild(n,a),dashboardUpdateList.updateUserList()),e.includes("configFile")&&(a=document.getElementById("createdElem"),n=chatConfig.createConfig(),o.replaceChild(n,a),chatConfig.setFunctionalConfig().updateConfig(),t.includes("dashboard")&&dashboardUpdateList.closeConnection()),e.includes("aboutMe")&&(a=document.getElementById("createdElem"),n=aboutMe.createAbout(),o.replaceChild(n,a),t.includes("dashboard")&&dashboardUpdateList.closeConnection())}window.addEventListener("hashchange",function(e){handlerUrl(e.newURL,e.oldURL)}),window.onload=function(){handlerUrl(window.location.href),document.getElementById("dashboard").addEventListener("click",function(e){var t=e.target.getAttribute("href");e.preventDefault(),window.location.hash=t}),document.getElementById("config").addEventListener("click",function(e){var t=e.target.getAttribute("href");e.preventDefault(),window.location.hash=t}),document.getElementById("aboutMe").addEventListener("click",function(e){var t=e.target.getAttribute("href");e.preventDefault(),window.location.hash=t})};