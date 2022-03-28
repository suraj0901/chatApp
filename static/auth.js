const auth = document.getElementById('auth');
const authMsg = document.getElementById('authMsg');
const _name = document.getElementById('name');
const password = document.getElementById('password');

const varifyUser = async (name, password) => {
  try {
    const res = await fetch('/auth', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });
    if (res.ok) {
      return await res.json();
    }
    return false;
  } catch (err) {
    console.log(err);
  }
};

auth.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (_name.value && password.value) {
    const result = await varifyUser(_name.value, password.value);
    if (result) {
      await init(result);
      auth.classList.toggle('hide');
    } else {
      authMsg.textContent = `Wrong Crendentials`;
      authMsg.classList.toggle('hide');
    }
  }
});

async function inti(token) {
  const { io } = import('https://cdn.socket.io/4.4.1/socket.io.esm.min.js');

  const socket = io({
    auth: {
      token,
    },
  });

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
      socket.emit('message', {
        token: localStorage.getItem('token'),
        message: message.value,
      });
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
}
