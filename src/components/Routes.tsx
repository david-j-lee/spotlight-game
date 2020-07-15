import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Loading from './Loading';

const Routes = () => {
  // /
  // /login
  // /game/<url>
  // /game-results/<url>
  // /leaderboards
  // /history
  return (
    <BrowserRouter>
      <Route exact path="/" component={Loading} />
      <Route path="/game/:url" />
      <Route path="/game-results/:url" />
      <Route path="/leaderboards" />
      <Route path="/history" />
    </BrowserRouter>
  );
};

export default Routes;
