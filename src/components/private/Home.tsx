import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import TopThree from './TopThree';

import Spotlight from '../../img/spotlight.png';

interface IProps {}

const Home: FC<IProps> = () => {
  const classes = useStyles();

  return (
    <div className={[classes.root, 'styled-scrollbar'].join(' ')}>
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
        >
          Play
        </Button>
        <Button
          component={Link}
          to="/leaderboards"
          color="secondary"
          variant="outlined"
        >
          Leaderboards
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
