import firebase from '../firebase';

import { data } from '../data/contents.json';
import { INITIAL_STATE } from './../context';
import Game from '../utils/GameClass';
import IState from './../interfaces/IState';

export const gameActions = {
  async loadAssets(user: string) {
    let history: any[] = [];
    const players: any[] = [];
    await Promise.all([getPlayerInfo(user), getGameHistory(user)])
      .then(async (snaps) => {
        let val = snaps[0].val();
        for (let _id in val) {
          val[_id]['_id'] = _id;
          if (val[_id].active) {
            val[_id].playing = true;
          } else {
            val[_id].playing = false;
          }
          players.push(val[_id]);
        }

        val = snaps[1].val();
        if (val) {
          const values = Object.values(val).filter((v: any) => !v.skipped);
          history = values.sort((a: any, b: any) => {
            const valA = new Date(a.date).getTime();
            const valB = new Date(b.date).getTime();
            return valB - valA;
          });
        }
      })
      .catch((err) => console.error(err));
    return (state: IState) => {
      return {
        ...state,
        players,
        history,
        img: getImageInfo(state.history),
        hints: getHints(state.history),
        isLoaded: true,
      };
    };
  },
  setGameMode(gameMode: string) {
    return (state: IState) => {
      return {
        ...state,
        gameMode,
      };
    };
  },
  getNewImage() {
    return (state: IState) => {
      return {
        ...state,
        img: getImageInfo(state.history),
      };
    };
  },
  skipImage() {
    return (state: IState) => {
      const gamesRef = firebase.database().ref(state.user + '/games');
      const skippedGame = new Game(
        state.img.caption,
        state.img.img_src,
        'SKIPPED',
        false,
        true,
      );
      gamesRef.push(skippedGame);
      return {
        ...state,
        img: getImageInfo(state.history),
      };
    };
  },
  skipImageAndReload() {
    return (state: IState) => {
      const gamesRef = firebase.database().ref(state.user + '/games');
      const skippedGame = new Game(
        state.img.caption,
        state.img.img_src,
        'SKIPPED',
        false,
        true,
      );
      gamesRef.push(skippedGame);
      return INITIAL_STATE;
    };
  },
  resetGame() {
    return () => {
      return INITIAL_STATE;
    };
  },
  setUser(user: any) {
    return (state: IState) => {
      return {
        ...state,
        user,
      };
    };
  },
  toggleUserPlayingState(name: string) {
    return (state: IState) => {
      return {
        ...state,
        players: state.players.map((e) => {
          if (e.name === name) {
            e.playing = !e.playing;
          }
          return e;
        }),
      };
    };
  },
  updateGuesses(guesses: any[]) {
    return (state: IState) => {
      return {
        ...state,
        guesses,
      };
    };
  },
};

const getImageInfo = (history: any[]) => {
  const entry = data[Math.floor(Math.random() * data.length)];
  if (history.find((e) => e.imgSrc === entry.img_src)) {
    return getImageInfo(history);
  }
  return entry;
};

const getPlayerInfo = (user: string) => {
  const playersRef = firebase.database().ref(user + '/players');
  return playersRef.once('value');
};

const getGameHistory = (user: string) => {
  const gameHistoryRef = firebase.database().ref(user + '/games');
  return gameHistoryRef.once('value');
};

const getHints = (history: any[]) => {
  const banned = [
    'USA',
    'U.S.A.',
    'U.S.',
    'US',
    'United Stated of America',
    'U.K.',
    'UK',
    'Australia',
    'Carribean',
  ];
  const seen: any = {};
  const guesses: any[] = [];
  history.forEach((h) => {
    if (h.guesses) {
      for (let g in h.guesses) {
        const guess = h.guesses[g];
        if (!(guess in seen) && !banned.includes(guess)) {
          seen[guess] = 1;
          guesses.push(guess);
        }
      }
    }
  });
  return guesses;
};
