import { Moment } from 'moment';
import IGuesses from './IGuesses';
import IGameResultsDb from './IGameResultsDb';

export default interface IGameResults extends IGameResultsDb {
  momentDate: Moment;
}
