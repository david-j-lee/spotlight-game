import IGuesses from './IGuesses';

export default interface IGameResultsDb {
  id?: string;
  date: string;
  guesses: IGuesses;
  imageSource: string;
  location: string;
  skipped: boolean;
  winner: string;
  lat?: number;
  lng?: number;
}
