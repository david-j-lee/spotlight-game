import React, { FC, useState } from 'react';

import { useContext } from '../context';

import Login from './Login';
import Pregame from './Pregame';
import LiveGame from './LiveGame';
import PostGame from './Postgame';

import './GameSwitch.css';

const GameSwitch: FC = () => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const [{ gameMode, gameModes, img, user }, { getNewImage }] = useContext();

  const handleImgLoaded = () => {
    setImgLoaded(true);
  };

  const handleImgError = () => {
    setImgLoaded(false);
    getNewImage();
  };

  return (
    <div className="main">
      {user && img && (
        <img
          className={gameMode !== gameModes.PREGAME ? 'game-img' : 'hidden'}
          src={img.img_src}
          alt="game img"
          onLoad={handleImgLoaded}
          onError={handleImgError}
        />
      )}

      {!user && <Login />}

      {user && gameMode === gameModes.PREGAME && (
        <Pregame imgLoaded={imgLoaded} />
      )}
      {user && gameMode === gameModes.LIVEGAME && <LiveGame />}
      {user && gameMode === gameModes.POSTGAME && <PostGame />}
    </div>
  );
};

export default GameSwitch;
