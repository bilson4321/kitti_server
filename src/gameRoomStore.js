/* abstract */ class GameRoomStore {
    findGameRoom(id) {}
    createGameRoom(id,gameInfo) {}
    saveGameRoom(id, gameSession) {}
    findAllGameRoom() {}
  }
  
  class InMemoryGameRoomStore extends GameRoomStore {
    constructor() {
      super();
      this.gameRoom = new Map();
    }
  
    findGameRoom(id) {
      return this.gameRoom.get(id);
    }

    createGameRoom(id, gameInfo){
        this.gameRoom.set(id,gameInfo);
    }
  
    saveGameRoom(id, session) {
      this.gameRoom.set(id, session);
    }
  
    findAllGameRoom() {
      return [...this.gameRoom.values()];
    }
  }
  
  module.exports = {
    InMemoryGameRoomStore,
  };
  