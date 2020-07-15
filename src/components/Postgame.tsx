import React, { FC, useState } from 'react';

import firebase from '../firebase';

import { useContext } from '../context';
import ButtonGroup from './ButtonGroup';
import MainButton from './MainButton';

import Confetti from '../utils/Confetti';
import Game from '../utils/GameClass';

import './Postgame.css';

const Postgame: FC = () => {
  const [winnerDeclared, setWinnerDeclared] = useState(false);
  const [congrats, setCongrats] = useState('');

  const [
    { user, img, players, guesses },
    { resetGame, skipImageAndReload },
  ] = useContext();

  const declareWinner = (ev) => {
    setWinnerDeclared(true);
    const winner = ev.target.textContent;
    startConfetti(winner);
    setCongrats(`Congratulations to ${winner} for earning the spotlight!`);
    const gamesRef = firebase.database().ref(user + '/games');
    const winningPlayerInfo = players.find((e) => e.name === winner);
    const newGame = new Game(img.caption, img.img_src, winner, guesses);
    gamesRef.push(newGame);
    pushPlayerInfoToDB(winningPlayerInfo, players, user);
  };

  const startConfetti = (winner) => {
    if (winner !== 'No one') {
      const con = new Confetti();
      // TODO: Fix
      // @ts-ignore
      con.startConfetti();
      setTimeout(() => con.stopConfetti(), 3000);
    }
  };

  const pushPlayerInfoToDB = (winner, players, user) => {
    players.forEach((p) => {
      if (p.playing) {
        const playerRef = firebase.database().ref(user + '/players/' + p._id);
        if (p.name === winner.name) {
          playerRef.update({
            wins: p.wins += 1,
            gamesPlayed: p.gamesPlayed += 1,
          });
        } else {
          playerRef.update({ gamesPlayed: p.gamesPlayed += 1 });
        }
      }
    });
  };

  const setGoogleSrc = () => {
    return `https://www.google.com/maps/embed/v1/place?q=${img.caption}&zoom=7&key=AIzaSyC1aEMKRB6A4_rZq8uwov5Q_uRkYy1TK0Q`;
  };

  const getGoogleWidth = () => {
    const width = window.innerWidth * 0.4;
    return `${width}`;
  };

  const getGoogleHeight = () => {
    const height = window.innerHeight * 0.25;
    return `${height}`;
  };

  const btnGroupEntries: any = [];
  const sortedGuesses: any = [];
  Object.values(players).forEach((p: any) => {
    if (p.playing) {
      btnGroupEntries.push({
        text: p.name,
        clickHandler: declareWinner,
      });
      sortedGuesses.push(guesses[p.name]);
    }
  });

  return (
    <div className="postgame">
      {winnerDeclared && <p className="small-caption">{img.caption}</p>}
      <h2>Answer:</h2>
      {winnerDeclared && <div className="caption">{congrats}</div>}
      {!winnerDeclared && <div className="caption">{img.caption}</div>}
      {!winnerDeclared && (
        <p className="skip" onClick={skipImageAndReload}>
          SKIP IMAGE
        </p>
      )}
      <div className={winnerDeclared ? 'hidden' : ''}>
        <ButtonGroup
          elements={btnGroupEntries}
          disabled={winnerDeclared}
          icon={false}
          centered={true}
        />
        <div className="guesses-caption">
          {sortedGuesses.map((g, i) => {
            return (
              <span key={i} className="guess-caption">
                {g}
              </span>
            );
          })}
        </div>
      </div>
      <div className={!winnerDeclared ? 'hidden' : 'google'}>
        <iframe
          title="google"
          width={getGoogleWidth()}
          height={getGoogleHeight()}
          frameBorder="0"
          src={setGoogleSrc()}
          allowFullScreen
        ></iframe>
      </div>
      {winnerDeclared && (
        <span className="google-warning">
          If no specific location is displayed, Maps could not locate based on
          the caption.
        </span>
      )}
      {winnerDeclared && (
        <div className="main-button-container">
          <MainButton
            actionTitle="Home"
            simple={false}
            clickHandler={resetGame}
          />
        </div>
      )}
    </div>
  );
};

export default Postgame;
