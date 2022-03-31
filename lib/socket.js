import { Server } from 'socket.io';
import { authenticateUser, addMessage, getMessages } from './util.js';

export default (server) => {
  const session = {};
  const io = new Server(server);

  io.use(async (socket, next) => {
    let { username, token } = socket.handshake.auth;
    if (token) {
      const storedToken = session[username];
      if (!username) return next(new Error('User is unauthorised'));
      socket['token'] = token;
      socket['username'] = username;
      return next();
    }
    token = authenticateUser(socket.handshake.auth);

    if (!token) return next(new Error('Wrong Crendentials'));
    session[token] = socket.handshake.auth.username;
    socket['token'] = token;
    socket['username'] = socket.handshake.auth.username;
    console.log('yeep yeep');
    return next();
  });

  io.on('connection', async (socket) => {
    console.log('connection established');
    await getMessages(socket);

    socket.emit('session', {
      token: socket.token,
      username: socket.username,
    });
    socket.on('message', (msg) => {
      addMessage(msg);
      io.emit('newMessage', msg);
    });
    // socket.on('disconnect', () => delete session[socket.token]);
  });

  // return  io
};
