import moment from 'moment';
import firebase from '../firebase';

import { data } from '../data/contents.json';

import { IGetState } from '../context';
import IState from './../interfaces/IState';
import IGameResults from './../interfaces/IGameResults';
import IGameResultsDb from './../interfaces/IGameResultsDb';
import IImage from './../interfaces/IImage';

import { getGeolocationUrl } from '../utils/googlemaps';
import { getPlayers } from './playerActions';

export const gameActions = {
  async loadAssets(user: string) {
    let history: any[] = [];
    let players: any[] = [];
    await Promise.all([
      getPlayers(user).once('value'),
      getGameHistory(user).once('value'),
    ])
      .then(async (snaps) => {
        let val = snaps[0].val();
        if (val) {
          players = Object.entries(val).map(([key, value]: [string, any]) => ({
            ...value,
            id: key,
            playing: value.active,
          }));
        }

        val = snaps[1].val();
        if (val) {
          history = Object.entries(val)
            .map(([key, value]: [string, any]) => ({
              ...value,
              id: key,
              momentDate: moment(value.date),
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
  async setImageWithUrl(url: string) {
    const image: IImage = {
      ...data.find((image) => image.source === url),
    } as IImage;
    const geolocation = await getGeolocation(image.caption);
    if (geolocation) {
      image.lat = geolocation.lat;
      image.lng = geolocation.lng;
    }
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          image,
        },
      };
    };
  },
  async getNewImage(getState: IGetState) {
    const image = await getRandomImage(getState().stats.history);
    return (state: IState): IState => {
      return {
        ...state,
        game: {
          ...state.game,
          image,
        },
      };
    };
  },
  async skipImage(skippedGame: IGameResultsDb, getState: IGetState) {
    const image = await getRandomImage(getState().stats.history);
    return (state: IState): IState => {
      const gamesRef = firebase.database().ref(state.auth.userId + '/games');
      gamesRef.push(skippedGame); // TODO: Need to set id on this object
      return {
        ...state,
        game: {
          ...state.game,
          image,
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

const getRandomImage = async (history: any[]): Promise<any> => {
  const entry: any = { ...data[Math.floor(Math.random() * data.length)] };
  if (history.find((e) => e.imageSource === entry.source)) {
    return await getRandomImage(history);
  }
  const geolocation = await getGeolocation(entry.caption);
  if (geolocation) {
    entry.lat = geolocation.lat;
    entry.lng = geolocation.lng;
  }
  return entry;
};

const getGameHistory = (user: string) => {
  return firebase.database().ref(user + '/games');
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

const getGeolocation = async (location: string | undefined) => {
  if (location) {
    return await fetch(getGeolocationUrl(location))
      .then((res) => res.json())
      .then((res) => {
        if (res.results && res.results[0]) {
          const geoLoc = res.results[res.results.length - 1].geometry.location;
          return {
            lat: geoLoc.lat,
            lng: geoLoc.lng,
          };
        } else {
          throw new Error('Unable to find location');
        }
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  }
  return Promise.reject('No location specified.');
};
