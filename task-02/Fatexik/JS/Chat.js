/* exported sendMessage showFeedback hideFeedback */
/* global Promise */
var configObj = {
    title: "Chat",
    name: "Bot",
    url: "https://touchsoft-fatexik.firebaseio.com/",
    CSS: "../CSS/styles.css",
    positionLeft: false,
    allowMinimize: true,
    drag: true,
    requireName: true,
    showTime: true,
    network: "XHR",
    userName: "",
    collapsed: false
};

var transferObject;
var userId = localStorage.getItem("userId");

function FetchObject() {
    this.getMessages = function getMessage() {
        var fetchPromise = new Promise(function sendRequest(resolve) {
            fetch(configObj.url.concat("users/".concat(userId.concat("/messages.json"))), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(function responseReady(response) {
                    response.json()
                        .then(function resolveResponse(responseObj) {
                            var arrayMessages = Object.keys(responseObj).map(function createNewArray(value) {
                                return responseObj[value]
                            });
                            resolve(arrayMessages);
                        })
                })
        });
        return fetchPromise;
    };
    this.sendMessage = function sendMsg(message) {
        var fetchPromise = new Promise(function sendRequest(resolve) {
            fetch(configObj.url.concat("users/").concat(userId).concat("/messages.json"), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            })
                .then(function responseReady(response) {
                    response.json()
                        .then(function resolveStatus() {
                            resolve(true);
                        })
                })
        });
        return fetchPromise;
    };
    this.createNewUser = function create() {
        var fetchPromise = new Promise(function createPromise(resolve) {
            fetch(configObj.url.concat("users.json"), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        chatConfig: configObj,
                        messages: ""
                    })
            })
                .then(function responseReady(response) {
                    response.json()
                        .then(function resolveResponse(responseObj) {
                            localStorage.setItem("userId", responseObj.name);
                            resolve(responseObj);
                        })
                })
        });
        return fetchPromise;
    };
    this.getUserConfig = function getUserConfig() {
        var fetchPromise = new Promise(function sendRequest(resolve) {
            fetch(configObj.url.concat("users/").concat(userId).concat("/chatConfig.json"), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(function responseReady(response) {
                    response.json()
                        .then(function resolveResponseObj(responseObj) {
                            configObj = responseObj;
                            resolve(responseObj);
                        })
                })
        });
        return fetchPromise;
    };
    this.setConfig = function setConfig(nameConfig, valueConfig) {
        var config = {};
        var fetchPromise;
        config[nameConfig] = valueConfig;
        fetchPromise = new Promise(function sendRequest(resolve) {
            fetch(configObj.url.concat("users/").concat(userId).concat("/chatConfig/" + nameConfig + ".json"), {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(valueConfig)
            })
                .then(function responseReady(response) {
                    response.json()
                        .then(function resolveStatus() {
                            resolve(true);
                        })
                })
        });
        return fetchPromise;
    };
    this.getConfig = function getConfig(nameConfig) {
        var fetchPromise = new Promise(function sendRequest(resolve) {
            fetch(configObj.url.concat("users/").concat(userId).concat("/chatConfig/" + nameConfig + ".json"), {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(function responseReady(response) {
                    response.json()
                        .then(function resolveResponse(responseObj) {
                            resolve(responseObj);
                        })
                })
        });
        return fetchPromise;
    }
}


function XHRObject() {
    var arrayMessages;
    var messages;
    userId = localStorage.getItem("userId");
    this.getMessages = function getMessages() {
        var XhrPromise = new Promise(function sendRequest(resolve) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', configObj.url.concat("users/").concat(userId).concat("/messages.json"));
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
            xhr.onreadystatechange = function responseReady() {
                if (this.status === 200 && this.readyState === 4) {
                    arrayMessages = JSON.parse(this.response);
                    messages = "";
                    messages = Object.keys(arrayMessages).map(function createNewArray(value) {
                        return arrayMessages[value]
                    });
                    resolve(messages);
                }
            }
        });
        return XhrPromise;
    };
    this.sendMessage = function sendMsg(message) {
        var XhrPromise = new Promise(function sendRequest(resolve) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', configObj.url.concat("users/").concat(userId).concat("/messages.json"));
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(message));
            xhr.onreadystatechange = function responseReady() {
                if (this.status === 200 && this.readyState === 4) {
                    resolve(true);
                }
            }
        });
        return XhrPromise;
    };
    this.createNewUser = function createNewUser() {
        var XhrPromise = new Promise(function sendRequest(resolve) {
            var xhr = new XMLHttpRequest();
            var response;
            xhr.open('POST', configObj.url.concat("users.json"));
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(
                {
                    chatConfig: configObj,
                    messages: ""
                })
            );
            xhr.onreadystatechange = function responseReady() {
                if (this.status === 200 && this.readyState === 4) {
                    response = JSON.parse(this.response);
                    localStorage.setItem("userId", response.name);
                    resolve(response);
                }
            }
        });
        return XhrPromise;
    };
    this.getUserConfig = function getUserConfig() {
        var XhrPromise = new Promise(function sendRequest(resolve) {
            var xhr = new XMLHttpRequest();
            var responseObj;
            xhr.open('GET', configObj.url.concat("users/").concat(userId).concat("/chatConfig.json"));
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
            xhr.onreadystatechange = function responseReady() {
                if (this.status === 200 && this.readyState === 4) {
                    responseObj = JSON.parse(this.response);
                    configObj = responseObj;
                    resolve(responseObj);
                }
            }
        });
        return (XhrPromise);
    };
    this.setConfig = function setConfig(nameConfig, valueConfig) {
        var XhrPromise = new Promise(function sendRequest(resolve) {
            var xhr = new XMLHttpRequest();
            var config = {};
            config[nameConfig] = valueConfig;
            xhr.open('PUT', configObj.url.concat("users/".concat(userId.concat("/chatConfig/" + nameConfig + ".json"))));
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(valueConfig));
            xhr.onreadystatechange = function requestReady() {
                if (this.status === 200 && this.readyState === 4) {
                    resolve(true);
                }
            }
        });
        return XhrPromise;
    };
    this.getConfig = function getConfig(nameConfig) {
        var XhrPromise = new Promise(function getRequest(resolve) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', configObj.url.concat("users/").concat(userId).concat("/chatConfig/" + nameConfig + ".json"));
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
            xhr.onreadystatechange = function responseReady() {
                if (this.status === 200 && this.readyState === 4) {
                    resolve(JSON.parse(this.response));
                }
            }
        });
        return XhrPromise;
    }
}


