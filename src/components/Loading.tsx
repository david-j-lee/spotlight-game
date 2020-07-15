import React, { FC, useState, useEffect } from 'react';
import firebase from '../firebase';

import { useContext } from '../context';
import GameSwitch from './GameSwitch';
import Login from './Login';

import Bouncing from '../img/bouncing.gif';
import './Loading.css';

const Loading: FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [displayLogin, setDisplayLogin] = useState(false);

  const [{ user, isLoaded }, { loadAssets, setUser }] = useContext();

  useEffect(() => {
    loadAssets(user);
  }, [user, loadAssets]);

  useEffect(() => {
    if (isLoaded) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setDisplayLogin(false);
          setLoggedIn(true);
          setUser(user.uid);
        } else {
          setDisplayLogin(true);
        }
      });
    }
  }, [isLoaded, setUser]);

  return (
    <div className="loading-screen">
      {!isLoaded && (
        <div>
          <p>Loading...</p>
          <img className="loading" src={Bouncing} alt="loading..." />
        </div>
      )}
      {isLoaded && displayLogin && <Login />}
      {isLoaded && loggedIn && user && <GameSwitch />}
    </div>
  );
};

export default Loading;
