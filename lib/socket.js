import { Server } from 'socket.io';
import { authenticateUser, addMessage, getMessages } from './util.js';
import session from './session.js';

export default (server) => {
  const io = new Server(server);

  io.use(async (socket, next) => {
    let { username, token } = socket.handshake.auth;
    if (token) {
      const storedToken = session.findSession(username);
      if (!username) return next(new Error('User is unauthorised'));
      socket['token'] = token;
      socket['username'] = username;
      return next();
    }
    token = authenticateUser(socket.handshake.auth);
    if (!token) return next(new Error('Wrong Crendentials'));
    session.saveSession(username, token);
    socket['token'] = token;
    socket['username'] = username;
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
  });

  // return  io
};
