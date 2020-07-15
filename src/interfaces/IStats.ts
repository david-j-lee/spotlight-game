import IGameResults from './IGameResults';

export default interface IStats {
  history: IGameResults[]; // TODO: rename to gameResults
}
