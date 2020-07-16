import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import PublicIcon from '@material-ui/icons/Public';
import ListIcon from '@material-ui/icons/List';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { useContext } from '../../context';
import TopThree from './TopThree';
import Spotlight from '../../img/spotlight.png';

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
          <Typography variant="h1" className={classes.title}>
            <small>INTO THE </small>
            <strong>SPOTLIGHT</strong>
          </Typography>
          <Typography variant="h4">
            <small>darkestmode</small>
          </Typography>
        </div>
      </div>
      <TopThree />
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
          to="/leaderboards"
          color="secondary"
          size="large"
          variant="contained"
          startIcon={<ListIcon />}
        >
          Leaderboards
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
    padding: theme.spacing(8),
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
    justifyContent: 'center',
    marginLeft: -150 / 2,
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    '& strong': {
      color: 'yellow',
    },
  },
  image: {
    width: 150,
    marginRight: theme.spacing(4),
  },
  title: {
    width: 'min-content',
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

export default Home;
