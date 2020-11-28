import firebase from '../firebase';

import IAuth from './../interfaces/IAuth';
import IGameResults from './../interfaces/IGameResults';
import IGameResultsDb from '../interfaces/IGameResultsDb';

export const KEY = 'AIzaSyAjFiu-pfgJDA0mytcBO3qPk-TlQeI5_Y4';

export const OPTIONS = {
  overviewMapControl: false,
  streetViewControl: false,
  rotateControl: true,
  mapTypeControl: false,
  minZoom: 3, // dynamically recalculated if possible during init
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#242f3e' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ],
};

export const getGeolocationUrl = (location: string) =>
  `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${KEY}`;

export const tryToPopulateGeoDataInHistory = (
  auth: IAuth,
  history: IGameResults[],
) => {
  const getData = async (url: string, record: any) => {
    await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        console.debug('fetched for ' + record.location, res);
        if (res.results && res.results[0]) {
          const geoLoc = res.results[res.results.length - 1].geometry.location;
          const updatedRecord: IGameResultsDb = {
            lat: geoLoc.lat,
            lng: geoLoc.lng,
            date: record.date,
            guesses: record.guesses,
            imageSource: record.imageSource,
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
        }
      });
  };
  if (history) {
    history.forEach((record, index) => {
      if (
        record.lat === undefined ||
        record.lat === null ||
        record.lng === undefined ||
        record.lng === null
      ) {
        console.debug('fetching for ' + record.location, record);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${record.location}&key=AIzaSyAjFiu-pfgJDA0mytcBO3qPk-TlQeI5_Y4`;
        getData(url, record);
      }
    });
  }
};
