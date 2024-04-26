/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.userId = null;
    this.username = null;
    this.lobbyId = null;
    this.lobbyOwner = null;
    Object.assign(this, data);
  }
}

export default User;
