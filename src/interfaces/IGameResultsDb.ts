import { Moment } from 'moment';
import IGuesses from './IGuesses';

export default interface IGameResultsDb {
  date: string;
  guesses: IGuesses;
  imageSource: string;
  location: string;
  skipped: boolean;
  winner: string;
}
