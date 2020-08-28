import React, { FC, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import HomeIcon from '@material-ui/icons/Home';

import { useContext } from '../../context';
import IGameResults from '../../interfaces/IGameResults';
import Confetti from '../../utils/Confetti';

const GameResults: FC = () => {
  const params: any = useParams();
  const { url } = params;
  const classes = useStyles();
  const [{ isLoaded, stats }] = useContext();
  const { history } = stats;
  const [record, setRecord] = useState<IGameResults | undefined>(undefined);
  const [recordNotFound, setRecordNotFound] = useState(false);

  useEffect(() => {
    let confetti = new Confetti();

    if (url && isLoaded) {
      const record = history.find(
        (record) => record.imageSource === decodeURIComponent(url),
      );
      if (record) {
        setRecord(record);
        setRecordNotFound(false);
        if (record.winner === 'No one') {
          confetti.startConfetti(undefined, undefined, undefined, '💩');
        } else {
          confetti.startConfetti();
        }
        setTimeout(() => confetti.stopConfetti(), 3000);
      } else {
        setRecordNotFound(true);
      }
    }

    return () => {
      if (confetti) {
        confetti.stopConfetti();
      }
    };
  }, [isLoaded, url, history]);

  if (recordNotFound) {
    return <div>Cannot find record.</div>;
  }

  if (!record) {
    return <div>Loading . . .</div>;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h2">Congratulations {record.winner}!</Typography>
      <Typography variant="h3">You are the winner!!!</Typography>
      <Divider />
      <Card className={classes.card}>
        <CardHeader title={record.location} />
        <CardMedia
          className={classes.media}
          image={record.imageSource}
          title={record.location}
        >
          {record?.location}
        </CardMedia>
      </Card>
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
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  card: {
    margin: theme.spacing(4),
  },
}));

export default GameResults;
