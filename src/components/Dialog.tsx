import React, { useState } from 'react';
import './Dialog.css';
import ButtonGroup from './ButtonGroup';

interface IProps {
  visible: boolean;
  message: string;
  cancelText: string;
  onCompleteText: string;
  onCancel: any;
  onComplete: any;
  prevCompleteMessage: string;
}

const Dialog = ({
  visible,
  message,
  cancelText,
  onCompleteText,
  onCancel,
  onComplete,
  preCompleteMessage,
}) => {
  const [showSecondary, setShowSecondary] = useState(false);

  const setToComplete = () => {
    if (!preCompleteMessage) {
      onComplete();
      return;
    }

    setShowSecondary(true);
  };

  const modalClicked = (el) => {
    if (el.target.className === 'modal' && !showSecondary) {
      onCancel();
    }
  };

  const resetAndComplete = () => {
    setShowSecondary(false);
    onComplete();
  };

  const btnGroupEntries = [
    { text: cancelText, clickHandler: onCancel },
    { text: onCompleteText, clickHandler: setToComplete },
  ];

  const secondaryBtnGroupEntries = [
    { text: 'Continue', clickHandler: resetAndComplete },
  ];

  return (
    <div className={visible ? 'modal' : 'hidden'} onClick={modalClicked}>
      <div className="dialog">
        <div className="message">
          {showSecondary ? preCompleteMessage : message}
        </div>
        <div className="button-group-div">
          <ButtonGroup
            elements={
              showSecondary ? secondaryBtnGroupEntries : btnGroupEntries
            }
            icon={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Dialog;
