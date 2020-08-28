import React, { FC, useEffect, useState } from 'react';

import { makeStyles, Theme, fade } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../../context';

const LastThreeWinners: FC = () => {
  const classes = useStyle();
  const [{ stats }] = useContext();
  const { history } = stats;

  const [lastThreeGamesWon, setLastThreeGamesWon] = useState<any[]>([]);

  useEffect(() => {
    if (history) {
      setLastThreeGamesWon(
        history.filter((game) => game.winner !== 'SKIPPED').slice(0, 3),
      );
    }
  }, [history]);

  return (
    <div className={classes.root}>
      <Typography variant="body1">Last 3 Winners</Typography>
      <div className={[classes.cards, 'styled-scrollbar'].join(' ')}>
        {lastThreeGamesWon.map((record) => (
          <Card key={record.imageSource} className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography>
                <small>{record.momentDate.format('ddd, M/D')}</small>
              </Typography>
              <Typography variant="body1">
                <strong>{record.winner}</strong>
              </Typography>
              <Link
                variant="caption"
                href={record.imageSource}
                target="_blank"
                rel="noreferrer"
              >
                {record.location}
              </Link>
            </CardContent>
            <div
              className={classes.image}
              style={{
                background: `url(${record.imageSource}) center / cover no-repeat`,
              }}
            ></div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  card: {
    width: 300,
    maxWidth: 300,
    flexShrink: 0,
    marginBottom: theme.spacing(),
    position: 'relative',
    background: 'transparent',
  },
  cardContent: {
    width: 300,
    paddingTop: `${theme.spacing()}px !important`,
    paddingBottom: `${theme.spacing()}px !important`,
    backgroundColor: fade(theme.palette.background.paper, 0.8),
    '& p': {
      background: `linear-gradient(180deg, rgba(255,255,255,0) 50%, ${theme.palette.primary.dark} 50%)`,
      display: 'inline',
      marginRight: theme.spacing(),
    },
    '& a': {
      color: theme.palette.text.primary,
    },
  },
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
}));

export default LastThreeWinners;
