import firebase from '../firebase';

import { IGetState } from '../context';
import IState from './../interfaces/IState';
import IPlayer from '../interfaces/IPlayer';

export const playerActions = {
  async addPlayer(player: IPlayer, getState: IGetState) {
    const userId = getState().auth.userId;
    const playersRef = getPlayers(userId);
    const addedPlayer = await playersRef.push({
      active: player.active,
      gamesPlayed: player.gamesPlayed,
      name: player.name,
      wins: player.wins,
    });
    player.id = addedPlayer.key || '';
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          players: [...state.game.players, player],
        },
      };
    };
  },
  async editPlayer(player: IPlayer, getState: IGetState) {
    const userId = getState().auth.userId;
    const playerRef = getPlayer(userId, player.id);
    playerRef.update({ name: player.name });
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          players: state.game.players.map((p) => {
            if (player.id === p.id) {
              p.name = player.name;
            }
            return p;
          }),
        },
      };
    };
  },
  async deletePlayer(playerId: string, getState: IGetState) {
    const userId = getState().auth.userId;
    const playerRef = getPlayer(userId, playerId);
    playerRef.remove();
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          players: state.game.players.filter(
            (player: IPlayer) => player.id !== playerId,
          ),
        },
      };
    };
  },
  async deactivatePlayer(playerId: string, getState: IGetState) {
    const userId = getState().auth.userId;
    const playerRef = getPlayer(userId, playerId);
    playerRef.update({ active: false });
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          players: state.game.players.map((player: IPlayer) => {
            if (player.id === playerId) {
              return { ...player, active: false, playing: false };
            }
            return player;
          }),
        },
      };
    };
  },
  async activatePlayer(playerId: string, getState: IGetState) {
    const userId = getState().auth.userId;
    const playerRef = getPlayer(userId, playerId);
    playerRef.update({ active: true });
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          players: state.game.players.map((player: IPlayer) => {
            if (player.id === playerId) {
              return { ...player, active: true, playing: true };
            }
            return player;
          }),
        },
      };
    };
  },
  toggleUserPlayingState(name: string) {
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          players: state.game.players.map((player) => {
            if (player.name === name && player.active) {
              player.playing = !player.playing;
            }
            return player;
          }),
        },
      };
    };
  },
};

export const getPlayers = (user: string) => {
  return firebase.database().ref(user + '/players');
};

export const getPlayer = (user: string, playerId: string) => {
  return firebase.database().ref(user + '/players/' + playerId);
};
