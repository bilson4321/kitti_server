const { Card } = require("./cards");

class Deck {
  constructor() {
    this.NOC = 52;
    this.cardIndex = 0;
    this.cards = [];
    for (var i = 0; i < this.NOC; i++) {
      this.cards[i] = new Card(i + 1);
    }
  }

  shuffle = () => {
    console.log("Shuffuling cards");
    this.cardIndex = 0;
    var array_of_random_number = this.create_array_of_random_number(0, 51);
    console.log("Array of random number"+array_of_random_number);
    for (var i = 0; i < this.NOC; i++) {
      var rand = array_of_random_number[i];
      this.cards[i] = new Card(rand + 1);
      console.log("index"+i+"card:"+this.cards[i].cardValue);
    }
  };

  drawCard = () => {
    return this.cards[this.cardIndex++];
  };

  displayShuffledCards = () => {
    for (var i = 0; i < 52; i++) {
      this.cards[i].displayCard();
    }
  };
  random_number = (min, max) => {
    return Math.round((max - min) * Math.random() + min);
  };

  create_array_of_random_number = (min, max) => {
    var temp;
    var nums = new Array();
    for (var i = 0; i < 52; i++) {
      while (
        (temp = this.number_found(this.random_number(min, max), nums)) == -1
      );
      nums[i] = temp;
    }
    return nums;
  };

  number_found = (random_number, number_array) => {
    for (var element = 0; element < number_array.length; element++) {
      if (random_number == number_array[element]) {
        return -1;
      }
    }

    return random_number;
  };
}

module.exports = {
  Deck,
};
