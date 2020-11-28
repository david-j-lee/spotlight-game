import React, { FC, useState, useRef, useEffect, useMemo } from 'react';

import { makeStyles, Theme } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import LinkIcon from '@material-ui/icons/Link';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import { useContext } from '../../context';

const WINNER_EMOJIS = ['🎉', '😊', '🥳', '🎊'];
const NO_ONE_EMOJIS = ['🤖', '💩', '🖥️', '👾', '💻'];
const PAGE_SIZE = 36;
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface IProps {}

const GameResultsGrid: FC<IProps> = () => {
  const classes = useStyles();
  const [{ stats }] = useContext();
  const { history } = stats;

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredListing, setFilteredListing] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const searchTimer = useRef<any>(null);
  const [dialogImageSource, setDialogImageSource] = useState<string | boolean>(
    false,
  );

  const listing = useMemo(
    () => filteredListing.slice(0, PAGE_SIZE * currentPage),
    [filteredListing, currentPage],
  );

  const maxPage = useMemo(() => Math.ceil(filteredListing.length / PAGE_SIZE), [
    filteredListing.length,
  ]);

  const memoListing = useMemo(
    () =>
      listing.map((record, i) => {
        let emoji = '';
        if (record.winner === 'No one') {
          emoji =
            NO_ONE_EMOJIS[Math.floor(Math.random() * NO_ONE_EMOJIS.length)];
        } else if (record.winner !== 'SKIPPED') {
          emoji =
            WINNER_EMOJIS[Math.floor(Math.random() * WINNER_EMOJIS.length)];
        }
        return (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={`${record.imageSource}-${i}`}
          >
            <Card
              className={[
                classes.card,
                record.winner === 'SKIPPED' ? classes.skipped : '',
              ].join(' ')}
            >
              {record.imageSource && (
                <>
                  <CardMedia
                    className={classes.media}
                    image={record.imageSource}
                    title={record.location}
                  />
                  <div className={'card-media-info'}>
                    <Typography
                      variant="body1"
                      className={classes.cardMediaDate}
                    >
                      {record.momentDate.format('M/D')}
                    </Typography>
                    <Typography
                      variant="body1"
                      className={classes.cardMediaWinner}
                    >
                      {emoji} {record.winner}
                    </Typography>
                    <Typography
                      variant="caption"
                      className={classes.cardMediaLocation}
                    >
                      {record.location}
                    </Typography>
                  </div>
                </>
              )}
              <CardContent
                className={[classes.cardContent, 'card-content'].join(' ')}
                onClick={() => handleClickOpen(record.imageSource)}
              >
                <div>
                  <Typography variant="caption">
                    {record.momentDate.format('ddd, MMMM D, YYYY h:mm A')}
                  </Typography>
                </div>
                <Typography
                  variant="body1"
                  component={Link}
                  href={record.imageSource}
                >
                  {record.location} <LinkIcon />
                </Typography>
                <Divider className={classes.divider} />
                {record.guesses &&
                  Object.entries(record.guesses).map(([key, value]) => (
                    <Chip
                      key={key}
                      label={`${key} - ${value}`}
                      size="small"
                      variant={key === record.winner ? 'default' : 'outlined'}
                      className={classes.chip}
                    />
                  ))}
                <div>
                  <Typography variant="caption">
                    <small>
                      {record.lat ?? '?'}, {record.lng ?? '?'}
                    </small>
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        );
      }),
    [listing, classes],
  );

  const handleClickOpen = (source: string) => {
    setDialogImageSource(source);
  };

  const handleClose = () => {
    setDialogImageSource(false);
  };

  const handleSearchInputChange = (event: any) => {
    const newSearchValue = event.target.value;
    setSearch(newSearchValue);
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      if (newSearchValue) {
        const newSearchValueLower = newSearchValue.toLowerCase();
        setFilteredListing(
          history.filter((record) => {
            return (
              record.location.toLowerCase().includes(newSearchValueLower) ||
              record.winner.toLowerCase().includes(newSearchValueLower) ||
              record.date.includes(newSearchValueLower) ||
              `${record.lat},${record.lng}`.includes(newSearchValueLower) ||
              (record.guesses &&
                Object.values(record.guesses).find((value) =>
                  value.toLowerCase().includes(newSearchValueLower),
                ))
            );
          }),
        );
      } else {
        setFilteredListing(history);
      }
    }, 500);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
    if (history) {
      setFilteredListing(history);
    } else {
      setFilteredListing([]);
    }
  }, [history]);

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <TextField
          id="search-input"
          value={search}
          onChange={handleSearchInputChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={['styled-scrollbar', classes.results].join(' ')}>
        <Grid container spacing={1}>
          {memoListing}
          {currentPage < maxPage && (
            <Grid item xs={12} className={classes.viewMore}>
              <Button onClick={nextPage}>View More</Button>
            </Grid>
          )}
        </Grid>
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
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  search: {
    margin: theme.spacing(2, 'auto', 1, 'auto'),
    maxWidth: 800,
    width: '100%',
  },
  results: {
    overflowY: 'auto',
    padding: theme.spacing(),
  },
  card: {
    position: 'relative',
    '&:hover .card-media-info': {
      display: 'none',
    },
    '&:hover .card-content': {
      display: 'block',
    },
  },
  cardMediaWinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'rgba(0,0,0,0.8)',
    padding: theme.spacing(0.5),
  },
  cardMediaDate: {
    position: 'absolute',
    top: 0,
    right: 0,
    background: 'rgba(0,0,0,0.6)',
    padding: theme.spacing(0.5),
  },
  cardMediaLocation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.8)',
    padding: theme.spacing(0.5),
  },
  cardContent: {
    display: 'none',
    position: 'absolute',
    background: 'rgba(0,0,0,0.9)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    '& a': {
      color: theme.palette.text.primary,
      display: 'inline',
      '& svg': {
        fontSize: theme.typography.fontSize,
      },
    },
  },
  skipped: {
    opacity: 0.7,
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  chip: {
    margin: theme.spacing(0, 0.5, 0.5, 0),
  },
  media: {
    width: '100%',
    height: 250,
  },
  viewMore: {
    display: 'flex',
    justifyContent: 'center',
  },
  appBar: {
    position: 'relative',
  },
  dialogImage: {
    height: '100%',
    width: '100%',
  },
}));

export default GameResultsGrid;
