import addInitialUser from "./users.js";

class Session {
  constructor() {
    this.users = new Map();
    addInitialUser(this.users);
  }

  init(auth) {
    this.auth = auth;
  }

  verifyUser() {
    return this.users.has(this.auth.username);
  }

  findSession() {
    const { token, username } = this.auth;
    const data = this.users.get(username);
    if (!(data.hasOwnProperty("token") && data.token === token)) return false;
    return true;
  }

  verifyPassword() {
    const { username, password } = this.auth;
    const data = this.users.get(username);
    if (data.password !== password) return false;
    const token = Array(64)
      .fill(0)
      .map((x) => Math.random().toString(36).charAt(2))
      .join("");
    data["token"] = token;
    this.auth.token = token;
    return true;
  }
}

export default new Session();
