import React, { FC, useEffect, useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { useContext } from './../../context';

const TopWinningLocations: FC = () => {
  const classes = useStyles();
  const [{ stats }] = useContext();
  const { history } = stats;

  const [winningLocations, setWinningLocations] = useState<any[]>([]);

  useEffect(() => {
    const groupedCounts = history
      .filter((record) => record.guesses)
      .map((record) => record.guesses[record.winner])
      .filter((record) => record)
      .reduce((acc: any, record: string) => {
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

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2">Top 15 Winning Locations</Typography>
      {winningLocations.length > 0 && (
        <div className={[classes.content, 'styled-scrollbar'].join(' ')}>
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
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
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

export default TopWinningLocations;
