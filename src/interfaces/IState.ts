import IAuth from './IAuth';
import IGame from './IGame';
import IStats from './IStats';

export default interface IState {
  isLoaded: boolean;
  auth: IAuth;
  game: IGame;
  stats: IStats;
}
