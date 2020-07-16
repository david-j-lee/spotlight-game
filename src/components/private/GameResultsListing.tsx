import React, { FC, useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

import { useContext } from '../../context';

const WINNER_EMOJIS = ['🎉', '😊', '🥳', '🎊'];
const NO_ONE_EMOJIS = ['🤖', '💩', '🖥️', '👾', '💻'];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface IProps {}

const GameResultsListing: FC<IProps> = () => {
  const classes = useStyles();
  const [{ stats }] = useContext();
  const { history } = stats;

  const [dialogImageSource, setDialogImageSource] = useState<string | boolean>(
    false,
  );

  const handleClickOpen = (source: string) => {
    setDialogImageSource(source);
  };

  const handleClose = () => {
    setDialogImageSource(false);
  };

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2" className={classes.title}>
        Game Results <Typography variant="caption">Last 50 games</Typography>
      </Typography>
      <div className={['styled-scrollbar', classes.results].join(' ')}>
        {history &&
          history.slice(0, 50).map((record, i) => {
            let emoji = '';
            if (record.winner === 'No one') {
              emoji =
                NO_ONE_EMOJIS[Math.floor(Math.random() * NO_ONE_EMOJIS.length)];
            } else if (record.winner !== 'SKIPPED') {
              emoji =
                WINNER_EMOJIS[Math.floor(Math.random() * WINNER_EMOJIS.length)];
            }
            return (
              <div key={`${record.imageSource}-${i}`}>
                <Card
                  className={[
                    classes.card,
                    record.winner === 'SKIPPED' ? classes.skipped : '',
                  ].join(' ')}
                >
                  {record.imageSource && (
                    <CardMedia
                      className={classes.media}
                      image={record.imageSource}
                      title={record.location}
                      onClick={() => handleClickOpen(record.imageSource)}
                    />
                  )}
                  <CardContent className={classes.cardContent}>
                    <Typography variant="caption">
                      {record.momentDate.format('ddd, MMMM D, YYYY h:mm A')}
                    </Typography>
                    <Typography variant="body1">{record.location}</Typography>
                    <div className={classes.link}>
                      {record.imageSource && (
                        <Link
                          href={record.imageSource}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {record.imageSource}
                        </Link>
                      )}
                    </div>
                    <Divider className={classes.divider} />
                    {record.guesses &&
                      Object.entries(record.guesses).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key} - ${value}`}
                          size="small"
                          variant={
                            key === record.winner ? 'default' : 'outlined'
                          }
                          className={classes.chip}
                        />
                      ))}
                    <Typography
                      variant="h4"
                      color={
                        record.winner === 'No one' ? 'error' : 'textPrimary'
                      }
                    >
                      {emoji}
                      {record.winner}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            );
          })}
      </div>
      <Dialog
        fullScreen
        open={Boolean(dialogImageSource)}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div
          style={{
            background: `#000 url(${dialogImageSource}) center / contain no-repeat`,
          }}
          className={classes.dialogImage}
        ></div>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {},
  results: {
    overflow: 'auto',
    flexGrow: 1,
  },
  card: {
    display: 'flex',
    marginBottom: theme.spacing(),
  },
  cardContent: {
    overflow: 'hidden',
  },
  media: {
    width: '30%',
    flexShrink: 0,
    cursor: 'pointer',
  },
  link: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  chip: {
    margin: theme.spacing(0, 1, 1, 0),
  },
  appBar: {
    position: 'relative',
  },
  dialogImage: {
    height: '100%',
    width: '100%',
  },
  skipped: {
    opacity: 0.4,
  },
}));

export default GameResultsListing;