function generateCollapsedFeedback() {
    var collapsedFeedback = document.createElement("div");
    collapsedFeedback.id = "elemShowFeedback";
    collapsedFeedback.className = "collapsedFeedback";
    collapsedFeedback.innerHTML =
        "<div class='drag_drop_collapsed' id='dragdrop'></div> <p class='chatName' id='chatName'></p><form><input type='text' id='messageArea'><input type='button' id='sendMessageButton' value='Send Message'><input type='button' value='<<' id='maximize'>" +
        "<span class='nameNote'><p>User Name</p></span><input type='text' id='userName'></form>";
    return collapsedFeedback;
}

function checkTime(time) {
    var currentTime = time;
    if (currentTime < 10) {
        currentTime = "0".concat(time);
    }
    return currentTime;
}

function generateFeedback() {
    var container = document.createElement("container");
    container.id = "feedBack";
    container.className = "feedBack";
    container.innerHTML =
        "<div class='drag_drop' id='dragdrop'></div><p class='chatName' id='chatName'></p><form><input type='button' value='>>' class='collapse' id='collapse'><p><textarea id='messageHistory' rows=\"8\" cols=\"30\" name=\"text\" disabled>" +
        '</textarea></p><textarea id=\'userName\' rows="1" cols="10" name="text"></textarea><span class=\'nameNote\'>User Name</span>' +
        '</textarea></p><textarea id=\'messageArea\' rows="3" cols="30" name="text"></textarea>' +
        "<br></ber><input type='button' id='sendMessageButton' value='Send Message' disabled></form>";
    return container;
}


function getReplyForMessage(message) {
    return function replyToMessage() {
        var messageHistory;
        var date = new Date();
        var minute = checkTime(date.getMinutes());
        var hour = checkTime(date.getHours());
        var botName = " ".concat(configObj.name);
        var newMessage;
        transferObject.getMessages().then(function updateMessageArea(value) {
            messageHistory = value;
            if (configObj.showTime) {
                newMessage = "\n".concat([hour, minute].join(":").concat(botName.concat(" Response to '".concat(message.concat("'")))));
                messageHistory.push(newMessage)
            }
            else {
                newMessage = "\n".concat(botName.concat(" Response to '".concat(message.concat("'"))));
                messageHistory.push(newMessage)
            }
            if (document.getElementById("messageHistory")) {
                document.getElementById("messageHistory").value = messageHistory.join(" ");
            }
            transferObject.sendMessage(newMessage);
        })
    };
}

