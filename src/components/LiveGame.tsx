import React, { FC, useState, useRef, useEffect } from 'react';

import { useContext } from '../context';
import ButtonGroup from './ButtonGroup';
import SidePanel from './SidePanel';
import Dialog from './Dialog';

import gears from '../img/gears.png';
import globe from '../img/globe.png';
import cancel from '../img/cancel.png';

import './LiveGame.css';

const LiveGame: FC = () => {
  const [btnGroupVisible, setBtnGroupVisible] = useState(false);
  const [sidePanelVisible, setSidePanelVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [{ hints, img }, { skipImage }] = useContext();

  const timeout = useRef<any>();

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const makeBtnGrpVisible = () => {
    if (timeout.current) {
      invalidateTimeout();
    }
    setBtnGroupVisible(true);
  };

  const setTimeoutBtnVisible = () => {
    if (timeout.current) {
      invalidateTimeout();
    }
    const nTimeout = setTimeout(() => {
      setBtnGroupVisible(false);
      timeout.current = null;
    }, 1200);
    timeout.current = nTimeout;
  };

  useEffect(() => {
    return () => {
      invalidateTimeout();
    };
  });

  const invalidateTimeout = () => {
    clearTimeout(timeout.current);
    timeout.current = null;
  };

  const toggleSidePanelVisibility = () => {
    setSidePanelVisible(!sidePanelVisible);
  };

  const btnGroupEntries = [
    {
      alt: 'globe',
      src: globe,
      clickHandler: toggleSidePanelVisibility,
    },
    {
      alt: 'cancel/skip',
      src: cancel,
      clickHandler: showDialog,
    },
  ];
  return (
    <div className="live-game">
      <Dialog
        visible={dialogVisible}
        message="Are you sure you want to skip?"
        cancelText="Cancel"
        onCompleteText="Skip"
        onCancel={hideDialog}
        onComplete={() => {
          skipImage();
          hideDialog();
        }}
        preCompleteMessage={`Answer: ${img.caption}`}
      />
      <SidePanel
        closePanel={toggleSidePanelVisibility}
        visible={sidePanelVisible}
        hints={hints}
      />
      <div className="footer-actions">
        <img
          src={gears}
          onMouseEnter={makeBtnGrpVisible}
          onMouseLeave={setTimeoutBtnVisible}
          alt="Settings"
          className="gears"
        />

        {btnGroupVisible && (
          <ButtonGroup
            elements={btnGroupEntries}
            icon={true}
            mouseLeave={setTimeoutBtnVisible}
            mouseEnter={makeBtnGrpVisible}
          />
        )}
      </div>
    </div>
  );
};

export default LiveGame;
