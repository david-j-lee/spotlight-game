import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';

import TopThree from './TopThree';
import PlayerStats from './PlayerStats';
import GameResultsListing from './GameResultsListing';
import LocationStats from './LocationStats';

interface IProps {}

const Leaderboards: FC<IProps> = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <div className={[classes.leftRow, classes.leftRowNoShrink].join(' ')}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            component={Link}
            to="/"
          >
            Back to Home
          </Button>
        </div>
        <div className={[classes.leftRow, classes.leftRowNoShrink].join(' ')}>
          <TopThree />
        </div>
        <div className={classes.leftRow}>
          <LocationStats />
        </div>
        <div className={classes.leftRow}>
          <PlayerStats />
        </div>
      </div>
      <div className={classes.right}>
        <GameResultsListing />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    padding: theme.spacing(),
  },
  left: {
    width: '40%',
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  leftRow: {
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  leftRowNoShrink: {
    flexShrink: 0,
  },
  right: {
    width: '60%',
    padding: theme.spacing(),
  },
}));

export default Leaderboards;
