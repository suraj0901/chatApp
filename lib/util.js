import { add, get } from './db.js';

export const addMessage = async (msg, io) => {
  try {
    await add(msg);
    io.emit('newMessage', msg);
  } catch (err) {
    console.log(err);
  }
};

export const getMessages = async (socket) => {
  try {
    const allPrevMessage = await get();
    socket.emit('allPrevMessage', allPrevMessage);
  } catch (err) {
    console.log(err);
  }
};

export const authenticateUser = (auth) => {
  const list = {
    'Mohit Pandey': 'great#667',
    'Suraj Yadav': 'smart#898',
    'Akash Jaiswal': 'gota#323',
    'Suraj Jha': '123',
    'Prince Dubey': 'charming#486',
  };

  const password = list[auth.username];
  if (password && password === auth.password) {
    console.log('Verified user');
    const token = Array(64)
      .fill(0)
      .map((x) => Math.random().toString(36).charAt(2))
      .join('');
    return token;
  }

  return false;
};
