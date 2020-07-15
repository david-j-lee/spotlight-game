import React, { FC, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { useContext } from '../context';
import MainButton from './MainButton';
import Dropdown from './Dropdown';

import MapIcon from '../img/map.png';
import Close from '../img/cross.png';
import './SidePanel.css';

interface IProps {
  visible: boolean;
  closePanel: any;
  hints: any;
}

const SidePanel: FC<IProps> = ({ visible, closePanel, hints }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [hasFocusElem, setHasFocusElem] = useState<any>(null);

  const [{ players }, { updateGuesses, setGameMode }] = useContext();

  // TODO: Determine if these needs to be converted
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     this.props.visible !== nextProps.visible ||
  //     this.state.suggestions !== nextState.suggestions ||
  //     this.state.hasFocusElem !== nextState.hasFocusElem
  //   );
  // }

  const saveGuesses = async () => {
    const inputs = document.getElementsByClassName('guess-input');
    const guesses = {};
    for (let i = 0; i < inputs.length; i++) {
      const child = inputs[i].children;
      const player = child[0].textContent;
      const guess = (child[1] as any).value;
      if (!player || !guess) {
        return;
      }
      guesses[player] = guess;
    }
    await updateGuesses(guesses);
    setGameMode('post');
  };

  const filterHints = (val) => {
    const re = new RegExp(val, 'i');
    const filteredHints = hints.filter((e) => {
      if (re.test(e)) {
        return e;
      }

      return null;
    });
    if (filteredHints.length > 5) {
      filteredHints.length = 5;
    }

    setSuggestions(filteredHints);
  };

  const handleGuessValueChange = (event) => {
    const cl = event.target.className;
    setSelectedClass(cl);
    setHasFocusElem(null);
    filterHints(event.target.value);
  };

  const resetSuggestions = () => {
    setSuggestions([]);
    setSelectedClass('');
    setHasFocusElem(null);
  };

  const handleKeyPress = (event) => {
    const k = event.key;
    const downPressed = k === 'ArrowDown';
    const upPressed = k === 'ArrowUp';
    const enterPressed = k === 'Enter';

    if (!hasFocusElem) {
      if (downPressed) {
        if (suggestions.length) {
          setHasFocusElem({ idx: 0, val: suggestions[0] });
        }
      }
    } else if (downPressed || upPressed) {
      const { idx } = hasFocusElem;
      let nIdx;
      if (downPressed) {
        nIdx = idx + 1;
      } else if (upPressed) {
        nIdx = idx - 1;
      }

      if (nIdx < 0) {
        setHasFocusElem(null);
      } else if (nIdx < suggestions.length) {
        setHasFocusElem({ idx: nIdx, val: suggestions[nIdx] });
      }
    } else if (enterPressed && selectedClass) {
      const { val } = hasFocusElem;
      setInputValue(val, selectedClass);
    }
  };

  const setInputValue = (val, cls) => {
    // TODO: Remove need for any
    const input = document.getElementsByClassName(cls)[1] as any;
    input.value = val;
    resetSuggestions();
  };

  const handleOnBlur = () => {
    setTimeout(resetSuggestions, 100);
    setHasFocusElem(null);
  };

  return (
    <TransitionGroup component={null}>
      {visible && (
        <CSSTransition classNames="panel-dialog" timeout={300}>
          <div className="side-panel">
            <img className="close" src={Close} alt="X" onClick={closePanel} />
            <div className="map">
              <img src={MapIcon} alt="Guess" />
            </div>
            <div className="guesses">
              {players.map((p, i) => {
                if (p.name === 'No one' || !p.playing) return null;
                const visible = i.toString() === selectedClass;

                return (
                  <div className="guess-input" key={i}>
                    <div className={i.toString()}>{p.name}</div>
                    <input
                      className={i.toString()}
                      onChange={(event) => handleGuessValueChange(event)}
                      onBlur={(event) => handleOnBlur()}
                      onKeyDown={(event) => handleKeyPress(event)}
                    />
                    <Dropdown
                      visible={visible}
                      hasFocus={hasFocusElem}
                      data={suggestions}
                      inputClass={i}
                      onClickHandler={(val, cls) => setInputValue(val, cls)}
                    />
                  </div>
                );
              })}
            </div>
            <div className="side-submit">
              <MainButton
                actionTitle="Submit"
                simple={true}
                clickHandler={saveGuesses}
              />
            </div>
          </div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

export default SidePanel;
