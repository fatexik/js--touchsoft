/* exported config */
/* global chatFactory */

var config = {
  chatTitle: "Чат",
  chatState: "",
  userName: "",
  chatURL: "https://besomhead-chat.firebaseio.com/",
  cssClass: "chat-container",
  position: "right",
  allowMinimize: "true",
  allowDrag: "false",
  requireName: "false",
  showDateTime: "true",
  requests: "fetch",
  messagesLength: "0"
};

//= util/DOM_manager.js
//= util/message_factory.js
//= util/storage_manager.js
//= factories/chat_factory.js

window.addEventListener("load", function initPage() {
  chatFactory.appendStylesheet();
  chatFactory.setUniqueUserID();
  chatFactory.createChatMarkup();
});

chatFactory.setConfig();
