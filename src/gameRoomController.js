const { Deck } = require("./deck");

class GameRoomController {
  constructor() {
    this.deck = new Deck();
    this.players = new Array();
  }

  addPlayer = (player) => {
    this.players.push(player);
  };

  distributeCard = (player) => {
    var cardsToDistribute = new Array();
    this.deck.shuffle();
    this.players.forEach((element) => {
      var cardsForEachPlayer = new Array();
      for (var i = 0; i < 9; i++) {
        cardsForEachPlayer.push(this.deck.drawCard());
      }
      cardsToDistribute.push(cardsForEachPlayer);
    });
    return cardsToDistribute;
  };
}

module.exports = {
  GameRoomController,
};
