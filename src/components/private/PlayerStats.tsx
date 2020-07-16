import React from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../../context';

const generateAverageWin = (wins, total) => {
  const avg =
    wins && total ? Math.round(100 * (Number(wins) / Number(total))) : 0;
  return `${avg} %`;
};

interface IProps {}

const PlayerStats = () => {
  const classes = useStyles();
  const [{ game }] = useContext();
  const { players } = game;

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2">Player Stats</Typography>
      <div className={['styled-scrollbar', classes.players].join(' ')}>
        {players
          .filter((player) => player.active)
          .sort((a, b) => b.wins - a.wins)
          .map((player, index) => (
            <Card className={classes.card} key={player.name}>
              <CardContent className={classes.cardContent}>
                <div className={classes.position}>
                  <Typography variant="h4">{index + 1}</Typography>
                </div>
                <div className={classes.info}>
                  <Typography variant="h6">{player.name}</Typography>
                  <Grid container spacing={0}>
                    <Grid item xs={6}>
                      <Typography>
                        <small>{player.wins === 1 ? 'Win' : 'Wins'}</small>{' '}
                        {player.wins}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        <small>Win rate</small>{' '}
                        {generateAverageWin(player.wins, player.gamesPlayed)}
                      </Typography>
                    </Grid>
                    {/* <Grid item xs={4}>
                      <Typography>
                        {player.streak > 0 && <span>{player.streak}</span>}
                      </Typography>
                    </Grid> */}
                  </Grid>
                </div>
                <Typography></Typography>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
  },
  players: {
    overflow: 'auto',
    flexGrow: 1,
  },
  card: {
    display: 'flex',
    marginBottom: theme.spacing(),
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(),
    width: '100%',
    '&:last-child': {
      paddingBottom: theme.spacing(),
    },
  },
  position: {
    margin: theme.spacing(0, 2, 0, 1),
  },
  info: {
    flexGrow: 1,
  },
}));

export default PlayerStats;
