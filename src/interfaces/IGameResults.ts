import { Moment } from 'moment';

export default interface IGameResults {
  date: string;
  momentDate: Moment;
  guesses: IGuesses;
  imageSource: string;
  location: string;
  skipped: boolean;
  winner: string;
}

interface IGuesses {
  [key: string]: string;
}