function sendMessage() {
    var messageArea = document.getElementById("messageArea");
    var messageHistory;
    var message;
    var timeOut = 15000;
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    var promise = new Promise(function getMessages(resolve) {
        resolve(transferObject.getMessages());
    });
    transferObject.setConfig("userName", configObj.userName);
    promise.then(function updateMessageHistory(value) {
        messageHistory = value;
        if (configObj.showTime) {
            message = "\n".concat([hour, minute].join(":").concat(" ".concat(configObj.userName).concat(" ").concat(messageArea.value)));
            messageHistory.push(message);
        }
        else {
            message = "\n".concat(" ".concat(configObj.userName).concat(" ").concat(messageArea.value));
            messageHistory.push(message);
        }
        if (document.getElementById("messageHistory")) {
            document.getElementById("messageHistory").value = messageHistory.join(" ");
        }
        transferObject.sendMessage(message);
        setTimeout(getReplyForMessage(messageArea.value), timeOut);
        messageArea.value = "";
    })
}

function DragDrop(elem) {
    var dragDropElem = document.getElementById("dragdrop");

    dragDropElem.onmouseenter = function setNewCursor() {
        dragDropElem.style.cursor = "move";
    };

    function getCoords(element) {
        var box = element.getBoundingClientRect();
        return {
            top: box.top + window.pageYOffset,
            left: box.left + window.pageXOffset
        };
    }

    dragDropElem.onmousedown = function findCoordsCursor(event) {
        var coords = getCoords(elem);
        var shiftX = event.pageX - coords.left;
        var shiftY = event.pageY - coords.top;

        function move(element) {
            elem.style.left = element.clientX - shiftX + 'px';
            elem.style.top = element.clientY - shiftY + 'px';
        }

        document.onmousemove = function mouseMove(e) {
            move(e);
        };
        elem.onmouseup = function dragEnd() {
            document.onmousemove = null;
            elem.onmouseup = null;
            dragDropElem.onmouseup = null;
        };
    }

}

function requireName() {
    var buttonMessage = document.getElementById("sendMessageButton");
    var userNameArea = document.getElementById("userName");
    buttonMessage.disabled = false;
    if (configObj.requireName) {
        if (!userNameArea.value) {
            buttonMessage.disabled = true;
        }
        userNameArea.onkeyup = function enterName() {
            if (userNameArea.value) {
                buttonMessage.disabled = false;
                configObj.userName = userNameArea.value;
            } else {
                buttonMessage.disabled = true;
                configObj.userName = null;
            }
        }
    } else {
        userNameArea.value = configObj.userName;
        userNameArea.onkeyup = function enterName() {
            configObj.userName = userNameArea.value || "You";
        }
    }
}

function notMinimize() {
    var btnCollapse = document.getElementById("collapse");
    btnCollapse.disabled = true;
}

function setPositionLeft(elem) {
    elem.style.left = 5 + "vw";
}

function showFeedback() {
    var bodyElement = document.body;
    var elem;
    var feedback = generateFeedback();
    var changeElem = document.getElementById("elemShowFeedback");
    var userName;
    bodyElement.replaceChild(feedback, changeElem);
    if (configObj.drag) {
        DragDrop(feedback);
    }
    if (!configObj.allowMinimize) {
        notMinimize();
    }
    if (configObj.positionLeft) {
        setPositionLeft(feedback);
    }
    userName = document.getElementById("userName");
    userName.value = configObj.userName;
    requireName();
    document.getElementById('chatName').innerText = configObj.title;
    elem = document.getElementById("messageHistory");
    transferObject.setConfig("collapsed", false);
    transferObject.getMessages().then(
        function createMessageHistory(value) {
            elem.value = value.join(" ");
        }
    );
    document.getElementById("collapse").addEventListener("click", function hide() {
        var collapsedFeedback = generateCollapsedFeedback();
        changeElem = document.getElementById("feedBack");
        bodyElement.replaceChild(collapsedFeedback, changeElem);
        userName = document.getElementById("userName");
        userName.value = configObj.userName;
        document.getElementById('chatName').innerText = configObj.title;
        if (configObj.drag) {
            DragDrop(collapsedFeedback);
        }
        if (configObj.positionLeft) {
            setPositionLeft(collapsedFeedback);
        }
        requireName();
        transferObject.setConfig("collapsed", true);
        document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
        document.getElementById("maximize").addEventListener("click", showFeedback)
    });
    document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
}

