import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';

import { makeStyles, Theme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../../context';

import Crown from '../../img/crown.png';

const TopThree: FC = () => {
  const classes = useStyle();
  const [{ stats }] = useContext();
  const { history } = stats;

  const [topPlayers, setTopPlayers] = useState<any[] | null>(null);

  useEffect(() => {
    if (history) {
      const groupedRecords = history
        .filter(
          (record) =>
            record.momentDate.isAfter(
              moment().subtract(14, 'days').startOf('day'),
            ) && record.winner !== 'SKIPPED',
        )
        .reduce((acc, record) => {
          if (acc[record.winner]) {
            acc[record.winner]++;
          } else {
            acc[record.winner] = 1;
          }
          return acc;
        }, {});
      const topThree = Object.entries(groupedRecords)
        .map(([key, value]) => ({
          name: key,
          wins: value,
        }))
        .sort((a: any, b: any) => b.wins - a.wins)
        .slice(0, 3);
      setTopPlayers(topThree);
    }
  }, [history]);

  return (
    <div className={classes.root}>
      {topPlayers && (
        <>
          <Typography variant="h4">Top 3</Typography>
          <Typography variant="caption">Last 14 Days</Typography>
          <div className={classes.topThree}>
            {topPlayers[1] && (
              <Card className={classes.two}>
                <CardContent>
                  <Typography>{topPlayers[1].name}</Typography>
                  <Typography variant="caption">
                    {topPlayers[1].wins}{' '}
                    {topPlayers[1].wins === 1 ? 'win' : 'wins'}
                  </Typography>
                </CardContent>
              </Card>
            )}
            {topPlayers[0] && (
              <div className={classes.cardWrapper}>
                <Card className={classes.one}>
                  <CardContent>
                    <Typography>{topPlayers[0].name}</Typography>
                    <Typography variant="caption">
                      {topPlayers[0].wins}{' '}
                      {topPlayers[0].wins === 1 ? 'win' : 'wins'}
                    </Typography>
                  </CardContent>
                </Card>
                <img src={Crown} className={classes.crown} alt="Champion" />
              </div>
            )}
            {topPlayers[2] && (
              <Card className={classes.three}>
                <CardContent>
                  <Typography>{topPlayers[2].name}</Typography>
                  <Typography variant="caption">
                    {topPlayers[2].wins}{' '}
                    {topPlayers[2].wins === 1 ? 'win' : 'wins'}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topThree: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    '& > div': {
      margin: theme.spacing(2, 1),
      width: '33.3%',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      overflow: 'unset',
      '& p': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
  },
  cardWrapper: {
    position: 'relative',
  },
  one: {
    transform: 'scale(1.1)',
    color: 'yellow',
  },
  two: {},
  three: {},
  crown: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 0,
    left: 0,
    transform: 'translate(-50%, -50%) rotate(-35deg)',
  },
}));

export default TopThree;
