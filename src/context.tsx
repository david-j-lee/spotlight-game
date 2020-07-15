import React from 'react';
import { useGovernor } from '@techempower/react-governor';

import IState from './interfaces/IState';

import { gameActions } from './actions/gameActions';

export const INITIAL_STATE: IState = {
  isLoaded: false,
  gameModes: {
    PREGAME: 'pre',
    LIVEGAME: 'live',
    POSTGAME: 'post',
  },
  gameMode: 'pre',
  img: null,
  players: [],
  history: [],
  guesses: {},
  hints: [],
  user: '',
};

const contract = {
  ...gameActions,
};

const Context = React.createContext(INITIAL_STATE);

export default function ContextProvider(props: any) {
  const [context, actions] = useGovernor(INITIAL_STATE, contract);

  const { children } = props;

  return (
    <Context.Provider value={[context, actions] as any}>
      {children}
    </Context.Provider>
  );
}

export function useContext(): [IState, any] {
  return React.useContext(Context) as any;
}
