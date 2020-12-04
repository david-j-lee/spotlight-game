import React, { FC, useState } from 'react';
import firebase from 'firebase';

import { makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../../context';
import IGameResultsDb from '../../interfaces/IGameResultsDb';

import { data } from '../../data/contents.json';

interface IProps {}

const Admin: FC<IProps> = () => {
  const classes = useStyles();
  const [{ stats, auth }] = useContext();
  const { history } = stats;

  console.debug(history);
  console.debug(data.length);

  const [messages, setMessages] = useState<string[]>([]);

  const cleanUpImageSources = () => {
    const newMessages = [];
    newMessages.push('Cleaning up images sources for game history');
    history.forEach((record, index) => {
      const imageSourceUrlParts = record.imageSource.split('/');
      let imageSource = record.imageSource;
      if (imageSourceUrlParts.length > 1) {
        const fileName = imageSourceUrlParts[imageSourceUrlParts.length - 1];
        if (fileName.split('.').length > 1) {
          imageSource = fileName;
        }
      }
      const updatedRecord: IGameResultsDb = {
        lat: record.lat,
        lng: record.lng,
        date: record.date,
        guesses: record.guesses,
        imageSource,
        location: record.location,
        skipped: record.skipped,
        winner: record.winner,
      };
      Object.keys(updatedRecord).forEach(
        (key) =>
          (updatedRecord as any)[key] == null &&
          delete (updatedRecord as any)[key],
      );
      firebase
        .database()
        .ref(auth.userId + '/games/' + record.id)
        .set(updatedRecord);
      newMessages.push(
        `Updated ${record.id}: ${record.imageSource} -> ${imageSource}`,
      );
    });
    newMessages.push('Game history image sources has been cleaned');
    setMessages(newMessages);
  };

  const cleanUpData = () => {
    const newMessages = [
      JSON.stringify(
        data.map((item) => {
          const sourceSegments = item.source.split('/');
          if (sourceSegments.length > 1) {
            return {
              ...item,
              source: sourceSegments[sourceSegments.length - 1],
            };
          }
          return item;
        }),
      ),
    ];
    setMessages(newMessages);
  };

  const removeDupesFromData = () => {
    const noDupes = Object.values(
      data.reduce((acc: any, item) => {
        acc[item.id] = item;
        return acc;
      }, {}),
    );
    console.debug(noDupes.length);
    const newMessages = [JSON.stringify(noDupes)];
    setMessages(newMessages);
  };

  return (
    <div className={[classes.root, 'styled-scrollbar'].join(' ')}>
      <Typography>Admin</Typography>
      <div className={classes.buttons}>
        <Button onClick={cleanUpImageSources}>Clean Up Image Sources</Button>
        <Button onClick={cleanUpData}>Clean Up Data</Button>
        <Button onClick={removeDupesFromData}>Remove Dupes from Data</Button>
      </div>
      <div className={classes.messages}>
        {messages.map((message, index) => (
          <Typography key={index}>{message}</Typography>
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(),
    position: 'relative',
  },
  buttons: {
    display: 'flex',
  },
  messages: {
    overflow: 'auto',
  },
}));

export default Admin;
