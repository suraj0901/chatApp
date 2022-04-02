const $ = (name) => document.getElementById(name);
const auth = $("auth");
const main = $("main");
const authMsg = $("authMsg");
const _name = $("name");
const password = $("password");
const form = $("form");
const message = $("input");
const authContainer = $("authContainer");
const container = $("container");

const { io } = await import("https://cdn.socket.io/4.4.1/socket.io.esm.min.js");

const socket = io({
  autoConnect: false,
});

if (localStorage.getItem("token")) {
  socket.auth = {
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
  };
  socket.connect();
} else {
  authContainer.classList.remove("hide");
  auth.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (_name.value && password.value) {
      socket.auth = {
        username: _name.value,
        password: password.value,
      };
      socket.connect();
      _name.value = "";
      password.value = "";
    }
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (message.value) {
    socket.emit("message", {
      username: localStorage.getItem("username"),
      message: message.value,
      time: new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    });
    message.value = "";
  }
});

function addMessage({ username, message, time }) {
  const div = document.createElement("div");
  const isSlef = localStorage.getItem("username") === username;
  div.className = `msgbox ${isSlef ? "self" : ""}`;
  div.innerHTML = `
  ${isSlef ? "" : `<div class="name">${username} </div>`}
  <p class="msg">${message}   <sub>${time}</sub></p>
  `;
  container.appendChild(div);
}

socket.on("allPrevMessage", function (msgs) {
  for (const message of msgs) addMessage(message);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("connect", () => {
  console.log("connection established");
  authContainer.classList.add("hide");
  authMsg.classList.add("hide");
  main.classList.remove("hide");
});

// socket.on("disconnect", () => {
//   console.log("disconnect");
//   socket.disconnect();
// });

socket.on("connect_error", (err) => {
  console.log(err.message);
  if (err.message === "Wrong password") {
    authMsg.textContent = `Wrong password`;
    authMsg.classList.remove("hide");
  }
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  authContainer.classList.remove("hide");
});

socket.on("session", ({ token, username }) => {
  socket.auth = { token, username };
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
});

socket.on("newMessage", (msg) => {
  addMessage(msg);
  window.scrollTo(0, document.body.scrollHeight);
});
