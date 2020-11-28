import React, { FC } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../../context';

import Star from '../../img/star.png';
import StarOff from '../../img/star_off.png';
import Crown from '../../img/crown.png';
import CrownOff from '../../img/crown_off.png';

import IPlayer from '../../interfaces/IPlayer';

interface IProps {
  player: IPlayer;
}

const Player: FC<IProps> = ({ player }) => {
  const classes = useStyles();

  const [, { toggleUserPlayingState }] = useContext();

  const generateAlt = (isChamp: boolean) => {
    return isChamp ? 'crown' : 'star';
  };

  const getImages = (isChamp: boolean) => {
    return isChamp ? [Crown, CrownOff] : [Star, StarOff];
  };

  const images = getImages(!!player.isCurrentChamp);
  const alt = generateAlt(!!player.isCurrentChamp);

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
