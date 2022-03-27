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
      await import('./socket.js');
      auth.classList.toggle('hide');
    } else {
      authMsg.textContent = `Wrong Crendentials`;
      authMsg.classList.toggle('hide');
    }
  }
});
