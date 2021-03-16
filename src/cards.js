class Card {
  constructor(random_number) {
    this.cardNumber = random_number;
    this.cardValue;
    this.cardType;
    var temp = random_number % 13;
    if (temp == 0) this.cardValue = 13;
    //adjusting value for king
    else if (temp == 1) this.cardValue = 14;
    //adjusting value for ace
    else this.cardValue = temp;

    if (random_number <= 13) this.cardType = "\u2660";
    //spade
    else if (random_number > 13 && random_number <= 26)
      this.cardType = "\u2663";
    //club
    else if (random_number > 26 && random_number <= 39)
      this.cardType = "\u2665";
    //heart
    else this.cardType = "\u2666"; //diamond
  }

  // console.log(cardValue,cardType);
  // console.log("card-type = ", cardType);

  displayIt = () => {
    console.log(this.cardValue, this.cardType);
  };
}

module.exports = {
  Card,
};
