export default interface IPlayer {
  id: string;
  active: boolean;
  playing: boolean;
  name: string;
  gamesPlayed: number;
  wins: number;
  streak: number;
  isCurrentChamp?: boolean;
  currentWinStreak?: number;
}
