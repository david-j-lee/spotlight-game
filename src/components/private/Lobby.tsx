import React, { FC, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import HomeIcon from '@material-ui/icons/Home';

import { useContext } from '../../context';
import Player from './Player';

const Lobby: FC = () => {
  const classes = useStyles();
  const params: any = useParams();
  const { url } = params;
  const [{ game, stats }, { getNewImage, setImageWithUrl }] = useContext();
  const { players, image } = game;
  const { history } = stats;

  useEffect(() => {
    if (!image) {
      if (url) {
        setImageWithUrl(decodeURIComponent(url));
      } else {
        getNewImage();
      }
    }
  }, [url, image, getNewImage, setImageWithUrl]);

  const getReigningChampion = (history) => {
    for (let i = 0; i < history.length; i++) {
      if (history[i].winner !== 'SKIPPED') {
        return history[i].winner;
      }
    }
    return '';
  };

  const getCurrentWinStreak = (history) => {
    const champ = getReigningChampion(history);
    let streak = 0;
    for (let i = 0; i < history.length; i++) {
      if (history[i].winner === 'SKIPPED') {
        continue;
      } else if (champ === history[i].winner) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // TODO: Move all this logic into an action
  const reigningChamp = getReigningChampion(history);
  const currentWinStreak = getCurrentWinStreak(history);

  return (
    <div className={classes.root}>
      <div className={['styled-scrollbar', classes.players].join(' ')}>
        {players
          .filter((player) => player.active)
          .sort((a: any, b: any) => a.name - b.name)
          .map((player) => {
            if (player.name !== 'No one') {
              return (
                <Player
                  key={player.name}
                  player={{
                    ...player,
                    isCurrentChamp: player.name === reigningChamp,
                    currentWinStreak:
                      player.name === reigningChamp ? currentWinStreak : 0,
                  }}
                />
              );
            } else {
              return null;
            }
          })}
      </div>
      <div className={classes.buttons}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          component={Link}
          disabled={!image?.source}
          to={`/game/${encodeURIComponent(image ? image.source : '')}`}
        >
          Start Game
        </Button>
        <Button
          color="primary"
          variant="outlined"
          size="small"
          startIcon={<HomeIcon />}
          component={Link}
          to="/"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  players: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 400,
    overflow: 'auto',
    padding: theme.spacing(),
    margin: theme.spacing(4, 2),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(),
    },
  },
}));

export default Lobby;
