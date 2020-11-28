import React, { FC } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import TopThree from './TopThree';
import PlayerStats from './PlayerStats';

interface IProps {}

const Leaderboards: FC<IProps> = () => {
  const classes = useStyles();

  return (
    <div className={['styled-scrollbar', classes.root].join(' ')}>
      <div className={classes.topThree}>
        <TopThree />
      </div>
      <PlayerStats />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
  },
  topThree: {
    margin: theme.spacing(2, 1),
  },
}));

export default Leaderboards;
