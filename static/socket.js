import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

const socket = io();
const form = document.getElementById('form');
const message = document.getElementById('input');
const container = document.getElementById('container');

const addMessage = ({ name, message }) => {
  const div = document.createElement('div');
  div.className = 'msgbox';
  div.innerHTML = `
    <p class="name">${name}</p>
    <p class="msg">${message}</p>
  `;
  container.appendChild(item);
};

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (message.value) {
    socket.emit('message', message.value);
    message.value = '';
  }
});

socket.on('allPrevMessage', function (msgs) {
  for (const message of msgs) addMessage(message);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('newMessage', function (msg) {
  addMessage(msg);
  window.scrollTo(0, document.body.scrollHeight);
});
