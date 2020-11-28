import React, { FC, useEffect, useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { useContext } from './../../context';

// TODO: This component has not been tested since being refactored

const FavoriteGuesses: FC = () => {
  const classes = useStyles();
  const [{ stats }] = useContext();
  const { history } = stats;

  const [favoriteGuesses, setFavoriteGuesses] = useState<any[]>([]);

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
    const favoriteGuesses = Object.entries(groupedGuesses)
      .map(([key, value]: [any, any]) => ({
        user: key,
        guesses: Object.entries(value)
          .map(([x, y]) => ({
            guess: x,
            count: y,
          }))
          .sort((a: any, b: any) => b.count - a.count),
      }))
      .sort((a, b) => a.user.localeCompare(b.user));
    setFavoriteGuesses(favoriteGuesses);
  }, [history]);

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2">Favorite Guesses</Typography>
      {favoriteGuesses.length > 0 && (
        <div className={[classes.content, 'styled-scrollbar'].join(' ')}>
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
                  <ListItem key={userGuesses.user} className={classes.listItem}>
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
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
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

export default FavoriteGuesses;