function hideFeedback() {
    var bodyElement = document.body;
    var changeElem = document.getElementById("feedBack");
    var collapsedFeedback = generateCollapsedFeedback();
    var userName;
    bodyElement.replaceChild(collapsedFeedback, changeElem);
    userName = document.getElementById("userName");
    userName.value = configObj.userName;
    document.getElementById('chatName').innerText = configObj.title;
    if (configObj.drag) {
        DragDrop(collapsedFeedback);
    }
    if (configObj.positionLeft) {
        setPositionLeft(collapsedFeedback);
    }
    requireName();
    transferObject.setConfig("collapsed", true);
    document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
    document.getElementById("maximize").addEventListener("click", function show() {
        var elem;
        var feedback = generateFeedback();
        changeElem = document.getElementById("elemShowFeedback");
        bodyElement.replaceChild(feedback, changeElem);
        userName = document.getElementById("userName");
        userName.value = configObj.userName;
        document.getElementById('chatName').innerText = configObj.title;
        if (configObj.drag) {
            DragDrop(feedback);
        }
        if (!configObj.allowMinimize) {
            notMinimize();
        }
        if (configObj.positionLeft) {
            setPositionLeft(feedback);
        }
        requireName();
        elem = document.getElementById("messageHistory");
        transferObject.setConfig("collapsed", false);
        transferObject.getMessages().then(
            function createMessageHistory(value) {
                elem.value = value.join(" ");
            }
        );
        document.getElementById("collapse").addEventListener("click", hideFeedback);
        document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
    });
}


function createFeedback() {
    var bodyElement = document.body;
    var elem;
    var feedback = generateFeedback();
    var userName;
    bodyElement.appendChild(feedback);
    userName = document.getElementById("userName");
    if (configObj.drag) {
        DragDrop(feedback);
    }
    if (!configObj.allowMinimize) {
        notMinimize();
    }
    if (configObj.positionLeft) {
        setPositionLeft(feedback);
    }
    userName.value = configObj.userName;
    requireName();
    document.getElementById('chatName').innerText = configObj.title;
    elem = document.getElementById("messageHistory");
    transferObject.getMessages().then(
        function createMessageHistory(value) {
            elem.value = value.join(" ");
            document.getElementById("collapse").addEventListener("click", hideFeedback);
            document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
        }
    )
}

function setStyle() {
    var titleElem = document.head;
    var styleElem = document.createElement("link");
    styleElem.setAttribute("rel", "stylesheet");
    styleElem.setAttribute("href", configObj.CSS);
    styleElem.setAttribute("type", "text/css");
    styleElem.setAttribute("media", "screen");
    titleElem.appendChild(styleElem);
}

setStyle();


function createCollapsedFeedback() {
    var bodyElement = document.body;
    var collapsedFeedback = generateCollapsedFeedback();
    var userName;
    bodyElement.appendChild(collapsedFeedback);
    userName = document.getElementById("userName");
    document.getElementById('chatName').innerText = configObj.title;
    if (configObj.drag) {
        DragDrop(collapsedFeedback);
    }
    if (configObj.positionLeft) {
        setPositionLeft(collapsedFeedback);
    }
    userName.value = configObj.userName;
    requireName();
    document.getElementById("sendMessageButton").addEventListener("click", sendMessage);
    document.getElementById("maximize").addEventListener("click", showFeedback);
}


function checkWindow() {
    if (configObj.network === "XHR") {
        transferObject = new XHRObject();
    }
    else {
        transferObject = new FetchObject();
    }
    if (!localStorage.getItem("userId")) {
        transferObject.createNewUser().then(function sendNewUser() {
            userId = localStorage.getItem("userId");
            transferObject.getConfig("collapsed").then(function getCollapsedConfig(value) {
                if (value === false) {
                    createFeedback();
                } else {
                    createCollapsedFeedback();
                }
            })
        });
    }
    else {
        transferObject.getUserConfig().then(function getConfigs(value) {
            configObj = value;
            transferObject.getConfig("collapsed").then(function getCollapsedConfig(collapsed) {
                if (collapsed === false) {
                    createFeedback();
                } else {
                    createCollapsedFeedback();
                }
            })
        })
    }

}

// function setConfigObject() {
//     ...
// }

window.onload = function check() {
    checkWindow();
};











