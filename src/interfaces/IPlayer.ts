export default interface IPlayer {
  _id: string;
  active: boolean;
  playing: boolean;
  name: string;
  gamesPlayed: number;
  wins: number;
  streak: number;
}
