import React, { FC, useEffect, useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { useContext } from './../../context';

const WinningStats: FC = () => {
  const classes = useStyles();
  const [{ stats }] = useContext();
  const { history } = stats;

  const [winningLocations, setWinningLocations] = useState<any[]>([]);
  const [favoriteGuesses, setFavoriteGuesses] = useState<any[]>([]);

  useEffect(() => {
    const groupedCounts = history
      .filter((record) => record.guesses)
      .map((record) => record.guesses[record.winner])
      .filter((record) => record)
      .reduce((acc: object, record: string) => {
        if (acc[record]) {
          acc[record].count++;
        } else {
          acc[record] = { value: record, count: 1 };
        }
        return acc;
      }, {});
    const winningLocations = Object.values(groupedCounts).sort(
      (a: any, b: any) => b.count - a.count,
    );
    setWinningLocations(winningLocations);
  }, [history]);

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
    const favoriteGuesses = Object.entries(groupedGuesses).map(
      ([key, value]: [any, any]) => ({
        user: key,
        guesses: Object.entries(value)
          .map(([x, y]) => ({
            guess: x,
            count: y,
          }))
          .sort((a: any, b: any) => b.count - a.count),
      }),
    );
    setFavoriteGuesses(favoriteGuesses);
  }, [history]);

  return (
    <div className={classes.root}>
      <div className={classes.sectionLeft}>
        <Typography variant="subtitle2">Top 15 Winning Locations</Typography>
        {winningLocations.length > 0 && (
          <div className={[classes.sectionBody, 'styled-scrollbar'].join(' ')}>
            <Paper>
              <List dense={true} className={classes.list}>
                {winningLocations.slice(0, 15).map((location) => (
                  <ListItem key={location.value} className={classes.listItem}>
                    <ListItemIcon className={classes.listItemIcon}>
                      {location.count}
                    </ListItemIcon>
                    <ListItemText primary={location.value} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </div>
        )}
      </div>
      <div className={classes.sectionRight}>
        <Typography variant="subtitle2">Favorite Guesses</Typography>
        {favoriteGuesses.length > 0 && (
          <div className={[classes.sectionBody, 'styled-scrollbar'].join(' ')}>
            <Paper>
              <List dense={true} className={classes.list}>
                {favoriteGuesses.map((userGuesses) => {
                  const topGuess = userGuesses.guesses[0];
                  const secondaryText = topGuess
                    ? `Guessed ${topGuess.guess} ${topGuess.count} time${
                        topGuess.count === 1 ? '' : 's'
                      }`
                    : '';
                  return (
                    <ListItem
                      key={userGuesses.user}
                      className={classes.listItem}
                    >
                      <ListItemText
                        primary={userGuesses.user}
                        secondary={secondaryText}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
  },
  sectionLeft: {
    height: '100%',
    overflow: 'hidden',
    width: '49%',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionRight: {
    height: '100%',
    overflow: 'hidden',
    width: '49%',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionBody: {
    flexGrow: 1,
    overflow: 'auto',
  },
  list: {},
  listItem: {},
  listItemIcon: {
    minWidth: 35,
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(2.5),
  },
}));

export default WinningStats;
