import React, { FC, useState, useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import moment from 'moment';
import firebase from '../../firebase';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';

import Alert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import WeekendIcon from '@material-ui/icons/Weekend';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { useContext } from '../../context';
import IGameResultsDb from '../../interfaces/IGameResultsDb';
import Map from '../../img/map.png';

const Game: FC = () => {
  const params: any = useParams();
  const { url } = params;
  const classes = useStyles();
  const history = useHistory();

  const [
    { auth, game },
    { setImageWithUrl, skipImage, addGameToHistory, getNewImage },
  ] = useContext();
  const { userId } = auth;
  const { hints, image, players } = game;

  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [declareWinnerDialogOpen, setDeclareWinnerDialogOpen] = React.useState(
    false,
  );
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [skipImageOnDialogClose, setSkipImageOnDialogClose] = useState(false);
  const [error, setError] = useState('');
  const [guesses, setGuesses] = useState({});

  useEffect(() => {
    if (!image && url) {
      setImageWithUrl(decodeURIComponent(url));
    }
    if (image && url && image.source !== decodeURIComponent(url)) {
      history.push(encodeURIComponent(image.source));
    }
  }, [url, image, history, setImageWithUrl]);

  const handleSkipClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setSkipDialogOpen(true);
  };

  const handleSkipDialogClose = () => {
    if (skipImageOnDialogClose) {
      skipImage();
      setSkipImageOnDialogClose(false);
    }
    setSkipDialogOpen(false);
  };

  const submitGuesses = () => {
    if (
      Object.keys(guesses).filter((guess) => guess).length <
      players.filter((player) => player.playing).length - 1 // -1 for No one
    ) {
      setError('Every player must include a guess');
    } else {
      setDeclareWinnerDialogOpen(true);
    }
  };

  const setGoogleSrc = () => {
    return `https://www.google.com/maps/embed/v1/place?q=${image?.caption}&zoom=7&key=AIzaSyC1aEMKRB6A4_rZq8uwov5Q_uRkYy1TK0Q`;
  };

  const declareWinner = (winner: string) => {
    if (image) {
      const gamesDb = firebase.database().ref(userId + '/games');
      const newGame: IGameResultsDb = {
        location: image.caption,
        imageSource: image.source,
        date: new Date().toISOString(),
        winner,
        guesses,
        skipped: false,
      };
      gamesDb.push(newGame);

      players
        .filter((player) => player.playing)
        .forEach((player) => {
          const playerDb = firebase
            .database()
            .ref(userId + '/players/' + player._id);
          if (player.name === winner) {
            playerDb.update({
              wins: player.wins += 1,
              gamesPlayed: player.gamesPlayed += 1,
            });
          } else {
            playerDb.update({ gamesPlayed: player.gamesPlayed += 1 });
          }
        });
      addGameToHistory({ ...newGame, momentDate: moment(newGame.date) });
      getNewImage();
      history.push(`/game-results/${url}`);
    }
  };

  if (game.players.length === 0) {
    return <Redirect to={`/lobby/${url}`} />;
  }

  if (!image) {
    return <div>Loading, please wait . . .</div>;
  }

  return (
    <div className={classes.root}>
      {/* Image for the game */}
      <div
        className={[classes.image, drawerOpen ? classes.imageShift : ''].join(
          ' ',
        )}
        style={{
          background: `url(${image.source}) center / contain no-repeat`,
        }}
      />
      {/* Drawer used to fill in guesses */}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        classes={{
          paper: [classes.drawerPaper, 'styled-scrollbar'].join(' '),
        }}
      >
        <div className={classes.drawerContent}>
          <img src={Map} alt="Map" width="40" height="40" />
          <div className={classes.inputs}>
            {players
              .filter((player) => player.playing && player.name !== 'No one')
              .map((player) => (
                <Autocomplete
                  key={player.name}
                  id={player.name}
                  freeSolo
                  options={hints}
                  inputValue={guesses[player.name] || ''}
                  onInputChange={(_, newValue) =>
                    setGuesses({ ...guesses, [player.name]: newValue })
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
            startIcon={<CheckIcon />}
          >
            Submit
          </Button>
          {error && (
            <Alert severity="error" className={classes.alert}>
              {error}
            </Alert>
          )}
        </div>
      </Drawer>
      {/* Dialog used to declare the winner */}
      <Dialog
        onClose={() => setDeclareWinnerDialogOpen(false)}
        open={declareWinnerDialogOpen}
        classes={{
          paper: classes.dialogPaper,
        }}
      >
        <DialogTitle>{image.caption}</DialogTitle>
        <div className={classes.dialogContent}>
          <div className="styled-scrollbar">
            <div
              className={[classes.image, classes.drawerImage].join(' ')}
              style={{
                background: `url(${image.source}) center / contain no-repeat`,
              }}
            />
            <iframe
              title="google"
              width={'100%'}
              height="250"
              frameBorder="0"
              src={setGoogleSrc()}
              allowFullScreen
            ></iframe>
          </div>
          <div className={[classes.guesses, 'styled-scrollbar'].join(' ')}>
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
      {/* Dialog to skip the image */}
      <Dialog onClose={handleSkipDialogClose} open={skipDialogOpen}>
        <DialogTitle>
          {skipImageOnDialogClose
            ? image.caption
            : 'Are you sure you want to skip?'}
        </DialogTitle>
        <DialogActions>
          {!skipImageOnDialogClose && (
            <>
              <Button
                color="primary"
                variant="contained"
                onClick={() => setSkipImageOnDialogClose(true)}
                startIcon={<CheckIcon />}
              >
                Yes
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSkipDialogOpen(false)}
                startIcon={<ClearIcon />}
              >
                No
              </Button>
            </>
          )}
          {skipImageOnDialogClose && (
            <Button
              color="primary"
              variant="contained"
              onClick={handleSkipDialogClose}
              startIcon={<ClearIcon />}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/* Speed dial of actions */}
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        className={[
          'dial',
          classes.speedDial,
          drawerOpen ? classes.speedDialShifted : '',
        ].join(' ')}
        icon={
          <SpeedDialIcon
            openIcon={drawerOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          />
        }
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        onClick={() => setDrawerOpen(!drawerOpen)}
        open={speedDialOpen}
      >
        <SpeedDialAction
          icon={drawerOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          tooltipTitle={drawerOpen ? 'Hide Inputs' : 'Show Inputs'}
          onClick={() => setDrawerOpen(!drawerOpen)}
        />
        <SpeedDialAction
          icon={<SkipNextIcon />}
          tooltipTitle="Skip"
          onClick={handleSkipClick}
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
  drawerImage: {
    paddingTop: '56.25%', // 16:9
    width: '100%',
  },
  alert: {
    marginTop: theme.spacing(2),
  },
  inputs: {
    '& > div': {
      margin: theme.spacing(2, 0),
    },
  },
  dialogPaper: {
    width: '100%',
    maxWidth: 800,
  },
  dialogContent: {
    width: '100%',
    maxWidth: 800,
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
    '& > div': {
      width: '50%',
      position: 'relative',
      overflow: 'auto',
    },
  },
  guesses: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(),
  },
  guess: {
    width: '100%',
    marginBottom: theme.spacing(),
  },
}));

export default Game;
