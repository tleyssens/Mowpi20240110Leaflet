module.exports = function () {
const io = require('socket.io')

const socket = io();
const { createApp, ref, watch, reactive, watchEffect } = Vue;

const Chat = {
  name: "Chat",

  setup() {
    let newMessage = ref(null);
    let typing = ref(false);
    let ready = ref(false);
    let info = reactive([]);
    let connections = ref(0);
    const messages = reactive([]);
    const username = ref(null);

    window.onbeforeunload = () => {
      socket.emit("leave", username.value);
    };

    socket.on("chat-message", (data) => {
      messages.push({
        message: data.message,
        type: 1,
        user: data.user,
      });
    });

    socket.on("typing", (data) => {
      typing.value = data;
    });

    socket.on("stopTyping", () => {
      typing.value = false;
    });

    socket.on("joined", (data) => {
      info.push({
        username: data.name,
        type: "joined",
      });

      messages.push(...data.messages);

      setTimeout(() => {
        info.length = 0;
      }, 5000);
    });

    socket.on("leave", (data) => {
      info.push({
        username: data,
        type: "left",
      });

      setTimeout(() => {
        info.length = 0;
      }, 5000);
    });

    socket.on("connections", (data) => {
      connections.value = data;
    });

    watch(newMessage, (newMessage, preNewMessage) => {
      newMessage
        ? socket.emit("typing", username.value)
        : socket.emit("stopTyping");
    });

    function send() {
      messages.push({
        message: newMessage.value,
        type: 0,
        user: "Me",
      });

      socket.emit("chat-message", {
        message: newMessage.value,
        user: username.value,
      });
      newMessage.value = null;
    }

    function addUser() {
      ready.value = true;
      socket.emit("joined", username.value);
    }

    return {
      addUser,
      send,
      newMessage,
      messages,
      typing,
      username,
      ready,
      info,
      connections,
    };
  },
};
console.log(Chat)
//createApp(Chat).mount("#app");
return Chat
}
