class Game {
  location: string;
  imageSource: string;
  winner: any;
  date: string;
  guesses: [];
  skipped: boolean;

  constructor(location, imageSource, winner, guesses, skipped = false) {
    this.location = location;
    this.imageSource = imageSource;
    this.winner = winner;
    this.date = new Date().toISOString();
    this.guesses = guesses;
    this.skipped = skipped;
  }
}

export default Game;
