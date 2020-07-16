import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCdoFYL2GI8FqivbhrQiNcpdUmkN5IY010',
  authDomain: 'spotlight-4861d.firebaseapp.com',
  databaseURL: 'https://spotlight-4861d.firebaseio.com',
  projectId: 'spotlight-4861d',
  storageBucket: 'spotlight-4861d.appspot.com',
  messagingSenderId: '213645315924',
  appId: '1:213645315924:web:07ac06c7b7298437e902c1',
  measurementId: 'G-K5XMZ1QK50',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
