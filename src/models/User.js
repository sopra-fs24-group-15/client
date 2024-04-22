/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.userid = null;
    this.username = null;
    this.lobbyid = null;
    this.lobbyowner = null;
    Object.assign(this, data);
  }
}

export default User;
