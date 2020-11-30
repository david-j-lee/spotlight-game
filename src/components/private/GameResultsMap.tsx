import React, { FC, useState } from 'react';
import GoogleMapReact from 'google-map-react';

import { makeStyles, Theme, fade } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../../context';
import IGameResults from './../../interfaces/IGameResults';

import TopWinningLocations from './TopWinningLocations';

import { KEY, OPTIONS } from '../../utils/googlemaps';
import { isEmpty } from '../../utils/utils';

// TODO: Move map into reuseable component, a lot of code is shared between this and HomeMap.tsx

// TODO: Move into own file
interface IMapMarker {
  onClick: any;
  lat: number;
  lng: number;
  className: string;
}
const MapMarker: FC<IMapMarker> = ({ onClick, className }) => {
  return (
    <div
      onClick={onClick}
      // TODO: Remove use of inline styling
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
        cursor: 'pointer',
      }}
      className={className}
    />
  );
};

interface IProps {}

const GameResultsMap: FC<IProps> = () => {
  const classes = useStyles();
  const [{ stats }] = useContext();
  const { history } = stats;

  const [markerPopover, setMarkerPopover] = useState<any | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<IGameResults | null>(
    null,
  );

  const selectMarker = (
    event: React.MouseEvent<any, MouseEvent>,
    gameResult: IGameResults,
  ) => {
    setSelectedMarker(gameResult);
    handleMarkerPopoverOpen(event);
  };

  const handleMarkerPopoverOpen = (
    event: React.MouseEvent<any, MouseEvent>,
  ) => {
    setMarkerPopover(event.currentTarget);
  };

  const handleMarkerPopoverClose = () => {
    setMarkerPopover(null);
    setSelectedMarker(null);
  };

  return (
    <div className={['styled-scrollbar', classes.root].join(' ')}>
      <Grid container className={classes.gridContainer}>
        <Grid item className={classes.gridItem} xs={12} md={9} lg={10}>
          <div className={classes.map}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: KEY }}
              center={{
                lat: 0,
                lng: 0,
              }}
              hoverDistance={0}
              defaultZoom={1}
              options={OPTIONS}
            >
              {history
                .filter(
                  (gameResult) =>
                    !isEmpty(gameResult.lat) && !isEmpty(gameResult.lng),
                )
                .map((gameResult) => (
                  <MapMarker
                    key={gameResult.imageSource + gameResult.date}
                    className={[
                      'marker',
                      gameResult.winner === 'No one'
                        ? 'no-one'
                        : gameResult.winner === 'SKIPPED'
                        ? 'skipped'
                        : 'someone',
                      gameResult === selectedMarker ? 'active' : '',
                    ].join(' ')}
                    lat={gameResult.lat as number}
                    lng={gameResult.lng as number}
                    onClick={(event: any) => selectMarker(event, gameResult)}
                  />
                ))}
            </GoogleMapReact>
          </div>
        </Grid>
        <Grid item className={classes.gridItem} xs={12} md={3} lg={2}>
          <TopWinningLocations />
        </Grid>
      </Grid>
      <Popover
        open={!!markerPopover}
        anchorEl={markerPopover}
        onClose={handleMarkerPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {selectedMarker && (
          <Card
            key={selectedMarker.imageSource + selectedMarker.date}
            className={classes.card}
          >
            <CardMedia
              className={classes.image}
              image={selectedMarker.imageSource}
              title={selectedMarker.location}
            />
            <CardContent className={classes.cardContent}>
              <Typography>
                <small>{selectedMarker.momentDate.format('ddd, M/D')}</small>
              </Typography>
              <Typography variant="body1">
                <strong>{selectedMarker.winner}</strong>
              </Typography>
              <Typography variant="caption">
                {selectedMarker.location}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Popover>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    overflow: 'hidden',
    '& .marker': {
      width: 15,
      height: 15,
      borderRadius: '100%',
      '&.skipped': {
        background: 'rgba(0, 0, 0, 0.5)',
      },
      '&.someone': {
        background: 'rgba(61, 227, 105, 0.5)',
      },
      '&.no-one': {
        background: 'rgba(209, 35, 0, 0.5)',
      },
      '&.active': {
        border: '3px solid rgba(232, 205, 0, 0.9)',
      },
    },
  },
  gridContainer: {
    height: '100%',
  },
  gridItem: {
    height: '100%',
    overflowY: 'hidden',
  },
  map: {
    background: '#111',
    width: '100%',
    height: '100%',
    overflowY: 'hidden',
  },
  card: {
    width: 300,
    maxWidth: 300,
    flexShrink: 0,
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
    height: 140,
    background: 'black',
    backgroundSize: 'cover',
  },
}));

export default GameResultsMap;
