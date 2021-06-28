import React, { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SaveIcon from '@material-ui/icons/Save';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { useContext } from '../../context';
import Player from './Player';

import IGameResults from '../../interfaces/IGameResults';
import IPlayer from '../../interfaces/IPlayer';

const Lobby: FC = () => {
  const classes = useStyles();
  const params: any = useParams();
  const { url } = params;
  const [{ game, stats }, { getNewImage, setImageWithUrl, addPlayer }] =
    useContext();
  const { players, image } = game;
  const { history } = stats;

  const [showDeactivatedPlayers, setShowDeactivatedPlayers] = useState(false);
  const [addPlayerDialog, setAddPlayerDialog] = useState(false);
  const [addPlayerName, setAddPlayerName] = useState('');

  useEffect(() => {
    if (!image) {
      if (url) {
        setImageWithUrl(decodeURIComponent(url));
      } else {
        getNewImage();
      }
    }
  }, [url, image, getNewImage, setImageWithUrl]);

  const onAddPlayerDialogClose = () => {
    setAddPlayerDialog(false);
    setAddPlayerName('');
  };

  const handleClickAddPlayerSave = () => {
    const newPlayer: IPlayer = {
      id: '',
      name: addPlayerName,
      active: true,
      playing: true,
      gamesPlayed: 0,
      wins: 0,
      streak: 0,
      isCurrentChamp: false,
      currentWinStreak: 0,
    };
    addPlayer(newPlayer);
    setAddPlayerName('');
    setAddPlayerDialog(false);
  };

  const getReigningChampion = (history: IGameResults[]) => {
    for (let i = 0; i < history.length; i++) {
      if (history[i].winner !== 'SKIPPED') {
        return history[i].winner;
      }
    }
    return '';
  };

  const getCurrentWinStreak = (history: IGameResults[]) => {
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
          .filter((player) => player.active || showDeactivatedPlayers)
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
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
      <div className={classes.listActionItems}>
        <Button
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setAddPlayerDialog(true)}
        >
          Add Player
        </Button>
        <Dialog open={addPlayerDialog} onClose={onAddPlayerDialogClose}>
          <DialogTitle>Add a Player</DialogTitle>
          <DialogContent>
            <TextField
              variant="filled"
              label="name"
              value={addPlayerName}
              onChange={(event) => setAddPlayerName(event.target.value)}
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddPlayerDialog(false)}>
              <ClearIcon /> No
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClickAddPlayerSave()}
            >
              <SaveIcon /> Save
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          size="small"
          color="primary"
          startIcon={
            showDeactivatedPlayers ? <VisibilityOffIcon /> : <VisibilityIcon />
          }
          onClick={() => setShowDeactivatedPlayers(!showDeactivatedPlayers)}
        >
          {showDeactivatedPlayers ? 'Hide Deactivated' : 'Show Deactivated'}
        </Button>
      </div>
      <div className={classes.buttons}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          component={Link}
          disabled={!image?.source}
          to={`/game/${encodeURIComponent(image ? image.source : '')}`}
          startIcon={<PlayArrowIcon />}
        >
          Start Game
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          size="large"
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
    margin: theme.spacing(4, 2, 0, 2),
  },
  listActionItems: {
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    '& > *': {
      marginBottom: theme.spacing(2),
      maxWidth: 200,
      width: '100%',
    },
  },
}));

export default Lobby;
