import React, { FC, useState } from 'react';

import { useContext } from '../context';
import MainButton from './MainButton';
import Standings from './Standings';
import History from './History';

import Spotlight from '../img/spotlight.png';
import './Pregame.css';

interface IProps {
  imgLoaded: boolean;
}

const Pregame: FC<IProps> = ({ imgLoaded }) => {
  const [showHistory, setShowHistory] = useState(false);

  const [{ history }, { setGameMode }] = useContext();

  const getCurrentDate = () => {
    const month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const day = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const curr = new Date();
    return (
      day[curr.getDay()] + ', ' + month[curr.getMonth()] + ' ' + curr.getDate()
    );
  };

  return (
    <div className="pregame">
      <div className="header">
        <img src={Spotlight} alt="logo" />
        <h1>BE IN THE SPOTLIGHT</h1>
        <h2>darkmode</h2>
      </div>
      <div className={showHistory ? 'hidden' : 'pregame-grid'}>
        <div className="button-div">
          <MainButton
            actionTitle="Start"
            loading={!imgLoaded}
            simple={true}
            clickHandler={() => setGameMode('live')}
          />
          <br />
          <MainButton
            actionTitle="History"
            loading={!imgLoaded}
            simple={true}
            clickHandler={() => setShowHistory(true)}
          />
        </div>
        <div className="standings-container">
          <Standings />
        </div>
        <div className="footer">
          <p>{getCurrentDate()}</p>
        </div>
      </div>
      <History
        history={history}
        shouldDisplay={showHistory}
        hideHistory={() => setShowHistory(false)}
      />
    </div>
  );
};

export default Pregame;
