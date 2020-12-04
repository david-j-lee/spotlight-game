import React, { FC, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import HomeIcon from '@material-ui/icons/Home';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import { useContext } from '../../context';
import IGameResults from '../../interfaces/IGameResults';
import Confetti from '../../utils/Confetti';
import { getImageSource } from '../../utils/utils';

const GameResults: FC = () => {
  const params: any = useParams();
  const { url } = params;
  const classes = useStyles();
  const [{ isLoaded, stats }] = useContext();
  const { history } = stats;
  const [record, setRecord] = useState<IGameResults | undefined>(undefined);
  const [recordNotFound, setRecordNotFound] = useState(false);

  const handleImageClick = () => {
    if (record) {
      window.open(getImageSource(record.imageSource));
    }
  };

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
    return <div className={classes.fullScreenText}>Cannot find record.</div>;
  }

  if (!record) {
    return <div className={classes.fullScreenText}>Loading . . .</div>;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h2">Congratulations {record.winner}!</Typography>
      <Typography variant="h3">You are the winner!!!</Typography>
      <Divider />
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          title={
            <Link
              href={getImageSource(record.imageSource)}
              target="_blank"
              rel="noreferrer"
            >
              {record.location} <OpenInNewIcon />
            </Link>
          }
        />
        <CardMedia
          className={classes.media}
          image={getImageSource(record.imageSource)}
          onClick={handleImageClick}
          title={record.location}
        ></CardMedia>
      </Card>
      <Button
        color="primary"
        variant="contained"
        size="large"
        startIcon={<HomeIcon />}
        component={RouterLink}
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
  fullScreenText: {
    fontSize: '3rem',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    cursor: 'pointer',
  },
  card: {
    margin: theme.spacing(4),
  },
  cardHeader: {
    '& a': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.text.primary,
      '& svg': {
        marginLeft: theme.spacing(),
      },
    },
  },
}));

export default GameResults;
