import React, { FC, useEffect, useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import HeartIcon from '@material-ui/icons/Favorite';
import LocationOffIcon from '@material-ui/icons/LocationOff';

import Crown from '../../img/crown.png';

import { useContext } from '../../context';
import IPlayer from './../../interfaces/IPlayer';

// TODO: Move into own component
interface StatCubeProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}
function StatBox(props: StatCubeProps) {
  const classes = useStyles();
  const { icon, children } = props;

  return (
    <div className={classes.stat}>
      {icon && <div className={classes.statIcon}>{icon}</div>}
      <div className={classes.statInner}>{children}</div>
    </div>
  );
}

interface IProps {}

const PlayerStats: FC<IProps> = () => {
  const classes = useStyles();
  const [{ game, stats }] = useContext();
  const { players } = game;
  const { history } = stats;

  const [favoriteGuesses, setFavoriteGuesses] = useState<any>([]);
  const [playerStats, setPlayerStats] = useState<any>([]);

  useEffect(() => {
    const groupedGuesses = history
      .map((record) => record.guesses)
      .reduce((acc, record) => {
        if (typeof record === 'object') {
          Object.entries(record).forEach(([key, value]) => {
            if (!acc[key]) {
              acc[key] = {};
            }
            if (!acc[key][value]) {
              acc[key][value] = 1;
            } else {
              acc[key][value]++;
            }
          });
        }
        return acc;
      }, {} as any);
    Object.keys(groupedGuesses).forEach((key) => {
      groupedGuesses[key] = Object.entries(groupedGuesses[key])
        .map(([key, value]) => ({
          guess: key,
          count: value,
        }))
        .sort((a: any, b: any) => b.count - a.count);
    });
    setFavoriteGuesses(groupedGuesses);
  }, [history]);

  useEffect(() => {
    const getWinRateForPlayer = (wins: number, total: number) => {
      const avg =
        wins && total ? Math.round(100 * (Number(wins) / Number(total))) : 0;
      return `${avg}%`;
    };

    const getFavoriteGuessForPlayer = (player: IPlayer) => {
      const playerGuesses = favoriteGuesses[player.name];
      if (playerGuesses && playerGuesses[0]) {
        return playerGuesses[0];
      }
      return '';
    };

    const playerStats = players.map((player) => {
      return {
        ...player,
        winRate: getWinRateForPlayer(player.wins, player.gamesPlayed),
        favoriteGuess: getFavoriteGuessForPlayer(player),
      };
    });
    setPlayerStats(playerStats);
  }, [players, favoriteGuesses]);

  return (
    <div className={classes.root}>
      <div className={['styled-scrollbar', classes.players].join(' ')}>
        {playerStats
          .sort((a: any, b: any) => b.wins - a.wins)
          .map((player: any, index: number) => (
            <Card className={classes.card} key={player.name}>
              <CardContent className={classes.cardContent}>
                <Grid container spacing={0}>
                  <Grid item className={classes.position}>
                    <Typography variant="h4">{index + 1}</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    sm={11}
                    md={3}
                    lg={2}
                    className={classes.info}
                  >
                    <Typography
                      variant="h6"
                      className={player.active ? '' : classes.inactive}
                    >
                      {player.name} {!player.active && <LocationOffIcon />}
                    </Typography>
                  </Grid>
                  <Grid item className={classes.stats}>
                    <StatBox icon={<img src={Crown} alt={'Crown Icon'} />}>
                      <Typography>
                        <strong>{player.wins}</strong>{' '}
                        <small>{player.wins === 1 ? 'win' : 'wins'}</small>
                      </Typography>
                      <Typography variant="caption">
                        {player.winRate} <small>win rate</small>
                      </Typography>
                    </StatBox>
                    {player.favoriteGuess && (
                      <StatBox
                        icon={
                          <HeartIcon className={classes.heartIcon}></HeartIcon>
                        }
                      >
                        <Typography variant="caption">
                          Favorite guess is
                        </Typography>
                        <Typography>
                          <strong>{player.favoriteGuess.guess}</strong>{' '}
                          <small>
                            at {player.favoriteGuess.count} guess
                            {player.favoriteGuess.count === 1 ? '' : 'es'}
                          </small>
                        </Typography>
                      </StatBox>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  players: {
    overflow: 'auto',
    flexGrow: 1,
  },
  card: {
    display: 'flex',
    margin: theme.spacing(0, 1, 1, 1),
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
    alignSelf: 'center',
  },
  info: {
    alignSelf: 'center',
  },
  stats: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(),
    border: '4px solid #aaa',
    borderRadius: 25,
  },
  statIcon: {
    margin: theme.spacing(),
    width: 50,
    '& img': {
      width: 50,
    },
    '& svg': {
      fontSize: 50,
    },
  },
  statInner: {
    padding: theme.spacing(),
  },
  heartIcon: {
    color: 'red',
  },
  inactive: {
    color: '#aaa',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginLeft: theme.spacing(),
    },
  },
}));

export default PlayerStats;
