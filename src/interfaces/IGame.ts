import IImage from './IImage';
import IPlayer from './IPlayer';

export default interface IGame {
  modes: IGameModes;
  mode: 'pre' | 'live' | 'post';
  players: IPlayer[];
  guesses: any;
  hints: string[];
  image?: IImage;
}

interface IGameModes {
  PREGAME: 'pre';
  LIVEGAME: 'live';
  POSTGAME: 'post';
}
