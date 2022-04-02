import { Server } from "socket.io";
import { addMessage, allPrevMessage } from "./db.js";
import Session from "../db/session.js";

export default (server) => {
  const io = new Server(server);

  io.use(async (socket, next) => {
    const { auth } = socket.handshake;
    Session.init(auth);
    if (!Session.verifyUser()) return next(new Error("Wrong User"));
    if (auth.hasOwnProperty("token")) {
      if (!Session.findSession()) return next(new Error("Need to login again"));
      socket.auth = auth;
      return next();
    }

    if (!Session.verifyPassword()) return next(new Error("Wrong password"));
    socket.auth = {
      token: auth.token,
      username: auth.username,
    };
    next();
  });

  io.on("connection", async (socket) => {
    console.log("connection established");
    socket.emit("session", socket.auth);

    const msgs = await allPrevMessage();
    socket.emit("allPrevMessage", msgs);

    socket.on("message", (msg) => {
      addMessage(msg);
      io.emit("newMessage", msg);
    });
  });
};
