import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import PublicIcon from '@material-ui/icons/Public';
import ListIcon from '@material-ui/icons/List';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { useContext } from '../../context';
import LastThreeWinners from './LastThreeWinners';
import TopThree from './TopThree';
import Spotlight from '../../img/spotlight.png';
import HomeMap from './HomeMap';

interface IProps {}

const Home: FC<IProps> = () => {
  const classes = useStyles();

  const [{ auth }, { logoff }] = useContext();
  const { email } = auth;

  return (
    <div className={[classes.root, 'styled-scrollbar'].join(' ')}>
      <Typography color="textSecondary" className={classes.email}>
        {email}
      </Typography>
      <div className={classes.header}>
        <div>
          <img src={Spotlight} alt="logo" className={classes.image} />
        </div>
        <div>
          <Typography variant="h2" className={classes.title}>
            <small>INTO THE </small>
            <strong>SPOTLIGHT</strong>
          </Typography>
          <Typography variant="h4">
            <small>darkestmode</small>
          </Typography>
        </div>
      </div>
      <div className={classes.body}>
        <div className={classes.buttons}>
          <Button
            component={Link}
            to="/lobby"
            color="primary"
            size="large"
            variant="contained"
            startIcon={<PublicIcon />}
          >
            Play
          </Button>
          <Button
            component={Link}
            to="/stats"
            color="secondary"
            size="large"
            variant="contained"
            startIcon={<ListIcon />}
          >
            Stats
          </Button>
          <Button
            onClick={logoff}
            color="secondary"
            variant="outlined"
            startIcon={<ExitToAppIcon />}
          >
            Quit
          </Button>
        </div>
        <div className={[classes.stats, 'styled-scrollbar'].join(' ')}>
          <TopThree />
          <LastThreeWinners />
        </div>
      </div>
      <div className={classes.map}>
        <HomeMap />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    overflow: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(8, 16),
    position: 'relative',
  },
  email: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: theme.spacing(),
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: 50,
    marginLeft: -150 / 2,
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    '& strong': {
      color: 'yellow',
    },
  },
  body: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  image: {
    width: 150,
    marginRight: theme.spacing(4),
  },
  title: {
    width: 'min-content',
  },
  buttons: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(4),
    minWidth: 300,
    '& > *': {
      marginBottom: theme.spacing(2),
      maxWidth: 300,
      width: '100%',
    },
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflowX: 'auto',
    overflowY: 'hidden',
    '& > div': {
      flexShrink: 0,
    },
  },
  map: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -10,
  },
}));

export default Home;
