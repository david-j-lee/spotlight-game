import React from 'react';

// @ts-ignore
import { useGovernor } from '@techempower/react-governor'; // TODO: Add types

import IState from './interfaces/IState';

import { authActions } from './actions/authActions';
import { gameActions } from './actions/gameActions';

export const INITIAL_STATE: IState = {
  isLoaded: false,
  auth: {
    email: '',
    userId: '',
    isAuthenticated: false,
    failedAutoLogin: false,
  },
  game: {
    players: [],
    guesses: {},
    hints: [],
    image: undefined,
  },
  stats: {
    history: [],
  },
};

const contract = {
  ...authActions,
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
