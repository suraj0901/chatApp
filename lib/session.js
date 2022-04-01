class Session {
  constructor() {
    this.session = new Map();
  }
  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }
}

export default new Session();
