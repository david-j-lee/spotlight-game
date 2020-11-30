import React, { FC, useState, useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';

import { makeStyles, Theme, fade } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import { useContext } from '../../context';
import { KEY, OPTIONS } from '../../utils/googlemaps';
import { isEmpty } from '../../utils/utils';
import IGameResults from '../../interfaces/IGameResults';

// TODO: Move into own file
interface IMapMarker {
  lat: number;
  lng: number;
  className: string;
}
const MapMarker: FC<IMapMarker> = ({ className }) => (
  <div
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

const SelectedMapMarker = React.forwardRef<HTMLDivElement, any>(
  ({ onLoad, ...props }, ref) => {
    useEffect(() => {
      if (onLoad) {
        onLoad();
      }
    }, [onLoad]);
    return (
      <div ref={ref}>
        <MapMarker {...props} />
      </div>
    );
  },
);

interface IProps {}

const GameResultsMap: FC<IProps> = () => {
  const classes = useStyles();
  const [{ stats }] = useContext();
  const { history } = stats;

  const [popoverAnchor, setPopoverAnchor] = useState<any | null>(null);
  const [marker, setMarker] = useState<IGameResults | null>(null);
  const markerRef = useRef<any>();

  useEffect(() => {
    const items = history.filter(
      (item) => !isEmpty(item.lat) && !isEmpty(item.lng),
    );
    if (items && items.length > 0) {
      setMarker(items[Math.floor(Math.random() * items.length)]);
    }
  }, [history]);

  return (
    <div className={['styled-scrollbar', classes.root].join(' ')}>
      <div className={classes.overlay} />
      {marker && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: KEY }}
          defaultZoom={7}
          hoverDistance={0}
          center={{
            lat: marker?.lat ?? 0,
            lng: marker?.lng ?? 0,
          }}
          options={{ ...OPTIONS, fullscreenControl: false, zoomControl: false }}
        >
          {history
            .filter(
              (gameResult) =>
                !isEmpty(gameResult.lat) &&
                !isEmpty(gameResult.lng) &&
                gameResult !== marker,
            )
            .map((gameResult) => (
              <MapMarker
                key={gameResult.imageSource + gameResult.date}
                className={[
                  'marker',
                  gameResult.winner === 'No one' ? 'no-one' : 'someone',
                  gameResult === marker ? 'active' : '',
                ].join(' ')}
                lat={gameResult.lat as number}
                lng={gameResult.lng as number}
              />
            ))}
          <SelectedMapMarker
            ref={markerRef}
            onLoad={() => setPopoverAnchor(markerRef.current)}
            className={[
              'marker',
              marker.winner === 'No one' ? 'no-one' : 'someone',
              'active',
            ].join(' ')}
            lat={marker.lat as number}
            lng={marker.lng as number}
          />
        </GoogleMapReact>
      )}
      <Popover
        open={!!popoverAnchor}
        anchorEl={popoverAnchor}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.paper,
        }}
      >
        <div className={classes.popoverContent}>
          <Card className={classes.card}>
            <CardMedia
              className={classes.image}
              image={marker?.imageSource ?? 'unknown'}
              title={marker?.location ?? ''}
            />
            <CardContent className={classes.cardContent}>
              <Typography>
                <small>{marker?.momentDate.format('ddd, M/D')}</small>
              </Typography>
              <Typography variant="body1">
                <strong>{marker?.winner}</strong>
              </Typography>
              <Typography variant="caption">{marker?.location}</Typography>
            </CardContent>
          </Card>
          <div className={classes.arrow}></div>
        </div>
      </Popover>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    '& .marker': {
      width: 15,
      height: 15,
      borderRadius: '100%',
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
  paper: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  popoverContent: {
    display: 'flex',
    alignItems: 'center',
  },
  arrow: {
    height: 0,
    width: 0,
    marginLeft: -1,
    borderTop: '25px solid transparent',
    borderBottom: '25px solid transparent',
    borderLeft: '25px solid rgba(232, 205, 0, 0.5)',
    zIndex: -1,
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
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
}));

export default GameResultsMap;
