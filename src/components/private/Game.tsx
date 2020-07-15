import React, { FC, useState, useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import moment from 'moment';
import firebase from '../../firebase';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import WeekendIcon from '@material-ui/icons/Weekend';

import { useContext } from '../../context';
import GameClass from '../../utils/GameClass';

const Game: FC = () => {
  const params: any = useParams();
  const { url } = params;
  const classes = useStyles();
  const history = useHistory();

  const [
    { auth, game },
    { setImageWithUrl, skipImage, addGameToHistory },
  ] = useContext();
  const { userId } = auth;
  const { hints, image, players } = game;

  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [guesses, setGuesses] = useState({});

  useEffect(() => {
    if (!image && url) {
      setImageWithUrl(decodeURIComponent(url));
    }
    if (image && url && image.source !== decodeURIComponent(url)) {
      history.push(encodeURIComponent(image.source));
    }
  }, [url, image, history, setImageWithUrl]);

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
  };

  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
  };

  const handleSpeedDialClick = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSkip = () => {
    // TODO: Modal and display location
    skipImage();
  };

  const handleInputChange = (playerName: string, newValue: any) => {
    // TODO: This does not update on free form input
    setGuesses({ ...guesses, [playerName]: newValue });
  };

  const submitGuesses = () => {
    // TODO: Validate inputs
    setDialogOpen(true);
  };

  const handleDialogClose = (value: string) => {
    setDialogOpen(false);
  };

  const setGoogleSrc = () => {
    return `https://www.google.com/maps/embed/v1/place?q=${image?.caption}&zoom=7&key=AIzaSyC1aEMKRB6A4_rZq8uwov5Q_uRkYy1TK0Q`;
  };

  const getGoogleWidth = () => {
    const width = 600;
    return `${width}`;
  };

  const getGoogleHeight = () => {
    const height = 250;
    return `${height}`;
  };

  const declareWinner = (winner: string) => {
    const gamesRef = firebase.database().ref(userId + '/games');
    const newGame = new GameClass(
      image?.caption,
      image?.source,
      winner,
      guesses,
    );
    gamesRef.push(newGame);

    players
      .filter((player) => player.playing)
      .forEach((player) => {
        const playerRef = firebase
          .database()
          .ref(userId + '/players/' + player._id);
        if (player.name === winner) {
          playerRef.update({
            wins: player.wins += 1,
            gamesPlayed: player.gamesPlayed += 1,
          });
        } else {
          playerRef.update({ gamesPlayed: player.gamesPlayed += 1 });
        }
      });

    history.push(`/game-results/${url}`);

    addGameToHistory({...newGame, momentDate: moment(newGame.date)});
  };

  if (game.players.length === 0) {
    return <Redirect to={`/lobby/${url}`} />;
  }

  if (!image) {
    return <div>Loading, please wait . . .</div>;
  }

  return (
    <div className={classes.root}>
      <div
        className={[classes.image, drawerOpen ? classes.imageShift : ''].join(
          ' ',
        )}
        style={{
          background: `url(${image.source}) center / contain no-repeat`,
        }}
      />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContent}>
          <div className={classes.inputs}>
            {players
              .filter((player) => player.playing && player.name !== 'No one')
              .map((player) => (
                <Autocomplete
                  key={player.name}
                  freeSolo
                  options={hints}
                  value={guesses[player.name] || ''}
                  onChange={(_, newValue) =>
                    handleInputChange(player.name, newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={player.name}
                      variant="filled"
                    />
                  )}
                ></Autocomplete>
              ))}
          </div>
          <Button
            onClick={submitGuesses}
            variant="contained"
            color="primary"
            size="large"
          >
            Submit
          </Button>
        </div>
      </Drawer>
      <Dialog onClose={handleDialogClose} open={dialogOpen}>
        <DialogTitle>{image.caption}</DialogTitle>
        <div className={classes.dialogContent}>
          <iframe
            title="google"
            width={getGoogleWidth()}
            height={getGoogleHeight()}
            frameBorder="0"
            src={setGoogleSrc()}
            allowFullScreen
          ></iframe>
          <div className={classes.guesses}>
            {players
              .filter((player) => player.playing)
              .sort(
                (a, b) =>
                  guesses[a.name] &&
                  guesses[a.name].localeCompare(guesses[b.name]),
              )
              .map((player) => (
                <Button
                  key={player.name}
                  variant="outlined"
                  className={classes.guess}
                  onClick={() => declareWinner(player.name)}
                >
                  {guesses[player.name] ? guesses[player.name] + ' - ' : ''}
                  {player.name}
                </Button>
              ))}
          </div>
        </div>
      </Dialog>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={[
          classes.speedDial,
          drawerOpen ? classes.speedDialShifted : '',
        ].join(' ')}
        icon={
          <SpeedDialIcon
            openIcon={drawerOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          />
        }
        onClose={handleSpeedDialClose}
        onOpen={handleSpeedDialOpen}
        onClick={handleSpeedDialClick}
        open={speedDialOpen}
      >
        <SpeedDialAction
          icon={<SkipNextIcon />}
          tooltipTitle="Skip"
          onClick={handleSkip}
        />
        <SpeedDialAction
          icon={<WeekendIcon />}
          tooltipTitle="Lobby"
          onClick={() => history.push(`/lobby/${url}`)}
        />
        <SpeedDialAction
          icon={<HomeIcon />}
          tooltipTitle="Home"
          onClick={() => history.push('/')}
        />
      </SpeedDial>
    </div>
  );
};

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
  },
  image: {
    flexGrow: 1,
    overflow: 'hidden',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  imageShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  speedDialShifted: {
    right: theme.spacing(2) + drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContent: {
    padding: theme.spacing(3),
  },
  inputs: {
    '& > div': {
      margin: theme.spacing(2, 0),
    },
  },
  dialogContent: {
    maxWidth: 600,
  },
  guesses: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(),
  },
  guess: {
    width: '100%',
    marginBottom: theme.spacing(),
  },
}));

export default Game;
