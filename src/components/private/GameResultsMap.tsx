import React, { FC, useState } from 'react';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';

import { makeStyles, Theme, fade } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../../context';
import IGameResults from './../../interfaces/IGameResults';

const GEO_URL =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

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
      <div className={classes.map}>
        <ComposableMap>
          <ZoomableGroup zoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} />
                ))
              }
            </Geographies>
            {history
              .filter(
                (gameResult) =>
                  gameResult.lat !== undefined &&
                  gameResult.lat !== null &&
                  gameResult.lng !== undefined &&
                  gameResult.lng !== null,
              )
              .map((gameResult) => (
                <Marker
                  key={gameResult.imageSource + gameResult.date}
                  coordinates={[
                    gameResult.lng as number,
                    gameResult.lat as number,
                  ]}
                  className={gameResult === selectedMarker ? 'active' : ''}
                  onClick={(event) => selectMarker(event, gameResult)}
                >
                  <circle r={3} />
                </Marker>
              ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
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
    '& .rsm-geography': {
      fill: '#333',
      stroke: '#555',
    },
    '& .rsm-marker': {
      '&.active': {
        stroke: 'rgba(61, 227, 105, 0.5)',
        '& circle': {
          fill: 'transparent',
        },
      },
      '& circle': {
        fill: 'rgba(61, 227, 105, 0.5)',
      },
    },
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
  },
}));

export default GameResultsMap;
