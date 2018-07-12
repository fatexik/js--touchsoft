/* exported dashboardFactory */
/* global messageFactory */
/* global DM */
/* global storageManager HTTP_GET HTTP_POST HTTP_PUT */
/* global config */

var dashboardFactory = (function DashboardFactory(config) {
  var DEFAULT_USERNAME = "Вы";
  var USER_ONLINE_TIMEOUT = 120000;
  var USERS_LIST_CONTAINER_ID = "operators-dashboard-users-list-container";
  var SELECTED_USER_CONTAINER_ID =
    "operators-dashboard-selected-user-container";
  var SELECTED_USER_INNER_ID = "operators-dashboard-selected-user-inner";
  var USER_CHAT_MESSAGES_ID = "operators-dashboard-user-chat-messages";
  var USER_CHAT_INPUT_ID = "operators-dashboard-user-chat-input";
  var SINGLE_USER_CLASS_NAME = "dashboard-single-user-container";
  var UNREAD_CLASS_NAME = "dashboard-single-user-container-unread";
  var ONLINE_CLASS_NAME = "dashboard-user-status-online";
  var OFFLINE_CLASS_NAME = "dashboard-user-status-offline";
  var LESS = -1;
  var MORE = 1;
  var self = this;

  function closeSelectedUserContainer() {
    DM.removeDOMElement(SELECTED_USER_CONTAINER_ID, SELECTED_USER_INNER_ID);
  }

  function getUserID(userContainer) {
    return DM.getDOMChildrenByTag(userContainer, "label").find(function findID(
      field
    ) {
      return field.hidden;
    }).innerHTML;
  }

  function appendSingleMessage(message) {
    var messages = DM.getDOMElement(USER_CHAT_MESSAGES_ID);
    var sender = DM.createDOMElement("div");
    var body = DM.createDOMElement("div");

    sender.innerHTML = message.sender;
    body.innerHTML = message.body;

    DM.appendDOMElement(messages, sender);
    DM.appendDOMElement(messages, body);
  }

  function sendMessage(userContainer) {
    var inputValue = DM.getDOMElement(USER_CHAT_INPUT_ID).value;
    var operatorMessage;

    if (inputValue === "") {
      return;
    }
    operatorMessage = messageFactory.getMessage(
      new Date(),
      config.operatorName + ":",
      inputValue
    );
    appendSingleMessage(operatorMessage);
    DM.getDOMElement(USER_CHAT_INPUT_ID).value = "";
    storageManager.sendRequestToStorage(
      getUserID(userContainer) + "/messages",
      HTTP_POST,
      operatorMessage
    );
  }

  function createUserChatContainer(userContainer) {
    var userChatContainer = DM.createDOMElement("fieldset");
    var userChatLegend = DM.createDOMElement("legend");
    var userChatMessagesList = DM.createDOMElement("div");
    var userChatMessageInput = DM.createDOMElement("textarea");
    var userChatSendButton = DM.createDOMElement("button");

    DM.addCSSClass(userChatContainer, "dashboard-selected-user-chat-container");
    userChatLegend.innerHTML = "Чат";
    userChatMessagesList.id = USER_CHAT_MESSAGES_ID;
    DM.addCSSClass(
      userChatMessagesList,
      "dashboard-selected-user-chat-messages"
    );
    userChatMessageInput.id = USER_CHAT_INPUT_ID;
    DM.addCSSClass(userChatMessageInput, "dashboard-selected-user-chat-input");
    userChatMessageInput.placeholder = "Новое сообщение пользователю";
    DM.addCSSClass(userChatSendButton, "dashboard-selected-user-chat-button");
    userChatSendButton.innerHTML = "Send";
    DM.addListener(
      userChatSendButton,
      "click",
      sendMessage.bind(null, userContainer)
    );

    DM.appendDOMElement(userChatContainer, userChatLegend);
    DM.appendDOMElement(userChatContainer, userChatMessagesList);
    DM.appendDOMElement(userChatContainer, userChatMessageInput);
    DM.appendDOMElement(userChatContainer, userChatSendButton);

    return userChatContainer;
  }

  function createUserControllerContainer() {
    var userControllerContainer = DM.createDOMElement("fieldset");
    var userControllerLegend = DM.createDOMElement("legend");

    DM.addCSSClass(
      userControllerContainer,
      "dashboard-selected-user-controller"
    );
    userControllerLegend.innerHTML = "Control";
    DM.appendDOMElement(userControllerContainer, userControllerLegend);

    return userControllerContainer;
  }

  function appendSelectedUserContainer(userContainer) {
    var selectedUserContainer = DM.createDOMElement("fieldset");
    var userContainerLegend = DM.createDOMElement("legend");
    var userContainerCloseButton = DM.createDOMElement("button");
    var userIDField = DM.createDOMElement("label");
    var userContainersInner = DM.createDOMElement("div");

    selectedUserContainer.id = SELECTED_USER_INNER_ID;
    DM.addCSSClass(
      selectedUserContainer,
      "dashboard-selected-user-container-inner"
    );
    userContainerLegend.innerHTML =
      "Active: " +
      DM.getDOMChildrenByTag(userContainer, "label").shift().innerHTML;
    userContainerCloseButton.innerHTML = "x";
    DM.addCSSClass(
      userContainerCloseButton,
      "dashboard-selected-user-container-button"
    );
    DM.addListener(
      userContainerCloseButton,
      "click",
      closeSelectedUserContainer
    );
    DM.addCSSClass(
      userContainersInner,
      "dashboard-selected-user-controls-container"
    );
    userIDField.innerHTML = getUserID(userContainer);
    userIDField.hidden = true;

    DM.appendDOMElement(
      userContainersInner,
      createUserChatContainer(userContainer)
    );
    DM.appendDOMElement(userContainersInner, createUserControllerContainer());
    DM.appendDOMElement(selectedUserContainer, userContainerLegend);
    DM.appendDOMElement(selectedUserContainer, userContainerCloseButton);
    DM.appendDOMElement(selectedUserContainer, userContainersInner);
    DM.appendDOMElement(selectedUserContainer, userIDField);
    DM.appendDOMElement(SELECTED_USER_CONTAINER_ID, selectedUserContainer);
  }

  function appendSelectedUserMessages(userContainer) {
    storageManager
      .sendRequestToStorage(
        getUserID(userContainer) + "/messages",
        HTTP_GET,
        ""
      )
      .then(function appendMessages(data) {
        if (!data) {
          return;
        }
        Object.keys(data).forEach(function appendMessage(key) {
          appendSingleMessage(data[key]);
        });
      });
  }

  function sendReadMarkToStorage(userContainer) {
    storageManager.sendRequestToStorage(
      getUserID(userContainer) + "/read",
      HTTP_PUT,
      true
    );
  }

  function selectUser(event) {
    if (!event.target.classList.contains(SINGLE_USER_CLASS_NAME)) {
      return;
    }
    if (DM.getDOMElement(SELECTED_USER_INNER_ID)) {
      closeSelectedUserContainer();
    }
    DM.removeCSSClass(event.target, UNREAD_CLASS_NAME);

    appendSelectedUserContainer(event.target);
    appendSelectedUserMessages(event.target);
    sendReadMarkToStorage(event.target);
  }

  function isUserOnline(user) {
    var lastMessage;
    var lastMessageTime;
    var lastMessageDate;
    var messagesKeys;

    if (!user.messages) {
      return false;
    }
    messagesKeys = Object.keys(user.messages);
    lastMessage = user.messages[messagesKeys.pop()];
    while (
      lastMessage &&
      lastMessage.sender === config.operatorName.concat(":")
    ) {
      lastMessage = user.messages[messagesKeys.pop()];
    }
    if (!lastMessage) {
      return false;
    }
    lastMessageTime = lastMessage.time.split(":");
    lastMessageDate = new Date(
      new Date().getFullYear(),
      Number(lastMessage.month),
      Number(lastMessage.day),
      Number(lastMessageTime.shift()),
      Number(lastMessageTime.shift())
    );

    return new Date() - lastMessageDate <= USER_ONLINE_TIMEOUT;
  }

  function setUserStatus(statusContainer, classToRemove, classToAdd) {
    DM.removeCSSClass(statusContainer, classToRemove);
    DM.addCSSClass(statusContainer, classToAdd);
  }

  function appendSingleUser(user, generated) {
    var userElement = DM.createDOMElement("div");
    var userNameElement = DM.createDOMElement("label");
    var generatedField = DM.createDOMElement("label");
    var chatStateElement = DM.createDOMElement("label");
    var userStatusElement = DM.createDOMElement("div");

    DM.addCSSClass(userElement, SINGLE_USER_CLASS_NAME);
    if (!user.read) {
      DM.addCSSClass(userElement, UNREAD_CLASS_NAME);
    }
    userNameElement.innerHTML =
      user.userName === undefined || user.userName === DEFAULT_USERNAME
        ? generated
        : user.userName;
    generatedField.innerHTML = generated;
    generatedField.hidden = true;
    DM.addCSSClass(userStatusElement, "dashboard-user-status");
    if (isUserOnline(user)) {
      setUserStatus(userStatusElement, ONLINE_CLASS_NAME, ONLINE_CLASS_NAME);
    } else {
      setUserStatus(userStatusElement, OFFLINE_CLASS_NAME, OFFLINE_CLASS_NAME);
    }
    chatStateElement.innerHTML = user.chatState;

    DM.appendDOMElement(userElement, userNameElement);
    DM.appendDOMElement(userElement, generatedField);
    DM.appendDOMElement(userElement, userStatusElement);
    DM.appendDOMElement(userElement, chatStateElement);
    DM.addListener(USERS_LIST_CONTAINER_ID, "click", selectUser);
    DM.appendDOMElement(USERS_LIST_CONTAINER_ID, userElement);
  }

  this.loadUsersList = function loadUsersList() {
    storageManager
      .sendRequestToStorage("", HTTP_GET, "")
      .then(function appendUsersToPage(data) {
        Object.keys(data).forEach(function appendUSer(key) {
          appendSingleUser(data[key], key);
        });
      });
  };

  function clearUsers(usersContainers) {
    var containers =
      usersContainers ||
      DM.getDOMChildrenByClass(USERS_LIST_CONTAINER_ID, SINGLE_USER_CLASS_NAME);

    containers.forEach(function clearUsersList(userContainer) {
      DM.removeDOMElement(USERS_LIST_CONTAINER_ID, userContainer);
    });

    return containers;
  }

  function filterUsers(event) {
    var filterValue = event.target.value.toLowerCase();
    var usersContainers = DM.getDOMChildrenByClass(
      USERS_LIST_CONTAINER_ID,
      SINGLE_USER_CLASS_NAME
    );

    if (filterValue === "") {
      clearUsers(usersContainers);
      self.loadUsersList();
      return;
    }
    usersContainers.forEach(function filter(userContainer) {
      if (
        DM.getDOMChildrenByTag(userContainer, "label")
          .shift()
          .innerHTML.toLowerCase()
          .indexOf(filterValue) === -1
      ) {
        DM.removeDOMElement(USERS_LIST_CONTAINER_ID, userContainer);
      }
    });
  }

  function sortUsersByUserName(container1, container2) {
    return DM.getDOMChildrenByTag(container1, "label")
      .shift()
      .innerHTML.toLowerCase() <
      DM.getDOMChildrenByTag(container2, "label")
        .shift()
        .innerHTML.toLowerCase()
      ? LESS
      : MORE;
  }

  function sortUsersByOnlineStatus(container) {
    return DM.getDOMChildrenByTag(container, "div")
      .shift()
      .classList.contains(ONLINE_CLASS_NAME)
      ? LESS
      : MORE;
  }

  function sortUsersByChatState(container) {
    return DM.getDOMChildrenByTag(container, "label").pop().innerHTML ===
      "chat-expanded"
      ? LESS
      : MORE;
  }

  function sortUsersByUnread(container) {
    return container.classList.contains(UNREAD_CLASS_NAME) ? LESS : MORE;
  }

  function sortUsers(event) {
    var selected = DM.getDOMChildrenByTag(event.target, "option").find(
      function getSelected(option) {
        return option.selected;
      }
    );
    var containers = clearUsers();

    function sortByAndAppend(sortFunc) {
      containers.sort(sortFunc);
      containers.forEach(function appendContainers(container) {
        DM.appendDOMElement(USERS_LIST_CONTAINER_ID, container);
      });
    }
    switch (selected.innerHTML) {
      case "User Name":
        sortByAndAppend(sortUsersByUserName);
        break;
      case "Online":
        sortByAndAppend(sortUsersByOnlineStatus);
        break;
      case "Chat state":
        sortByAndAppend(sortUsersByChatState);
        break;
      case "Unread":
        sortByAndAppend(sortUsersByUnread);
        break;
      default:
        self.loadUsersList();
    }
  }

  this.initListeners = function initListeners() {
    DM.addListener(
      "operators-dashboard-users-filter-bar",
      "change",
      filterUsers
    );
    DM.addListener("operators-dashboard-users-sort-bar", "change", sortUsers);
  };

  this.checkUpdates = function checkUpdates() {
    storageManager
      .sendRequestToStorage("", HTTP_GET, "")
      .then(function checkUsers(data) {
        if (!data) {
          return;
        }
        Object.keys(data).forEach(function checkUser(key) {
          var user;
          var userContainer;
          var userStatusElement;
          var appendedMessagesAmount;

          user = data[key];
          userContainer = DM.getDOMChildrenByClass(
            USERS_LIST_CONTAINER_ID,
            SINGLE_USER_CLASS_NAME
          ).find(function findContainer(container) {
            return getUserID(container) === key;
          });
          if (!userContainer) {
            appendSingleUser(user, key);
            return;
          }
          userStatusElement = DM.getDOMChildrenByTag(
            userContainer,
            "div"
          ).shift();
          if (isUserOnline(user)) {
            setUserStatus(
              userStatusElement,
              OFFLINE_CLASS_NAME,
              ONLINE_CLASS_NAME
            );
          } else {
            setUserStatus(
              userStatusElement,
              ONLINE_CLASS_NAME,
              OFFLINE_CLASS_NAME
            );
          }
          DM.getDOMChildrenByTag(userContainer, "label").pop().innerHTML =
            user.chatState;
          if (user.read) {
            return;
          }
          if (!DM.getDOMElement(SELECTED_USER_INNER_ID)) {
            DM.addCSSClass(userContainer, UNREAD_CLASS_NAME);
            return;
          }
          if (getUserID(SELECTED_USER_INNER_ID) === key) {
            sendReadMarkToStorage(userContainer);
            appendedMessagesAmount =
              DM.getDOMChildrenByTag(USER_CHAT_MESSAGES_ID, "div").length / 2;
            if (appendedMessagesAmount < user.messages.length) {
              Array.from(user.messages)
                .slice(appendedMessagesAmount - 1)
                .forEach(function appendUnread(message) {
                  appendSingleMessage(message);
                });
            }
            return;
          }
          DM.addCSSClass(userContainer, UNREAD_CLASS_NAME);
        });
      });
  };

  return self;
})(config);
