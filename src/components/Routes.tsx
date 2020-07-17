import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './public/Login';

import PrivateRoute from './private/PrivateRoute';
import Home from './private/Home';
import Lobby from './private/Lobby';
import Game from './private/Game';
import GameResults from './private/GameResults';
import Leaderboards from './private/Leaderboards';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route path="/login" component={Login} />
      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute path="/lobby/:url?" component={Lobby} />
      <PrivateRoute path="/game/:url?" component={Game} />
      <PrivateRoute path="/game-results/:url?" component={GameResults} />
      <PrivateRoute path="/leaderboards" component={Leaderboards} />
    </BrowserRouter>
  );
};

export default Routes;
