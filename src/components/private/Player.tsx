import React from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../../context';
import IPlayer from './../../interfaces/IPlayer';

import Star from '../../img/star.png';
import StarOff from '../../img/star_off.png';
import Crown from '../../img/crown.png';
import CrownOff from '../../img/crown_off.png';

interface IProps {
  player: IPlayer;
}

const Player = ({ player }) => {
  const classes = useStyles();

  const [, { toggleUserPlayingState }] = useContext();

  const generateAlt = (isChamp) => {
    return isChamp ? 'crown' : 'star';
  };

  const getImages = (isChamp) => {
    return isChamp ? [Crown, CrownOff] : [Star, StarOff];
  };

  const images = getImages(player.isCurrentChamp);
  const alt = generateAlt(player.isCurrentChamp);

  return (
    <div
      className={classes.root}
      onClick={() => toggleUserPlayingState(player.name)}
    >
      {player.playing && <img src={images[0]} alt={alt} />}
      {!player.playing && <img src={images[1]} alt={alt + ' off'} />}
      <Typography className="name" variant="h3">
        {player.name}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(),
    '& > img': {
      width: 50,
      height: 50,
      margin: theme.spacing(1, 2),
    },
  },
}));

export default Player;
