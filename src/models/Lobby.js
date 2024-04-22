class Lobby {
    constructor(data = {}) {
      this.lobbyid = null;
      this.players = [];
      this.lobbyjoincode = null;
      this.lobbyowner = null;
      this.gameactive = false;
      Object.assign(this, data);
    }
  }
  
  export default Lobby;