import React, { FC, useState, useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import moment from 'moment';
import firebase from '../../firebase';
import GoogleMapReact from 'google-map-react';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Alert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import HomeIcon from '@material-ui/icons/Home';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import WeekendIcon from '@material-ui/icons/Weekend';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PinIcon from '@material-ui/icons/LocationOn';
import ImageIcon from '@material-ui/icons/Image'

import { useContext } from '../../context';
import IGameResultsDb from '../../interfaces/IGameResultsDb';
import Map from '../../img/map.png';

import { KEY, OPTIONS } from '../../utils/googlemaps';
import { isEmpty } from './../../utils/utils';

// TODO: Move into own file
interface IMapMarker {
  lat: number;
  lng: number;
}
const MapMarker: FC<IMapMarker> = () => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      <PinIcon color="secondary" />
    </div>
  );
};

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
  const [skipDialogResultOpen, setSkipDialogResultOpen] = useState(false);
  const [
    skipOnDeclareWinnerDialogClose,
    setSkipOnDeclareWinnerDialogClose,
  ] = useState(false);
  const [error, setError] = useState('');
  const [guesses, setGuesses] = useState<any>({});
  const [geolocation, setGeolocation] = useState<any>({});

  useEffect(() => {
    if (!image && url) {
      setImageWithUrl(decodeURIComponent(url));
    }
  }, [url, image, setImageWithUrl]);

  useEffect(() => {
    if (image && url && image.source !== decodeURIComponent(url)) {
      history.push(encodeURIComponent(image.source));
    }
  }, [url, image, history]);

  useEffect(() => {
    if (isEmpty(image?.lat) && isEmpty(image?.lng)) {
      setGeolocation({ hasLatLng: false });
    } else {
      setGeolocation({
        hasLatLng: true,
        lat: image?.lat,
        lng: image?.lng,
      });
    }
  }, [image]);

  const handleSkipImage = () => {
    const skippedGame: IGameResultsDb = {
      location: image?.caption || '',
      imageSource: image?.source || '',
      date: new Date().toISOString(),
      winner: 'SKIPPED',
      guesses: guesses || {},
      skipped: true,
    };
    if (geolocation.hasLatLng) {
      skippedGame.lat = geolocation.lat;
      skippedGame.lng = geolocation.lng;
    }
    skipImage(skippedGame);
  };

  const handleSkipClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setSkipDialogOpen(true);
  };

  const handleSkipDialogClick = () => {
    setSkipDialogOpen(false);
    setSkipDialogResultOpen(true);
  };

  const handleOnSkipDialogResultExited = () => {
    setSkipDialogResultOpen(false);
    handleSkipImage();
  };

  const handleSkipDeclareWinnerDialogClick = () => {
    setSkipOnDeclareWinnerDialogClose(true);
    setDeclareWinnerDialogOpen(false);
  };

  const handleOnDeclareWinnerDialogExited = () => {
    if (skipOnDeclareWinnerDialogClose) {
      setSkipOnDeclareWinnerDialogClose(false);
      handleSkipImage();
      setGuesses({});
    }
  };

  const handleOnMapClick = ({ lat, lng }: any) => {
    setGeolocation({ ...geolocation, hasLatLng: true, lat, lng });
  };

  const handleClearMapSelection = () => {
    setGeolocation({
      hasLatLng: false,
      lat: geolocation.lat,
      lng: geolocation.lng,
    });
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
      if (geolocation.hasLatLng) {
        newGame.lat = geolocation.lat;
        newGame.lng = geolocation.lng;
      }
      gamesDb.push(newGame); // TODO: Need to set id on this object

      players
        .filter((player) => player.playing)
        .forEach((player) => {
          const playerDb = firebase
            .database()
            .ref(userId + '/players/' + player._id);
          if (player.name === winner) {
            playerDb.update({
              wins: (player.wins += 1),
              gamesPlayed: (player.gamesPlayed += 1),
            });
          } else {
            playerDb.update({ gamesPlayed: (player.gamesPlayed += 1) });
          }
        });
      addGameToHistory({ ...newGame, momentDate: moment(newGame.date) });
      getNewImage();
      history.push(`/game-results/${url}`);
    }
  };

  const map = () => (
    <div>
      <div className={classes.map}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: KEY }}
          options={{ ...OPTIONS, minZoom: 2 }}
          hoverDistance={0}
          center={{
            lat: geolocation.lat ?? 37.09024,
            lng: geolocation.lng ?? -95.712891,
          }}
          defaultZoom={4}
          onClick={handleOnMapClick}
        >
          {geolocation.hasLatLng && (
            <MapMarker lat={geolocation.lat} lng={geolocation.lng} />
          )}
        </GoogleMapReact>
      </div>
      <Typography variant="caption">
        <small>
          {geolocation.hasLatLng
            ? `${geolocation.lat},${geolocation.lng}`
            : '?,?'}
        </small>
      </Typography>
      {geolocation.hasLatLng && (
        <IconButton
          aria-label="deselect location on map"
          onClick={handleClearMapSelection}
          className={classes.clearMapSelection}
          size="small"
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      )}
    </div>
  );

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
        onExited={handleOnDeclareWinnerDialogExited}
        open={declareWinnerDialogOpen}
        classes={{ paper: classes.dialogPaper }}
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
            {map()}
          </div>
          <div className={[classes.guesses, 'styled-scrollbar'].join(' ')}>
            <div className={classes.players}>
              {players
                .filter((player) => player.playing && player.name !== 'No one')
                .sort((a, b) =>
                  guesses[a.name]
                    ? guesses[a.name].localeCompare(guesses[b.name])
                    : undefined,
                )
                .map((player) => (
                  <Button
                    key={player.name}
                    variant="contained"
                    className={classes.guess}
                    onClick={() => declareWinner(player.name)}
                  >
                    {guesses[player.name] ? guesses[player.name] + ' - ' : ''}
                    {player.name}
                  </Button>
                ))}
            </div>
            <div className={classes.actions}>
              <Button
                variant="outlined"
                onClick={() => declareWinner('No one')}
              >
                <span role="img" aria-label="The robots have won">
                  💩
                </span>{' '}
                No one
              </Button>
              <Button
                variant="outlined"
                onClick={handleSkipDeclareWinnerDialogClick}
                startIcon={<SkipNextIcon />}
              >
                Skip
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      {/* Dialog to skip the image */}
      <Dialog open={skipDialogOpen}>
        <DialogTitle>'Are you sure you want to skip?'</DialogTitle>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSkipDialogClick}
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
        </DialogActions>
      </Dialog>
      <Dialog
        open={skipDialogResultOpen}
        onExited={handleOnSkipDialogResultExited}
      >
        <DialogTitle>{image.caption}</DialogTitle>
        {map()}
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setSkipDialogResultOpen(false)}
            startIcon={<ImageIcon />}
          >
            NEXT PICTURE
          </Button>
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
    padding: theme.spacing(0, 1, 1, 1),
  },
  players: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    '& > button': {
      width: '100%',
      marginTop: theme.spacing(),
    },
  },
  guess: {
    width: '100%',
    marginBottom: theme.spacing(),
  },
  geolocationLoading: {
    padding: theme.spacing(8, 4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: 250,
  },
  clearMapSelection: {
    fontSize: 10,
  },
}));

export default Game;
