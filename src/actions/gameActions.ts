import moment from 'moment';
import firebase from '../firebase';

import { data } from '../data/contents.json';
import IState from './../interfaces/IState';
import IGameResults from './../interfaces/IGameResults';
import IGuesses from '../interfaces/IGuesses';
import IGameResultsDb from './../interfaces/IGameResultsDb';

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
          history = Object.entries(val)
            .map(([key, value]: [string, any]) => ({
              ...value,
              id: key,
              momentDate: moment(value.date, [
                'M/D/YYYY',
                'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
              ]),
            }))
            .sort(
              (a: any, b: any) =>
                b.momentDate.format('YYYYMMDDHHmmss') -
                a.momentDate.format('YYYYMMDDHHmmss'),
            );
        }
      })
      .catch((err) => console.error(err));
    return (state: IState): IState => {
      return {
        ...state,
        isLoaded: true,
        game: {
          ...state.game,
          players,
          hints: getHints(state.stats.history),
        },
        stats: {
          ...state.stats,
          history,
        },
      };
    };
  },
  setImageWithUrl(url: string) {
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          image: data.find((image) => image.source === url),
        },
      };
    };
  },
  getNewImage() {
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          image: getRandomImage(state.stats.history),
        },
      };
    };
  },
  skipImage(guesses: IGuesses) {
    return (state: IState): IState => {
      const gamesRef = firebase.database().ref(state.auth.userId + '/games');
      const skippedGame: IGameResultsDb = {
        location: state.game.image?.caption || '',
        imageSource: state.game.image?.source || '',
        date: new Date().toISOString(),
        winner: 'SKIPPED',
        guesses,
        skipped: true,
      };
      gamesRef.push(skippedGame); // TODO: Need to set id on this object
      return {
        ...state,
        game: {
          ...state.game,
          image: getRandomImage(state.stats.history),
        },
        stats: {
          ...state.stats,
          history: [
            {
              ...skippedGame,
              momentDate: moment(skippedGame.date),
            } as IGameResults,
            ...state.stats.history,
          ],
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
            if (player.name === name) {
              player.playing = !player.playing;
            }
            return player;
          }),
        },
      };
    };
  },
  addGameToHistory(game: IGameResults) {
    return (state: IState): IState => {
      return {
        ...state,
        stats: {
          ...state.stats,
          history: [game, ...state.stats.history],
        },
      };
    };
  },
};

const getRandomImage = (history: any[]): any => {
  const entry = data[Math.floor(Math.random() * data.length)];
  if (history.find((e) => e.imageSource === entry.source)) {
    return getRandomImage(history);
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
  const hints: any[] = [];
  history.forEach((record) => {
    if (record.guesses) {
      for (let g in record.guesses) {
        const guess = record.guesses[g];
        if (!(guess in seen) && !banned.includes(guess)) {
          seen[guess] = 1;
          hints.push(guess);
        }
      }
    }
  });
  return hints.sort((a: string, b: string) => a.localeCompare(b));
};
