import { Moment } from 'moment';
import IGameResultsDb from './IGameResultsDb';

export default interface IGameResults extends IGameResultsDb {
  momentDate: Moment;
}
