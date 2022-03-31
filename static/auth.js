const $ = (name) => document.getElementById(name);
const auth = $('auth');
const authMsg = $('authMsg');
const _name = $('name');
const password = $('password');
const form = $('form');
const message = $('input');
const container = $('container');

const { io } = await import('https://cdn.socket.io/4.4.1/socket.io.esm.min.js');

const socket = io({
  autoConnect: false,
});

const token = localStorage.getItem('token');
if (token) {
  socket.auth = { token };
  socket.connect();
} else {
  auth.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (_name.value && password.value) {
      socket.auth = {
        username: _name.value,
        password: password.value,
      };
      socket.connect();
      _name.value = '';
      password.value = '';
    }
  });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (message.value) {
    socket.emit('message', {
      username: localStorage.getItem('username'),
      message: message.value,
    });
    message.value = '';
  }
});

function addMessage({ username, message }) {
  const div = document.createElement('div');
  div.className = 'msgbox';
  div.innerHTML = `
  <p class="name">${username}</p>
  <p class="msg">${message}</p>
  `;
  container.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

socket.on('allPrevMessage', function (msgs) {
  for (const message of msgs) addMessage(message);
});

socket.on('connect', () => {
  console.log('connection established');
  auth.classList.toggle('hide');
});

socket.on('disconnect', () => {
  localStorage.removeItem('token');
  console.log('disconnect');
});

socket.on('connect_error', (err) => {
  authMsg.textContent = `Wrong Crendentials`;
  authMsg.classList.toggle('hide');
});

socket.on('session', ({ token, username }) => {
  console.log('got session object');
  socket.auth = { token };
  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
});

socket.on('newMessage', addMessage);
