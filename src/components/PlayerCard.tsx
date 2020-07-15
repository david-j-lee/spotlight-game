import React from 'react';

import { useContext } from '../context';

import Star from '../img/star.png';
import StarOff from '../img/star_off.png';
import Crown from '../img/crown.png';
import CrownOff from '../img/crown_off.png';
import './PlayerCard.css';

interface IProps {
  name: string;
  playing: boolean;
  isCurrentChamp: boolean;
  streak: number;
  wins: number;
  gamesPlayed: number;
  allInfo: boolean;
}

const PlayerCard = ({
  playing,
  isCurrentChamp,
  streak,
  wins,
  gamesPlayed,
  name,
  allInfo,
}) => {
  const [, { toggleUserPlayingState }] = useContext();

  const generateAverageWin = (wins, total) => {
    const avg =
      wins && total ? Math.round(100 * (Number(wins) / Number(total))) : 0;
    return `${avg} %`;
  };

  const generateAlt = (isChamp) => {
    return isChamp ? 'crown' : 'star';
  };

  const getImages = (isChamp) => {
    return isChamp ? [Crown, CrownOff] : [Star, StarOff];
  };

  const images = getImages(isCurrentChamp);
  const alt = generateAlt(isCurrentChamp);

  return (
    <div className="player-card">
      {playing && (
        <img
          src={images[0]}
          alt={alt}
          onClick={() => toggleUserPlayingState(name)}
        />
      )}
      {!playing && (
        <img
          src={images[1]}
          alt={alt + ' off'}
          onClick={() => toggleUserPlayingState(name)}
        />
      )}
      {isCurrentChamp && <span className="streak">{streak}</span>}
      <p className="name">{name}</p>
      <p>{wins}</p>
      {allInfo && <p>{generateAverageWin(wins, gamesPlayed)}</p>}
    </div>
  );
};

export default PlayerCard;
