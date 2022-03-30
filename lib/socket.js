import { Server } from 'socket.io';
import { authenticateUser, addMessage, getMessages } from './util.js';

export default (server) => {
  const session = {};
  const io = new Server(server);

  io.use((socket, next) => {
    let token = socket.handshake.auth.token;
    if (token) {
      const username = session.get(token, false);
      if (!username) return next(new Error('User is unauthorised'));
      socket.token = token;
      socket.username = username;
      return next();
    }
    token = authenticateUser(socket.handshake.auth);
    if (!token) return next(new Error('Wrong Crendentials'));
    session[token] = socket.handshake.auth.username;
    session.token = token;
    session.username = username;
    next();
  });

  io.on('connection', async (socket) => {
    await getMessages(socket);

    socket.emit('session', {
      token: socket.token,
      username: socket.username,
    });
    socket.on('message', addMessage);
    socket.on('disconnect', () => delete session[token]);
  });

  // return  io
};
