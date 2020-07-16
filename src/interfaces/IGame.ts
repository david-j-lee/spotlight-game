import IImage from './IImage';
import IPlayer from './IPlayer';
import IGuesses from './IGuesses';

export default interface IGame {
  players: IPlayer[];
  guesses: IGuesses;
  hints: string[];
  image?: IImage;
}
