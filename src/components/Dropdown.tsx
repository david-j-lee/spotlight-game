import React from 'react';
import './Dropdown.css';

interface IProps {
  visible: boolean;
  data: any;
  inputClass: string;
  onClickHandler: any;
  hasFocus: boolean;
}

const Dropdown = ({ visible, data, inputClass, onClickHandler, hasFocus }) => {
  return (
    <div className="dropdown">
      {visible && (
        <div className="dropdown-content">
          {data.map((d, i) => {
            return (
              <p
                className={
                  hasFocus && hasFocus.idx === i
                    ? 'selection focused'
                    : 'selection'
                }
                onClick={(event) => onClickHandler(d, inputClass, event)}
                key={i}
              >
                {d}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
